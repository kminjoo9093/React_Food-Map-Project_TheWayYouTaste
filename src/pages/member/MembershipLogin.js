import { useState } from "react";
import style from "../../css/MembershipLogin.module.css";
import { useNavigate } from "react-router-dom"; // BrowserRouter는 여기서 필요 없음

function MembershipLogin({setIsLoggedIn, setUser}) {
    // ----------------- 상태 관리 -----------------
    const [userEmlAddr, setUserEmlAddr] = useState('');
    const [user_PSWD, setUser_PSWD] = useState('');
    const [regUser_NM, setRegUser_NM] = useState('');
    const [regUser_EML_ADDR, setRegUser_EML_ADDR] = useState('');
    const [regUser_PSWD, setRegUser_PSWD] = useState('');

    const navigate = useNavigate();
    const [active, setActive] = useState(false); // 초기값: false (회원가입/Registration 화면)

    // ----------------- 로그인 처리 -----------------
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3001/membership/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmlAddr: userEmlAddr,
                password: user_PSWD,
            }),
            });

            if (!res.ok) throw new Error("login fail");

            const data = await res.json();

            localStorage.setItem("user", JSON.stringify(data));  // 예: {userSn: 1002, userName: "JohnDoe", token: "jwt_token"}
            setUser(data); 
            setIsLoggedIn(true);

            alert("정상적으로 로그인 되었습니다.");
            navigate("/main");

        } catch (error) {
            alert("ID / PASSWORD를 확인하세요.");
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("회원 가입하시겠습니까?");
        if (!isConfirmed) return;

        try {
            const res = await fetch("http://localhost:3001/membership/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userNm: regUser_NM,
                userPswd: regUser_PSWD,
                userEmlAddr: regUser_EML_ADDR,
                nickname: regUser_NM,
                userMblTelno: "01012345678", // 임시
            }),
        });

            if (!res.ok) throw new Error("register fail");

            alert("회원가입 완료! 로그인 해주세요.");
            setActive(true);

            setRegUser_NM("");
            setRegUser_EML_ADDR("");
            setRegUser_PSWD("");

        } catch (error) {
            alert("회원가입 실패");
        }
    };

    return (
        <div className="contentTopPosition" style={{marginTop : "180px"}}>
            {/* active 상태에 따라 container에 active 클래스 적용 */}
            <div className={`${style.container} ${active ? style.active : ""}`}>
                
                {/* 회원가입 폼 (Image: 회원 정보 등록 페이지.jpg) 
                    - CSS 상으로는 .login 클래스를 사용하여 Registration 폼을 덮어쓰는 것으로 보입니다.
                    - 토글 버튼의 onClick={() => setActive(false)}가 이쪽으로 연결됩니다.
                */}
                <div className={`${style.formBox} ${style.login}`}> 
                    <form onSubmit={handleRegister}>
                        <h1>회원가입</h1>

                        <div className={style.inputBox}>
                            <input 
                                type="text" 
                                placeholder="성명" 
                                value={regUser_NM} 
                                onChange={(e) => setRegUser_NM(e.target.value)}
                                required
                            />
                            <i className="bx bxs-user"></i>
                        </div>

                        <div className={style.inputBox}>
                            <input 
                                type="email" 
                                placeholder="이메일" 
                                value={regUser_EML_ADDR} 
                                onChange={(e) => setRegUser_EML_ADDR(e.target.value)}
                            />
                            <i className="bx bxs-envelope"></i>
                        </div>

                        <div className={style.inputBox}>
                            <input 
                                type="password" 
                                placeholder="비밀번호" 
                                value={regUser_PSWD} 
                                onChange={(e) => setRegUser_PSWD(e.target.value)}
                                required
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <br></br>
                        {/* 이 버튼을 클릭 시 handleRegister 실행 */}
                        <button className={style.btn} type="submit">회원가입</button>
                    </form>
                </div>

                {/* 로그인 폼 (Image: 회원 로그인 페이지.jpg)
                    - CSS 상으로는 .register 클래스를 사용하여 Login 폼을 덮어쓰는 것으로 보입니다.
                    - 토글 버튼의 onClick={() => setActive(true)}가 이쪽으로 연결됩니다.
                */}
                <div className={`${style.formBox} ${style.register}`}>
                    <div>
                        <h1>Login</h1>
                        <form onSubmit={handleLogin}>
                            <div className={style.inputBox}>
                                <input 
                                    type="text" 
                                    placeholder="이메일" 
                                    value={userEmlAddr} 
                                    onChange={(e) => setUserEmlAddr(e.target.value)}
                                />
                                <i className="bx bxs-user"></i>
                            </div>

                            <div className={style.inputBox}>
                                <input 
                                    type="password" 
                                    placeholder="비밀번호" 
                                    value={user_PSWD} 
                                    onChange={(e) => setUser_PSWD(e.target.value)} 
                                />
                                <i className="bx bxs-lock-alt"></i>
                            </div>
                            <br></br>
                            <button className={style.btn} type="submit">Login</button>
                        </form>
                    </div>

                    {/* 토글 패널 */}
                    <div className={style.toggleBox}>
                        
                        {/* 토글 오른쪽 패널 - 로그인 유도 (Registration 폼이 보일 때) */}
                        <div className={style.toggleLeft}> 
                            <h1>Signing up only takes
                                <br></br>a few seconds.</h1>
                            <br></br>
                            <br></br>
                            <p>Already have an account?</p>
                            {/* 클릭 시 active를 true로 변경하여 Login 화면(.register) 활성화 */}
                            <button type="button" className={style.registerBtn} onClick={() => setActive(true)}>Login</button>
                        </div>

                        {/* 토글 왼쪽 패널 - 회원가입 유도 (Login 폼이 보일 때) */}
                        <div className={style.toggleRight}> 
                            <h1>A service you can trust 
                                <br></br>- join us today~~!</h1>
                            <br></br>
                            <br></br>
                            <p>Don't have an account?</p>
                            <br></br>
                            {/* 클릭 시 active를 false로 변경하여 Registration 화면(.login) 활성화 */}
                            <button type="button" className={style.loginBtn} onClick={() => setActive(false)}>Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MembershipLogin;