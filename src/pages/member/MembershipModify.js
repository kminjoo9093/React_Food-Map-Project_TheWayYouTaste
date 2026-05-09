import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../css/MembershipModify.module.css";
import serverUrl from "../../config/server.json";

function MembershipModify() {
  const navigate = useNavigate();
  const SERVER_URL = serverUrl.SERVER_URL;

  // 각 섹션을 가리킬 ref 생성
  const profileRef = useRef(null);
  const securityRef = useRef(null);
  const historyRef = useRef(null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [modifyData, setModifyData] = useState({
    nickname: user?.nickname || "",
    userMblTelno: user?.userMblTelno || "",
    userEmlAddr: user?.userEmlAddr || "",
  });

  const [editingField, setEditingField] = useState(null);

  // 2. 스크롤 이동 함수
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = 100;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModify = async (field) => {
    if (editingField !== field) {
      setEditingField(field);
      return;
    }

    if (!user || !user.userSn) return alert("로그인 정보가 없습니다.");

    try {
      const res = await axios.put(
        `${SERVER_URL}/membership/modify/${user.userSn}`,
        {
          ...user,
          [field]: modifyData[field],
        },
      );

      if (res.status === 200) {
        alert("성공적으로 수정되었습니다.");
        const updatedUser = { ...user, [field]: modifyData[field] };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditingField(null);
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 실패: " + (error.response?.data || "서버 통신 오류"));
    }
  };

  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={style.mainWrapper}>
          {/* 왼쪽 사이드바 */}
          <aside className={style.leftBox}>
            <h1>회원 설정</h1>
            <div
              className={style.subTitle1}
              onClick={() => scrollToSection(profileRef)}
            >
              ■ 내 프로필 수정
            </div>
            <div
              className={style.subTitle1}
              onClick={() => scrollToSection(profileRef)}
            >
              ■ 비밀/보안 설정
            </div>
            <div
              className={style.subTitle1}
              onClick={() => scrollToSection(profileRef)}
            >
              ■ 이력 관리
            </div>
            <button
              className={style.mainBtn}
              type="button"
              onClick={() => {
                if (window.confirm("로그아웃 하시겠습니까?")) {
                  localStorage.removeItem("user");
                  window.location.href = "/main";
                }
              }}
            >
              로그 아웃
            </button>
          </aside>
          {/* 오른쪽 메인 콘텐츠 */}
          <div className={style.rightBox}>
            {/* 1. 프로필 관리 카드 */}
            <section className={style.profileBox} ref={profileRef}>
              <h3>내 프로필 수정</h3>

              <div className={style.wrapBox}>
                <span className={style.subTitle2}>닉네임</span>
                <div className={style.dataValue}>
                  {editingField === "nickname" ? (
                    <input
                      className={style.editInput}
                      type="text"
                      name="nickname"
                      value={modifyData.nickname}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user?.nickname}</span>
                  )}
                </div>
                <button
                  className={style.btn}
                  onClick={() => handleModify("nickname")}
                >
                  {editingField === "nickname" ? "저장" : "수정"}
                </button>
              </div>

              <div className={style.wrapBox}>
                <span className={style.subTitle2}>핸드폰 번호</span>
                <div className={style.dataValue}>
                  {editingField === "userMblTelno" ? (
                    <input
                      className={style.editInput}
                      type="text"
                      name="userMblTelno"
                      value={modifyData.userMblTelno}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user?.userMblTelno}</span>
                  )}
                </div>
                <button
                  className={style.btn}
                  onClick={() => handleModify("userMblTelno")}
                >
                  {editingField === "userMblTelno" ? "저장" : "수정"}
                </button>
              </div>

              <div className={style.wrapBox}>
                <span className={style.subTitle2}>이메일 주소</span>
                <div className={style.dataValue}>
                  {editingField === "userEmlAddr" ? (
                    <input
                      className={style.editInput}
                      type="text"
                      name="userEmlAddr"
                      value={modifyData.userEmlAddr}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span className={style.email}>{user?.userEmlAddr}</span>
                  )}
                </div>
                <button
                  className={style.btn}
                  onClick={() => handleModify("userEmlAddr")}
                >
                  {editingField === "userEmlAddr" ? "저장" : "수정"}
                </button>
              </div>
            </section>

            {/* 2. 보안 설정 카드 */}
            <section className={style.securityBox} ref={securityRef}>
              <h3>비밀/보안 설정</h3>
              <div className={style.wrapBox}>
                <span className={style.subTitle2}>회원 탈퇴</span>
                <div className={style.dataValue}>
                  탈퇴 시 모든 활동 기록과 정보가 삭제됩니다.
                </div>
                <button
                  className={style.btn}
                  type="button"
                  onClick={() => navigate("/member/resign")}
                >
                  탈퇴하기
                </button>
              </div>
            </section>

            {/* 3. 이력 관리 카드 */}
            <section className={style.historyBox} ref={historyRef}>
              <h3>활동 이력 관리</h3>
              <div className={style.wrapBox}>
                <span className={style.subTitle2}>최초 가입일</span>
                <div className={style.dataValue}>
                  {user?.frstRegDt || "2025-12-22"}
                </div>
                <div style={{ width: "100px" }}></div>
              </div>
            </section>
          </div>{" "}
          {/* rightBox 끝 */}
        </div>{" "}
        {/* mainWrapper 끝 */}
      </div>{" "}
      {/* container 끝 */}
    </div>
  );
}

export default MembershipModify;
