import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import styleGlobal from "../../css/Global.module.css";
import styleReport from "../../css/Report.module.css";

function NoticeWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // 카테고리 → 번호 매핑
  const categoryMap = {
    "서버점검": 5,
    "대표공지": 6
  };

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const data = {
      userSn: 1000,                   // 관리자 ID (임시)
      notiTtl: title,
      notiCn: content,
      dclrCatNo: categoryMap[category],
      prcsYn: "N",
      prcsRegYmd: new Date()
    };

    try {
      const res = await fetch("http://localhost:3001/youtaste/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("공지사항 등록 실패");

      alert("공지사항이 성공적으로 등록되었습니다.");
      navigate("/notice/list");

    } catch (err) {
      console.error(err);
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <div className='container contentTopPosition'>
      <h1 className='heading'>공지사항 작성</h1>

      <p><strong>제목</strong></p>
      <input
        type="text"
        className={styleReport.input}
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className='doubleContainer'>
        <div>
          <p><strong>카테고리</strong></p>
          <select
            className={styleReport.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="서버점검">서버 점검</option>
            <option value="대표공지">대표 공지</option>
          </select>
        </div>

        <div>
          <p><strong>작성일</strong></p>
          <input
            type="text"
            className={styleReport.input}
            value={new Date().toLocaleDateString()}
            readOnly
          />
        </div>
      </div>

      <p><strong>내용</strong></p>
      <textarea
        className={styleReport.textarea}
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='rightContainer'>
        <button onClick={handleSubmit}>
          등록하기
        </button>
      </div>
    </div>
  );
}

export default NoticeWrite;
