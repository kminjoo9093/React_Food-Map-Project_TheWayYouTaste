 import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import style from "../../css/MembershipModify.module.css"; 

function MembershipModify() {
    const navigate = useNavigate();
    
    // 세션에서 로그인 정보를 가져오는 초기화 로직
    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem("loginMember");
        return saved ? JSON.parse(saved) : null;
    });

    const [modifyData, setModifyData] = useState({
        nickname: user?.nickname || "",
        userMblTelno: user?.userMblTelno || "",
        userEmlAddr: user?.userEmlAddr || "",
        password: ""
    });

    // 세션 데이터가 들어오면 상태 업데이트
    useEffect(() => {
        const saved = sessionStorage.getItem("loginMember");
        if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed);
            setModifyData({
                nickname: parsed.nickname || "",
                userMblTelno: parsed.userMblTelno || "",
                userEmlAddr: parsed.userEmlAddr || "",
                password: ""
            });
        }
    }, []);

    const handleModify = async (field) => {
        // 이 부분에서 세션의 userSn(강상훈 님은 26)이 없으면 경고가 뜸
        if (!user || !user.userSn) {
            alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:3001/membership/modify/${user.userSn}`, {
                ...user,
                [field]: modifyData[field]
            });

            if (res.status === 200) {
                alert("성공적으로 수정되었습니다.");

                const updatedUser = { ...user, [field]: modifyData[field] };
                sessionStorage.setItem("loginMember", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setModifyData(prev => ({ ...prev, [field]: modifyData[field]}))
            }
        } catch (error) {
            console.error("수정 실패:", error);
            alert("수정 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="contentTopPosition">
            <div className="container">
                <div className={style.container}>
                    <div className={style.leftBox}>
                        <br /><br />
                        <h1>회원 정보 수정</h1>
                        <br />
                        <div className={style.subTitle1}>■ My profile</div>
                        <br />
                        <div className={style.subTitle1}>■ Security setting</div>
                        <br />
                        <div className={style.subTitle1}>■ History management</div>
                        <br />
                        <button className={style.mainBtn} type="button" onClick={() => {
                            sessionStorage.clear();
                            navigate('/login');
                        }}>Log-out</button>
                    </div>

                    <div className={style.rightBox}>
                        <div className={style.profileBox}>
                            <h3>My profile~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 닉네임 </span>
                                <span>{modifyData.nickname}</span> 
                                <button className={style.btn} onClick={() => handleModify('nickname')}>수정</button>
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 핸드폰 번호 </span>
                                <span>{modifyData.userMblTelno}</span>
                                <button className={style.btn} onClick={() => handleModify('userMblTelno')}>수정</button>
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ E-mail</span>
                                <span>{modifyData.userEmlAddr}</span>
                                <button className={style.btn} onClick={() => handleModify('userEmlAddr')}>수정</button>
                            </div>
                        </div>

                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', margin: '7px 0', width: '100%' }}></div>

                        <div className={style.profileBox}>
                            <h3>Security setting~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 비밀번호</span>
                                <button className={style.btn} onClick={() => handleModify('password')}>수정</button>
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 회원 탈퇴</span>
                                <button className={style.btn} type="button" onClick={() => navigate('/member/resign')}>/resign</button>
                            </div>
                        </div>

                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', margin: '15px 0', width: '100%' }}></div>

                        <div className={style.profileBox}>
                            <h3>History management~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 최초 가입일</span>
                                <span>{user?.frstRegDt || "데이터 로딩 중..."}</span>
                                <button className={style.btn} type="button">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MembershipModify;