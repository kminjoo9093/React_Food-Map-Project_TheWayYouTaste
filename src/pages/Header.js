// import styleGlobal from "../css/Global.module.css";
import styleHeader from "../css/Header.module.css";
import styleSidebar from "../css/sidebar.module.css"
import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import searchIcon from "../resources/img/system/search.png";

function Header(){

    const [open, setOpen] = useState(false);
    const [openMyMenu, setOpenMyMenu] = useState(false);
    const [isLogin, setIsLogin] = useState(false); // 로그인 여부
    const [user, setUser] = useState(null); // 로그인된 사용자 정보
    const [searchTerm, setSearchTerm] = useState(""); // 검색어
    const navigate = useNavigate();

    //모바일 메뉴 버튼 state
    const [openMobMenu, setOpenMobMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLogin(true);
        }
    }, []);


    const handleSearch = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (!searchTerm.trim()) return;
            // 검색어를 포함하여 SearchStore 페이지로 이동
            navigate(`/search/store?keyword=${encodeURIComponent(searchTerm)}`);
            setSearchTerm(""); // 입력창 초기화
        }
    };

    function handleLoginState(){
        if(isLogin){
            return <button className={styleHeader.myMenu} onClick={() => setOpenMyMenu(true)}>
                        MY MENU
                    </button>
        } else {
            return <Link to ="/login"><button className={styleHeader.login}>LOGIN</button></Link> 
        }
    }

    function closeAllSideMenu(){
        setOpenMyMenu(false);
        setOpenMobMenu(false);
    }

    return(
        <>
            <header>
                <div className={styleHeader.headerTop}>
                    <h1 className={styleHeader.logo}>
                        <Link to = "/main"> 니맛대로 </Link>    {/* <p style={{fontSize: 12}}>TheWayYouTaste</p> */}
                    </h1>
                    {/* PC */}
                    <div className={styleHeader.searchContainer}>
                        <input type="text" placeholder="지역, 음식 또는 식당명을 검색하세요" className={styleHeader.searchInput} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // 값 변경 감지
                            onKeyDown={handleSearch} // 엔터키 
                        /> 
                        <img src={searchIcon} 
                        alt="search" 
                        onClick={handleSearch} // 돋보기 클릭 감지
                        style={{ cursor: "pointer" }}
                    />
                    </div>
                    <div className={styleHeader.rightMenu}>
                        {handleLoginState()}
                    </div>
                    {/* Mobile */}
                    {!openMyMenu && (
                        <button className={`${styleSidebar.btnMobMenu} ${openMobMenu ? styleSidebar.open : ""}`} 
                                onClick={() => setOpenMobMenu(prev => !prev)}
                            >
                            <span className={styleSidebar.menuLine}></span>
                            <span className={styleSidebar.menuLine}></span>
                            <span className={styleSidebar.menuLine}></span>
                        </button>
                    )}
                </div>
                <div className={styleHeader.menubarPC}>
                    <ul className={styleHeader.menuListPC}>
                        <li>
                            <NavLink to = "/store/region" className={({ isActive }) => isActive ? styleHeader.active : ""}>지역 맛집</NavLink>
                        </li>
                        <li>
                            <NavLink to = "/search/store" className={({ isActive }) => isActive ? styleHeader.active : ""}>지도 찾기</NavLink>
                        </li>
                        <li>
                            <NavLink to = "/store/register" className={({ isActive }) => isActive ? styleHeader.active : ""}>가게 등록</NavLink>
                        </li>
                        <li>
                            <NavLink to = "/notice/list" className={({ isActive }) => isActive ? styleHeader.active : ""}> 공지사항 </NavLink> 
                        </li>
                    </ul>
                </div>

                {/* mobile menu sidebar */}
                {/* dimmed */}
                {(openMobMenu || openMyMenu) && (<div className={styleSidebar.dimmed} onClick={closeAllSideMenu}></div>)}
                <div className={`${styleSidebar.sideWrapper} ${openMobMenu ? styleSidebar.open : ""}`}>
                    <div className={`${styleSidebar.sideBox} ${styleSidebar.mobMenuBar}`}>
                        {handleLoginState()}
                        <ul className={styleSidebar.mobMenuList}>
                            <li>
                                <Link to="#" onClick={() => setOpenMobMenu(false)}>지역 맛집</Link>
                            </li>
                            <li>
                                <Link to = "/search/store" onClick={() => setOpenMobMenu(false)}>지도 찾기</Link>
                            </li>
                            <li>
                                <Link to = "/store/register" onClick={() => setOpenMobMenu(false)}>가게 등록</Link>
                            </li>
                            <li>
                                <Link to = "/notice/list" onClick={() => setOpenMobMenu(false)}> 공지사항 </Link> 
                            </li>
                        </ul>
                    </div>
                </div>

                {/* myMenu sidebar (pc, mobile 공용) */}
                <div className={`${styleSidebar.sideWrapper} 
                                ${openMyMenu ? styleSidebar.open : ""}`}
                                >
                    <div className={styleSidebar.sideBox}>
                        <button className={styleSidebar.btnCloseMyMenu} onClick={() => closeAllSideMenu()}></button>
                         {/* 사용자 이름 또는 관리자 표시 */}
                        <h3 className={styleSidebar.greeting}>
                            {isLogin ? (
                                user?.authrtYn === 'Y' 
                                    ? `${user.nickname} 관리자님 안녕하세요!`  // 관리자일 때
                                    : `${user.nickname}님 안녕하세요!`      // 일반 사용자일 때
                            ) : (
                                "로그인해주세요"
                            )}
                        </h3>
                        <ul className={styleSidebar.myPageList}>
                            <li><Link to = "/member/modify" onClick={() => setOpenMyMenu(false)}> 내 정보 </Link></li>
                            <li><Link to = "/member/notice/list" onClick={() => setOpenMyMenu(false)}> 내 알림 내역 </Link></li>
                            {user?.authrtYn === 'Y' && (
                                <>
                                    <li><Link to="/admin/member/list" onClick={() => setOpenMyMenu(false)}> 회원 정보 조회 </Link></li>
                                    <li><Link to="/admin/report/list" onClick={() => setOpenMyMenu(false)}> 신고 내역 조회 </Link></li>
                                    <li><Link to="/admin/register/list" onClick={() => setOpenMyMenu(false)}> 가게 등록 조회 </Link></li>
                                </>
                            )}
                        </ul>
                        {isLogin && (
                            <button
                                className={styleSidebar.logoutBtn}
                                onClick={() => {
                                    localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 삭제
                                    setIsLogin(false); // 로그인 상태 false로 변경
                                    setUser(null); // 사용자 정보 초기화
                                    window.location.href = "/main";
                                }}
                            >로그아웃</button>
                        )}
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header;