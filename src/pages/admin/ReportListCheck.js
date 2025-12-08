import React, { useState } from "react";
import styleGlobal from "../../css/Global.module.css"
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
import reportData from "../../db/reportData.json";



function ReportListCheck() {
  //const [reports, setreports] = useState(memberData.reports); 
  const [reports, setReports] = useState(reportData.reports);
  const [nowPage, setNowPage] = useState(1);
  const viewPeople = 5;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowReports = reports.slice(firstMember, lastMember);

  const totalPages = Math.ceil(reports.length / viewPeople);

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
      <h1 className={styleGlobal.heading}>신고 내역 조회</h1>
      <table className={styleGlobal.container}>
        <thead>
          <tr>
            <th>회원명</th>
            <th>ID</th>
            <th>회원Email</th>
            <th>신고한 가게 명</th>
            <th>신고 제목</th>
            
          </tr>
        </thead>
        <tbody>
          {nowReports.map((report) => (
            <tr key={report.id}>
              <td>{report.name}</td>
              <td>{report.id}</td>
              <td>{report.email}</td>
              <td>{report.storeAddress}</td>
              <td>{report.reportTilte}</td>
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

export default ReportListCheck;
