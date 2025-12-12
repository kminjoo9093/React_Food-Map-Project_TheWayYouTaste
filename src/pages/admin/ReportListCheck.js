import React, { useEffect, useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";

function ReportListCheck({ reports }) {
  const [nowPage, setNowPage] = useState(1);

  const viewPeople = 5; // 한 페이지에 보여줄 항목 수
  const limitBlock = 5; // 페이지 블록 수

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowReports = reports.slice(firstMember, lastMember);
  const totalPages = Math.ceil(reports.length / viewPeople);

  const paginate = (pageNumber) => setNowPage(pageNumber);
  const goPrev = () => nowPage > 1 && setNowPage(nowPage - 1);
  const goNext = () => nowPage < totalPages && setNowPage(nowPage + 1);

  const nowBlock = Math.floor((nowPage - 1) / limitBlock);
  const startPage = nowBlock * limitBlock + 1;
  const endPage = Math.min(startPage + limitBlock - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  function getDclrCatName(catNo) {
    switch(catNo) {
      case 1:
        return "폐업 신고";
      case 2:
        return "허위 사실 신고";
      case 3:
        return "리뷰 신고";
      default:
        return "기타 신고";
    }
  }

  return (
    <div className={styleMember.middleContainer}>
      <h1 className="heading">신고 내역 조회</h1>
      <table className="container">
        <thead>
          <tr>
            <th>회원명</th>
            <th>ID</th>
            <th>회원Email</th>
            <th>신고한 가게 명</th>
            <th>신고 제목</th>
            <th>카테고리</th>
          </tr>
        </thead>
        <tbody>
          {nowReports.map((report) => (
            <tr key={report.dclrSn}>
              <td>{report.userSn}</td> {/* 회원명은 나중에 JOIN해서 가져와야 함 */}
              <td>{report.userSn}</td>
              <td>{"user@email.com"}</td> {/* 실제 이메일도 JOIN 필요 */}
              <td>{report.bplcSn}</td> {/* 실제 가게명도 JOIN 필요 */}
              <td>{report.dclrTtl}</td>
              <td>{getDclrCatName(report.dclrCatNo)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={stylePagination.pagination}>
        <button onClick={goPrev} disabled={nowPage === 1} className={stylePagination.button}>
          이전
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`${nowPage === number ? stylePagination.active : ""} ${stylePagination.button}`}
          >
            {number}
          </button>
        ))}
        <button onClick={goNext} disabled={nowPage === totalPages} className={stylePagination.button}>
          다음
        </button>
      </div>
    </div>
  );
}

export default ReportListCheck;
