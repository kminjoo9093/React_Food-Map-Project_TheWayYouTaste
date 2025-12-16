import style from "../../css/MembershipResign.module.css";
import Swal from 'sweetalert2';

function MembershipResign () {
    const isMembershipinfoRegistered = () => {
        if (isMembershipinfoRegistered === true) {
            alert("/companyinfo");
        } else {
            Swal.fire({
                icon: "warning",
                title: "탈퇴 여부 확인.",
                text: "탈퇴 되었습니다."
            });
        }
    };
    return (
       <div className={style.container}>
            <div className={style.leftBox}>
                <br></br>
                <div>
                    <h1>회원 정보 탈퇴</h1>
                </div>
                        <br></br>
                        <div className={style.subTitle1}>죄종 경고 및 확인</div>
                        <br></br>
                        <div className={style.subTitle1}>본인 인증</div>
                        <br></br>
                        <div className={style.subTitle1}>데이터 처리 및 보관</div>
                        <br></br>
                        <div className={style.subTitle1}>사유 수집</div>
                        <br></br>
                        <div className={style.subTitle1}>완료 및 후속조치</div>
                        <br></br>
                        <div className={style.subTitle1}>자세히 보기</div>
                        <br></br>
                        <br></br>
                        <button className={style.mainBtn} type="button">탈퇴하기</button>
            </div>
            <div className={style.rightBox}>
                <div className={style.profileBox}><h2>warning~!</h2>
                <br></br>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ 최종 경고 및 확인</span>
                            <button className={style.btn} type="button">바로가기</button>
                    </div>
                    <br></br>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ 본인 인증</span>
                            <button className={style.btn} type="button">바로가기</button>
                    </div>
                    <br></br>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ 데이터 처리 및 보관</span>
                            <button className={style.btn} type="button">바로가기</button>
                    </div>
                    <br></br>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ 탈퇴 사유 수집(선택항목)</span>
                            <button className={style.btn} type="button">바로가기</button>
                    </div>
                    <br></br>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ 완료 및 후속 조치</span>
                            <button className={style.btn} type="button">바로가기</button>
                    </div>
                    <br></br>
                    <div className={style.wrapBox}>
                        <span className={style.subTitle2}>■ 자세히 보기</span>
                            <button className={style.btn} type="button">바로가기</button>
                    </div>
                    <br></br>
                </div>
            </div>
        </div>
    )


}

export default MembershipResign;