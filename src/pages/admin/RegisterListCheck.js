import { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";


function RegisterListCheck({ registerAdmin }) {
  const [nowPage, setNowPage] = useState(1);
  const navigate = useNavigate();

  const viewPeople = 5;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  //const pendingReports = registerAdmin.filter(r => !r.prcsYn); 
  const nowRegister = registerAdmin.slice(firstMember, lastMember);

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
              <th>회원명</th>
              <th>회원Email</th>
              <th>상호 명</th>
              <th>신청 일자</th>
            </tr>
          </thead>
          <tbody>
            {nowRegister.map((registerAdmin) => (
              <tr  
                key={registerAdmin.dclrSn} 
                onClick={() => goDetail(registerAdmin)}       // 클릭 시 이동!
                style={{ cursor: "pointer" }} 
              >
                <td>{registerAdmin.rprsvNm}</td>
                <td>{registerAdmin.usersn}</td>
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
