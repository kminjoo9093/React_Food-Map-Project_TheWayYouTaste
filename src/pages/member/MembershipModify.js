import style from "../../css/MembershipModifty.module.css";

import React from 'react';
import { useNavigate } from "react-router-dom";

function MembershipModify () {
    // useNavigate 훅 초기화
    const navigate = useNavigate();

    // 로그아웃 핸들러 함수 정의
    const handleLogout = () => {
        // 실제 로그아웃 처리 로직: 토큰/세션 정보 삭제
        // 예시: Local Storage에 저장된 사용자 토큰 및 정보 삭제
        localStorage.removeItem('accessToken'); 
        localStorage.removeItem('userProfile');
        
        console.log('로그아웃 처리 완료: 저장된 토큰 삭제');
        setTimeout(() => {
            alert('정상적으로 Log-out 되었습니다.~~!!')

        // /login 페이지로 이동
        navigate('/login'); 
    }, 1500); 
};

    return (
        <div className="contentTopPosition">
            <div className="container">
                <div className={style.container}>
                    <div className={style.leftBox}>
                        <br></br>
                        <br></br>
                        <div>
                            <h1>회원 정보 수정</h1>
                        </div>
                                <br></br>
                                <div className={style.subTitle1}>■ My profile</div>
                                <br></br>
                                <div className={style.subTitle1}>■ Security setting</div>
                                <br></br>
                                <div className={style.subTitle1}>■ History management</div>
                                <br></br>

                                <button className={style.mainBtn} type="button" onClick={handleLogout}>log-out</button>
                    </div>

                    <div className={style.rightBox}>
                        <div className={style.profileBox}><h3>My profile~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 닉네임 </span>
                                    <button className={style.btn} type="button">수정</button>
                            </div>

                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 핸드폰 번호 </span>
                                    <button className={style.btn} type="button">수정</button>
                            </div>

                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ E-mail</span>
                                    <button className={style.btn} type="button">수정</button>
                            </div>

                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 회원 탈퇴</span>
                                    <button className={style.btn1} type="button" onClick={() => navigate('/member/resign')}> /resign </button>
                            </div>
                        </div>

                        <div className={style.securityBox}><h3>Security setting~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 비밀번호</span>
                                <button className={style.btn} type="button">수정</button>
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 2단계 인증</span>
                                <button className={style.btn} type="button">설정</button>
                                    {/*<div style={{borderTop: '2px dashed gray', padding: '2px'}}></div> */}
                            </div>
                        </div>
                        <div className={style.historyBox}><h3>History management~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 최초 가입일</span>
                                <button className={style.btn} type="button">확인</button>
                                    {/* <div style={{borderTop: '2px dashed gray', padding: '2px'}}></div> */}
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 주문내역</span>
                                <button className={style.btn} type="button">확인</button>
                                    {/* <div style={{borderTop: '2px dashed gray', padding: '2px'}}></div> */}
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 즐겨찾기</span>
                                <button className={style.btn} type="button">확인</button>
                                    {/* <div style={{borderTop: '2px dashed gray', padding: '2px'}}></div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MembershipModify;