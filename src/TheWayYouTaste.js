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

function TheWayYouTaste() {
  const location = useLocation();
  const hideHeaderRoutes = [];
  const hideFooter = ["/search/store"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  
  const [reports, setReports] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const reportsRes = await fetch("http://localhost:3001/youtaste/reports");
      const noticesRes = await fetch("http://localhost:3001/youtaste/notice");

      const reportsData = reportsRes.ok ? await reportsRes.json() : [];
      const noticesData = noticesRes.ok ? await noticesRes.json() : [];

      setReports(reportsData);
      setNotices(noticesData);
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
            <Route path="/" element={<Navigate to = "/main" replace/>} />
            <Route path="/main" element={ <MainPage /> }/>
            <Route path="/notice/list" element={ <NoticeList notices={notices}/> }/>
            <Route path="/admin/member/list" element={ <MemberListCheck /> }/> 
            <Route path="/admin/report/list"  element={<ReportListCheck reports={reports}/>}/> 
            <Route path="/admin/register/list" element={ <RegisterListCheck /> }/> 
            <Route path="/search/store" element={ <SearchStore /> }/> 
            <Route path="/search/storeDetail" element={ <StoreDetail /> }/> 
            <Route path="/store/report/:userSn" element={ <ReportRequest /> }/> 
            <Route path="/store/reportDetail" element={ <ReportDetail /> }/> 
            <Route path="/*" element={<Error404Page/>}/>
           
          </Routes>
          { !hideFooter && <Footer /> }
      </div>
    
  );
}

export default TheWayYouTaste;
