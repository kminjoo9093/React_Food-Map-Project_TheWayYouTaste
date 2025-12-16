// import styleGlobal from "../css/Global.module.css";
import styleHeader from "../css/Header.module.css";
import styleSidebar from "../css/sidebar.module.css"
import { useState } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../resources/img/system/search.png";

function Header(){

    const [open, setOpen] = useState(false);
    const [openMyMenu, setOpenMyMenu] = useState(false);

    // 임시 login state
    //const [isLogin, setIsLogin] = useState(true); ////로그인 O => My page 보임
    const [isLogin, setIsLogin] = useState(false); //로그인 X

    //모바일 메뉴 버튼 state
    const [openMobMenu, setOpenMobMenu] = useState(false);

    function handleLoginState(){
        if(isLogin){
            return <button className={styleHeader.myMenu} onClick={() => setOpenMyMenu(true)}>
                        MY MENU
                    </button>
        } else {
            return <button className={styleHeader.login}>LOGIN</button>
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
                        <input type="text" placeholder="지역, 음식 또는 식당명을 검색하세요"/>
                        <img src={searchIcon} alt="search"/>
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
                
                <ul className={styleHeader.menubarPC}>
                    <li>
                        <a>지역 맛집</a>
                    </li>
                    <li>
                        <Link to = "/search/store" >지도 찾기</Link>
                    </li>
                    <li>
                        <a>가게 등록</a>
                    </li>
                    <li>
                        <Link to = "/notice/list"> 공지사항 </Link> 
                    </li>
                </ul>

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
                                <Link to = "#" onClick={() => setOpenMobMenu(false)}>가게 등록</Link>
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
                        <h3 className={styleSidebar.greeting}>○○○ 님 or 관리자님, 안녕하세요</h3>
                        <ul className={styleSidebar.myPageList}>
                            <li><Link to = "#" onClick={() => setOpenMyMenu(false)}> 내 정보 </Link></li>
                            <li><Link to = "/admin/member/list" onClick={() => setOpenMyMenu(false)}> 회원 정보 조회 </Link></li>
                            <li><Link to = "/admin/report/list" onClick={() => setOpenMyMenu(false)}> 신고 내역 조회 </Link></li>
                            <li><Link to = "/admin/register/list" onClick={() => setOpenMyMenu(false)}> 가게 등록 조회 </Link></li>
                        </ul>
                        <button className={styleSidebar.logoutBtn}>로그아웃</button>
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header;