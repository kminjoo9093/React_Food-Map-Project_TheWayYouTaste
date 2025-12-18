import styleStore from "../../css/StoreRegister.module.css"

import { useState, useRef } from "react";

function StoreRegister({ userSn }) {
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

    if (registerType === "BUSINESS") {
      if (!owner || !openDate) {
        setBrError("대표자명과 개업일을 모두 입력해주세요.");
        return;
      }
    }

    if (brNo.length !== 10) {
      setBrError("사업자등록번호 10자리를 입력해주세요.");
      return;
    }

    try {
      const serviceKey =
        "nYrvOHdHDUUOV%2Fb8t4ddcrtVY02lgsfE%2BNmWpM%2F88LynhtxTOqBYkJZWbBCccrjZGcvSysLZVipV0g069cKT2A%3D%3D";
      let url = "";
      let body = null;

      if (registerType === "USER") {
        url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`;
        body = { b_no: [brNo] };
      } else {
        url = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${serviceKey}`;
        body = {
          businesses: [
            {
              b_no: brNo, 
              start_dt: openDate.replaceAll("-", ""),
              p_nm: owner,
            },
          ],
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Raw API response:", data);

      let result = null;
      if (registerType === "USER") {
        result = data.businesses?.[0] || data.data?.[0];
      } else {
        result = data.businesses?.[0] || data.data?.[0];
      }

      if (!result) {
        setBrError("조회 결과가 없습니다.");
        return;
      }

      // 결과 검증
      if (registerType === "USER") {
        if (result.b_stt === "계속사업자") {
          setBrResult({ status: "인증되었습니다" });
        } else {
          setBrError("유효하지 않은 사업자등록번호입니다.");
        }
      } else {
        if (result.valid === "01") {
          setBrResult({ status: "인증되었습니다" });
        } else {
          setBrError("사업자정보가 일치하지 않습니다.");
        }
      }
    } catch (err) {
      console.error("API 호출 실패:", err);
      setBrError("API 호출 중 오류가 발생했습니다.");
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
    if (!window.daum) return;
    new window.daum.Postcode({
      oncomplete: function (data) {
        setRoadAddress(data.roadAddress);
        setSido(data.sido);
        setSigungu(data.sigungu);
        setBname(data.bname);
        setSiGunGuCode(data.sigunguCode || "");
        setBcode(data.bcode || "");

        // 시도 코드 계산 (bcode 앞 2자리)
        if (data.bcode) {
          setSidoCode(data.bcode.slice(0, 2));
        }

        const detailInput = document.querySelector(
          'input[placeholder="상세주소"]'
        );
        if (detailInput) detailInput.focus();

        if (wrapRef.current) wrapRef.current.style.display = "none";
      },
      width: "100%",
      height: "100%",
      maxSuggestItems: 5,
    }).embed(wrapRef.current);

    if (wrapRef.current) {
      const width = 300;
      const height = 400;
      const borderWidth = 1;
      wrapRef.current.style.display = "block";
      wrapRef.current.style.width = width + "px";
      wrapRef.current.style.height = height + "px";
      wrapRef.current.style.border = `${borderWidth}px solid #ccc`;
      wrapRef.current.style.position = "fixed";
      wrapRef.current.style.left =
        ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - 
        borderWidth +
        "px";
      wrapRef.current.style.top =
        ((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - 
        borderWidth +
        "px";
      wrapRef.current.style.zIndex = 1000;
      wrapRef.current.style.overflow = "hidden";
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

  /* 기본 정보 */
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");

  /* 편의 사항 */
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
  const conveniencePayload = conveniences;

  /* 이미지 업로드 */
  const [storeImage, setStoreImage] = useState(null);
  const [storePreview, setStorePreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setStoreImage(file);
    if (file) setStorePreview(URL.createObjectURL(file));
  };

  const [verifyImage, setVerifyImage] = useState(null);
  const [verifyPreview, setVerifyPreview] = useState(null);
  const VerifyImageChange = (e) => {
    const file = e.target.files[0];
    setVerifyImage(file);
    if (file) setVerifyPreview(URL.createObjectURL(file));
  };

  /* 서버 전송 */
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("brNo", brNo);
    formData.append("userSn", userSn);
    if (registerType === "BUSINESS") {
      formData.append("owner", owner);
      formData.append("business", 1);
    }

    if (registerType === "USER") {
      formData.append("user", 1);
    }

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

    formData.append("convenience", JSON.stringify(conveniencePayload));
    formData.append("menuList", JSON.stringify(items));

    if (storeImage) formData.append("storeImage", storeImage);
    if (verifyImage) formData.append("VerifyImage", verifyImage);

    // 전송값 확인 - 지우기
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    try {
      const response = await fetch("http://localhost:3001/youtaste/store/register", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("등록 실패");
      const result = await response.json();
      setStorePreview(`http://localhost:3001${result.storeImageUrl}`);
      setVerifyPreview(`http://localhost:3001${result.verifyImageUrl}`);
      alert("등록 완료!");
      console.log(result);
    } catch (error) {
      console.error(error);
      alert("오류 발생: 등록 실패");
    }
  };

  // 등록 버튼 활성화 조건
const isFormValid =
  brResult?.status === "인증되었습니다" &&
  storeName &&
  roadAddress &&
  detailAddress &&
  openTime &&
  closeTime &&
  category &&
  items.length > 0 && 
  verifyImage !== null;

  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={styleStore.storeContainer}>
          <form onSubmit={handleSubmit}>
            {/* 손님/사업자 선택 버튼 */}
            <div>
              <button
                className={`${styleStore.selectBtnL} ${styleStore.button} ${registerType === "USER" ? styleStore.completed : ""}`}
                type="button"
                onClick={user}
              >
                내 맛집 등록
                <br />
                (손님 등록)
              </button>

              <button
                className={`${styleStore.selectBtnR} ${styleStore.button} ${registerType === "BUSINESS" ? styleStore.completed : ""}`}
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

            <p className={styleStore.text} style={registerType === null ? {} : { display: "none" }}>항목을 선택해 주세요</p>

            <div style={registerType === null ? { display: "none" } : {}}>
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
                    placeholder='"-" 제외 10자리 숫자 입력'
                    readOnly={brResult?.status === "인증되었습니다" ? true : false}
                  />
                  <button
                    className={`${styleStore.brNoBtn} ${styleStore.button}`}
                    type="button"
                    onClick={checkBusiness}
                  >
                    인증
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
                    <p>{brResult.status}</p>
                  </div>
                )}
              </div>

              {/* 사업자 등록 */}
              {registerType === "BUSINESS" && (
                <>
                  <label htmlFor="owner">대표자</label>
                  <input
                    id="owner"
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="사업자 등록증과 일치하게 작성해 주세요"
                  />

                  <label htmlFor="openDate">개업일</label>
                  <br />
                  <input
                    className={styleStore.inputBox}
                    type="date"
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    id="openDate"
                  />
                  <br />
                </>
              )}

              {/* 사업자등록번호 인증 사진 */}
              <div className={styleStore.imgBox}>
                {registerType === "BUSINESS" ? 
                  <label>사업자 등록증</label> : <label>영수증</label>}
                <label htmlFor="VerifyImage" className={`${styleStore.customFileLabel} ${verifyImage ? styleStore.completed : ""}`}>
                  {verifyImage ? "등록완료" : "파일 선택"}
                </label>
                <input
                  type="file"
                  id="VerifyImage"
                  accept="image/*"
                  onChange={VerifyImageChange}
                  className={styleStore.hiddenFileInput}
                />
              </div>
              {verifyPreview && <div style={{ marginTop: "10px" }}><img src={verifyPreview} alt="미리보기" width="200" /></div>}

              {/* 매장이름 */}
              <label>매장 명</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />

              {/* 주소API */}
              <label>주소</label>
              <div>
                <div ref={wrapRef} style={{ display: "none", position: "relative" }}>
                  <img
                    src="//t1.daumcdn.net/postcode/resource/images/close.png"
                    alt="닫기"
                    style={{ cursor: "pointer", position: "absolute", right: 0, top: -1, zIndex: 1 }}
                    onClick={foldAddress}
                  />
                </div>

                <div className={styleStore.addBox}>
                  <input type="text" placeholder="도로명 주소" value={roadAddress} readOnly />
                  <input className={`${styleStore.addBtn} ${styleStore.button}`} type="button" value="검색" onClick={handleAddressSearch} /><br />
                </div>

                <input
                  type="text"
                  placeholder="상세주소"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />

                <input type="text" style={{ display: "none" }} value={sido} readOnly />
                <input type="text" style={{ display: "none" }} value={sigungu} readOnly />
                <input type="text" style={{ display: "none" }} value={bname} readOnly />
                <input type="hidden" name="sidoCode" value={sidoCode} readOnly/>
                <input type="text" style={{ display: "none" }} value={siGunGuCode} readOnly />
                <input type="text" style={{ display: "none" }} value={bcode} readOnly />
              </div>

              {/* 운영시간 */}
              <label>운영시간</label>
              <br />
              <div className={styleStore.flexBox}>
                <label>OPEN</label>
                <input
                  className={styleStore.timeinput}
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                />
              </div>
              <div className={styleStore.flexBox}>
                <label>CLOSE</label>
                <input
                  className={styleStore.timeinput}
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                />
              </div>

              {/* 카테고리 */}
              <label htmlFor="menuCat">카테고리</label>
              <select
                id="menuCat"
                className={styleStore.inputBox}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <br />

              {/* 편의사항 */}
              <p>편의사항</p>
              {convenienceList.map((item) => (
                <label
                  key={item.key}
                  className={`${styleStore.checkbox} ${conveniences.includes(item.key) ? styleStore.active : ""}`}
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
                    onChange={(e) => handleConvenienceChange(e.target.checked, item.key)}
                  />
                </label>
              ))}

              {/* 메뉴추가 */}
              <label>메뉴</label>
              {items.map((item, index) => (
                <div key={index}>
                  <input
                    className={styleStore.menu}
                    type="text"
                    placeholder={"메뉴" + (index + 1)}
                    value={item.menu}
                    onChange={(e) => handleChange(index, "menu", e.target.value)}
                  />
                  <input
                    className={styleStore.price}
                    type="number"
                    placeholder="가격"
                    value={item.price}
                    onChange={(e) => handleChange(index, "price", e.target.value)}
                  />
                  <button className={`${styleStore.menuBtnL} ${styleStore.button}`} type="button" onClick={addItem}>
                    +
                  </button>
                  <button className={`${styleStore.menuBtnR} ${styleStore.button}`} type="button" onClick={() => removeItem(index)}>
                    -
                  </button>
                </div>
              ))}
              {/* 가게대표이미지 */}
              <div className={styleStore.imgBox}>
                <label htmlFor="storeImage">가게 대표 이미지</label><br />
                <label htmlFor="storeImage" className={`${styleStore.customFileLabel} ${storeImage ? styleStore.completed : ""}`}>
                  {storeImage ? "파일 선택 완료" : "파일 선택"}
                </label>
                <input
                  type="file"
                  id="storeImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styleStore.hiddenFileInput}
                />
              </div>
              {storePreview && <div style={{ marginTop: "10px" }}><img src={storePreview} alt="미리보기" width="200" /></div>}

              {/* 등록버튼 */}
              {isFormValid ? (
                <button
                  className={`${styleStore.submit} ${styleStore.button}`}
                  type="submit"
                >
                  등록
                </button>
              ) : (
                <button
                  className={`${styleStore.submit} ${styleStore.button}`}
                  type="button"
                  onClick={() => alert("입력하신 값을 다시 한번 확인해주세요")}
                >
                  등록
                </button>
              )}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StoreRegister;
