import React, { useState, useEffect } from 'react';
import style from "../../css/MembershipResign.module.css";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AGREEMENT_ITEMS = [
    "최종 경고 및 확인",
    "본인 인증",
    "데이터 처리 및 보관",
    "사유 수집",
    "완료 및 후속조치",
    "이용 약관",
];

const LEGAL_NOTICES = {
    "최종 경고 및 확인": {
        icon: 'warning', title: '안내 및 주의사항을 알려드립니다.', width: '1050px',
        htmlContent: `
            <div style="max-height: 500px; overflow-y: auto; text-align: left; font-size: 0.82em;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <thead style="background-color: #f8f9fa;">
                        <tr><th style="border: 1px solid #ddd; padding: 10px; width: 15%;">구분</th><th style="border: 1px solid #ddd; padding: 10px; width: 25%;">핵심 내용</th><th style="border: 1px solid #ddd; padding: 10px;">필수 고지 사항</th></tr>
                    </thead>
                    <tbody>
                        <tr><td rowspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">계정 및 정보 파기</td><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">개인 식별 정보 삭제</td><td style="border: 1px solid #ddd; padding: 10px;">탈퇴와 동시에 회원님의 ID, 비밀번호, 이메일 휴대폰 번호 등 계정을 식별할 수 있는 모든 정보가 즉시 파기됩니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">서비스 이용 기록 삭제 불가</td><td style="border: 1px solid #ddd; padding: 10px;">구매 내역, 주문/배송 정보, 고객 문의 기록 등은 법적 의무에 따라 일정 기간 보관되므로, 즉시 삭제되지 않습니다.</td></tr>
                        <tr><td rowspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">활동 및 데이터 손실</td><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">활동 기록 영구삭제</td><td style="border: 1px solid #ddd; padding: 10px;">회원 탈퇴 시 작성하신 게시글, 댓글, 스크랩, 좋아요 등의 활동 기록이 모두 삭제되며, 복구가 절대 불가능합니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">포인트 / 혜택 소멸</td><td style="border: 1px solid #ddd; padding: 10px;">보유하고 계시던 적립금, 포인트, 쿠폰, 레벨(등급) 등 모든 혜택이 즉시 소멸되어, 재가입 시에도 복원되지 않습니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">거래 미완료 건 처리</td><td style="border: 1px solid #ddd; padding: 10px;">진행 중인 환불, 반품, 교환 등의 미완료 건이 있는 경우, 탈퇴 전에 반드시 처리해야 합니다. 미처리 시 불이익이 발생할 수 있습니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">재가입 제한</td><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">재가입 가능 시점</td><td style="border: 1px solid #ddd; padding: 10px;">탈퇴 후 일정 기간(예: 7일) 동안 재가입이 제한될 수 있으며, 재가입하더라도 기존의 활동 기록과 정보는 복원되지 않습니다.</td></tr>
                    </tbody>
                </table>
            </div>`
    },
    "본인 인증": { 
        icon: 'lock', title: '“당신은 정말로 이 계정의 탈퇴를 원하시나요?”', width: '1050px',
        htmlContent: `
            <div style="text-align: center; padding: 10px;">
                <p style="font-size: 0.9em; color: #555; line-height: 1.6; margin-bottom: 20px;">
                    "행동으로 옮기시기 전, 본 항목을 제외한 나머지 항목들을 한번만 더 읽어주십시오."<br>
                    "그럼에도 탈퇴를 원하신다면, 회원 가입 때 작성하신 E-mail로 본인 인증 번호를 보내 드리겠습니다."
                </p>
                <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                    <input type="text" id="swal-email-id" class="swal2-input" placeholder="이메일 아이디" style="width: 180px; margin: 0;">
                    <select id="swal-email-domain" class="swal2-select" style="margin: 0;">
                        <option value="@naver.com">@naver.com</option>
                        <option value="@gmail.com">@gmail.com</option>
                        <option value="@daum.net">@daum.net</option>
                        <option value="@nate.com">@nate.com</option>
                    </select>
                </div>
                <p style="font-size: 0.8em; color: #B71C1C; margin-top: 15px; font-weight: bold;">* 인증번호 발송 버튼 클릭 시 3초 후 인증 메일이 전송됩니다.</p>
            </div>` 
    },
    "데이터 처리 및 보관": {
        icon: 'info', title: '데이터 처리 및 법적 보관 기준', width: '1050px',
        htmlContent: `
            <div style="max-height: 500px; overflow-y: auto; text-align: left; font-size: 0.82em;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <thead style="background-color: #f8f9fa;">
                        <tr><th style="border: 1px solid #ddd; padding: 10px;">법률 근거</th><th style="border: 1px solid #ddd; padding: 10px;">보관 항목</th><th style="border: 1px solid #ddd; padding: 10px;">보존 기간</th><th style="border: 1px solid #ddd; padding: 10px;">보존 목적</th></tr>
                    </thead>
                    <tbody>
                        <tr><td rowspan="3" style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">전자상거래법</td><td style="border: 1px solid #ddd; padding: 10px;">계약 또는 청약 철회 등에 관한 기록</td><td style="border: 1px solid #ddd; padding: 10px;">5년</td><td style="border: 1px solid #ddd; padding: 10px;">소비자 클레임 대응</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px;">대금 결제 및 재화 등의 공급 기록</td><td style="border: 1px solid #ddd; padding: 10px;">5년</td><td style="border: 1px solid #ddd; padding: 10px;">거래 사실 확인</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px;">소비자 불만 또는 분쟁 처리 기록</td><td style="border: 1px solid #ddd; padding: 10px;">3년</td><td style="border: 1px solid #ddd; padding: 10px;">분쟁 방지</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">통신비밀보호법</td><td style="border: 1px solid #ddd; padding: 10px;">서비스 접속 기록 (로그 기록)</td><td style="border: 1px solid #ddd; padding: 10px;">3개월</td><td style="border: 1px solid #ddd; padding: 10px;">수사 협조</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">국세 기본법</td><td style="border: 1px solid #ddd; padding: 10px;">세법에 정하는 거래의 모든 장부</td><td style="border: 1px solid #ddd; padding: 10px;">5년</td><td style="border: 1px solid #ddd; padding: 10px;">세무 조사 대비</td></tr>
                    </tbody>
                </table>
            </div>`
    },
    "사유 수집": {
        icon: 'question', title: '탈퇴를 하려는 이유는 무엇인가요?', width: '1050px',
        htmlContent: `
            <div style="text-align: left; font-size: 0.9em;">
                <p>탈퇴 사유를 선택해 주세요.</p>
                <select id="swal-input-reason" class="swal2-select" style="width: 100%; margin-bottom: 15px;">
                    <option value="이용 빈도가 낮다">이용 빈도가 낮다</option>
                    <option value="기능 및 사용성 불만">기능 및 사용성 불만</option>
                    <option value="콘텐츠/상품 부족">콘텐츠/상품 부족</option>
                    <option value="시스템 오류 및 속도">시스템 오류 및 속도</option>
                    <option value="개인정보 및 보안 불안">개인정보 및 보안 불안</option>
                    <option value="타 서비스 이용">타 서비스 이용</option>
                    <option value="기타">기타</option>
                </select>
                <p>우리 서비스에 바라는 점을 적어 주세요. (최대 300자)</p>
                <textarea id="swal-input-feedback" class="swal2-textarea" placeholder="남겨주신 소중한 의견은 서비스 개선의 자료로 활용하겠습니다." style="height: 80px;"></textarea>
            </div>`
    },
    "완료 및 후속조치": {
        icon: 'success', title: '완료 및 후속조치 안내', width: '1050px',
        htmlContent: `
            <div style="max-height: 500px; overflow-y: auto; text-align: left; font-size: 0.82em;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <thead style="background-color: #f8f9fa;">
                        <tr><th style="border: 1px solid #ddd; padding: 10px; width: 20%;">구분</th><th style="border: 1px solid #ddd; padding: 10px; width: 25%;">내용</th><th style="border: 1px solid #ddd; padding: 10px;">세부 고지 사항</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">계약 해지 효과</td><td style="border: 1px solid #ddd; padding: 10px;">이용 계약 해지</td><td style="border: 1px solid #ddd; padding: 10px;">탈퇴와 동시에 당사 서비스 이용 계약은 즉시 종료됩니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">개인정보 처리</td><td style="border: 1px solid #ddd; padding: 10px;">정보 즉시 파기</td><td style="border: 1px solid #ddd; padding: 10px;">식별 정보는 법적 보관 의무 대상을 제외하고 지체 없이 파쇄 및 삭제됩니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">게시물 저작권</td><td style="border: 1px solid #ddd; padding: 10px;">게시물의 익명 보존</td><td style="border: 1px solid #ddd; padding: 10px;">회원이 작성한 공용 게시판의 게시물 및 댓글은 서비스 유지 및 비영리 목적으로 보존될 수 있습니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">포인트 및 정산</td><td style="border: 1px solid #ddd; padding: 10px;">권리 자동 소멸</td><td style="border: 1px solid #ddd; padding: 10px;">미사용 잔여 포인트 및 쿠폰은 환불되지 않으며 자동 소멸됩니다.</td></tr>
                    </tbody>
                </table>
            </div>`
    },
    "이용 약관": {
        icon: 'info', title: '플랫폼 서비스 이용 약관 안내', width: '1050px',
        htmlContent: `
            <div style="max-height: 500px; overflow-y: auto; text-align: left; font-size: 0.82em;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <thead style="background-color: #f8f9fa;">
                        <tr><th style="border: 1px solid #ddd; padding: 10px; width: 20%;">항목</th><th style="border: 1px solid #ddd; padding: 10px;">약관 주요 내용 (배달 중개 서비스 표준)</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">서비스 성격</td><td style="border: 1px solid #ddd; padding: 10px;">회사는 통신판매중개업자로서 입점 업체와 소비자 간의 거래를 중개하는 플랫폼 역할을 수행하며, 상품 판매의 직접 주체가 아닙니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">입점 업체 책임</td><td style="border: 1px solid #ddd; padding: 10px;">음식의 품질, 위생, 원산지 표기, 배달 지연 등으로 인한 분쟁의 책임은 상품을 판매한 해당 가맹점(입점사)에 귀속됩니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">면책 및 제한</td><td style="border: 1px solid #ddd; padding: 10px;">천재지변, 서버 장애, 통신 오류 등 회사의 귀책 사유가 없는 불가항력적 사태에 대해 회사는 서비스 중단 책임을 지지 않습니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">콘텐츠 이용권</td><td style="border: 1px solid #ddd; padding: 10px;">회원이 작성한 리뷰 및 이미지는 마케팅 및 통계 목적으로 제3자(입점업체 포함)에게 제공되거나 재편집되어 노출될 수 있음에 동의합니다.</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">취소 및 환불</td><td style="border: 1px solid #ddd; padding: 10px;">가맹점의 조리가 시작되거나 배달 대행이 확정된 시점 이후의 주문 취소 요청은 거부될 수 있습니다.</td></tr>
                    </tbody>
                </table>
            </div>`
    }
};

