import styleHeader from "../css/Header.module.css";
import styleSiderbar from "../css/sidebar.module.css"
import { useState } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../resources/img/system/search.png";

function Header(){

    const [open, setOpen] = useState(false);

    return(
        <>
            <div className={styleHeader.header}>
                <div className={styleHeader.logo}>
                     <Link to = "/main"> 니맛대로 </Link>    {/* <p style={{fontSize: 12}}>TheWayYouTaste</p> */}
                </div>
                <div className={styleHeader.searchContainer}>
                    <input type="text" placeholder="지역, 음식 또는 식당명을 검색하세요"/>
                    <img src={searchIcon} alt="search"/>
                </div>
                <div className={styleHeader.rightMenu}>
                    <div className={styleHeader.login}>로그인</div>
                    <div className={styleSiderbar.tripleLine} onClick={() => setOpen(true)}>
                        ☰
                    </div>
                </div>
            </div>
            
            <div className={styleHeader.menubar}>
                <a>지역 맛집</a>
                <a>지도 찾기</a>
                <a>가게 등록</a>
                <Link to = "/notice"> 공지사항 </Link> 
            </div>
            <div className={`${styleSiderbar.sideWrapper} ${open ? styleSiderbar.open : ""}`}>
                <div className={styleSiderbar.dimmed} onClick={() => setOpen(false)}></div>
                <div className={styleSiderbar.sideBox}>

                    <h3>○○○ 관리자님, 안녕하세요</h3>

                    <ul className={styleSiderbar.menuList}>
                        <li>내 정보</li>
                        <li><Link to = "/admin/member/list" onClick={() => setOpen(false)}> 회원 정보 조회 </Link></li>
                        <li><Link to = "/admin/report/list" onClick={() => setOpen(false)}> 신고 내역 조회 </Link></li>
                        <li><Link to = "/admin/register/list" onClick={() => setOpen(false)}> 가게 등록 조회 </Link></li>
                    </ul>

                    <button className={styleSiderbar.logoutBtn}>로그아웃</button>
                </div>
            </div>
        </>
    )

}

export default Header;