import styleHeader from "../css/Header.module.css";
import styleSidebar from "../css/sidebar.module.css"
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchForm from "../components/SearchForm";

function Header(){

    const [open, setOpen] = useState(false);
    const [openMyMenu, setOpenMyMenu] = useState(false);
    const [isLogin, setIsLogin] = useState(false); 
    const [user, setUser] = useState(null); 

    //모바일 메뉴 버튼 state
    const [openMobMenu, setOpenMobMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLogin(true);
        }
    }, []);

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
                        <Link to = "/main"> 니맛대로 </Link>    
                    </h1>
                    {/* PC */}
                    <SearchForm device={"pc"}/>
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
                                    ? `${user.nickname} 관리자님 안녕하세요!`  
                                    : `${user.nickname}님 안녕하세요!`      
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
                                    localStorage.removeItem("user"); 
                                    setIsLogin(false); 
                                    setUser(null); 
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