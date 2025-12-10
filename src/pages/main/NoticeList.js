import { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
import styleGlobal from "../../css/Global.module.css"
import { useNavigate } from "react-router-dom";


function Notice({ notices }) {
  const [nowPage, setNowPage] = useState(1);
  const navigate = useNavigate();
  
  const viewPeople = 5;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowNotice = notices.slice(firstMember, lastMember);

  const totalPages = Math.ceil(notices.length / viewPeople);

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

  const handleClick = (notice) => {
    navigate("/notice/noticeDetail", { state: notice });
  };

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

  function getPrcsYn(YorN) {
    switch(YorN) {
      case 'Y':
        return "승인";
      default:
        return "반려";
    }
  }

  function getDate(date) {
  if (!date) return ""; // null이나 undefined 대비
  return date.split("T")[0].replace(/-/g, ".");
  }
  return (
    <div className={styleMember.middleContainer}>
      <h1>공지사항</h1>
      <table className={styleGlobal.container}>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>승인 / 반려 표시</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {nowNotice.map((notice) => (
            <tr key={notice.notiSn} onClick={() => handleClick(notice)}>
              <td>{getDclrCatName(notice.dclrCatNo)}</td>
              <td>{getPrcsYn(notice.prcsYn)}</td>
              <td>{notice.notiTtl}</td>
              <td>{getDate(notice.prcsRegYmd)}</td>
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

export default Notice;
