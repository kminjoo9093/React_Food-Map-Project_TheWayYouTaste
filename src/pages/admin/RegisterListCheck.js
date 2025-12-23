import { useEffect, useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import serverUrl from "../../db/server.json";


function RegisterListCheck({ registerAdmin }) {
  const [nowPage, setNowPage] = useState(1);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const SERVER_URL = serverUrl.SERVER_URL;

  const viewPeople = 5;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  //const pendingReports = registerAdmin.filter(r => !r.prcsYn); 
  const nowRegister = registerAdmin.slice(firstMember, lastMember);

  useEffect(() => {
    axios.get(`${SERVER_URL}/membership/check`)
      .then(res => setMembers(res.data))
      .catch(err => console.error("회원 목록 로드 실패", err));
  }, []);

  // 2. userSn을 받아 이름을 반환하는 함수
  function transName(userSn) {
    const member = members.find(m => m.userSn === userSn);
    return member ? member.userNm : userSn; // 이름을 찾으면 반환, 없으면 번호 그대로 표시
  }

  function transEmail(userSn) {
    const member = members.find(m => m.userSn === userSn);
    return member ? member.userEmlAddr : userSn; // 이름을 찾으면 반환, 없으면 번호 그대로 표시
  }

  const goDetail = (registerAdmin) => {
    navigate("/store/registerDetail", {
      state: { ...registerAdmin, isAdmin: true }   // 관리자라서 true
    });
  };

  function getDate(date) {
    if (!date) return "";
    return date.split("T")[0].replace(/-/g, ".");
  }

  return (
    <div className='contentTopPosition'>
      <div className={styleMember.middleContainer}>
        <h1 className="heading">등록 신청 조회</h1>
        <table className="container">
          <thead>
            <tr>
              <th>대표자 명</th>
              <th>회원 명</th>
              <th>회원 Email</th>
              <th>상호 명</th>
              <th>신청 일자</th>
            </tr>
          </thead>
          <tbody>
            {nowRegister.map((registerAdmin) => (
              <tr  
                key={registerAdmin.dclrSn} 
                onClick={() => goDetail(registerAdmin)}       
                style={{ cursor: "pointer" }} 
              >
                <td>{registerAdmin.rprsvNm}</td>
                <td>{transName(registerAdmin.userSn)}</td>
                <td>{transEmail(registerAdmin.userSn)}</td>
                <td>{registerAdmin.bplcNm}</td>
                <td>{getDate(registerAdmin.prcsRegYmd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        nowPage={nowPage}
        totalItems={registerAdmin.length}
        itemsPerPage={viewPeople}
        limitBlock={limitBlock}
        onPageChange={setNowPage}
      />
    </div>
  );
}

export default RegisterListCheck;
