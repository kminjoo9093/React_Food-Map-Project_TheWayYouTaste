//import React, { useState } from 'react';
//import style from "./../Script.js";
import style from "../../css/MembershipLogin.module.css";

function MembershipLogin() {    
  //const [active, setActive] = useState(false);

  return (
    //< className={`${style.container} ${active ? style.active : ""}`}>
      <div className={style.container}>
        <div className={style.formBox}>
          <form action="#">
            <h1>Login</h1>
            <div className={style.inputBox}>
              <input type="text" placeholder="Username" required />
              <i className="bx bxs-user"></i>
            </div>
            <div className={style.inputBox}>
              <input type="password" placeholder="Password" required />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className={style.forgotLink}>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className={style.btn}>Login</button>
            <p>or login with social platforms</p>
            <div className={style.socialIcons}>
              <a href="#"><i className="bx bxl-google"></i></a>
              <a href="#"><i className="bx bxl-facebook"></i></a>
              <a href="#"><i className="bx bxl-github"></i></a>
              <a href="#"><i className="bx bxl-linkedin"></i></a>
            </div>
          </form>
        </div>
      
      <div className={style.formBox}>
        <form action="#">
          <h1>Registration</h1>
          <div className={style.inputBox}>
            <input type="text" placeholder="Username" required />
            <i className="bx bxs-user"></i>
          </div>
          <div className={style.inputBox}>
            <input type="email" placeholder="Email" required />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className={style.inputBox}>
            <input type="password" placeholder="Password" required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className={style.btn}>Register</button>
          <p>or register with social platforms</p>
          <div className={style.socialIcons}>
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

        <div className={style.toggleBox}>
          <div className={style.toggleLeft}>
            <h2>A service you can trust <br>
            </br>- join us today!!</h2>
            <p>Don't have an account?</p>
            <button className={style.registerBtn}>Register</button>
          </div>

          <div className={style.toggleRight}>
            <h1>Hello, Welcome!</h1>
            <p>Already have an account?</p>
            <button className={style.loginBtn}>Login</button>
          </div>
        </div>
      </div>
  );
}

    export default MembershipLogin;
