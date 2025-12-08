import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styleGlobal from "../../css/Global.module.css";
import styleReport from "../../css/Report.module.css"

function ReportRequest() {
  const [writer, setWriter] = useState(""); // 작성자명
  const [storeName, setStoreName] = useState(""); // 매장 상호 명
  const [address, setAddress] = useState(""); // 주소
  const [title, setTitle] = useState(""); // 신고 제목
  const [reason, setReason] = useState(""); // 신고 사유

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && reason) {
      // 신고 정보를 ReportDetail 페이지로 전달하며 이동
      navigate("/reportDetail", {
        state: { writer, storeName, address, title, reason },
      });
    } else {
      alert("신고 제목과 사유를 입력해주세요.");
    }
  };

  return (
    <div className={styleGlobal.container}>
      <p>안녕하세요 여기는 신고접수페이징입니다.</p>

      <form onSubmit={handleSubmit}>
        <p>작성자명</p>
        <input
          type="text"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
        />

        <div className={styleGlobal.doubleContainer}>
          <div>
            <p>매장 상호 명</p>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          <div>
            <p>주소</p>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <p>신고 제목</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p>신고 사유</p>
        <textarea
          placeholder="자세한 사유를 입력해 주세요"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={styleReport.textarea}
        />

        <div className={styleGlobal.rightContainer}>
          <button className={styleReport.button} type="submit">등록</button>
        </div>
      </form>
    </div>
  );
}

export default ReportRequest;
