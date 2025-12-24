import { useEffect, useState } from "react";
import styleMember from "../../../css/MemberListCheck.module.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Pagination";
import serverUrl from "../../../db/server.json";
import axios from "axios";


function ReportListCheck({ reports }) {
  const [nowPage, setNowPage] = useState(1);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]); 
  const [stores, setStores] = useState([]);
  const SERVER_URL = serverUrl.SERVER_URL;

  const viewPeople = 5; // 한 페이지에 보여줄 항목 수
  const limitBlock = 5; // 페이지 블록 수

  useEffect(() => {
    axios.get(`${SERVER_URL}/membership/check`)
      .then(res => setMembers(res.data))
      .catch(err => console.error("회원 목록 로드 실패", err));
  }, []);
  useEffect(() => {
    axios.get(`${SERVER_URL}/youtaste/search/store/all`) // 경로 확인 필요 (컨트롤러에 따라)
      .then(res => setStores(res.data))
      .catch(err => console.error("가게 목록 로드 실패", err));
  }, []);


  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
  const pendingReports = reports.filter(r => !r.prcsYn); 
  const nowReports = pendingReports.slice(firstMember, lastMember);

  function transName(userSn) {
    if (!members) return userSn;
    const member = members.find(m => m.userSn === userSn);
    return member ? member.userNm : userSn;
  }

  function transEmail(userSn) {
    const member = members.find(m => m.userSn === userSn);
    return member ? member.userEmlAddr : userSn; // 이름을 찾으면 반환, 없으면 번호 그대로 표시
  }

  function transStore(bplcSn) {
    if (!stores) return bplcSn;
    const store = stores.find(s => s.bplcSn === bplcSn);
    return store ? store.bplcNm : bplcSn;
  }

  const goDetail = (report) => {
    navigate("/store/reportDetail", {
      state: { ...report, isAdmin: true }   // 관리자라서 true
    });
  };

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

  return (
    <div className="contentTopPosition">
      <div className={styleMember.middleContainer}>
        <h1 className="heading">신고 내역 조회</h1>
        <table className="container">
          <thead>
            <tr>
              <th>회원명</th>
              <th>회원Email</th>
              <th>신고한 가게 명</th>
              <th>신고 제목</th>
              <th>카테고리</th>
            </tr>
          </thead>
          <tbody>
            {nowReports.map((report) => (
              <tr 
                key={report.dclrSn} 
                onClick={() => goDetail(report)}       // 클릭 시 이동!
                style={{ cursor: "pointer" }}         // 클릭 가능 표시
              >
                <td>{transName(report.userSn)}</td> {/* 회원명은 나중에 JOIN해서 가져와야 함 */}
                <td>{transEmail(report.userSn)}</td> {/* 실제 이메일도 JOIN 필요 */}
                <td>{transStore(report.bplcSn)}</td> {/* 실제 가게명도 JOIN 필요 */}
                <td>{report.dclrTtl}</td>
                <td>{getDclrCatName(report.dclrCatNo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          nowPage={nowPage}
          totalItems={nowPage.length}
          itemsPerPage={viewPeople}
          limitBlock={limitBlock}
          onPageChange={setNowPage}
        />
      </div>
    </div>
  );
}

export default ReportListCheck;
