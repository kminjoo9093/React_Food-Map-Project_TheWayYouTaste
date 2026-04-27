import { Link, useNavigate } from "react-router-dom";
import styleMain from "../../css/MainPage.module.css";
import { useState, useEffect, useContext } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import styleHeader from "../../css/Header.module.css";
import searchIcon from "../../resources/img/system/search.png";
import { AppDataContext } from "../../context/AppDataProvider";
import { getSearchPath } from "../../lib/utils/getSearchPath";
import RegionSelector from "../../components/RegionSelector";
import useInitLocationInfo from "../../hooks/useInitLocationInfo";
import { useCategories, useFilterStore, useRegion, useRegionCode, useRegionName } from "../../store/filters";
import { useGeolocation } from "../../hooks/useGeolocation";

function MainPage() {
  
  const { categories, sidoList } = useContext(AppDataContext);
  const { lat, lng, getLocation } = useGeolocation();
    const {selectedSido, selectedSgg, selectedDong} = useRegionCode();
    const {sidoName, sggName, dongName} = useRegionName();
    const selectedCategories = useCategories();
  // const [isResetFilter, setIsResetFilter] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) {
      getLocation();
    }
  }, [lat, lng, getLocation]);

  const searchUrl = getSearchPath({
    region: {
      selectedSido,
      sidoName,
      selectedSgg,
      sggName,
      selectedDong,
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
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className={styleMain.mainContainer}>
          <h3 style={{ fontSize: "2.4rem" }}>
            원하시는 식당 유형을 선택해 주세요
          </h3>
          <RegionSelector
            sidoList={sidoList}
            // mode="main"
          />
          <CategoryFilter
            mode="main"
            categories={categories}
            // setIsResetFilter={setIsResetFilter}
          />

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
