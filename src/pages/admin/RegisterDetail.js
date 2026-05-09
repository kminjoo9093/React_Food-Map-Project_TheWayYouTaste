import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styleStore from "../../css/StoreRegister.module.css";
import styleNotice from "../../css/Notice.module.css";
import serverUrl from "../../config/server.json";

function RegisterDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const registerData = location.state;
  const SERVER_URL = serverUrl.SERVER_URL;

  /* 승인/반려박스 관련 */
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");

  /* 기본 정보 상태 */
  const [owner, setOwner] = useState("");
  const [brNo, setBrNo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [category, setCategory] = useState("");
  const [conveniences, setConveniences] = useState([]);
  const [preview, setPreview] = useState(null);
  const [verifyPreview, setVerifyPreview] = useState(null);

  /* 위도/경도 상태 (카카오 API) */
  const [lat, setLat] = useState(""); // 위도
  const [lot, setLot] = useState(""); // 경도

  /* 손님/사업자 구분 기준 */
  const isGuest = registerData?.rprsvNm === "손님등록";

  /* 데이터 초기화 */
  useEffect(() => {
    if (!registerData) return;

    setOwner(registerData.rprsvNm || "");
    setBrNo(registerData.brno || "");
    setStoreName(registerData.bplcNm || "");
    setRoadAddress(registerData.roadNmAddr || "");

    setCategory(registerData.storeCatNo ? Number(registerData.storeCatNo) : 1);

    if (registerData.bgngTm) {
      setOpenTime(
        registerData.bgngTm.slice(0, 2) + ":" + registerData.bgngTm.slice(2),
      );
    }
    if (registerData.ddlnTm) {
      setCloseTime(
        registerData.ddlnTm.slice(0, 2) + ":" + registerData.ddlnTm.slice(2),
      );
    }

    const initConveniences = registerData.amtySrvc
      ? JSON.parse(registerData.amtySrvc)
      : [];
    setConveniences(initConveniences);

    if (registerData.bplcPhoto) {
      setPreview(
        registerData.bplcPhoto.startsWith("http")
          ? registerData.bplcPhoto
          : `${SERVER_URL}${registerData.bplcPhoto}`,
      );
    }
    if (registerData.certPhoto) {
      setVerifyPreview(
        registerData.certPhoto.startsWith("http")
          ? registerData.certPhoto
          : `${SERVER_URL}${registerData.certPhoto}`,
      );
    }
  }, [registerData]);

  /* 위도/경도 조회 로직 (카카오 API 사용) */
  const handleCoordSearch = async () => {
    if (!roadAddress) {
      alert("주소 정보가 없습니다.");
      return;
    }

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(roadAddress)}`,
        {
          headers: {
            Authorization: "KakaoAK bd23a565a07fd608d593c2c99d192e8f",
          },
        },
      );

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const doc = data.documents[0];
        setLat(doc.y); // 위도 업데이트
        setLot(doc.x); // 경도 업데이트
        setDetailAddress(`위도: ${doc.y} / 경도: ${doc.x}`); // 입력창 표시용
        alert("좌표 조회가 완료되었습니다.");
      } else {
        alert("주소에 해당하는 좌표를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("좌표 조회 중 오류가 발생했습니다.");
    }
  };

  /* 승인/반려 최종 제출 */
  const decisionSubmit = async (title) => {
    if (!title || !actionReason) {
      alert("제목과 사유를 입력해주세요.");
      return;
    }
    if (actionType === "승인" && !lat) {
      alert("승인 처리 전 반드시 '조회' 버튼을 눌러 좌표를 생성해야 합니다.");
      return;
    }

    const updateData = {
      prcsYn: actionType === "승인" ? "Y" : "N",
      notiTtl: title,
      notiCn: actionReason,
      lat: lat,
      lot: lot,
      storeCatNo: Number(category),
      menuNm1: registerData.menuNm1,
      menuPrc1: registerData.menuPrc1,
    };

    try {
      const response = await fetch(
        `${SERVER_URL}/youtaste/register/${registerData.bplcSn}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) throw new Error("처리 실패");
      alert("처리가 완료되었습니다.");
      navigate("/notice/list");
    } catch (error) {
      alert(error.message);
    }
  };

  const openActionBox = (type) => {
    setActionType(type);
    setIsActionBoxOpen(true);
  };

  function getDclrCatName(catNo) {
    switch (catNo) {
      case 1:
        return "한식";
      case 2:
        return "일식";
      case 3:
        return "중식";
      case 4:
        return "양식";
      case 5:
        return "아시안";
      case 6:
        return "햄버거";
      case 7:
        return "치킨";
      default:
        return "디저트";
    }
  }

  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={styleStore.storeContainer}>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="brno">사업자 등록번호</label>
            <div className={styleStore.brNoBox}>
              <input id="brno" type="text" value={brNo} readOnly />
              <button className={styleStore.brNoBtn} type="button" disabled>
                인증
              </button>
            </div>

            <div className="doubleContainer">
              <div>
                <label>대표자</label>
                <input type="text" value={owner} readOnly />
              </div>
              <div>
                <label>매장 명</label>
                <input type="text" value={storeName} readOnly />
              </div>
            </div>

            {!isGuest && (
              <>
                <label>개업일</label>
                <input
                  className={styleStore.inputBox}
                  type="text"
                  value={registerData.prcsRegYmd || ""}
                  readOnly
                />
              </>
            )}

            <label>주소</label>
            <div className={styleStore.addBox}>
              <input type="text" value={roadAddress} readOnly />
              <button
                className={styleStore.brNoBtn}
                type="button"
                onClick={handleCoordSearch}
              >
                조회
              </button>
            </div>
            <p
              style={{ fontSize: "12px", color: "blue", marginBottom: "10px" }}
            >
              {lat
                ? `조회된 좌표 - 위도: ${lat}, 경도: ${lot}`
                : "* 승인 처리 전 좌표 조회를 클릭하세요."}
            </p>

            <label>운영시간</label>
            <div className="doubleContainer">
              <div className={styleStore.flexBox}>
                <label>OPEN</label>
                <input
                  className={styleStore.timeinput}
                  type="time"
                  value={openTime}
                  readOnly
                  style={{ padding: 5, marginLeft: 5 }}
                />
              </div>
              <div className={styleStore.flexBox}>
                <label>CLOSE</label>
                <input
                  className={styleStore.timeinput}
                  type="time"
                  value={closeTime}
                  readOnly
                  style={{ padding: 5, marginLeft: 5 }}
                />
              </div>
            </div>

            <label>카테고리</label>
            <select className={styleStore.inputBox} value={category} readOnly>
              <option value="1">한식</option>
              <option value="2">일식</option>
              <option value="3">중식</option>
              <option value="4">양식</option>
              <option value="5">아시안</option>
              <option value="6">햄버거</option>
              <option value="7">치킨</option>
              <option value="8">디저트</option>
            </select>

            <br />
            <br />
            <label>신청 메뉴 목록</label>
            <div style={{ marginBottom: "20px" }}>
              {registerData.menuNm1 &&
                JSON.parse(registerData.menuNm1).map((name, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "2px", marginBottom: "5px" }}
                  >
                    <input
                      className={styleStore.menu}
                      type="text"
                      value={name}
                      readOnly
                    />
                    <input
                      className={styleStore.price}
                      type="text"
                      value={`${JSON.parse(registerData.menuPrc1)[idx]}원`}
                      readOnly
                    />
                  </div>
                ))}
            </div>

            <p>편의사항</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {[
                { key: "pet", icon: "🐕", label: "반려견" },
                { key: "parking", icon: "🅿️", label: "주차" },
                { key: "takeout", icon: "🥡", label: "포장" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`${styleStore.checkbox} ${conveniences.includes(item.key) ? styleStore.active : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    height: "80px",
                    minWidth: "70px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", marginTop: "4px" }}>
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    className={styleStore.hiddenCheckbox}
                    checked={conveniences.includes(item.key)}
                    readOnly
                  />
                </label>
              ))}
            </div>

            <label>가게 대표 이미지</label>
            {preview && (
              <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                <img src={preview} alt="대표" width="200" />
              </div>
            )}

            <label>
              {isGuest
                ? "사업자 인증 이미지 (영수증)"
                : "사업자 인증 이미지 (등록증)"}
            </label>
            {verifyPreview && (
              <div style={{ marginTop: "10px" }}>
                <img src={verifyPreview} alt="인증" width="200" />
              </div>
            )}

            <div className="rightContainer">
              <button type="button" onClick={() => openActionBox("승인")}>
                {" "}
                승인{" "}
              </button>
              <button type="button" onClick={() => openActionBox("반려")}>
                {" "}
                반려{" "}
              </button>
            </div>
          </form>

          {/* 승인/반려 팝업 박스 */}
          {isActionBoxOpen && (
            <div className={styleNotice.popupDimmed}>
              <div className={styleNotice.popupBox}>
                <h2>{actionType} 처리</h2>
                <p>제목:</p>
                <input
                  type="text"
                  className={styleNotice.popupInput}
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                />
                <p>
                  카테고리 :{" "}
                  {actionType === "승인" ? "가게 등록 승인" : "가게 등록 반려"}
                </p>
                <p hidden>카테고리 : {getDclrCatName(6)}</p>
                <textarea
                  className={styleNotice.popupTextarea}
                  placeholder="사유를 작성하세요"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
                <div className={styleNotice.popupButtonGroup}>
                  <button
                    className={styleNotice.confirmBtn}
                    onClick={() => decisionSubmit(noticeTitle)}
                  >
                    등록
                  </button>
                  <button
                    className={styleNotice.cancelBtn}
                    onClick={() => setIsActionBoxOpen(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterDetail;
