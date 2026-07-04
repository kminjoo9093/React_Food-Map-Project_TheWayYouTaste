import { Link } from "react-router-dom";
import styleMain from "../../css/MainPage.module.css";
import CategoryFilter from "../../components/CategoryFilter";
import { useAppData } from "../../context/AppDataProvider";
import { getSearchPath } from "../../lib/utils/getSearchPath";
import RegionSelector from "../../components/RegionSelector";
import {
  useDongName,
  useSelectedCategories,
  useSelectedDong,
  useSelectedSgg,
  useSelectedSido,
  useSggName,
  useSidoName,
} from "../../store/filters";
import useInitLocationInfo from "../../hooks/useInitLocationInfo";
import SearchForm from "../../components/SearchForm";

function MainPage() {
  const { categories, sidoList } = useAppData();
  useInitLocationInfo({ skip: false });
  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const sidoName = useSidoName();
  const sggName = useSggName();
  const dongName = useDongName();
  const selectedCategories = useSelectedCategories();
  const keyword = "";

  const searchUrl = getSearchPath({
    region: {
      selectedSido,
      sidoName,
      selectedSgg,
      sggName,
      selectedDong,
      dongName,
    },
    categories: selectedCategories,
    keyword: keyword,
  });

  const handleSearchClick = () => {
    if (!selectedSido || !selectedSgg) {
      alert("위치를 불러오는 중입니다.");
      return;
    }
  };

  return (
    <div className="contentTopPosition">
      <div className={styleMain.bigContainer}>
        {/* 모바일 */}x
        <SearchForm device="mobile" />
        <div className={styleMain.mainContainer}>
          <h3 style={{ fontSize: "2.4rem" }}>
            원하시는 식당 유형을 선택해 주세요
          </h3>
          <RegionSelector sidoList={sidoList} />
          <CategoryFilter mode="main" categories={categories} />

          <div className={styleMain.iconRight}>
            <div className={styleMain.iconSearch}>
              <Link to={searchUrl} onClick={handleSearchClick}>
                🔍검색
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
