import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Error404Page from "./Error404Page";
import MemberListCheck from "./pages/admin/MemberListCheck";
import MainPage from "./pages/main/MainPage";
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
import StoreDetail from "./pages/store/StoreDetail";
import NoticeMemberList from "./pages/main/NoticeMemberList";
import NoticeMemberDetail from "./pages/main/NoticeMemberDetail";
import NoticeWrite from "./pages/main/NoticeWrite";
import StoreRegister from "./pages/store/StoreRegister";
import MembershipLogin from "./pages/member/MembershipLogin";
import MembershipModify from "./pages/member/MembershipModify";
import MembershipResign from "./pages/member/MembershipResign";
import RegisterDetail from "./pages/admin/RegisterDetail";
import StoreRegion from "./pages/search/StoreRegion";
import serverUrl from "./db/server.json";
import { AppDataProvider } from "./context/AppDataProvider";

function TheWayYouTaste() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login"];
  const hideFooterRoutes = ["/search/store", "/login"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  const SERVER_URL = serverUrl.SERVER_URL;

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [notices, setNotices] = useState([]);
  const [registerAdmin, setRegisterAdmin] = useState([]);
  const [memberNotices, setMemberNotices] = useState([]);
  const isAdmin = user?.authrtYn === "Y";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const fetchData = async () => {
      try {
        /* 공통 정보 */
        const noticesRes = await fetch(`${SERVER_URL}/youtaste/notice`);
        const noticesData = noticesRes.ok ? await noticesRes.json() : [];
        setNotices(noticesData);

        /* 로그인했을때 불러올 정보 */
        if (user) {
          const membersRes = await fetch(`${SERVER_URL}/membership/check`);
          const reportsRes = await fetch(`${SERVER_URL}/youtaste/reports`);
          const registerAdminRes = await fetch(
            `${SERVER_URL}/youtaste/register-admin`,
          );
          const memberNoticesRes = await fetch(
            `${SERVER_URL}/youtaste/member-notices?userSn=${user.userSn}`,
          );

          const membersData = membersRes.ok ? await membersRes.json() : [];
          const reportsData = reportsRes.ok ? await reportsRes.json() : [];
          const registerAdminData = registerAdminRes.ok
            ? await registerAdminRes.json()
            : [];
          const memberNoticesData = memberNoticesRes.ok
            ? await memberNoticesRes.json()
            : [];

          setMembers(membersData);
          setReports(reportsData);
          setRegisterAdmin(registerAdminData);
          setMemberNotices(memberNoticesData);
        }
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
      }
    };
    fetchData();
  }, [isInitialized, user]);

  //f5하였을때 로그인페이지로 넘어가는 상황 방지
  if (!isInitialized) {
    return <div>로딩 중...</div>;
  }
  return (
    <div className="App">
      {!hideHeader && <Header />}
      <AppDataProvider>
        <Routes>
          {/* 누구나 접근 가능한 페이지*/}
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route
            path="/notice/list"
            element={<NoticeList notices={notices} isAdmin={isAdmin} />}
          />
          <Route
            path="/notice/noticeDetail"
            element={<NoticeDetail isAdmin={isAdmin} />}
          />
          <Route path="/search/store" element={<SearchStore />} />
          <Route path="/store/storeDetail" element={<StoreDetail />} />
          <Route path="/store/region" element={<StoreRegion />} />
          <Route
            path="/login"
            element={
              <MembershipLogin
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/*" element={<Error404Page />} />

          {/* 로그인한 일반 사용자만 접근 가능한 페이지*/}
          <Route
            path="/notice/write"
            element={
              isLoggedIn ? <NoticeWrite /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/member/notice/list"
            element={
              isLoggedIn ? (
                <NoticeMemberList notices={memberNotices} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/member/notice/noticeDetail"
            element={
              isLoggedIn ? (
                <NoticeMemberDetail />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/store/register"
            element={
              isLoggedIn ? (
                <StoreRegister userSn={user ? user.userSn : ""} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/store/report/:userSn"
            element={
              isLoggedIn ? <ReportRequest /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/member/modify"
            element={
              isLoggedIn ? (
                <MembershipModify />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/member/resign"
            element={
              isLoggedIn ? (
                <MembershipResign />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 로그인 + 관리자 권한(isAdmin)이 있어야 접근 가능한 페이지 */}
          <Route
            path="/notice/write"
            element={
              isLoggedIn && isAdmin ? (
                <NoticeWrite />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/store/registerDetail"
            element={
              isLoggedIn && isAdmin ? (
                <RegisterDetail setMemberNotices={setMemberNotices} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/store/reportDetail"
            element={
              isLoggedIn && isAdmin ? (
                <ReportDetail setMemberNotices={setMemberNotices} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/member/list"
            element={
              isLoggedIn && isAdmin ? (
                <MemberListCheck members={members} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/report/list"
            element={
              isLoggedIn && isAdmin ? (
                <ReportListCheck reports={reports} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/register/list"
            element={
              isLoggedIn && isAdmin ? (
                <RegisterListCheck registerAdmin={registerAdmin} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </AppDataProvider>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default TheWayYouTaste;
