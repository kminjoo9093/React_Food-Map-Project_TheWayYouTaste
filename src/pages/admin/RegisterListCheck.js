import { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
import registerData from "../../db/registerData.json";


function RegisterListCheck() {
  const [register, setregister] = useState(registerData.registers);
  const [nowPage, setNowPage] = useState(1);
  const viewPeople = 5;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowRegister = register.slice(firstMember, lastMember);

  const totalPages = Math.ceil(register.length / viewPeople);

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
    <div className={styleMember.middleContainer}>
      <h1>등록 신청 조회</h1>
      <table>
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

      <div className={stylePagination.pagination}>
        <button onClick={goPrev} disabled={nowPage === 1}> 이전 </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={nowPage === number ? stylePagination.active : ""}
          >
            {number}
          </button>
          
        ))}
        <button onClick={goNext} disabled={nowPage === totalPages}> 다음 </button>
      </div>
    </div>
  );
}

export default RegisterListCheck;
