import { Link } from 'react-router-dom';
import mainstyle from '../../css/MainPage.module.css';
import { useState } from 'react';

const foodIcons = [
  { emoji: "🍚", label: "한식" },
  { emoji: "🍣", label: "일식" },
  { emoji: "🥟", label: "중식" },
  { emoji: "🍝", label: "양식" },
  { emoji: "🍔", label: "햄버거" },
  { emoji: "🍗", label: "치킨" },
];

const icons= [
  { emoji: "🐕", label: "반려동물허용" },
  { emoji: "🅿️", label: "주차" },
  { emoji: "🥡", label: "포장" }
];
const regionData = {
  "서울": {
    "강남구": ["삼성동", "역삼동", "청담동"],
    "마포구": ["합정동", "서교동", "상수동"]
  },
  "경기도": {
    "성남시": ["분당동", "정자동"],
    "수원시": ["영통구", "장안구"]
  }
};
function MainPage() {
  const [selectedDo, setSelectedDo] = useState("");
  const [selectedSi, setSelectedSi] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);

  return (
    <>
    <h1>The Way You Taste</h1>

     <div className={mainstyle.mainContainer}>
      <h3>원하시는 식당 유형을 선택해 주세요</h3>

      {/* 필터 버튼 */}
      <div className={mainstyle.filterBox}>
        <button 
          className={mainstyle.filterBtn}
          onClick={() => setIsDimmedMiddleOpen(true)}
        >
          <span className={mainstyle.filterIcon}>📍</span>
          <span className={mainstyle.filterText}>
            {selectedDong ? `${selectedDo} ${selectedSi} ${selectedDong}` : "지역을 선택하세요"}
          </span>
          <span className={mainstyle.arrowIcon}>▼</span>
        </button>
      </div>

      {isDimmedMiddleOpen && (
        <div className={mainstyle.regionDimmed}>
          <div className={mainstyle.regionDimmedMiddle}>
            <h2>지역 선택</h2>

            <div className={mainstyle.regionContainer}>

              {/* ▼ 도 리스트 */}
              <div className={mainstyle.regionColumn}>
                <p>광역시/도</p>
                {Object.keys(regionData).map((d) => (
                  <div
                    key={d}
                    className={`${mainstyle.regionItem} ${
                      selectedDo === d ? mainstyle.activeItem : ""
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

              {/* ▼ 시 리스트 */}
              <div className={mainstyle.regionColumn}>
                <p>시/군/구</p>
                {selectedDo &&
                  Object.keys(regionData[selectedDo]).map((s) => (
                    <div
                      key={s}
                      className={`${mainstyle.regionItem} ${
                        selectedSi === s ? mainstyle.activeItem : ""
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

              {/* ▼ 동 리스트 */}
              <div className={mainstyle.regionColumn}>
                <p>읍/면/동</p>
                {selectedSi &&
                  regionData[selectedDo][selectedSi].map((dong) => (
                    <div
                      key={dong}
                      className={`${mainstyle.regionItem} ${
                        selectedDong === dong ? mainstyle.activeItem : ""
                      }`}
                      onClick={() => setSelectedDong(dong)}
                    >
                      {dong}
                    </div>
                  ))}
              </div>
            </div>

            <button
              className={mainstyle.regionConfirm}
              onClick={() => setIsDimmedMiddleOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
        <div className={mainstyle.titleBox}>
          <h4 className={mainstyle.sectionTitle}>업종</h4>
        </div>
        <div className={mainstyle.iconGrid}>
          {foodIcons.map((item, index) => (
            <div key={index} className={mainstyle.iconBtn}>
              {item.emoji}
              <div className={mainstyle.tooltip}>{item.label}</div>
            </div>
          ))}
        </div>
        <div className={mainstyle.titleBox}>
          <h4 className={mainstyle.sectionTitle}>편의</h4>
        </div>
        <div className={mainstyle.iconGrid}>
          {icons.map((item, index) => (
            <div key={index} className={mainstyle.iconBtn}>
              {item.emoji}
              <div className={mainstyle.tooltip}>{item.label}</div>
            </div>
          ))}
        </div>
        <div className={mainstyle.iconRight}>
          <div className={mainstyle.iconSearch}><Link to = "/notice"> 🔍 검색</Link> 
          </div>
        </div>
      </div>
    </>

  );
}

export default MainPage;
