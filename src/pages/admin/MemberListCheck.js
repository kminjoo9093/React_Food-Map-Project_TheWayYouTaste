import { useState } from "react";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import serverUrl from "../../db/server.json";

function MemberListCheck({ members }) {
  const navigate = useNavigate();
  const [nowPage, setNowPage] = useState(1);
  const viewPeople = 5;
  const SERVER_URL = serverUrl.SERVER_URL;

  const handleDelete = async (userSn) => {
      const confirmDelete = window.confirm("정말 이 멤버를 삭제하시겠습니까?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(
          `${SERVER_URL}/membership/delete/${userSn}`,
          { method: "DELETE" }
        );

        if (!res.ok) throw new Error("삭제 실패");

        alert("멤버가 삭제되었습니다.");
        navigate("/admin/member/list");

      } catch (err) {
        console.error(err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    };

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  // const pendingMembers = members.filter(r => !r.prcsYn); 
  const nowMembers = members.slice(firstMember, lastMember);

  function memberAuthority(authrtYn){
    return authrtYn === "Y" ? "관리자" : "사용자";

  }

  function joinDate(frstRegDt){
  
    const years = frstRegDt.slice(2,4);
    const month = frstRegDt.slice(4,6);
    const date = frstRegDt.slice(6,8);
    
    return `${years}년 ${month}월 ${date}일`
    
  }

  return (
    <div className='contentTopPosition'>
      <div className="container">
        <h1 className="heading">회원 정보 조회</h1>
        <table>
          <thead>
            <tr>
              <th>회원명</th>
              <th>닉네임</th>
              <th>회원Email</th>
              <th>가입일</th>
              <th>이용자 권한</th>
              <th>탈퇴</th>
            </tr>
          </thead>
          <tbody>
            {nowMembers.map((member) => (
              <tr key={member.userSn}>
                <td>{member.userNm}</td>
                <td>{member.nickname}</td>
                <td>{member.userEmlAddr}</td>
                <td>{joinDate(member.frstRegDt)}</td>
                <td>{memberAuthority(member.authrtYn)}</td>
                <td>
                  <button type="button" onClick={() => handleDelete(member.userSn)}>탈퇴</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        nowPage={nowPage}
        totalItems={members.length}
        itemsPerPage={viewPeople}
        limitBlock={5}
        onPageChange={setNowPage}
      />
    </div>
  );
}

export default MemberListCheck;
