import style from "../../css/MembershipModifty.module.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function MembershipModify() {
    const navigate = useNavigate();

    // --- 1. 상태 관리 (DB 데이터 기준 초기화) ---
    const [userData, setUserData] = useState({
        nickname: "김휘원",         // DB: NICKNAME
        phone: "01012345678",      // DB: USER_MBL_TELNO
        email: "theway@naver.com", // DB: USER_EML_ADDR
        joinDate: "20251219111419" // DB: FRST_REG_DT
    });

    // 일반 수정 모드 상태
    const [isEditing, setIsEditing] = useState({
        nickname: false,
        phone: false,
        email: false,
    });

    // 비밀번호 변경 모달 관련 상태
    const [showPwModal, setShowPwModal] = useState(false);
    const [pwData, setPwData] = useState({ currentPw: "", newPw: "", confirmPw: "" });

    // --- 2. 유틸리티 및 핸들러 함수 ---

    // 날짜 가공 (20251219111419 -> 2025-12-19)
    const formatJoinDate = (dateStr) => {
        if (!dateStr) return "정보 없음";
        return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    };

    // 일반 입력값 변경
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // 비밀번호 입력값 변경
    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPwData({ ...pwData, [name]: value });
    };

    // 수정/저장 토글
    const toggleEdit = (field) => {
        if (isEditing[field]) {
            alert(`${field} 정보가 저장되었습니다.`);
        }
        setIsEditing({ ...isEditing, [field]: !isEditing[field] });
    };

    // 비밀번호 업데이트 로직
    const handlePwUpdate = () => {
        if (!pwData.currentPw || !pwData.newPw || !pwData.confirmPw) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        if (pwData.newPw !== pwData.confirmPw) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        // 추후 여기서 서버와 비밀번호 검증 API 통신
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setShowPwModal(false);
        setPwData({ currentPw: "", newPw: "", confirmPw: "" });
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userProfile');
        setTimeout(() => {
            alert('정상적으로 Log-out 되었습니다.~~!!');
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="contentTopPosition">
            <div className="container">
                <div className={style.container}>
                    {/* 왼쪽 사이드바 */}
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
                        <button className={style.mainBtn} type="button" onClick={handleLogout}>log-out</button>
                    </div>

                    {/* 오른쪽 컨텐츠 영역 */}
                    <div className={style.rightBox}>
                        {/* 1. My Profile 섹션 */}
                        <div className={style.profileBox}>
                            <h3>My profile~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 닉네임 </span>
                                {isEditing.nickname ? (
                                    <input name="nickname" value={userData.nickname} onChange={handleChange} className={style.editInput} />
                                ) : (
                                    <span>{userData.nickname}</span>
                                )}
                                <button className={style.btn} type="button" onClick={() => toggleEdit('nickname')}>
                                    {isEditing.nickname ? "저장" : "수정"}
                                </button>
                            </div>

                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 핸드폰 번호 </span>
                                {isEditing.phone ? (
                                    <input name="phone" value={userData.phone} onChange={handleChange} className={style.editInput} />
                                ) : (
                                    <span>{userData.phone}</span>
                                )}
                                <button className={style.btn} type="button" onClick={() => toggleEdit('phone')}>
                                    {isEditing.phone ? "저장" : "수정"}
                                </button>
                            </div>

                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ E-mail</span>
                                {isEditing.email ? (
                                    <input name="email" value={userData.email} onChange={handleChange} className={style.editInput} />
                                ) : (
                                    <span>{userData.email}</span>
                                )}
                                <button className={style.btn} type="button" onClick={() => toggleEdit('email')}>
                                    {isEditing.email ? "저장" : "수정"}
                                </button>
                            </div>

                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 회원 탈퇴</span>
                                <button className={style.btn1} type="button" onClick={() => navigate('/member/resign')}> /resign </button>
                            </div>
                        </div>

                        {/* 2. Security Setting 섹션 */}
                        <div className={style.securityBox}>
                            <h3>Security setting~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 비밀번호</span>
                                <span>********</span>
                                <button className={style.btn} type="button" onClick={() => setShowPwModal(true)}>수정</button>
                            </div>
                        </div>

                        {/* 3. History Management 섹션 */}
                        <div className={style.historyBox}>
                            <h3>History management~!</h3>
                            <div className={style.wrapBox}>
                                <span className={style.subTitle2}>■ 최초 가입일</span>
                                <button className={style.btn} type="button" onClick={() => alert(`회원님의 최초 가입일은 ${formatJoinDate(userData.joinDate)}입니다.`)}>확인</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 비밀번호 변경 모달 */}
            {showPwModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{color: '#333'}}>비밀번호 변경</h3>
                        <input type="password" name="currentPw" placeholder="현재 비밀번호" value={pwData.currentPw} onChange={handlePwChange} style={modalInputStyle} />
                        <input type="password" name="newPw" placeholder="새 비밀번호" value={pwData.newPw} onChange={handlePwChange} style={modalInputStyle} />
                        <input type="password" name="confirmPw" placeholder="새 비밀번호 확인" value={pwData.confirmPw} onChange={handlePwChange} style={modalInputStyle} />
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={handlePwUpdate} className={style.btn} style={{ marginRight: '10px' }}>변경</button>
                            <button onClick={() => setShowPwModal(false)} className={style.btn}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 모달 인라인 스타일 (MembershipModifty.module.css에 추가하시는 것을 추천합니다)
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '40px', borderRadius: '15px', textAlign: 'center', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
};
const modalInputStyle = {
    display: 'block', width: '100%', margin: '15px 0', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box'
};

export default MembershipModify;