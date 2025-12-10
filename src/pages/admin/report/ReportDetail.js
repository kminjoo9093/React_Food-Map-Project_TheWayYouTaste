import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styleReport from "../../../css/Report.module.css";
import styleGlobal from "../../../css/Global.module.css";
import styleNotice from "../../../css/Notice.module.css";

function ReportDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state;

  const [showDetail, setShowDetail] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState(report.dclrTtl); 
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false); //박스처럼나타남
  const [actionType, setActionType] = useState(""); //수리반려
  const [actionReason, setActionReason] = useState(""); //사유입력

  if (!report) return <p>신고 정보가 없습니다.</p>;

  const { dclrTtl, dclrCn, dclrCatNo, userSn, bplcSn, storeName, isAdmin } = report;

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

  const openActionBox = (type) => {
    setActionType(type);
    setActionReason("");
    setIsActionBoxOpen(true);
  };

  const closeActionBox = () => setIsActionBoxOpen(false);

  const handleSubmit = async (title) => {
  const noticeData = {
    userSn: report.userSn,
    notiTtl: title,
    notiCn: actionReason,
    prcsRegYmd: new Date(),
    prcsYn: actionType === "수리" ? "Y" : "N",
    dclrCatNo: report.dclrCatNo,
  };

  try {
    const res = await fetch("http://localhost:3001/youtaste/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticeData),
    });

    if (!res.ok) {
      throw new Error("공지사항 등록 실패");
    }

    alert("공지사항 등록 완료!");
    window.location.href = "/notice/list"; // 공지사항 페이지로 이동
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};


  return (
    <div>
      <h1 className={styleGlobal.heading}>신고 내역</h1>

      <table className={styleGlobal.container}>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>매장</th>
            <th>제목</th>
            <th>작성자</th>
            <th>자세히보기</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{getDclrCatName(report.dclrCatNo)}</td>
            <td>{storeName || bplcSn}</td>
            <td>{dclrTtl}</td>
            <td>{userSn}</td>
            <td>
              <button onClick={() => setShowDetail(!showDetail)}>
                자세히 보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      
      {showDetail && (
        <div className={styleGlobal.container}>
          <h3>신고 사유</h3>
          <textarea className={styleReport.textarea} disabled>
            {dclrCn}
          </textarea>
          {/* 관리자만 수리/반려 버튼 출력 */}
          {isAdmin && (
              <div className={styleGlobal.rightContainer}>
                <button onClick={() => openActionBox("수리")}>수리</button>
                <button onClick={() => openActionBox("반려")}>반려</button>
              </div>
          )}  
        </div>
      )}

      {isActionBoxOpen && (
        <div className={styleNotice.modalDimmed}>
          <div className={styleNotice.modalBox}>
            <h2>{actionType} 처리</h2>
            <p>제목:</p>
            <input
              type="text"
              className={styleNotice.modalInput}
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            <p>날짜: {new Date().toLocaleDateString()}</p>
            <p>카테고리 : {getDclrCatName(report.dclrCatNo)}</p>
            <textarea
              className={styleNotice.modalTextarea}
              placeholder="사유를 작성하세요"
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
            <div className={styleNotice.modalButtonGroup}>
              <button className={styleNotice.confirmBtn} onClick={() => handleSubmit(noticeTitle)}>
                등록
              </button>
              <button className={styleNotice.cancelBtn} onClick={closeActionBox}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportDetail;
