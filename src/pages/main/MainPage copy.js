import { Link, useNavigate } from 'react-router-dom';
import styleMain from "../../css/MainPage.module.css";
// import styleGlobal from "../../css/Global.module.css";
import { useState, useEffect } from 'react';
import mainbody from "../../resources/img/system/main.png";
import useRegionFilter from '../search/hook/useRegionFilter';
import RegionModal from "../search/RegionModal"; 


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

// const regionData = {
//   "서울": {
//     "강남구": ["삼성동", "역삼동", "청담동"],
//     "마포구": ["합정동", "서교동", "상수동"],
//   },
//   "경기도": {
//     "성남시": ["분당동", "정자동"],
//     "수원시": ["영통구", "장안구"],
//   },
// };

function MainPage({sidoList}) {
  const navigate = useNavigate(); // 4. navigate 정의
  const {regionState, regionSetters, getCurrentLocation} = useRegionFilter();
  const { selectedDo, doName, selectedSi, siName, selectedDong, dongName } = regionState;
  const [isModalOpen, setIsModalOpen] = useState(false); //지역 모달 오픈 상태

  useEffect(() => { getCurrentLocation(); }, [getCurrentLocation]);

  const handleSearchClick = () => {
    const { selectedDo, selectedSi, selectedDong } = regionState;
    
    // 1. 주소창에 붙일 파라미터 생성
    const params = new URLSearchParams();
    if (selectedDo) params.append("sido", selectedDo);
    if (selectedSi) params.append("sgg", selectedSi);
    if (selectedDong) params.append("dong", selectedDong);

    // 2. 검색 페이지로 이동 (예: /search?sido=11&sgg=11060)
    navigate(`/search?${params.toString()}`);
  };

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
              onClick={() => setIsModalOpen(true)}
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
          {isModalOpen && (
                <RegionModal 
                    setIsModalOpen={setIsModalOpen}
                    {...regionState}
                    {...regionSetters}
                    onclick={onConfirm}
                    //onClick={() => setIsModalOpen(false)}
                    sidoList={sidoList}
                />
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
              <Link to="/search/store" onClick={handleSearchClick}>🔍검색</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
