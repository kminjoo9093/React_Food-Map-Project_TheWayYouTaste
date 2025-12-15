import { useState } from "react";
import style from "../../css/MembershipLogin.module.css";

function MembershipLogin() {
  const [active, setActive] = useState(false);

  return (
    <div className={`${style.container} ${active ? style.active : ""}`}>
      
      {/* 로그인 */}
      <div className={`${style.formBox} ${style.login}`}>
        <form>
          <h1>Login</h1>

          <div className={style.inputBox}>
            <input type="text" placeholder="Username" />
            <i className="bx bxs-user"></i>
          </div>

          <div className={style.inputBox}>
            <input type="password" placeholder="Password" />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button className={style.btn}>Login</button>
        </form>
      </div>

      {/* 회원가입 */}
      <div className={`${style.formBox} ${style.register}`}>
        <form>
          <h1>Registration</h1>

          <div className={style.inputBox}>
            <input type="text" placeholder="Username" />
            <i className="bx bxs-user"></i>
          </div>

          <div className={style.inputBox}>
            <input type="email" placeholder="Email" />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className={style.inputBox}>
            <input type="password" placeholder="Password" />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button className={style.btn}>Register</button>
        </form>
      </div>

      {/* 토글 */}
      <div className={style.toggleBox}>
        <div className={style.toggleLeft}>
          <h2>Join us today!</h2>
          <p>Don't have an account?</p>
          <button
            className={style.registerBtn}
            onClick={() => setActive(true)}
          >
            Register
          </button>
        </div>

        <div className={style.toggleRight}>
          <h2>Hello, Welcome!</h2>
          <p>Already have an account?</p>
          <button
            className={style.loginBtn}
            onClick={() => setActive(false)}
          >
            Login
          </button>
        </div>
      </div>

    </div>
  );
}

export default MembershipLogin;
