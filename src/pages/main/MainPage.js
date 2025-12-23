import { Link } from 'react-router-dom';
import styleMain from "../../css/MainPage.module.css";
// import styleGlobal from "../../css/Global.module.css";
import { useState } from 'react';
import mainbody from "../../resources/img/system/main.png";

const foodIcons = [
  { emoji: "🍚", label: "한식" },
  { emoji: "🍣", label: "일식" },
  { emoji: "🥟", label: "중식" },
  { emoji: "🍝", label: "양식" },
  { emoji: "🍜", label:"아시안"},
  { emoji: "🍔", label: "햄버거" },
  { emoji: "🍗", label: "치킨" },
  { emoji: "🍰", label: "디저트"}
];

const icons = [
  { emoji: "🐕", label: "반려동물허용" },
  { emoji: "🅿️", label: "주차" },
  { emoji: "🥡", label: "포장" },
];

const regionData = {
  "서울": {
    "강남구": ["삼성동", "역삼동", "청담동"],
    "마포구": ["합정동", "서교동", "상수동"],
  },
  "경기도": {
    "성남시": ["분당동", "정자동"],
    "수원시": ["영통구", "장안구"],
  },
};

function MainPage() {
  const [selectedDo, setSelectedDo] = useState("");
  const [selectedSi, setSelectedSi] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);

  return (
    <div className='contentTopPosition'>
      <div className={styleMain.bigContainer}>
        <h1 className={`${styleMain.mainFont} heading`}>
          The Way You Taste
        </h1>

        <div className={styleMain.mainContainer}>
          <h3>원하시는 식당 유형을 선택해 주세요</h3>

          {/* 필터 버튼 */}
          <div className={styleMain.filterBox}>
            <button
              className={styleMain.filterBtn}
              onClick={() => setIsDimmedMiddleOpen(true)}
            >
              <span className={styleMain.filterIcon}>📍</span>
              <span className={styleMain.filterText}>
                {selectedDong
                  ? `${selectedDo} ${selectedSi} ${selectedDong}`
                  : "지역을 선택하세요"}
              </span>
              <span className={styleMain.arrowIcon}>▼</span>
            </button>
          </div>

          {/* 지역 선택 모달 */}
          {isDimmedMiddleOpen && (
            <div className={styleMain.regionDimmed}>
              <div className={styleMain.regionDimmedMiddle}>
                <h2>지역 선택</h2>
                <div className={styleMain.regionContainer}>
                  {/* 도 리스트 */}
                  <div className={styleMain.regionColumn}>
                    <p>광역시/도</p>
                    {Object.keys(regionData).map((d) => (
                      <div
                        key={d}
                        className={`${styleMain.regionItem} ${
                          selectedDo === d ? styleMain.activeItem : ""
                        }`}
                        onClick={() => {
                          setSelectedDo(d);
                          setSelectedSi("");
                          setSelectedDong("");
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* 시 리스트 */}
                  <div className={styleMain.regionColumn}>
                    <p>시/군/구</p>
                    {selectedDo &&
                      Object.keys(regionData[selectedDo]).map((s) => (
                        <div
                          key={s}
                          className={`${styleMain.regionItem} ${
                            selectedSi === s ? styleMain.activeItem : ""
                          }`}
                          onClick={() => {
                            setSelectedSi(s);
                            setSelectedDong("");
                          }}
                        >
                          {s}
                        </div>
                      ))}
                  </div>

                  {/* 동 리스트 */}
                  <div className={styleMain.regionColumn}>
                    <p>읍/면/동</p>
                    {selectedSi &&
                      regionData[selectedDo][selectedSi].map((dong) => (
                        <div
                          key={dong}
                          className={`${styleMain.regionItem} ${
                            selectedDong === dong ? styleMain.activeItem : ""
                          }`}
                          onClick={() => setSelectedDong(dong)}
                        >
                          {dong}
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  className={styleMain.regionConfirm}
                  onClick={() => setIsDimmedMiddleOpen(false)}
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 업종 */}
          <div className={styleMain.titleBox}>
            <h4 className={styleMain.sectionTitle}>업종</h4>
          </div>
          <div className={styleMain.iconGrid}>
            {foodIcons.map((item, index) => (
              <div key={index} className={styleMain.iconBtn}>
                {item.emoji}
                <div className={styleMain.tooltip}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* 편의 */}
          <br></br><br></br><br></br>
          <div className={styleMain.titleBox}>
            <h4 className={styleMain.sectionTitle}>편의</h4>
          </div>
          <div className={styleMain.iconGrid}>
            {icons.map((item, index) => (
              <div key={index} className={styleMain.iconBtn}>
                {item.emoji}
                <div className={styleMain.tooltip}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* 검색 버튼 */}
          <div className={styleMain.iconRight}>
            <div className={styleMain.iconSearch}>
              <Link to="/notice">🔍검색</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
