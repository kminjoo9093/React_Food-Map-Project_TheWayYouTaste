import { useLocation } from "react-router-dom";
import { useState } from "react";
import styleReport from "../../css/Report.module.css";
import styleGlobal from "../../css/Global.module.css"

function ReportDetail() {
  const location = useLocation();
  const { title, reason, category, writer, storeName } = location.state || {}; // ReportRequest에서 전달받은 state
  const [showDetail, setShowDetail] = useState(false);

  if (!title || !reason || !category) {
    return <p>신고 정보가 없습니다.</p>;
  }

  return (
    <div>
      <h1 className={styleGlobal.heading}>신고 내역</h1>
      <table className={styleGlobal.container}>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>매장</th>
            <th>신고제목</th>
            <th>작성자</th>
            <th>자세히보기</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{category}</td>
              <td>{storeName}</td>
              <td>{title}</td>
              <td>{writer}</td>
              <td>
                <button onClick={() => setShowDetail(!showDetail)}>
                  자세히 보기
                </button>
              </td>
            </tr>
        </tbody>
      </table>
      {showDetail && 
      <div className={styleGlobal.container}>
        <h3>신고 사유</h3>
        <textarea className={styleReport.textarea} disabled> 
          {reason}
        </textarea>
      </div>
      }
    </div>
  );
}

export default ReportDetail;
