import React, { useState } from "react";
import style from "../../css/MembershipLogin.module.css"; // CSS Module import

export default function Script() {
    const [active, setActive] = useState(false);

    return (
        <div className={`{style.container} ${active ? style.active : ""}`}>
            <button onClick={() => setActive(true)} className={style.registerBtn}>
                register
            </button>

            <button onClick={() => setActive(false)} className={style.loginBtn}>
                login
            </button>
        </div>
    );
}


/*
import style from "../../css/MembershipLogin.module.css";

function script () {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.registerBtn');
    const loginBtn = document.querySelector('.loginBtn');
    return (
        <>
            registerBtn.addEventListener('click', () = {
                container.classList.add('active')
            })

            loginBtn.addEventListener('click', () = {
                container.classList.remove('active')
            })
        </>
    );
}

export default script;
*/