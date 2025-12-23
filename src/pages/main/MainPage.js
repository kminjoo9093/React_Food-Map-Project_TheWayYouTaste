import { Link } from 'react-router-dom';
import styleMain from "../../css/MainPage.module.css";
// import styleGlobal from "../../css/Global.module.css";
import { useState, useEffect } from 'react';
import mainbody from "../../resources/img/system/main.png";
import useRegionSetting from '../search/hook/useRegionSetting';
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

function MainPage({sidoList}) {

  const {regionState, regionSetters, getCurrentLocation} = useRegionSetting();
  const { selectedDo, doName, selectedSi, siName, selectedDong, dongName } = regionState;
  const [isModalOpen, setIsModalOpen] = useState(false); //지역 모달 오픈 상태

  useEffect(() => { getCurrentLocation(); }, [getCurrentLocation]);

  const getSearchPath = () => {
    
    // 1. 주소창에 붙일 파라미터 생성
    const params = new URLSearchParams();
    if (selectedDo) params.append("sido", String(selectedDo).trim());
    if (selectedSi) params.append("sgg", String(selectedSi).trim());
    if (selectedDong) params.append("dong", String(selectedDong).trim());

    // 2. 검색 페이지로 이동
    return `/search/store?${params.toString()}`;
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
            <button className={styleMain.filterBtn} onClick={() => setIsModalOpen(true)}>
              <span className={styleMain.filterIcon}>📍</span>
              <span className={styleMain.filterText}>
                {doName ? `${doName} ${siName} ${dongName}`.trim() : "지역 선택"}
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
                    onConfirm={() => setIsModalOpen(false)}
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
              <Link to={getSearchPath()}>🔍검색</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
