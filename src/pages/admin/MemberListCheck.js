import React, { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
import memberData from "../../db/memberData.json"; 


function MemberListCheck() {
  const [members, setMembers] = useState(memberData.members); 
  const [nowPage, setNowPage] = useState(1);
  const viewPeople = 5;
  const limitBlock = 5;            

  const deleteMember = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowMembers = members.slice(firstMember, lastMember);

  const totalPages = Math.ceil(members.length / viewPeople);

  const paginate = (pageNumber) => setNowPage(pageNumber);

  const goPrev = () => {
    if (nowPage > 1) setNowPage(nowPage - 1);
  };

  const goNext = () => {
    if (nowPage < totalPages) setNowPage(nowPage + 1);
  };

  const nowBlock = Math.floor((nowPage - 1) / limitBlock);
  const startPage = nowBlock * limitBlock + 1;
  const endPage = Math.min(startPage + limitBlock - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='contentTopPosition'>
      <div className="container">
        <h1 className="heading">회원 정보 조회</h1>
        <table>
          <thead>
            <tr>
              <th>회원명</th>
              <th>ID</th>
              <th>회원Email</th>
              <th>신고처리여부</th>
              <th>이용자 권한</th>
              <th>탈퇴</th>
            </tr>
          </thead>
          <tbody>
            {nowMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.id}</td>
                <td>{member.email}</td>
                <td>{member.reported}</td>
                <td>{member.role}</td>
                <td>
                  <button type="button" onClick={() => deleteMember(member.id)}>탈퇴</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={stylePagination.pagination}>
          <button onClick={goPrev} disabled={nowPage === 1} className={stylePagination.button}> 이전 </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`${nowPage === number ? stylePagination.active : ""} ${stylePagination.button}`}
            >
              {number}
            </button>

            
          ))}
          <button className={stylePagination.button} onClick={goNext} disabled={nowPage === totalPages}> 다음 </button>
        </div>
      </div>
    </div>
  );
}

export default MemberListCheck;
