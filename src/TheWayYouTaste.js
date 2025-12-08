import { Routes,Route, useLocation } from "react-router-dom";
import Error404Page from "./Error404Page";
import MemberListCheck from "./pages/admin/MemberListCheck"
import MainPage from "./pages/main/MainPage"
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import ReportListCheck from "./pages/admin/ReportListCheck";
import RegisterListCheck from "./pages/admin/RegisterListCheck";

function TheWayYouTaste() {
  const location = useLocation();
  const hideHeaderRoutes = ["/admin/member/list"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
     
      <div className="App">
          {!hideHeader && <Header />}
          <Routes>
            {/* <Route exact path="/" element={ <DayList/> }/> */}
            {/* <Route exact path="/" element={ <Navigate to="/day/1" replace/> }/> */}
            <Route path="/main" element={ <MainPage /> }/>
            <Route path="/admin/member/list" element={ <MemberListCheck /> }/> 
            <Route path="/admin/report/list" element={ <ReportListCheck /> }/> 
            <Route path="/admin/register/list" element={ <RegisterListCheck /> }/> 
            <Route path="/*" element={<Error404Page/>}/>
          </Routes>
          <Footer />
      </div>
    
  );
}

export default TheWayYouTaste;
