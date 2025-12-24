import { Link } from 'react-router-dom';
import styleMain from "../../css/MainPage.module.css";
import { useState, useEffect } from 'react';
import useRegionSetting from '../search/hook/useRegionSetting';
import RegionModal from "../search/RegionModal"; 
import CategoryFilter from '../search/CategoryFilter';


const icons = [
  { emoji: "🐕", label: "반려동물허용" },
  { emoji: "🅿️", label: "주차" },
  { emoji: "🥡", label: "포장" },
];

function MainPage({storeCategories, sidoList}) {

  const {regionState, regionSetters, getCurrentLocation} = useRegionSetting();
  const { selectedDo, doName, selectedSi, siName, selectedDong, dongName, lat, lng, isLoading } = regionState;
  const [isModalOpen, setIsModalOpen] = useState(false); //지역 모달 오픈 상태

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isResetFilter, setIsResetFilter] = useState(false);

  useEffect(() => { getCurrentLocation(); }, [getCurrentLocation]);

  const getSearchPath = () => {
    
    // 주소창에 붙일 파라미터 생성
    const params = new URLSearchParams();
    if (selectedDo) params.append("sido", String(selectedDo).trim());
    if (selectedSi) params.append("sgg", String(selectedSi).trim());
    if (selectedDong) params.append("dong", String(selectedDong).trim());
    if (doName) params.append("doName", String(doName).trim());
    if (siName) params.append("siName", String(siName).trim());
    if (dongName) params.append("dongName", String(dongName).trim());
    if (lat) params.append("lat", lat); // 위도 추가
    if (lng) params.append("lng", lng); // 경도 추가

    // 선택된 카테고리들을 파라미터에 추가 (배열을 쉼표로 연결)
    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }

    // 검색 페이지로 이동
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
                {(doName || siName || dongName) ? `${doName} ${siName} ${dongName}`.trim() : "지역 선택"}
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
          <CategoryFilter 
              storeCategories={storeCategories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              setIsResetFilter={setIsResetFilter}
          />

          {/* <ul className={styleMain.iconGrid}>
             {storeCategories.map(record => (
                <li key={record.StoreCatNo}>
                  <div className={styleMain.iconBtn}>
                    {foodIcons[record.storeCatName]}
                    <div className={styleMain.tooltip}>{record.storeCatName}</div>
                  </div>
                </li>
            ))}
          </ul> */}

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
