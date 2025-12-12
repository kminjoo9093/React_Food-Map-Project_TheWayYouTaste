import { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
import registerData from "../../db/registerData.json";
import Pagination from "../Pagination";


function RegisterListCheck() {
  const [register, setregister] = useState(registerData.registers);
  const [nowPage, setNowPage] = useState(1);
  const viewPeople = 5;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowRegister = register.slice(firstMember, lastMember);

  return (
    <div className='contentTopPosition'>
      <div className={styleMember.middleContainer}>
        <h1 className="heading">등록 신청 조회</h1>
        <table className="container">
          <thead>
            <tr>
              <th>회원명</th>
              <th>ID</th>
              <th>회원Email</th>
              <th>상호 명</th>
            </tr>
          </thead>
          <tbody>
            {nowRegister.map((register) => (
              <tr key={register.id}>
                <td>{register.name}</td>
                <td>{register.id}</td>
                <td>{register.email}</td>
                <td>{register.store}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        nowPage={nowPage}
        totalItems={register.length}
        itemsPerPage={viewPeople}
        limitBlock={limitBlock}
        onPageChange={setNowPage}
      />
    </div>
  );
}

export default RegisterListCheck;
