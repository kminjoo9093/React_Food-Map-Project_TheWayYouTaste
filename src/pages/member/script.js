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


