import { Routes,Route, useLocation, Navigate } from "react-router-dom";
import Error404Page from "./Error404Page";
import MemberListCheck from "./pages/admin/MemberListCheck"
import MainPage from "./pages/main/MainPage"
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import ReportListCheck from "./pages/admin/ReportListCheck";
import RegisterListCheck from "./pages/admin/RegisterListCheck";
import SearchStore from "./pages/search/SearchStore";


function TheWayYouTaste() {
  const location = useLocation();
  const hideHeaderRoutes = [];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
     
      <div className="App">
          {!hideHeader && <Header />}
          <Routes>
            <Route path="/" element={<Navigate to = "/main" replace/>} />
            <Route path="/main" element={ <MainPage /> }/>
            <Route path="/notice" element={ <Notice /> }/>
            <Route path="/admin/member/list" element={ <MemberListCheck /> }/> 
            <Route path="/admin/report/list" element={ <ReportListCheck /> }/> 
            <Route path="/admin/register/list" element={ <RegisterListCheck /> }/> 
            <Route path="/search/store" element={ <SearchStore /> }/> 
            <Route path="/*" element={<Error404Page/>}/>
          </Routes>
          <Footer />
      </div>
    
  );
}

export default TheWayYouTaste;
