import { useLocation, useNavigate } from "react-router-dom";
import styleReport from "../../css/Report.module.css";
import serverUrl from "../../config/server.json";

function NoticeDetail({ isAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const notice = location.state; // Notice 목록에서 전달된 notice 데이터
  const SERVER_URL = serverUrl.SERVER_URL;

  if (!notice) return <p>공지사항 정보를 불러올 수 없습니다.</p>;
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 공지를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${SERVER_URL}/youtaste/notice/${notice.notiSn}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error("삭제 실패");

      alert("공지사항이 삭제되었습니다.");
      navigate("/notice/list");
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  function getDclrCatName(catNo) {
    switch (catNo) {
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

  function getDate(date) {
    if (!date) return "";
    return date.split("T")[0].replace(/-/g, ".");
  }

  return (
    <div className="container contentTopPosition">
      <h1 className="heading">공지사항 상세</h1>
      <p>
        <strong>제목</strong>
      </p>
      <input type="text" value={notice.notiTtl} readOnly />
      <div className="doubleContainer">
        <div>
          <p>
            <strong>카테고리</strong>{" "}
          </p>
          <input
            type="text"
            value={getDclrCatName(notice.dclrCatNo)}
            readOnly
          />
        </div>
        <div>
          <p>
            <strong>작성일</strong>{" "}
          </p>
          <input type="text" value={getDate(notice.prcsRegYmd)} readOnly />
        </div>
      </div>
      <p>
        <strong>사유</strong>{" "}
      </p>
      <textarea
        className={styleReport.textarea}
        value={notice.notiCn}
        readOnly
      ></textarea>

      <div className="rightContainer">
        {isAdmin && (
          <button
            className="button"
            style={{
              backgroundColor: "#ff5c5c",
              color: "white",
              marginTop: "20px",
            }}
            onClick={handleDelete}
          >
            공지 삭제
          </button>
        )}
      </div>
    </div>
  );
}

export default NoticeDetail;
