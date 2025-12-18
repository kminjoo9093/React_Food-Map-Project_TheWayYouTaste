import { useState } from "react";
import style from "../../css/MembershipLogin.module.css";
import { useNavigate } from "react-router-dom"; // BrowserRouter는 여기서 필요 없음

function MembershipLogin() {
    // ----------------- 상태 관리 -----------------
    const [user_NM, setUser_NM] = useState('');
    const [user_PSWD, setUser_PSWD] = useState('');
    const [regUser_NM, setRegUser_NM] = useState('');
    const [regUser_EML_ADDR, setRegUser_EML_ADDR] = useState('');
    const [regUser_PSWD, setRegUser_PSWD] = useState('');

    const navigate = useNavigate();
    // active가 true일 때: 'register' 클래스가 활성화 (로그인 화면), 'login' 클래스가 비활성화 (회원가입 화면)
    // active가 false일 때: 'login' 클래스가 활성화 (회원가입 화면), 'register' 클래스가 비활성화 (로그인 화면)
    const [active, setActive] = useState(false); // 초기값: false (회원가입/Registration 화면)

    // ----------------- 로그인 처리 -----------------
    const mockLoginAPI = async (user_NM, pass) => {
        // ID: user1, PW: 1234 가 성공 조건이라고 가정
        if (user_NM === "user1" && pass === "1234") {
            return { success: true, token: "TEMP_JWT_TOKEN_12345" };
        } else {
            throw new Error("Invalid credentials");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await mockLoginAPI(user_NM, user_PSWD);

            if (result.success) {
                localStorage.setItem('authToken', result.token); 
                alert("정상적으로 Log-in 되었습니다.");
                // 메인 페이지로 이동
                navigate('/main'); 
            } 
        } catch (error) {
            console.error("Login Failed:", error.message);
            alert("ID/PASSWORD를 확인 하시기 바랍니다."); 
        }
    };

    const mockRegisterAPI = async (user, email, pass) => {
        // 실제 API 호출 로직 (생략하고 성공으로 가정)
        console.log("회원가입 시도:", user, email, pass);
        // 성공 시 resolve, 실패 시 reject 또는 throw
        return { success: true };
    };

    const handleRegister = async (e) => {
        e.preventDefault(); 
        
        // Alert/모달 박스로 "회원 가입하시겠습니까?" 질문
        const isConfirmed = window.confirm("회원 가입하시겠습니까?");
        
        if (isConfirmed) {
            try {
                // 가입 처리 (여기서는 mock API 호출)
                await mockRegisterAPI(regUser_NM, regUser_EML_ADDR, regUser_PSWD);

                // Login 페이지로 화면 전환 (로그인하기 직전 상태)
                // 현재 active는 false가 'Registration' 화면이므로, true로 변경하여 'Login' 화면으로 전환
                setActive(true); 
                alert("회원가입이 완료되었습니다. 로그인 해주세요.");

                // 입력 필드 초기화 (선택 사항)
                setRegUser_NM('');
                setRegUser_EML_ADDR('');
                setRegUser_PSWD('');
                
            } catch (error) {
                console.error("Registration Failed:", error.message);
                alert("회원가입에 실패했습니다.");
            }
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
                        <h1>Registration</h1>

                        <div className={style.inputBox}>
                            <input 
                                type="text" 
                                placeholder="User_NM" 
                                value={regUser_NM} 
                                onChange={(e) => setRegUser_NM(e.target.value)}
                                required
                            />
                            <i className="bx bxs-user"></i>
                        </div>

                        <div className={style.inputBox}>
                            <input 
                                type="email" 
                                placeholder="User_EML_ADDR" 
                                value={regUser_EML_ADDR} 
                                onChange={(e) => setRegUser_EML_ADDR(e.target.value)}
                            />
                            <i className="bx bxs-envelope"></i>
                        </div>

                        <div className={style.inputBox}>
                            <input 
                                type="password" 
                                placeholder="User_PSWD" 
                                value={regUser_PSWD} 
                                onChange={(e) => setRegUser_PSWD(e.target.value)}
                                required
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <br></br>
                        {/* 이 버튼을 클릭 시 handleRegister 실행 */}
                        <button className={style.btn} type="submit">Register</button>
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
                                    placeholder="User_NM" 
                                    value={user_NM} 
                                    onChange={(e) => setUser_NM(e.target.value)}
                                />
                                <i className="bx bxs-user"></i>
                            </div>

                            <div className={style.inputBox}>
                                <input 
                                    type="password" 
                                    placeholder="User_PSWD" 
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