import { Link, useNavigate } from "react-router-dom";
import styleMain from "../../css/MainPage.module.css";
import { useState, useEffect, useContext } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import styleHeader from "../../css/Header.module.css";
import searchIcon from "../../resources/img/system/search.png";
import { AppDataContext } from "../../context/AppDataProvider";
import { getSearchPath } from "../../lib/utils/getSearchPath";
import RegionSelector from "../../components/RegionSelector";
import {
  useDongName,
  useFilterStore,
  useSelectedDong,
  useSelectedSgg,
  useSelectedSido,
  useSggName,
  useSidoName,
} from "../../store/filters";
import useInitLocationInfo from "../../hooks/useInitLocationInfo";

function MainPage() {
  const { categories, sidoList } = useContext(AppDataContext);
  const { lat, lng, getCoords } = useInitLocationInfo({ skip: false });
  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const sidoName = useSidoName();
  const sggName = useSggName();
  const dongName = useDongName();
  const selectedCategories = useFilterStore(
    (store) => store.selectedCategories,
  );
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const isRegionReady = selectedSido && selectedSgg;

  // useEffect(() => {
  //   if (!lat && !lng) {
  //     getCoords();
  //   }
  // }, [lat, lng, getCoords]);

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
      if (!keyword.trim()) return;
      // 검색어를 포함하여 SearchStore 페이지로 이동
      navigate(`/search/store?keyword=${encodeURIComponent(keyword)}`);
      setKeyword(""); // 입력창 초기화
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
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
          <RegionSelector sidoList={sidoList} />
          <CategoryFilter mode="main" categories={categories} />

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
