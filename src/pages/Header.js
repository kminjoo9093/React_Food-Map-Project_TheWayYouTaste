import "./Header.css";

function Header(){
    return(
        <>
            <div className="header">
                <div className="logo">
                     니맛대로    {/* <p style={{fontSize: 12}}>TheWayYouTaste</p> */}
                </div>
                <div className="search-container">
                    <input type="text" placeholder="지역, 음식 또는 식당명을 검색하세요"/>
                    <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="search"/>
                </div>
                <div className="login">로그인</div>
            </div>

            <div className="menubar">
                <a>지역 맛집</a>
                <a>지도 찾기</a>
                <a>가게등록</a>
                <a>공지사항</a>
            </div>
        </>
    )

}

export default Header;