import { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
import styleGlobal from "../../css/Global.module.css"
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";


function Notice({ notices, isAdmin }) {
  const [nowPage, setNowPage] = useState(1);
  const navigate = useNavigate();
  
  const viewPeople = 8;
  const limitBlock = 5;            

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const nowNotice = notices.slice(firstMember, lastMember);

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
      case 4:
        return "기타 신고";
      case 5:
        return "서버 점검";
      default :
        return "대표 공지";  
    }
  }

  function getPrcsYn(YorN) {
    switch(YorN) {
      case 'Y':
        return "승인";
      default:
        return "공지";
    }
  }

  function getDate(date) {
  if (!date) return ""; // null이나 undefined 대비
  return date.split("T")[0].replace(/-/g, ".");
  }
  return (
    <div className={styleMember.middleContainer}>
      <h1>공지사항</h1>
      {isAdmin && (
        <div style={{width:"85%" ,textAlign:"right" , paddingBottom:"20px"}}>
          <button className={stylePagination.button} onClick={() => navigate("/notice/write")}>
            공지 작성
          </button>
        </div>
      )}
      <table className={styleGlobal.container}>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>구분</th>
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

      <Pagination
        nowPage={nowPage}
        totalItems={notices.length}
        itemsPerPage={viewPeople}
        limitBlock={limitBlock}
        onPageChange={setNowPage}
      />
    </div>
  );
}

export default Notice;
