import { Routes,Route, useLocation, Navigate } from "react-router-dom";
import Error404Page from "./Error404Page";
import MemberListCheck from "./pages/admin/MemberListCheck"
import MainPage from "./pages/main/MainPage"
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import ReportListCheck from "./pages/admin/ReportListCheck";
import RegisterListCheck from "./pages/admin/RegisterListCheck";
import SearchStore from "./pages/search/SearchStore";
import Notice from "./pages/main/Notice";
import ReportRequest from "./pages/report/ReportRequest";
import ReportDetail from "./pages/report/ReportDetail";
import { useEffect, useState } from "react";
import StoreDetail from "./pages/search/StoreDetail";

function TheWayYouTaste() {
  const location = useLocation();
  const hideHeaderRoutes = [];
  const hideFooter = ["/search/store"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:3001/youtaste/reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("신고 목록 로드 실패:", err);
      }
    };
    fetchReports();
  }, []);

  return (
     
      <div className="App">
          {!hideHeader && <Header />}
          <Routes>
            <Route path="/" element={<Navigate to = "/main" replace/>} />
            <Route path="/main" element={ <MainPage /> }/>
            <Route path="/notice" element={ <Notice /> }/>
            <Route path="/admin/member/list" element={ <MemberListCheck /> }/> 
            <Route path="/admin/report/list"  element={<ReportListCheck reports={reports}/>}/> 
            <Route path="/admin/register/list" element={ <RegisterListCheck /> }/> 
            <Route path="/search/store" element={ <SearchStore /> }/> 
            <Route path="/search/storeDetail" element={ <StoreDetail /> }/> 
            <Route path="/store/report" element={ <ReportRequest /> }/> 
            <Route path="/store/reportDetail" element={ <ReportDetail /> }/> 
            <Route path="/*" element={<Error404Page/>}/>
          </Routes>
          { !hideFooter && <Footer /> }
      </div>
    
  );
}

export default TheWayYouTaste;
