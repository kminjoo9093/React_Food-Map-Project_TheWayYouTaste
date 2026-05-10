import styleFooter from "../css/Footer.module.css"
import iconInsta from "../resources/img/system/instagram.svg"
import iconFacebook from "../resources/img/system/facebook.svg"
import iconTwitter from "../resources/img/system/twitter.svg"

function Footer() {
    return (
        <footer className={styleFooter.footer}>
            <div className={styleFooter.footerContainer}>

                <div className={styleFooter.footerSection}>
                    <h2>니맛대로</h2>
                    <p>경상남도 진주시 동부로 169번길 12, B동 1103호 </p>
                    <p>전화: 02-1234-5678</p>
                    <p>이메일: info@mycompany.com</p>
                </div>

                <div className={styleFooter.footerSection}>
                    <h3>Quick Links</h3>
                    <ul className={styleFooter.quickList}>
                        <li><a href="/home">홈</a></li>
                        <li><a href="/about">회사소개</a></li>
                        <li><a href="/services">서비스</a></li>
                        <li><a href="/contact">문의</a></li>
                    </ul>
                </div>

               <div className={`${styleFooter.footerSection} ${styleFooter.footerSocial}`}>
                    <h3>Follow Us</h3>
                    <a href="https://www.facebook.com"><img src={iconFacebook} alt="니맛대로 페이스북"/></a>
                    <a href="https://www.facebook.com"><img src={iconTwitter} alt="니맛대로 트위터"/></a>
                    <a href="https://www.instagram.com"><img src={iconInsta} alt="니맛대로 인스타그램"/></a>
                </div>

            </div>

            <div className={styleFooter.footerBottom}>
                © 2025 My Company. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
