import style from "../../css/MembershipModifty.module.css";

function MembershipModify () {
    return (
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
                        <br></br>
                        <button className={style.mainBtn} type="button">log-out</button>
            </div>

            <div className={style.rightBox}>
                <div className={style.profileBox}><h3>My profile~!</h3>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ Real name</span>
                            <button className={style.btn} type="button">수정</button>
                    </div>

                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ Phone number</span>
                            <button className={style.btn} type="button">수정</button>
                    </div>

                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ E-mail</span>
                            <button className={style.btn} type="button">수정</button>
                    </div>

                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ Membership withdrawal</span>
                            <button className={style.btn} type="button">탈퇴</button>
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
    )

}

export default MembershipModify;