function MembershipResign() {
    const navigate = useNavigate();
    const [agreements, setAgreements] = useState(new Array(AGREEMENT_ITEMS.length).fill(false));
    const [isBtnEnabled, setIsBtnEnabled] = useState(false);

    useEffect(() => {
        const essentialChecked = agreements.filter((_, i) => i !== 3).every(val => val === true);
        setIsBtnEnabled(essentialChecked);
    }, [agreements]);

    const handleCheckboxChange = (index) => {
        setAgreements(agreements.map((item, i) => i === index ? !item : item));
    };

    const handleGoToDetails = (itemTitle, index) => {
        const notice = LEGAL_NOTICES[itemTitle];
        if (!notice) return;

        // [본인 인증 단계 - 3초 딜레이 적용]
        if (itemTitle === "본인 인증") {
            Swal.fire({
                icon: notice.icon, title: notice.title, html: notice.htmlContent,
                width: notice.width, showCancelButton: true,
                confirmButtonText: '인증번호 발송', cancelButtonText: '취소',
                confirmButtonColor: '#B71C1C',
                preConfirm: () => {
                    const emailId = document.getElementById('swal-email-id').value;
                    if (!emailId) { Swal.showValidationMessage('이메일 아이디를 입력해주세요.'); }
                    return { emailId };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // --- 3초 대기 로딩창 ---
                    let timerInterval;
                    Swal.fire({
                        title: '인증 메일을 생성 중입니다...',
                        html: '잠시만 기다려주세요. <b>3</b>초 후 발송됩니다.',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                            const b = Swal.getHtmlContainer().querySelector('b');
                            timerInterval = setInterval(() => {
                                b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                            }, 100);
                        },
                        willClose: () => { clearInterval(timerInterval); }
                    }).then(() => {
                        // --- 3초 후 인증번호 입력창 노출 ---
                        Swal.fire({
                            title: '인증번호 입력',
                            text: '이메일로 전송된 6자리 번호를 입력하세요.',
                            input: 'text',
                            inputPlaceholder: '123456',
                            showCancelButton: true,
                            confirmButtonText: '인증하기',
                            confirmButtonColor: '#B71C1C',
                            preConfirm: (code) => {
                                if (code === '123456') return true;
                                else { Swal.showValidationMessage('인증번호가 틀렸습니다.'); }
                            }
                        }).then((authResult) => {
                            if (authResult.isConfirmed) {
                                Swal.fire({
                                    icon: 'success', title: '인증 완료',
                                    text: '(돌아가기)', confirmButtonColor: '#B71C1C'
                                });
                                setAgreements(prev => prev.map((item, i) => i === index ? true : item));
                            }
                        });
                    });
                }
            });
            return;
        }

        // 일반 항목들
        Swal.fire({
            icon: notice.icon, title: notice.title, html: notice.htmlContent,
            width: notice.width || '600px', showCancelButton: true,
            confirmButtonText: '확인 및 동의', cancelButtonText: '취소',
            confirmButtonColor: '#B71C1C', allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                setAgreements(prev => prev.map((item, i) => i === index ? true : item));
            }
        });
    };

    const handleResignSubmit = () => {
        if (!isBtnEnabled) return;
        Swal.fire({
            title: '최종 탈퇴 확인',
            text: "정말로 모든 혜택을 포기하고 탈퇴하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '탈퇴 확정',
            cancelButtonText: '취소',
            confirmButtonColor: '#B71C1C'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '탈퇴 완료', text: '감사합니다.', icon: 'success',
                    confirmButtonColor: '#B71C1C'
                }).then(() => { navigate('/login'); });
            }
        });
    };

    return (
        <div className="contentTopPosition">
            <div className="container">
                <div className={style.container}>
                    <div className={style.leftBox}>
                        <br/><div><h1 className={style.mainTitle}>회원 정보 탈퇴</h1></div><br/>
                        {AGREEMENT_ITEMS.map((item, idx) => (
                            <React.Fragment key={idx}>
                                <div className={style.subTitle1}>{item}</div><br/>
                            </React.Fragment>
                        ))}
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                            <button className={`${style.mainBtn} ${!isBtnEnabled ? style.disabledBtn : ''}`} 
                                    onClick={handleResignSubmit} disabled={!isBtnEnabled}>탈퇴하기</button>
                        </div>
                    </div>
                    <div className={style.rightBox}>
                        <div className={style.profileBox}>
                            <br/><h2>유의사항 확인 및 동의</h2><br/>
                            {AGREEMENT_ITEMS.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className={style.wrapBox}>
                                        <span className={style.subTitle2}>■ {index === 3 ? "탈퇴 사유 수집(선택)" : item}</span>
                                        <button className={style.btn} onClick={() => handleGoToDetails(item, index)}>바로가기</button>
                                    </div>
                                    <div className={style.agreementArea}>
                                        <label className={style.agreementLabel}>
                                            <input type="checkbox" checked={agreements[index]} onChange={() => handleCheckboxChange(index)} />
                                            &nbsp;위 내용을 확인하고, 동의 합니다.
                                        </label>
                                    </div><br/>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MembershipResign;