import { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import stylePagination from "../../css/Pagination.module.css";
// import styleGlobal from "../../css/Global.module.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";

function Notice({ notices, isAdmin }) {
  const [nowPage, setNowPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "up" });

  const navigate = useNavigate();
  
  const viewPeople = 5;
  const lastIndex = nowPage * viewPeople;
  const firstIndex = lastIndex - viewPeople;

  // 카테고리 이름 매핑
  function getDclrCatName(catNo) {
    switch (catNo) {
      case 1: return "폐업 신고";
      case 2: return "허위 사실 신고";
      case 3: return "리뷰 신고";
      case 4: return "기타 신고";
      case 5: return "서버 점검";
      case 6: return "가게 등록";
      default: return "대표 공지";
    }
  }

  // 승인/반려/공지 변환
  function getPrcsYn(YorN) {
    switch (YorN) {
      case "Y": return "승인";
      default: return "공지";
    }
  }

  // 날짜 변환
  function getDate(date) {
    if (!date) return "";
    return date.split("T")[0].replace(/-/g, ".");
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "up" ? "down" : "up"
    }));
  };

  const sortedData = [...notices].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal, bVal;

    switch (sortConfig.key) {
      case "category":
        aVal = getDclrCatName(a.dclrCatNo);
        bVal = getDclrCatName(b.dclrCatNo);
        break;
      case "type":
        aVal = getPrcsYn(a.prcsYn);
        bVal = getPrcsYn(b.prcsYn);
        break;
      case "title":
        aVal = a.notiTtl;
        bVal = b.notiTtl;
        break;
      case "date":
        aVal = new Date(a.prcsRegYmd);
        bVal = new Date(b.prcsRegYmd);
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortConfig.direction === "up" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "up" ? 1 : -1;
    return 0;
  });

  const nowNotice = sortedData.slice(firstIndex, lastIndex);

  const handleClick = (notice) => {
    navigate("/notice/noticeDetail", { state: notice });
  };

  return (
    <div className="contentTopPosition">
      <div className={styleMember.middleContainer}>
        <h1>공지사항</h1>

        {/* 관리자만 보이는 작성 버튼 */}
        {isAdmin && (
          <div style={{ width: "85%", textAlign: "right", paddingBottom: "20px" }}>
            <button
              className="button"
              onClick={() => navigate("/notice/write")}
            >
              공지 작성
            </button>
          </div>
        )}

        <table className='container'>
          <thead>
            <tr>
              <th onClick={() => handleSort("category")}>
                카테고리 {sortConfig.key === "category" ? (sortConfig.direction === "up" ? "🔼" : "🔽") : ""}
              </th>
              <th onClick={() => handleSort("type")}>
                구분 {sortConfig.key === "type" ? (sortConfig.direction === "up" ? "🔼" : "🔽") : ""}
              </th>
              <th onClick={() => handleSort("title")}>
                제목 {sortConfig.key === "title" ? (sortConfig.direction === "up" ? "🔼" : "🔽") : ""}
              </th>
              <th onClick={() => handleSort("date")}>
                작성일 {sortConfig.key === "date" ? (sortConfig.direction === "up" ? "🔼" : "🔽") : ""}
              </th>
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
          totalItems={sortedData.length}
          itemsPerPage={viewPeople}
          limitBlock={5}
          onPageChange={setNowPage}
        />
      </div>
    </div>
  );
}

export default Notice;
