import { Routes,Route, useLocation, Navigate } from "react-router-dom";
import Error404Page from "./Error404Page";
import MemberListCheck from "./pages/admin/MemberListCheck"
import MainPage from "./pages/main/MainPage"
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import ReportListCheck from "./pages/admin/report/ReportListCheck";
import RegisterListCheck from "./pages/admin/RegisterListCheck";
import SearchStore from "./pages/search/SearchStore";
import NoticeList from "./pages/main/NoticeList";
import ReportRequest from "./pages/admin/report/ReportRequest";
import ReportDetail from "./pages/admin/report/ReportDetail";
import { useEffect, useState } from "react";
import NoticeDetail from "./pages/main/NoticeDetail";
import StoreDetail from "./pages/search/StoreDetail";
import NoticeMemberList from "./pages/main/NoticeMemberList";
import NoticeMemberDetail from "./pages/main/NoticeMemberDetail";
import NoticeWrite from "./pages/main/NoticeWrite";
import StoreResister from "./pages/store/Resister";

import MembershipLogin from "./pages/member/MembershipLogin";


function TheWayYouTaste() {
  const location = useLocation();
  const hideHeaderRoutes = [];
  const hideFooterRoutes = ["/search/store"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  
  const [reports, setReports] = useState([]);
  const [notices, setNotices] = useState([]);
  const [memberNotices, setMemberNotices] = useState([]);
  const userSn = 1000; // 예시, 실제 로그인 정보로 가져오기

  useEffect(() => {
  const fetchData = async () => {
    try {
      const reportsRes = await fetch("http://localhost:3001/youtaste/reports");
      const noticesRes = await fetch("http://localhost:3001/youtaste/notice");
      const memberNoticesRes = await fetch(`http://localhost:3001/youtaste/member-notices?userSn=${userSn}`);

      const reportsData = reportsRes.ok ? await reportsRes.json() : [];
      const noticesData = noticesRes.ok ? await noticesRes.json() : [];
      const memberNoticesData = memberNoticesRes.ok ? await memberNoticesRes.json() : [];

      setReports(reportsData);
      setNotices(noticesData);
      setMemberNotices(memberNoticesData);

    } catch (err) {
      console.error("데이터 로드 중 오류:", err);
    }
  };

  fetchData();
}, []);
  
  return (
     
      <div className="App">
          {!hideHeader && <Header />}
          <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/notice/list" element={<NoticeList notices={notices} isAdmin={true}/>} />
            <Route path="/notice/noticeDetail" element={<NoticeDetail />} />
            <Route path="/notice/write" element={<NoticeWrite />}/>
            <Route path="/member/notice/list" element={<NoticeMemberList notices={memberNotices} />} />
            <Route path="/member/notice/noticeDetail" element={<NoticeMemberDetail />} />
            <Route path="/admin/member/list" element={<MemberListCheck />} />
            <Route path="/admin/report/list" element={<ReportListCheck reports={reports} />} />
            <Route path="/admin/register/list" element={<RegisterListCheck />} />
            <Route path="/search/store" element={<SearchStore />} />
            <Route path="/search/storeDetail" element={<StoreDetail />} />
            <Route path="/store/report/:userSn" element={<ReportRequest />} />
            <Route path="/store/reportDetail" element={<ReportDetail setMemberNotices={setMemberNotices} />} />
            <Route path="/store/resister" element={<StoreResister />} />
            <Route path="/*" element={<Error404Page />} />
            <Route path="/member/membership/login" element={<MembershipLogin />}/>


          </Routes>
          { !hideFooter && <Footer /> }
      </div>
    
  );
}

export default TheWayYouTaste;
