import React, { useState, useEffect } from 'react';
import style from "../../css/MembershipResign.module.css";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AGREEMENT_ITEMS = [
    "최종 경고 및 확인",
    "본인 인증",
    "데이터 처리 및 보관",
    "탈퇴 사유 수집(선택)",
    "완료 및 후속조치",
    "이용 약관",
];

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

    const thStyle = "border:1px solid #ccc; padding:12px; text-align:center; background:#f2f2f2; font-weight:bold; font-size:14px;";
    const tdStyle = "border:1px solid #ccc; padding:12px; line-height:1.6; font-size:14px; color:#333;";
    const redSpan = (text) => `<span style="color: #B71C1C; font-weight: bold;">${text}</span>`;

    // --- [1. 최종 경고 및 확인] 테이블 ---
    const getFinalWarningTable = () => {
        return `
            <div style="text-align: left;">
                <table style="width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #ccc;">
                    <thead>
                        <tr>
                            <th style="${thStyle} width:100px;">구분</th>
                            <th style="${thStyle} width:150px;">핵심 내용</th>
                            <th style="${thStyle}">필수 고지 사항</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="2" style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">계정 및<br/>정보 파기</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">개인 식별 정보 삭제</td>
                            <td style="${tdStyle}">탈퇴와 동시에 회원님의 ID, 비밀번호, 이메일 휴대폰 번호 등 계정을 식별할 수 있는 모든 정보가 ${redSpan('즉시 파기됩니다.')}</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">서비스 이용 기록 삭제 불가</td>
                            <td style="${tdStyle}">구매 내역, 주문/배송 정보, 고객 문의 기록 등은 법적 의무에 따라 일정 기간 보관되므로, ${redSpan('즉시 삭제되지 않습니다.')} (별도의 법적 고지를 참조하도록 안내하기)</td>
                        </tr>
                        <tr>
                            <td rowspan="3" style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">활동 및<br/>데이터 손실</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">활동 기록 영구삭제</td>
                            <td style="${tdStyle}">회원 탈퇴 시 작성하신 게시글, 댓글, 스크랩, 좋아요 등의 활동 기록이 모두 삭제되며, ${redSpan('복구가 절대 불가능합니다.')}</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">포인트 /혜택 소멸</td>
                            <td style="${tdStyle}">보유하고 계신 적립금, 포인트, 쿠폰, 레벨(등급) 등 모든 혜택이 ${redSpan('즉시 소멸되며,')} 재가입 시에도 복원되지 않습니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">거래 미완료 건 처리</td>
                            <td style="${tdStyle}">진행 중인 환불, 반품, 교환 등의 미완료 건이 있는 경우, 탈퇴 전에 반드시 처리해야 합니다. 미처리 시 ${redSpan('불이익이 발생할 수 있습니다.')}</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">재가입 제한</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">재가입 가능 시점</td>
                            <td style="${tdStyle}">탈퇴 후 일정 기간(예: 7일) 동안 재가입이 제한될 수 있으며, 재가입하더라도 기존의 활동 기록과 정보는 ${redSpan('복원되지 않습니다.')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    };

    // --- [3. 데이터 처리 및 보관] 테이블 ---
    const getDataRetentionTable = () => {
        return `
            <div style="text-align: left;">
                <h3 style="font-size: 16px; margin-bottom: 10px;">■ 관련 법령에 따른 보존 정보</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th style="${thStyle}">법률 근거</th>
                            <th style="${thStyle}">보관 항목</th>
                            <th style="${thStyle}">보존 기간</th>
                            <th style="${thStyle}">보존 목적</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="3" style="${tdStyle} text-align:center;">전자상거래 등에서의 소비자보호에 관한 법률(제6조)</td>
                            <td style="${tdStyle}">계약 또는 청약 철회 등에 관한 기록</td>
                            <td style="${tdStyle} text-align:center;">5년</td>
                            <td style="${tdStyle}">소비자 클레임 대응 및 분쟁 해결</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle}">대금 결제 및 재화 등의 공급에 관한 기록</td>
                            <td style="${tdStyle} text-align:center;">5년</td>
                            <td style="${tdStyle}">거래 사실 확인 및 세금 관련 법령 준수</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle}">소비자의 불만 또는 분쟁 처리에 관한 기록</td>
                            <td style="${tdStyle} text-align:center;">3년</td>
                            <td style="${tdStyle}">소비자 보호 및 분쟁 방지</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center;">통신비밀보호법(제41조)</td>
                            <td style="${tdStyle}">서비스 접속 기록 (로그 기록)</td>
                            <td style="${tdStyle} text-align:center;">3개월</td>
                            <td style="${tdStyle}">통신사실 확인자료 제공 및 서비스 보안</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center;">국세 기본법</td>
                            <td style="${tdStyle}">세법에서 정하는 거래에 관한 모든 장부 및 증명 서류</td>
                            <td style="${tdStyle} text-align:center;">5년</td>
                            <td style="${tdStyle}">세금 관련 법령 준수 및 세무조사 대비</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    };

    // --- [5. 완료 및 후속조치] 테이블 (이미지 내용 반영하여 보강) ---
    const getFollowUpTable = () => {
        return `
            <div style="text-align: left; overflow-y: auto; max-height: 500px;">
                <h3 style="font-size: 16px; margin-bottom: 10px;">■ 완료 및 후속조치 상세 가이드</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th style="${thStyle} width:120px;">구분</th>
                            <th style="${thStyle} width:180px;">내용</th>
                            <th style="${thStyle}">고지 사항</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="2" style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">계약의 종료</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">이용 계약의 즉시 해지</td>
                            <td style="${tdStyle}">회원 탈퇴와 동시에 당사와 회원님 간의 서비스 이용 계약은 ${redSpan('즉시 해지')}됩니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">잔존 권리 및 의무 소멸</td>
                            <td style="${tdStyle}">서비스 이용권한, 혜택 등 모든 권리와 이용료 납부 등 의무가 소멸됩니다.</td>
                        </tr>
                        <tr>
                            <td rowspan="2" style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">게시물 처리</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">게시물의 유지 및 이용</td>
                            <td style="${tdStyle}">작성하신 게시물/댓글은 탈퇴 후에도 삭제되지 않고 서비스 내 보존될 수 있으므로, ${redSpan('탈퇴 전 직접 삭제')}해 주시기 바랍니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">게시물 저작권</td>
                            <td style="${tdStyle}">저작권은 회원님께 귀속되나, 서비스 운영을 위한 이용 허락(라이선스)은 약관에 따라 처리될 수 있습니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">법적 자료 보관</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">연락 수단 확보</td>
                            <td style="${tdStyle}">분쟁 발생 시 연락을 위해 ${redSpan('비상 연락처(이메일/전화번호)')}를 별도로 요청할 수 있습니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">유료 콘텐츠</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">잔여 캐시/구독 처리</td>
                            <td style="${tdStyle}">미사용 잔여 캐시, 상품권, 정기 구독권 등은 환불 정책 및 절차에 따라 진행 혹은 처리됩니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">세무 처리</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">탈퇴 시점의 청구</td>
                            <td style="${tdStyle}">직전까지 발생한 이용료에 대한 최종 청구가 진행될 수 있으며, 세금 계산서 발행 등에 대한 안내가 포함됩니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">증빙 제공</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">탈퇴 확인 이메일 발송</td>
                            <td style="${tdStyle}">탈퇴 일시, 파기 정보 항목 등이 포함된 확인 메일이 ${redSpan('최소 2일 이내')} 발송됩니다.</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    };

    // --- [6. 이용 약관] 테이블 ---
    const getTermsOfServiceTable = () => {
        return `
            <div style="text-align: left; overflow-y: auto; max-height: 500px;">
                <p style="font-weight:bold; color:#B71C1C;">[이용 약관 1: 회원 계약 및 의무]</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead><tr><th style="${thStyle}">항목</th><th style="${thStyle}">상세 내용</th></tr></thead>
                    <tbody>
                        <tr><td style="${tdStyle} font-weight:bold; width:30%;">회원의 의무</td><td style="${tdStyle}">허위 정보 등록 금지 및 타인 명의 도용 엄금</td></tr>
                        <tr><td style="${tdStyle} font-weight:bold;">탈퇴 및 자격상실</td><td style="${tdStyle}">본인 요청 시 즉시 탈퇴 처리하며 부당 행위 시 자격 박탈 가능</td></tr>
                    </tbody>
                </table>
                <p style="font-weight:bold; color:#B71C1C;">[이용 약관 2: 서비스 이용 및 책임 소재]</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead><tr><th style="${thStyle}">항목</th><th style="${thStyle}">상세 내용</th></tr></thead>
                    <tbody>
                        <tr><td style="${tdStyle} font-weight:bold; width:30%;">주문 및 결제</td><td style="${tdStyle}">주문 완료 시 입점사와 계약 성립, 회사는 결제 대행 역할 수행</td></tr>
                        <tr><td style="${tdStyle} font-weight:bold;">취소 및 환불</td><td style="${tdStyle}">조리 시작 후 취소 불가 및 소비자 분쟁 해결 기준 준수</td></tr>
                    </tbody>
                </table>
                <p style="font-weight:bold; color:#B71C1C;">[이용 약관 3: 책임 제한 및 분쟁 해결]</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead><tr><th style="${thStyle}">항목</th><th style="${thStyle}">상세 내용</th></tr></thead>
                    <tbody>
                        <tr><td style="${tdStyle} font-weight:bold; width:30%;">회사의 면책</td><td style="${tdStyle}">천재지변, 입점사의 개별 과실에 대해 책임 범위 제한</td></tr>
                        <tr><td style="${tdStyle} font-weight:bold;">분쟁 해결</td><td style="${tdStyle}">상호 합의 해결 우선 및 관련 법령에 따른 관할 법원 지정</td></tr>
                    </tbody>
                </table>
            </div>`;
    };

    const handleGoToDetails = (itemTitle, index) => {
        if (index === 0) {
            Swal.fire({
                title: `<div style="font-size: 20px; font-weight: bold;">${itemTitle}</div>`,
                html: getFinalWarningTable(),
                width: '1000px',
                showCancelButton: true,
                confirmButtonText: '내용을 확인했으며 동의합니다',
                cancelButtonText: '닫기',
                confirmButtonColor: '#B71C1C'
            }).then((result) => result.isConfirmed && updateAgreement(index));
            return;
        }

        if (index === 1) {
            Swal.fire({
                title: `<div style="font-size: 20px; font-weight: bold;">“당신은 정말로 이 계정의 탈퇴를 원하시나요?”</div>`,
                html: `
                    <div style="text-align: center; font-size: 14px; line-height: 1.8;">
                        “행동으로 옮기시기 전, 본 항목을 제외한 나머지 항목들을 한번만 더 읽어주십시오.”<br/>
                        “그럼에도 탈퇴를 원하신다면, 일단 회원 가입 때 작성하신 E-mail로 본인 인증 번호를 보내 드리겠습니다.”
                        <br/><br/>
                        <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                            당신의 계정은 무엇 입니까?
                            <input type="text" id="userEmail" style="width: 120px; border: none; border-bottom: 1px solid #000; outline: none;">
                            @
                            <select id="emailDomain" style="border: 1px solid #000; padding: 2px;">
                                <option value="nate.com">@nate.com</option>
                                <option value="naver.com">@naver.com</option>
                                <option value="gmail.com">@gmail.com</option>
                                <option value="daum.net">@daum.net</option>
                            </select>
                            <button id="sendAuthBtn" style="border: 1px solid #000; background: #fff; padding: 2px 8px; cursor: pointer;">인증하기</button>
                        </div>
                    </div>
                `,
                width: '850px',
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: '취소',
                didOpen: () => {
                    document.getElementById('sendAuthBtn').addEventListener('click', () => {
                        const emailPrefix = document.getElementById('userEmail').value;
                        if (!emailPrefix) {
                            Swal.showValidationMessage('이메일을 입력해주세요.');
                            return;
                        }
                        Swal.fire({
                            icon: 'info', title: '인증번호 발송', text: '이메일로 인증번호가 발송되었습니다.', timer: 2000, showConfirmButton: false
                        }).then(() => {
                            Swal.fire({
                                title: '인증 번호 입력',
                                input: 'text',
                                inputAttributes: { maxlength: 4, style: 'text-align: center; font-size: 24px;' },
                                showCancelButton: true,
                                confirmButtonText: '인증 완료 확인',
                                preConfirm: (value) => {
                                    if (value === "1234") return true; 
                                    Swal.showValidationMessage('번호가 일치하지 않습니다.');
                                }
                            }).then((res) => {
                                if (res.isConfirmed) {
                                    Swal.fire({
                                        html: `<div style="border: 1px solid #000; padding: 40px;"><h2 style="margin:0;">인증 되었습니다.</h2><p style="color:#888; margin-top:10px;">(돌아가기)</p></div>`,
                                        showConfirmButton: false, timer: 1500
                                    }).then(() => updateAgreement(index));
                                }
                            });
                        });
                    });
                }
            });
            return;
        }

        if (index === 2) {
            Swal.fire({
                title: `<div style="font-size: 20px; font-weight: bold;">${itemTitle}</div>`,
                html: getDataRetentionTable(),
                width: '1000px',
                showCancelButton: true,
                confirmButtonText: '내용을 확인했으며 동의합니다',
                cancelButtonText: '닫기',
                confirmButtonColor: '#B71C1C'
            }).then((result) => result.isConfirmed && updateAgreement(index));
            return;
        }

        if (index === 3) {
            Swal.fire({
                title: `<div style="font-size: 18px; font-weight: bold;">탈퇴를 하려는 이유는 무엇인가요?</div>`,
                html: `
                    <div style="text-align: left; font-size: 14px;">
                        <p style="margin-bottom: 10px; color: #666;">* 사유를 선택해 주시면 서비스 개선에 큰 도움이 됩니다.</p>
                        <select id="reasonSelect" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc;">
                            <option value="">사유를 선택해 주세요 (선택)</option>
                            <option value="1">이용 빈도가 낮음</option>
                            <option value="2">기능 및 서비스 불편</option>
                            <option value="3">개인정보 유출 우려</option>
                            <option value="4">혜택 및 이벤트 부족</option>
                            <option value="5">새 계정 생성 목적</option>
                            <option value="6">타 서비스 이용</option>
                            <option value="7">기타</option>
                        </select>
                        <textarea id="opinionText" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ccc; resize: none;" placeholder="불편하셨던 점을 자유롭게 적어주세요."></textarea>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #fff5f5; border: 1px solid #ffe3e3; border-radius: 5px;">
                            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                                <input type="checkbox" id="dormantCheck" style="margin-top: 4px;">
                                <span style="font-size: 13px; color: #c62828;">회원 탈퇴 대신 <b>'휴면 계정'</b>으로 전환하시겠습니까? (개인정보는 안전하게 별도 보관되며, 언제든 다시 로그인하여 서비스를 이용할 수 있습니다.)</span>
                            </label>
                        </div>

                        <div style="margin-top: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: bold;">
                                <input type="checkbox" id="finalCheck">
                                <span>위의 유의사항을 모두 확인하였으며, 탈퇴 진행에 동의합니다.</span>
                            </label>
                        </div>
                    </div>
                `,
                width: '600px',
                showCancelButton: true,
                confirmButtonText: '탈퇴 프로세스 계속',
                cancelButtonText: '취소 (메인으로)',
                confirmButtonColor: '#B71C1C',
                preConfirm: () => {
                    if (!document.getElementById('finalCheck').checked) {
                        Swal.showValidationMessage('탈퇴 유의사항 확인 및 동의 체크박스에 체크해 주세요.');
                        return false;
                    }
                    return true;
                }
            }).then((result) => {
                if (result.isConfirmed) updateAgreement(index);
                else if (result.dismiss === Swal.DismissReason.cancel) navigate('/'); 
            });
            return;
        }

        if (index === 4) {
            Swal.fire({
                title: `<div style="font-size: 20px; font-weight: bold;">${itemTitle}</div>`,
                html: getFollowUpTable(),
                width: '1000px',
                showCancelButton: true,
                confirmButtonText: '내용을 확인했으며 동의합니다',
                cancelButtonText: '닫기',
                confirmButtonColor: '#B71C1C'
            }).then((result) => result.isConfirmed && updateAgreement(index));
            return;
        }

        if (index === 5) {
            Swal.fire({
                title: `<div style="font-size: 20px; font-weight: bold;">${itemTitle} 상세 내용</div>`,
                html: getTermsOfServiceTable(),
                width: '1000px',
                showCancelButton: true,
                confirmButtonText: '모든 약관 내용을 확인했으며 동의합니다',
                cancelButtonText: '닫기',
                confirmButtonColor: '#B71C1C'
            }).then((result) => result.isConfirmed && updateAgreement(index));
            return;
        }
    };

    const updateAgreement = (index) => {
        const updated = [...agreements];
        updated[index] = true;
        setAgreements(updated);
    };

    const handleResignSubmit = () => {
        Swal.fire({
            title: '최종 탈퇴 확인',
            text: "정말로 모든 정보를 파기하고 탈퇴하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '탈퇴하기',
            confirmButtonColor: '#B71C1C'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: '탈퇴 처리 완료', icon: 'success' }).then(() => navigate('/login'));
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
                            <div key={idx} className={style.subTitle1} style={{marginBottom: '10px'}}>{item}</div>
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
                                        <span className={style.subTitle2}>■ {item}</span>
                                        <button className={style.btn} onClick={() => handleGoToDetails(item, index)}>바로보기</button>
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