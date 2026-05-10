import React, { useState, useEffect } from "react";
import style from "../../css/MembershipResign.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import serverUrl from "../../config/server.json";

// 1. "본인 인증"을 리스트에서 완전히 제거
const AGREEMENT_ITEMS = [
  "최종 경고 및 확인",
  "데이터 처리 및 보관",
  "탈퇴 사유 수집(선택)",
  "완료 및 후속조치",
  "이용 약관",
];

function MembershipResign() {
  const [agreements, setAgreements] = useState(
    new Array(AGREEMENT_ITEMS.length).fill(false),
  );
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const SERVER_URL = serverUrl.SERVER_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // index 2(탈퇴 사유) 제외 필수 항목 체크 확인
    const essentialChecked = agreements
      .filter((_, i) => i !== 2)
      .every((val) => val === true);
    setIsBtnEnabled(essentialChecked);
  }, [agreements]);

  const handleCheckboxChange = (index) => {
    setAgreements(agreements.map((item, i) => (i === index ? !item : item)));
  };

  // 테이블 스타일 (Swal 내부용)
  const thStyle =
    "border-bottom:2px solid #eee; padding:12px; text-align:center; background:#f9f9f9; font-weight:bold; font-size:14px; color:#333;";
  const tdStyle =
    "border-bottom:1px solid #eee; padding:12px; line-height:1.6; font-size:14px; color:#555;";
  const redSpan = (text) =>
    `<span style="color: #B71C1C; font-weight: bold;">${text}</span>`;

  // --- [원본 법령 테이블 내용 100% 유지] ---
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
                            <td style="${tdStyle}">탈퇴와 동시에 회원님의 ID, 비밀번호, 이메일 휴대폰 번호 등 계정을 식별할 수 있는 모든 정보가 ${redSpan("즉시 파기됩니다.")}</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">서비스 이용 기록 삭제 불가</td>
                            <td style="${tdStyle}">구매 내역, 주문/배송 정보, 고객 문의 기록 등은 법적 의무에 따라 일정 기간 보관되므로, ${redSpan("즉시 삭제되지 않습니다.")} (별도의 법적 고지를 참조하도록 안내하기)</td>
                        </tr>
                        <tr>
                            <td rowspan="3" style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">활동 및<br/>데이터 손실</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">활동 기록 영구삭제</td>
                            <td style="${tdStyle}">회원 탈퇴 시 작성하신 게시글, 댓글, 스크랩, 좋아요 등의 활동 기록이 모두 삭제되며, ${redSpan("복구가 절대 불가능합니다.")}</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">포인트 /혜택 소멸</td>
                            <td style="${tdStyle}">보유하고 계신 적립금, 포인트, 쿠폰, 레벨(등급) 등 모든 혜택이 ${redSpan("즉시 소멸되며,")} 재가입 시에도 복원되지 않습니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">거래 미완료 건 처리</td>
                            <td style="${tdStyle}">진행 중인 환불, 반품, 교환 등의 미완료 건이 있는 경우, 탈퇴 전에 반드시 처리해야 합니다. 미처리 시 ${redSpan("불이익이 발생할 수 있습니다.")}</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">재가입 제한</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa; text-align:center;">재가입 가능 시점</td>
                            <td style="${tdStyle}">탈퇴 후 일정 기간(예: 7일) 동안 재가입이 제한될 수 있으며, 재가입하더라도 기존의 활동 기록과 정보는 ${redSpan("복원되지 않습니다.")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
  };

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
                            <td style="${tdStyle}">회원 탈퇴와 동시에 당사와 회원님 간의 서비스 이용 계약은 ${redSpan("즉시 해지")}됩니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">잔존 권리 및 의무 소멸</td>
                            <td style="${tdStyle}">서비스 이용권한, 혜택 등 모든 권리와 이용료 납부 등 의무가 소멸됩니다.</td>
                        </tr>
                        <tr>
                            <td rowspan="2" style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">게시물 처리</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">게시물의 유지 및 이용</td>
                            <td style="${tdStyle}">작성하신 게시물/댓글은 탈퇴 후에도 삭제되지 않고 서비스 내 보존될 수 있으므로, ${redSpan("탈퇴 전 직접 삭제")}해 주시기 바랍니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">게시물 저작권</td>
                            <td style="${tdStyle}">저작권은 회원님께 귀속되나, 서비스 운영을 위한 이용 허락(라이선스)은 약관에 따라 처리될 수 있습니다.</td>
                        </tr>
                        <tr>
                            <td style="${tdStyle} text-align:center; font-weight:bold; background:#fff;">법적 자료 보관</td>
                            <td style="${tdStyle} font-weight:bold; background:#fafafa;">연락 수단 확보</td>
                            <td style="${tdStyle}">분쟁 발생 시 연락을 위해 ${redSpan("비상 연락처(이메일/전화번호)")}를 별도로 요청할 수 있습니다.</td>
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
                            <td style="${tdStyle}">탈퇴 일시, 파기 정보 항목 등이 포함된 확인 메일이 ${redSpan("최소 2일 이내")} 발송됩니다.</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
  };

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
    let contentHtml = "";
    if (index === 0) contentHtml = getFinalWarningTable();
    else if (index === 1) contentHtml = getDataRetentionTable();
    else if (index === 3) contentHtml = getFollowUpTable();
    else if (index === 4) contentHtml = getTermsOfServiceTable();
    else if (index === 2) {
      Swal.fire({
        title: `<div style="font-size: 18px; font-weight: bold;">탈퇴를 하려는 이유는 무엇인가요?</div>`,
        html: `
                    <div style="text-align: left; font-size: 14px;">
                        <select id="reasonSelect" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc;">
                            <option value="">사유를 선택해 주세요 (선택)</option>
                            <option value="1">이용 빈도가 낮음</option>
                            <option value="2">기능 및 서비스 불편</option>
                            <option value="7">기타</option>
                        </select>
                        <textarea id="opinionText" style="width: 100%; height: 200px; padding: 12px; border: 1px solid #ccc; resize: none;"></textarea>
                        <div style="margin-top: 20px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: bold;">
                                <input type="checkbox" id="finalCheck">
                                <span>위의 유의사항을 모두 확인하였으며, 탈퇴 진행에 동의합니다.</span>
                            </label>
                        </div>
                    </div>`,
        width: "600px",
        showCancelButton: true,
        confirmButtonText: "확인",
        confirmButtonColor: "#B71C1C",
        preConfirm: () => {
          if (!document.getElementById("finalCheck").checked) {
            Swal.showValidationMessage(
              "탈퇴 진행 동의 체크박스에 체크해 주세요.",
            );
            return false;
          }
          return true;
        },
      }).then((result) => result.isConfirmed && updateAgreement(index));
      return;
    }

    Swal.fire({
      title: `<div style="font-size: 20px; font-weight: bold;">${itemTitle}</div>`,
      html: contentHtml,
      width: "1000px",
      showCancelButton: true,
      confirmButtonText: "확인 및 동의",
      confirmButtonColor: "#B71C1C",
    }).then((result) => result.isConfirmed && updateAgreement(index));
  };

  const updateAgreement = (index) => {
    const updated = [...agreements];
    updated[index] = true;
    setAgreements(updated);
  };

  const handleResignSubmit = () => {
    const userSn = user && user.userSn ? user.userSn : 28;

    Swal.fire({
      title: "최종 탈퇴 확인",
      text: "정말로 모든 정보를 파기하고 탈퇴하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      confirmButtonColor: "#B71C1C",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${SERVER_URL}/membership/delete/${userSn}`,
          );
          if (response.status === 200) {
            Swal.fire({ title: "탈퇴 처리 완료", icon: "success" }).then(() => {
              localStorage.removeItem("user");
              // 2. 자동 새로고침 및 메인 이동
              window.location.href = "/";
            });
          }
        } catch (error) {
          Swal.fire("실패", `탈퇴 중 오류가 발생했습니다.`, "error");
        }
      }
    });
  };

  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={style.mainWrapper}>
          {/* 왼쪽 사이드바: 단계 안내 */}
          <aside className={style.leftBox}>
            <h1 className={style.mainTitle}>회원 탈퇴</h1>
            <div className={style.stepList}>
              {AGREEMENT_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className={`${style.subTitle1} ${agreements[idx] ? style.activeStep : ""}`}
                >
                  {idx + 1}. {item}
                </div>
              ))}
            </div>
            <button
              className={`${style.mainBtn} ${!isBtnEnabled ? style.disabledBtn : ""}`}
              onClick={handleResignSubmit}
              disabled={!isBtnEnabled}
            >
              회원 탈퇴 확정
            </button>
          </aside>

          {/* 오른쪽 본문: 동의 섹션 */}
          <section className={style.rightBox}>
            <div className={style.profileBox}>
              <h3>유의사항 확인 및 필수 동의</h3>
              <p className={style.description}>
                안전한 데이터 파기를 위해 각 항목을 반드시 확인해 주시기
                바랍니다.
              </p>

              <div className={style.agreementContainer}>
                {AGREEMENT_ITEMS.map((item, index) => (
                  <div key={index} className={style.agreementCard}>
                    <div className={style.wrapBox}>
                      <span className={style.subTitle2}>{item}</span>
                      <button
                        className={style.btn}
                        onClick={() => handleGoToDetails(item, index)}
                      >
                        내용 보기
                      </button>
                    </div>
                    <div className={style.agreementArea}>
                      <label className={style.agreementLabel}>
                        <input
                          type="checkbox"
                          checked={agreements[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <span>
                          위 안내 내용을 충분히 숙지하였으며 이에 동의합니다.
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MembershipResign;
