import { useNavigate } from "react-router-dom";
import styleStore from "../../css/StoreRegister.module.css";
import { useState, useRef } from "react";

function StoreRegister({ userSn }) {
  const navigate = useNavigate();
  const SERVER_URL = "http://localhost:3001";

  /* 손님/사업자 선택 */
  const [registerType, setRegisterType] = useState(null);
  const user = () => setRegisterType("USER");
  const br = () => setRegisterType("BUSINESS");

  /* 사업자번호 API */
  const [brNo, setBrNo] = useState("");
  const [brResult, setBrResult] = useState(null);
  const [brError, setBrError] = useState(null);
  const [owner, setOwner] = useState("");
  const [openDate, setOpenDate] = useState("");

  const checkBusiness = async () => {
    setBrError(null);
    setBrResult(null);

    if (!brNo) {
      setBrError("사업자등록번호를 입력해주세요.");
      return;
    }

    if (registerType === "BUSINESS" && (!owner || !openDate)) {
      setBrError("대표자명과 개업일을 모두 입력해주세요.");
      return;
    }

    if (brNo.length !== 10) {
      setBrError("사업자등록번호 10자리를 입력해주세요.");
      return;
    }

    try {
      const serviceKey = "nYrvOHdHDUUOV%2Fb8t4ddcrtVY02lgsfE%2BNmWpM%2F88LynhtxTOqBYkJZWbBCccrjZGcvSysLZVipV0g069cKT2A%3D%3D";
      let url = "";
      let body = null;

      if (registerType === "USER") {
        url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`;
        body = { b_no: [brNo] };
      } else {
        url = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${serviceKey}`;
        body = {
          businesses: [{
            b_no: brNo,
            start_dt: openDate.replaceAll("-", ""),
            p_nm: owner,
          }],
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      let result = data.businesses?.[0] || data.data?.[0];

      if (!result || (registerType === "USER" && result.b_stt !== "계속사업자") || 
          (registerType === "BUSINESS" && result.valid !== "01")) {
        setBrError("유효하지 않은 사업자 정보입니다.");
        return;
      }

      const dupRes = await fetch(`${SERVER_URL}/youtaste/store/check-brno?brno=${brNo}`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const dupData = await dupRes.json();

      if (!dupData.exists) {
        setBrResult({ status: "인증되었습니다." });
        return;
      }

      if (dupData.exists) {
        if (registerType === "USER") {
          setBrError("이미 등록된 사업자번호입니다.");
          return;
        }
        if (registerType === "BUSINESS") {
          if (dupData.userReg === 1 && dupData.bzmnReg === 0) {
            setBrResult({ status: "사용자 등록정보를 업데이트했습니다." });
            return;
          }
          if (dupData.bzmnReg === 1) {
            setBrError("이미 사업자 등록이 완료된 가게입니다.");
            return;
          }
        }
      }
    } catch (err) {
      setBrError("인증 중 오류가 발생했습니다.");
    }
  };

  /* 주소 API */
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [bname, setBname] = useState("");
  const [siGunGuCode, setSiGunGuCode] = useState("");
  const [bcode, setBcode] = useState("");
  const [sidoCode, setSidoCode] = useState("");
  const wrapRef = useRef(null);

  const handleAddressSearch = () => {
    if (!window.daum) {
      alert("주소 서비스 로딩 중입니다. 잠시만 기다려 주세요.");
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: function (data) {
        setRoadAddress(data.roadAddress);
        setSido(data.sido);
        setSigungu(data.sigungu);
        setBname(data.bname);
        setSiGunGuCode(data.sigunguCode || "");
        setBcode(data.bcode || "");
        if (data.bcode) setSidoCode(data.bcode.slice(0, 2));

        if (wrapRef.current) wrapRef.current.style.display = "none";
      },
      width: "100%",
      height: "100%",
    }).embed(wrapRef.current);

    if (wrapRef.current) {
      wrapRef.current.style.display = "block";
      wrapRef.current.style.position = "fixed";
      wrapRef.current.style.left = "50%";
      wrapRef.current.style.top = "50%";
      wrapRef.current.style.transform = "translate(-50%, -50%)";
      wrapRef.current.style.width = "400px";
      wrapRef.current.style.height = "500px";
      wrapRef.current.style.zIndex = "9999"; 
      wrapRef.current.style.border = "1px solid #ccc";
      wrapRef.current.style.backgroundColor = "white";
    }
  };

  const foldAddress = () => {
    if (wrapRef.current) wrapRef.current.style.display = "none";
  };

  /* 메뉴 구성 */
  const [items, setItems] = useState([{ menu: "", price: "" }]);
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { menu: "", price: "" }]);
  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  /* 기본 정보 및 편의사항 */
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const convenienceList = [
    { key: "pet", label: "🐕\n반려견" },
    { key: "parking", label: "🅿️\n주차" },
    { key: "takeout", label: "🥡\n포장" },
  ];
  const [conveniences, setConveniences] = useState([]);
  const handleConvenienceChange = (checked, value) => {
    if (checked) setConveniences((prev) => [...prev, value]);
    else setConveniences((prev) => prev.filter((item) => item !== value));
  };

  /* 이미지 업로드 */
  const [storeImage, setStoreImage] = useState(null);
  const [storePreview, setStorePreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setStoreImage(file); setStorePreview(URL.createObjectURL(file)); }
  };

  const [verifyImage, setVerifyImage] = useState(null);
  const [verifyPreview, setVerifyPreview] = useState(null);
  const VerifyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setVerifyImage(file); setVerifyPreview(URL.createObjectURL(file)); }
  };

  /* 서버 전송 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // 메뉴 데이터 추출
    const menuNames = items.map(i => i.menu);
    const menuPrices = items.map(i => i.price);

    formData.append("brno", brNo);
    formData.append("userSn", userSn);
    formData.append("registerType", registerType);
    formData.append("owner", registerType === "BUSINESS" ? owner : "손님등록");
    formData.append("userReg", registerType === "USER" ? 1 : 0);
    formData.append("bzmnReg", registerType === "BUSINESS" ? 1 : 0);
    formData.append("storeName", storeName);
    formData.append("roadAddress", roadAddress);
    formData.append("detailAddress", detailAddress);
    formData.append("sido", sido);
    formData.append("sigungu", sigungu);
    formData.append("bname", bname);
    formData.append("sidoCode", sidoCode);
    formData.append("siGunGuCode", siGunGuCode);
    formData.append("bcode", bcode);
    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);
    formData.append("category", category);
    formData.append("convenience", JSON.stringify(conveniences));
    
    // 메뉴 정보 전송
    formData.append("menuNm1", JSON.stringify(menuNames));
    formData.append("menuPrc1", JSON.stringify(menuPrices));

    if (storeImage) formData.append("storeImage", storeImage);
    if (verifyImage) formData.append("VerifyImage", verifyImage);

    try {
      const response = await fetch(`${SERVER_URL}/youtaste/store/register`, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        alert("등록 완료!");
        navigate("/main");
      } else if (response.status === 409) {
        alert("이미 등록된 사업자번호입니다.");
      } else {
        alert("등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    }
  };

  const isFormValid =
    (brResult?.status === "인증되었습니다." || brResult?.status === "사용자 등록정보를 업데이트했습니다.") &&
    storeName && roadAddress && detailAddress && openTime && closeTime && category &&
    items[0].menu !== "" && verifyImage !== null;

  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={styleStore.storeContainer}>
          <form onSubmit={handleSubmit}>
            <div>
              <button className={`${styleStore.selectBtnL} ${styleStore.button} ${registerType === "USER" ? styleStore.completed : ""}`} type="button" onClick={user}>
                내 맛집 등록 <br /> (손님 등록)
              </button>
              <button className={`${styleStore.selectBtnR} ${styleStore.button} ${registerType === "BUSINESS" ? styleStore.completed : ""}`} type="button" onClick={br}>
                내 가게 등록 <br /> (사업자 등록)
              </button>
            </div>
            <br />
            <p className={styleStore.text} style={registerType === null ? {} : { display: "none" }}>항목을 선택해 주세요</p>

            <div style={registerType === null ? { display: "none" } : {}}>
              <label htmlFor="brno">사업자 등록번호</label>
              <div className={styleStore.brNoBox}>
                <input id="brno" type="text" maxLength={10} value={brNo} onChange={(e) => setBrNo(e.target.value)} placeholder='"-" 제외 10자리 숫자 입력' readOnly={brResult?.status === "인증되었습니다."} />
                <button className={`${styleStore.brNoBtn} ${styleStore.button}`} type="button" onClick={checkBusiness}>인증</button>
              </div>

              {brError && <p style={{ background: "white", padding: "1rem", color: "red" }}>{brError}</p>}
              {brResult && <div style={{ background: "white", padding: "1rem", marginBottom: "1rem" }}><p>{brResult.status}</p></div>}

              {registerType === "BUSINESS" && (
                <>
                  <label htmlFor="owner">대표자</label>
                  <input id="owner" type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="사업자 등록증과 일치하게 작성해 주세요" />
                  <label htmlFor="openDate">개업일</label>
                  <input className={styleStore.inputBox} type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} id="openDate" />
                </>
              )}

              <div className={styleStore.imgBox}>
                <label>{registerType === "BUSINESS" ? "사업자 등록증" : "영수증"}</label>
                <label htmlFor="VerifyImage" className={`${styleStore.customFileLabel} ${verifyImage ? styleStore.completed : ""}`}>
                  {verifyImage ? "등록완료" : "파일 선택"}
                </label>
                <input type="file" id="VerifyImage" accept="image/*" onChange={VerifyImageChange} className={styleStore.hiddenFileInput} />
              </div>
              {verifyPreview && <div style={{ marginTop: "10px" }}><img src={verifyPreview} alt="미리보기" width="200" /></div>}

              <label>매장 명</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />

              <label>주소</label>
              <div>
                <div ref={wrapRef} style={{ display: "none", zIndex: 10000 }}>
                  <img src="//t1.daumcdn.net/postcode/resource/images/close.png" alt="닫기" style={{ cursor: "pointer", position: "absolute", right: 0, top: -1, zIndex: 1 }} onClick={foldAddress} />
                </div>
                <div className={styleStore.addBox}>
                  <input type="text" placeholder="도로명 주소" value={roadAddress} readOnly />
                  <input className={`${styleStore.addBtn} ${styleStore.button}`} type="button" value="검색" onClick={handleAddressSearch} />
                </div>
                <input type="text" placeholder="상세주소" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
              </div>

              <label>운영시간</label>
              <div className={styleStore.flexBox}>
                <label>OPEN</label>
                <input className={styleStore.timeinput} type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
              </div>
              <div className={styleStore.flexBox}>
                <label>CLOSE</label>
                <input className={styleStore.timeinput} type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
              </div>

              <label htmlFor="menuCat">카테고리</label>
              <select id="menuCat" className={styleStore.inputBox} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled hidden>선택하세요</option>
                <option value="1">한식</option><option value="2">일식</option><option value="3">중식</option><option value="4">양식</option>
                <option value="5">아시안</option><option value="6">햄버거</option><option value="7">치킨</option><option value="8">디저트</option>
              </select>

              <p>편의사항</p>
              {convenienceList.map((item) => (
                <label key={item.key} className={`${styleStore.checkbox} ${conveniences.includes(item.key) ? styleStore.active : ""}`}>
                  {item.label.split("\n").map((line, idx) => <span key={idx}>{line}<br /></span>)}
                  <input type="checkbox" className={styleStore.hiddenCheckbox} checked={conveniences.includes(item.key)} onChange={(e) => handleConvenienceChange(e.target.checked, item.key)} />
                </label>
              ))}

              <label>메뉴</label>
              {items.map((item, index) => (
                <div key={index}>
                  <input className={styleStore.menu} type="text" placeholder={"메뉴" + (index + 1)} value={item.menu} onChange={(e) => handleChange(index, "menu", e.target.value)} />
                  <input className={styleStore.price} type="number" placeholder="가격" value={item.price} onChange={(e) => handleChange(index, "price", e.target.value)} />
                  <button className={`${styleStore.menuBtnL} ${styleStore.button}`} type="button" onClick={addItem}>+</button>
                  <button className={`${styleStore.menuBtnR} ${styleStore.button}`} type="button" onClick={() => removeItem(index)}>-</button>
                </div>
              ))}

              <div className={styleStore.imgBox}>
                <label htmlFor="storeImage">가게 대표 이미지</label><br />
                <label htmlFor="storeImage" className={`${styleStore.customFileLabel} ${storeImage ? styleStore.completed : ""}`}>
                  {storeImage ? "파일 선택 완료" : "파일 선택"}
                </label>
                <input type="file" id="storeImage" accept="image/*" onChange={handleImageChange} className={styleStore.hiddenFileInput} />
              </div>
              {storePreview && <div style={{ marginTop: "10px" }}><img src={storePreview} alt="미리보기" width="200" /></div>}

              <button className={`${styleStore.submit} ${styleStore.button}`} type="submit" disabled={!isFormValid}>등록</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StoreRegister;