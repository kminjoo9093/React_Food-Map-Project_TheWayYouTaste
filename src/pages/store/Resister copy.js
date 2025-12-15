import styleStore from "../../css/storeresister.module.css"
import { useState, useRef } from "react";

function StoreResister() {

  /* 손님/사업자 선택 */
  const user = () => {}
  const br = () => {}

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
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [bname, setBname] = useState("");
  const [siGunGuCode, setSiGunGuCode] = useState("");
  const [bcode, setBcode] = useState("");

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

        const detailInput = document.querySelector('input[placeholder="상세주소"]');
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

  const addItem = () => {
    setItems([...items, { menu: "", price: "" }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  /* 기본 정보 */
  const [owner, setOwner] = useState("");
  const [openDate, setOpenDate] = useState("");
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
      setConveniences((prev) =>
        prev.filter((item) => item !== value)
      );
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

  /* 서버 전송 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("brNo", brNo);
    formData.append("owner", owner);
    formData.append("openDate", openDate);
    formData.append("storeName", storeName);

    formData.append("roadAddress", roadAddress);
    formData.append("detailAddress", detailAddress);
    formData.append("sido", sido);
    formData.append("sigungu", sigungu);
    formData.append("bname", bname);
    formData.append("siGunGuCode", siGunGuCode);
    formData.append("bcode", bcode);

    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);
    formData.append("category", category);

    formData.append("convenience", JSON.stringify(conveniencePayload));

    formData.append("menuList", JSON.stringify(items));

    if (image) {
      formData.append("image", image);
    }

    // 전송값 확인 - 지우기
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    try {
      const response = await fetch("/api/store/register", {
        method: "POST",
        body: formData,  // Content-Type 직접 설정 금지!
      });

      if (!response.ok) {
        throw new Error("등록 실패");
      }

      const result = await response.json();
      alert("등록 완료!");
      console.log(result);

    } catch (error) {
      console.error(error);
      alert("오류 발생: 등록 실패");
    }
  };

  return (
    <div className="contentTopPosition">
      <div className="container">
        <div className={styleStore.storeContainer}>
          <form onSubmit={handleSubmit}>

            {/* 손님/사업자 선택 버튼 */}
            <div>
              <button className={styleStore.selectBtnL} type="button" onClick={user}>
                내 맛집 등록<br />(손님 등록)
              </button>
              <button className={styleStore.selectBtnR} type="button" onClick={br}>
                내 가게 등록<br />(사업자 등록)
              </button>
              <br /><br />
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
                  placeholder='"-" 제외 10자리 숫자 입력'
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
                <p style={{ background: "white", padding: "1rem", color: "red" }}>{brError}</p>
              )}

              {brResult && (
                <div style={{ background: "white", padding: "1rem", marginBottom: "1rem" }}>
                  <p>
                    {brResult.status === "계속사업자"
                      ? "인증되었습니다"
                      : "사업자번호를 확인해 주세요"}
                  </p>
                </div>
              )}
            </div>

            {/* 기본 정보 */}
            <label htmlFor="owner">대표자</label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />

            <label>개업일</label><br />
            <input
              type="date"
              className={styleStore.inputBox}
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
            /><br />

            <label>매장 명</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />

            {/* 주소 */}
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
                <input
                  className={styleStore.addBtn}
                  type="button"
                  value="검색"
                  onClick={handleAddressSearch}
                /><br />
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
              <input type="text" style={{ display: "none" }} value={siGunGuCode} readOnly />
              <input type="text" style={{ display: "none" }} value={bcode} readOnly />
            </div>

            {/* 운영시간 */}
            <label>운영시간</label><br />
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
              <option value="" disabled hidden>선택하세요</option>
              <option value="1">한식</option>
              <option value="2">일식</option>
              <option value="3">중식</option>
              <option value="4">양식</option>
              <option value="5">아시안</option>
              <option value="6">햄버거</option>
              <option value="7">치킨</option>
              <option value="8">디저트</option>
            </select><br />
            
            {/* 편의시설 */}
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
                  onChange={(e) => handleConvenienceChange(e.target.checked, item.key)}
                />
              </label>
            ))}

            {/* 메뉴 구성 */}
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
                <button
                  className={styleStore.menuBtnL}
                  type="button"
                  onClick={addItem}
                >
                  +
                </button>
                <button
                  className={styleStore.menuBtnR}
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  -
                </button>
              </div>
            ))}

            <br />

            {/* 이미지 업로드 */}
            <label>가게 대표 이미지</label><br/>
            {preview && (
              <div style={{ marginTop: "10px" }}>
                <img src={preview} alt="미리보기" width="200" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <button className={styleStore.submit} type="submit">등록</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StoreResister;
