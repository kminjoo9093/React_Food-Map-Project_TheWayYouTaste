import { useLocation } from "react-router-dom";
import styleReport from "../../css/Report.module.css"

function NoticeMemberDetail() {
  const location = useLocation();
  const noticeMember = location.state; // Notice 목록에서 전달된 notice 데이터

  if (!noticeMember) return <p>신고 처리 정보를 불러올 수 없습니다.</p>;

  function getPrcsYn(YorN) {
    return YorN === "Y" ? "승인"  : "반려";
  }

  function getColor(YorN){
    return YorN === "Y" ? {backgroundColor:"blue", color:"white"} : {backgroundColor:"red" , color:"white"};
  }

  return (
    <div className='contentTopPosition'>
      <div className="container">
        <h1>공지사항 상세</h1>
        <p><strong>제목</strong></p>
        <input  type="text" value={noticeMember.notiTtl} readOnly/>
        
        <div className='leftContainer'>
              <div>
                  <button className="button" style={getColor(noticeMember)}readOnly>{getPrcsYn(noticeMember)}</button>
              </div>
        </div>
        <p><strong>사유</strong></p>
        <textarea className={styleReport.textarea} value={noticeMember.notiCn} readOnly></textarea>
      </div>
    </div>
  );
}

export default NoticeMemberDetail;
