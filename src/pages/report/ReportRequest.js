import { Link } from "react-router-dom";
import styleGlobal from "../../css/Global.module.css";
import styleReport from "../../css/Report.module.css";

function ReportRequest(){
    return (
        <>
        <p>안녕하세요 여기는 신고접수페이징입니다.</p>
        <div className={styleGlobal.container}>
            <p>작성자명</p>
            <input type="text" />
            <div className = {styleReport.doubleContainer}>
                <div>
                    <p>매장 상호 명</p>
                    <input type="text" />
                </div>
                <div>
                    <p>주소</p>
                    <input type="text" />
                </div>                
            </div>
            <p>신고 제목</p>
            <input type="text" />
            <p>신고 사유</p>
            <textarea placeholder="자세한 사유를 입력해 주세요"></textarea>

            <div className={styleReport.rightContainer}>
                 <Link to = "/main"><button>  등록 </button></Link>    
                 {/* /store/reportDetail  로 변경요망 */}
            </div>
        </div>
        </>
    );
}

export default ReportRequest;