import { Link, useNavigate } from "react-router-dom";
import styleMain from "../../css/MainPage.module.css";
import { useState, useEffect, useContext } from "react";
import useRegionSetting from "../search/hook/useRegionSetting";
import RegionModal from "../search/RegionModal";
import CategoryFilter from "../search/CategoryFilter";
import styleHeader from "../../css/Header.module.css";
import searchIcon from "../../resources/img/system/search.png";
import { AppDataContext } from "../../context/AppDataProvider";
import { getSearchPath } from "../../utils/getSearchPath";

function MainPage() {
  const { regionState, regionSetters, getCurrentLocation } = useRegionSetting();
  const {
    selectedDo,
    doName,
    selectedSi,
    siName,
    selectedDong,
    dongName,
    lat,
    lng,
    isLoading,
  } = regionState;
  const [isModalOpen, setIsModalOpen] = useState(false); //지역 모달 오픈 상태

  const { categories, sidoList } = useContext(AppDataContext);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isResetFilter, setIsResetFilter] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) {
      getCurrentLocation();
    }
  }, [lat, lng, getCurrentLocation]);

  const searchUrl = getSearchPath({
    region: {
      selectedDo,
      selectedSi,
      selectedDong,
      doName,
      siName,
      dongName,
    },
    location: { lat, lng },
    categories: selectedCategories,
  });

  //검색
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!searchTerm.trim()) return;
      // 검색어를 포함하여 SearchStore 페이지로 이동
      navigate(`/search/store?keyword=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // 입력창 초기화
    }
  };

  return (
    <div className="contentTopPosition">
      <div className={styleMain.bigContainer}>
        <h1 className={`${styleMain.mainFont} heading`}>The Way You Taste</h1>

        {/* 모바일 */}
        <div
          className={`${styleHeader.searchContainer} ${styleMain.mobSearch}`}
        >
          <input
            type="text"
            placeholder="지역, 음식 또는 식당명을 검색하세요"
            className={styleHeader.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 값 변경 감지
            onKeyDown={handleSearch} // 엔터키
          />
          <img
            src={searchIcon}
            alt="search"
            onClick={handleSearch} // 돋보기 클릭 감지
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className={styleMain.mainContainer}>
          <h3 style={{ fontSize: "2.4rem" }}>
            원하시는 식당 유형을 선택해 주세요
          </h3>

          {/* 필터 버튼 */}
          <div className={styleMain.filterBox}>
            <button
              className={styleMain.filterBtn}
              onClick={() => setIsModalOpen(true)}
            >
              <span className={styleMain.filterIcon}>📍</span>
              <span className={styleMain.filterText}>
                {doName || siName || dongName
                  ? `${doName} ${siName} ${dongName}`.trim()
                  : "지역 선택"}
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
          <CategoryFilter
            mode="main"
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            setIsResetFilter={setIsResetFilter}
          />

          {/* 검색 버튼 */}
          <div className={styleMain.iconRight}>
            <div className={styleMain.iconSearch}>
              <Link to={searchUrl}>🔍검색</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
