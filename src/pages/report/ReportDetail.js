import { useLocation } from "react-router-dom";
import { useState } from "react";
import styleReport from "../../css/Report.module.css";

function ReportDetail() {
  const location = useLocation();
  const { title, reason } = location.state || {}; // ReportRequest에서 전달받은 state
  const [showDetail, setShowDetail] = useState(false);

  if (!title || !reason) {
    return <p>신고 정보가 없습니다.</p>;
  }

  return (
    <div className={styleReport.container}>
      <h2>신고 내역</h2>
      <div className={styleReport.reportItem}>
        <strong>{title}</strong>
        <button onClick={() => setShowDetail(!showDetail)}>
          자세히 보기
        </button>
        {showDetail && <p className={styleReport.reportDetail}>{reason}</p>}
      </div>
    </div>
  );
}

export default ReportDetail;
