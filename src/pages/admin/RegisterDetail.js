import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styleStore from "../../css/StoreRegister.module.css";
import styleNotice from "../../css/Notice.module.css";

function RegisterDetail({ setMemberNotices }) {
  const location = useLocation();
  const navigate = useNavigate();
  const registerData = location.state;

  /* 승인/반려박스 */
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");
  
  /* 손님/사업자 선택 */
  const user = () => {};
  const br = () => {};

  /* 사업자번호 API */
  const [brNo, setBrNo] = useState("");
  const [brResult, setBrResult] = useState(null);
  const [brError, setBrError] = useState(null);

  const checkBr = async () => {
    setBrError(null);
    setBrResult(null);

    if (brNo.length !== 10) {
      setBrError("사업자등록번호 10자리를 입력해주세요.");
      return;
    }

    try {
      const serviceKey =
        "nYrvOHdHDUUOV%2Fb8t4ddcrtVY02lgsfE%2BNmWpM%2F88LynhtxTOqBYkJZWbBCccrjZGcvSysLZVipV0g069cKT2A%3D%3D";
      const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`;
      const body = { b_no: [brNo] };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const result = data.data?.[0];

      if (!result) {
        setBrError("조회 결과가 없습니다.");
        return;
      }

      const checkResult = {
        b_no: result.b_no,
        status: result.b_stt,
        tax_type: result.tax_type,
        valid: result.valid ?? "값 없음",
      };

      setBrResult(checkResult);
    } catch (err) {
      setBrError("API 호출 중 오류가 발생했습니다.");
    }
  };

  /* 주소 API */
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [lat, setLat] = useState(""); // 위도
  const [lot, setLot] = useState(""); // 경도

const handleAddressSearch = async () => {
  if (!roadAddress) {
    alert("주소를 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(roadAddress)}`,
      {
        headers: {
          Authorization: "KakaoAK bd23a565a07fd608d593c2c99d192e8f",
        },
      }
    );

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const doc = data.documents[0];
      setLat(doc.y); // 위도
      setLot(doc.x); // 경도

      setDetailAddress(`위도: ${doc.y}, 경도: ${doc.x}`);
    } else {
      setDetailAddress("주소를 찾을 수 없습니다.");
    }
  } catch (err) {
    console.error(err);
    setDetailAddress("주소 조회 중 오류가 발생했습니다.");
  }
};

  /* 기본 정보 */
  const [owner, setOwner] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");


  /* 편의 사항 */
  const convenienceList = [
    { key: "pet", label: "🐕\n반려견" },
    { key: "parking", label: "🅿️\n주차" },
    { key: "takeout", label: "🥡\n포장" },
  ];

  const [conveniences, setConveniences] = useState([]);

  const handleConvenienceChange = (checked, value) => {
    if (checked) {
      setConveniences((prev) => [...prev, value]);
    } else {
      setConveniences((prev) => prev.filter((item) => item !== value));
    }
  };
  const conveniencePayload = conveniences;

  /* 이미지 업로드 */
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* 기존 데이터 초기화 */
  useEffect(() => {
    if (!registerData) return;

    setOwner(registerData.rprsvNm);
    setBrNo(registerData.brno);
    setStoreName(registerData.bplcNm);
    setRoadAddress(registerData.roadNmAddr);
    setDetailAddress(registerData.daddr);

    if (registerData.bgngTm) {
      setOpenTime(
        registerData.bgngTm.slice(0, 2) + ":" + registerData.bgngTm.slice(2)
      );
    }

    if (registerData.ddlnTm) {
      setCloseTime(
        registerData.ddlnTm.slice(0, 2) + ":" + registerData.ddlnTm.slice(2)
      );
    }

    setCategory(registerData.storeCatNo);

    if (registerData.petYn === 1) {
      setConveniences(["pet"]);
    }

    if (registerData.bplcPhoto) {
      setPreview(`/uploads/${registerData.bplcPhoto}`);
    }
  }, [registerData]);

  /* 이미지 & 데이터 서버 전송 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("정말로 등록하시겠습니까?")) return;

    const formData = new FormData();

    formData.append("brNo", brNo);
    formData.append("owner", owner);
    formData.append("storeName", storeName);

    formData.append("roadAddress", roadAddress);
    formData.append("detailAddress", detailAddress);
    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);
    formData.append("category", category);

    formData.append("convenience", JSON.stringify(conveniencePayload));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/store/register", {
        method: "POST",
        body: formData, // Content-Type 직접 설정 금지
      });

      if (!response.ok) throw new Error("등록 실패");

      const result = await response.json();
      alert("등록 완료!");
      console.log(result);
    } catch (error) {
      console.error(error);
      alert("오류 발생: 등록 실패");
    }
  };

  const openActionBox = (type) => {
    setActionType(type);
    setActionReason("");
    setIsActionBoxOpen(true);
  };

  const closeActionBox = () => setIsActionBoxOpen(false);

 const decisionSubmit = async (title) => {
  if (!title || !actionReason) {
    alert("제목과 사유를 입력해주세요.");
    return;
  }

  const prcsYnValue = actionType === "승인" ? "Y" : "N";

  const updateData = {
    prcsYn: prcsYnValue,
    notiTtl: title,
    notiCn: actionReason,
    lat: lat, 
    lot: lot
  };

  try {
    const response = await fetch(
      `http://localhost:3001/youtaste/register/${registerData.bplcSn}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      }
    );

    if (!response.ok) throw new Error("처리 실패");

    const result = await response.json();
    
    // 반려(N)일 경우 MemberNotice 리스트에 바로 추가
    if (prcsYnValue === "N") {
      const noticeData = {
        userSn: registerData.userSn,
        notiTtl: title,
        notiCn: actionReason,
        prcsYn: "N"
      };

      const noticeRes = await fetch(
        "http://localhost:3001/youtaste/member-notices",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noticeData)
        }
      );

      if (!noticeRes.ok) throw new Error("공지사항 등록 실패");

      const newNotice = await noticeRes.json();
      setMemberNotices(prev => [newNotice, ...prev]);
    }

    alert("처리 완료!");
    navigate("/notice/list");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  function getDclrCatName(catNo) {
    switch (catNo) {
      case 1: return "한식";
      case 2: return "일식";
      case 3: return "중식";
      case 4: return "양식";
      case 5: return "아시안";
      case 6: return "햄버거";
      case 7: return "치킨";
      default: return "디저트";
    }
  } 
  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={styleStore.storeContainer}>
          <form onSubmit={handleSubmit}>
            {/* 손님/사업자 선택 버튼 */}
            <div>
              <button
                className={styleStore.selectBtnL}
                type="button"
                onClick={user}
              >
                내 맛집 등록
                <br />
                (손님 등록)
              </button>
              <button
                className={styleStore.selectBtnR}
                type="button"
                onClick={br}
              >
                내 가게 등록
                <br />
                (사업자 등록)
              </button>
              <br />
              <br />
            </div>

            {/* 사업자등록번호 */}
            <div>
              <label htmlFor="brno">사업자 등록번호</label>
              <div className={styleStore.brNoBox}>
                <input
                  id="brno"
                  type="text"
                  maxLength={10}
                  value={brNo}
                  onChange={(e) => setBrNo(e.target.value)}
                  readOnly
                />
                <button
                  className={styleStore.brNoBtn}
                  type="button"
                  onClick={checkBr}
                >
                  조회
                </button>
              </div>

              {brError && (
                <p style={{ background: "white", padding: "1rem", color: "red" }}>
                  {brError}
                </p>
              )}

              {brResult && (
                <div
                  style={{
                    background: "white",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <p>
                    {brResult.status === "계속사업자"
                      ? "인증되었습니다"
                      : "사업자번호를 확인해 주세요"}
                  </p>
                </div>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="doubleContainer">
              <div>
                <label htmlFor="owner" readOnly>대표자</label>
                <input
                  id="owner"
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>
              <div>
                <label>매장 명</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            {/* 주소 */}
            <label>주소</label>
            <div className={styleStore.addBox}>
              <input
                type="text"
                placeholder="도로명 주소"
                value={roadAddress}
                onChange={(e) => setRoadAddress(e.target.value)}
                readOnly
              />
              <input
                className={styleStore.addBtn}
                type="button"
                value="조회"
                onClick={handleAddressSearch}
              />
            </div>
            <label>위도, 경도</label>
            <input
              type="text"
              placeholder="상세주소 (위도/경도)"
              value={detailAddress}
              readOnly
            />

            {/* 운영시간 */}
            <label>운영시간</label>
            <div className="doubleContainer" >
              <div className={styleStore.flexBox}>
                <label>OPEN</label>
                <input
                  className={styleStore.timeinput}
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  style={{"padding": 5, "marginLeft" : 5}}
                />
              </div>
              <div className={styleStore.flexBox}>
                <label>CLOSE</label>
                <input
                  className={styleStore.timeinput}
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  style={{"padding": 5, "marginLeft" : 5}}
                />
              </div>
            </div>

            {/* 카테고리 */}
            
            <label htmlFor="menuCat">카테고리</label>
            <br />
            <select
              id="menuCat"
              className={styleStore.inputBox}
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
            >
              <option value="" disabled hidden>
                선택하세요
              </option>
              <option value="1">한식</option>
              <option value="2">일식</option>
              <option value="3">중식</option>
              <option value="4">양식</option>
              <option value="5">아시안</option>
              <option value="6">햄버거</option>
              <option value="7">치킨</option>
              <option value="8">디저트</option>
            </select>

            {/* 편의시설 */}
            <br></br><br></br>
            <p>편의사항</p>
            {convenienceList.map((item) => (
              <label
                key={item.key}
                className={`${styleStore.checkbox} ${
                  conveniences.includes(item.key) ? styleStore.active : ""
                }`}
              >
                {item.label.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
                <input
                  type="checkbox"
                  className={styleStore.hiddenCheckbox}
                  checked={conveniences.includes(item.key)}
                  onChange={(e) =>
                    handleConvenienceChange(e.target.checked, item.key)
                  }
                />
              </label>
            ))}

            {/* 이미지 업로드 */}
            <label htmlFor="storeImg">가게 대표 이미지</label>
            <br />
            {preview && (
              <div style={{ marginTop: "10px" }}>
                <img src={preview} alt="미리보기" width="200" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <div className="rightContainer">
              <button type="button" onClick={() => openActionBox("승인")} > 승인 </button> 
              <button type="button" onClick={() => openActionBox("반려")} > 반려 </button>
            </div>
          </form>

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
                <p>날짜: {new Date().toLocaleDateString()}</p>
                <p>카테고리 : {getDclrCatName(6)}</p>
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
                  <button className={styleNotice.cancelBtn} onClick={closeActionBox}>
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
