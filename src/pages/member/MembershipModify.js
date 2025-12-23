import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import style from "../../css/MembershipModify.module.css"; 
import serverUrl from "../../db/server.json"; 

function MembershipModify() {
    const navigate = useNavigate();
    const SERVER_URL = serverUrl.SERVER_URL;

    // 1. 데이터 로드 (localStorage "user" 키 사용)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [modifyData, setModifyData] = useState({
        nickname: user?.nickname || "",
        userMblTelno: user?.userMblTelno || "",
        userEmlAddr: user?.userEmlAddr || "",
        password: ""
    });

    // 2. 수정 모드 상태 (어떤 필드를 수정 중인지 저장)
    const [editingField, setEditingField] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModifyData(prev => ({ ...prev, [name]: value }));
    };

    const handleModify = async (field) => {
        // 수정 모드가 아닐 때: 입력창으로 전환
        if (editingField !== field) {
            setEditingField(field);
            return;
        }

        // 수정 모드일 때 (저장 버튼 클릭 시): 서버 전송
        if (!user || !user.userSn) return alert("로그인 정보가 없습니다.");

        try {
            const res = await axios.put(`${SERVER_URL}/membership/modify/${user.userSn}`, {
                ...user,
                [field]: modifyData[field]
            });

            if (res.status === 200) {
                alert("성공적으로 수정되었습니다.");
                const updatedUser = { ...user, [field]: modifyData[field] };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setEditingField(null); // 입력창 닫기
            }
        } catch (error) {
            console.error("수정 실패:", error);
            alert("수정 실패: " + (error.response?.data || "서버 통신 오류"));
        }
    };

    return (
        <div className="contentTopPosition">
            <div className="container">
                <div className={style.container}>
                    {/* 왼쪽 사이드바 (디자인 보존) */}
                    <div className={style.leftBox}>
                        <br /><br />
                        <h1>회원 정보 수정</h1>
                        <br />
                        <div className={style.subTitle1}>■ 내 프로필 수정</div>
                        <br />
                        <div className={style.subTitle1}>■ 비밀/보안 설정</div>
                        <br />
                        <div className={style.subTitle1}>■ 이력 관리</div>
                        <br />
                        <button className={style.mainBtn} type="button" onClick={() => {
                            alert("로그아웃 하시겠습니까?");
                            localStorage.removeItem("user");
                            navigate('/main');
                        }}>로그 아웃</button>
                    </div>

                    {/* 오른쪽 영역 */}
                    <div className={style.rightBox}>
                        {/* 1. My Profile 박스 */}
                        <div className={style.profileBox}>
                            <h3>내 프로필 수정</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 닉네임 </span>
                                {editingField === 'nickname' ? (
                                    <input type="text" name="nickname" value={modifyData.nickname} onChange={handleInputChange} />
                                ) : (
                                    <span>{user?.nickname}</span>
                                )}
                                <button className={style.btn} onClick={() => handleModify('nickname')}>
                                    {editingField === 'nickname' ? "저장" : "수정"}
                                </button>
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 핸드폰 번호 </span>
                                {editingField === 'userMblTelno' ? (
                                    <input type="text" name="userMblTelno" value={modifyData.userMblTelno} onChange={handleInputChange} />
                                ) : (
                                    <span>{user?.userMblTelno}</span>
                                )}
                                <button className={style.btn} onClick={() => handleModify('userMblTelno')}>
                                    {editingField === 'userMblTelno' ? "저장" : "수정"}
                                </button>
                            </div>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 전자 메일</span>
                                {editingField === 'userEmlAddr' ? (
                                    <input type="text" name="userEmlAddr" value={modifyData.userEmlAddr} onChange={handleInputChange} />
                                ) : (
                                    <span>{user?.userEmlAddr}</span>
                                )}
                                <button className={style.btn} onClick={() => handleModify('userEmlAddr')}>
                                    {editingField === 'userEmlAddr' ? "저장" : "수정"}
                                </button>
                            </div>
                        </div>

                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', margin: '7px 0', width: '100%' }}></div>

                        {/* 2. Security setting 박스 */}
                        <div className={style.securityBox}>
                            <h3>비밀/보안 설정</h3>
                            {/* <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 비밀번호</span>
                                <span>{user?.userPswd ? "*".repeat(user.userPswd.length) : ""}</span>
                                <button className={style.btn} onClick={() => handleModify('password')}>수정</button>
                            </div> */}
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 회원 탈퇴</span>
                                <button className={style.btn} type="button" onClick={() => navigate('/member/resign')}>탈퇴 하기</button>
                            </div>
                        </div>

                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', margin: '7px 0', width: '100%' }}></div>

                        {/* 3. History management 박스 (복구 완료) */}
                        <div className={style.historyBox}>
                            <h3>이력 관리</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 최초 가입일</span>
                                <span>{user?.frstRegDt || "2025-12-22"}</span>
                                <button className={style.btn} style={{border : "1px solid #ffb92e"}}></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MembershipModify;