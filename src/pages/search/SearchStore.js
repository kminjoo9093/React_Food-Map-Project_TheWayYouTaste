import { Link, useLocation, useNavigate } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useRef } from "react";
import Pagination from "../Pagination";
import MapComponent from "../../components/MapComponent";
import CategoryFilter from "../../components/CategoryFilter";
import useInitLocationInfo from "../../hooks/useInitLocationInfo";
import { useContext } from "react";
import { AppDataContext } from "../../context/AppDataProvider";
import RegionSelector from "../../components/RegionSelector";
import {
  useFilterStore,
  useSelectedDong,
  useSelectedSgg,
  useSelectedSido,
} from "../../store/filters";
import { useStoresByCondition } from "../../hooks/queries/useStoresByCondition";
import { useStoresByViewport } from "../../hooks/queries/useStoresByViewport";
import StoreItem from "../../components/StoreItem";

function SearchStore() {
  const { categories, sidoList } = useContext(AppDataContext);
  const positionAreaRef = useRef({
    swMinLat: 0,
    swMinLng: 0,
    neMaxLat: 0,
    neMaxLng: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const selectedCategories = useFilterStore(
    (store) => store.selectedCategories,
  );
  const appliedCategories = useFilterStore((store) => store.appliedCategories);
  const setCategories = useFilterStore((store) => store.setCategories);
  const applyCategories = useFilterStore((store) => store.applyCategories);
  const resetRegion = useFilterStore((store) => store.resetRegion);
  const resetCategories = useFilterStore((store) => store.resetCategories);
  const setRegion = useFilterStore((store) => store.setRegion);
  const mapQueryToRegion = ({
    sidoCode,
    sggCode,
    dongCode,
    sidoName,
    sggName,
    dongName,
  }) => ({
    selectedSido: sidoCode ?? null,
    selectedSgg: sggCode ?? null,
    selectedDong: dongCode ?? null,
    sidoName: sidoName ?? "",
    sggName: sggName ?? "",
    dongName: dongName ?? "",
  });

  const [viewport, setViewport] = useState(null);

  const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태
  const [isMoved, setIsMoved] = useState(false);
  const [isChangedRegion, setIsChangedRegion] = useState(false);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isResetFilter, setIsResetFilter] = useState(false);
  const [isSearchViewport, setIsSearchViewport] = useState(false);

  const hasQueryRegion =
    queryParams.get("sido") ||
    queryParams.get("sgg") ||
    queryParams.get("dong");

  //지도 검색 페이지에서 초기 sgg기반 리스트
  const { lat, lng, getCoords } = useInitLocationInfo({
    skip: !!hasQueryRegion,
  });

  // URL에서 카테고리 가져오기
  const paramCategories = queryParams.get("categories");

  const urlCategoryArray = useMemo(() => {
    return paramCategories ? paramCategories.split(",") : [];
  }, [paramCategories]);

  // fetch -> query storeList 요청
  const params = useMemo(
    () => ({
      keyword,
      sidoCode: selectedSido,
      sggCode: selectedSgg,
      dongCode: selectedDong,
    }),
    [keyword, selectedSido, selectedSgg, selectedDong],
  );

  const { data: storeList = [], isLoading } = useStoresByCondition(params);

  //메인페이지에서 넘어온 url상태 동기화
  useEffect(() => {
    if (hasQueryRegion) {
      const nextRegion = mapQueryToRegion({
        sidoCode: queryParams.get("sido"),
        sggCode: queryParams.get("sgg"),
        dongCode: queryParams.get("dong"),
        sidoName: queryParams.get("doName"),
        sggName: queryParams.get("siName"),
        dongName: queryParams.get("dongName"),
      });

      if (
        nextRegion.selectedSido !== selectedSido ||
        nextRegion.selectedSgg !== selectedSgg ||
        nextRegion.selectedDong !== selectedDong
      ) {
        setRegion(nextRegion);
      }
    }

    //카테고리
    if (urlCategoryArray.length > 0) {
      setCategories(urlCategoryArray);
      applyCategories(urlCategoryArray);
    }
  }, [
    location.search,
  ]);

  useEffect(() => {
    setIsChangedRegion(true);
    setIsSearchViewport(false);
  }, [keyword, selectedSido, selectedSgg, selectedDong]);

  const { data: viewportStoreList, refetch: getStoreListByViewport } =
    useStoresByViewport(viewport);

  // 범위 내 재검색 함수
  const handleSearchViewportArea = () => {
    const currentArea = positionAreaRef.current;
    if (!currentArea || currentArea.swMinLat === 0) return;
    setViewport(currentArea);
    getStoreListByViewport();

    setIsSearchViewport(true);
    setIsChangedRegion(false);
    setIsMoved(false); // 재검색 후 버튼 비활성화
    setNowPage(1);
  };

  //데이터 결정
  const baseList = isSearchViewport ? viewportStoreList : storeList;

  //카테고리 필터링한 맛집 리스트
  const filteredStoreList = useMemo(() => {
    if (appliedCategories.length === 0) return baseList;

    console.log(appliedCategories);
    return baseList.filter((record) =>
      appliedCategories.includes(record.storeCatNo),
    );
  }, [baseList, appliedCategories]);

  // 필터링, 지도범위 적용 최종 맛집 리스트
  const finalStoreListWithId = useMemo(() => {
    if (!Array.isArray(filteredStoreList)) return [];
    return filteredStoreList.map((record) => ({
      id: record.bplcSn,
      ...record,
    }));
  }, [filteredStoreList]);

  // 검색 버튼 클릭 (카테고리 필터 적용)
  const onClickSearchBtn = () => {
    applyCategories(selectedCategories); //적용되는 카테고리 리스트로 복사

    //map level 조절
    if (!selectedSido && selectedSido === null) {
      setIsSelectedAll(true); //level 12
    } else {
      setIsSelectedAll(false); //level 7
    }

    // URL 파라미터 제거
    navigate("/search/store", { replace: true });
  };

  //필터 초기화
  const resetFilter = () => {
    resetRegion();
    resetCategories();

    // URL 파라미터 제거
    navigate("/search/store", { replace: true });

    setIsSearchViewport(false);

    setIsMoved(false);
    setIsResetFilter(true);
    setIsSelectedAll(false);
    setIsChangedRegion(true);

    getCoords();
  };

  useEffect(() => {
    if (nowPage !== 1) {
      setNowPage(1); // 검색 시 페이지 번호 초기화
    }
  }, [filteredStoreList]);

  // 페이지네이션
  const [nowPage, setNowPage] = useState(1);
  const viewListItemNum = 10;
  const viewStoreItems = finalStoreListWithId.slice(
    (nowPage - 1) * viewListItemNum,
    nowPage * viewListItemNum,
  );

  return (
    <div className={`${styleSearchStore.gridMap} contentTopPosition`}>
      <section
        className={`${styleSearchStore.leftArea} ${isOpen ? styleSearchStore.open : ""}`}
      >
        <button
          className={styleSearchStore.btnViewList}
          onClick={() => setIsOpen(!isOpen)}
        ></button>
        <div className={styleSearchStore.filterArea}>
          <RegionSelector sidoList={sidoList} />
          <div className={styleSearchStore.filterBottomWrap}>
            <CategoryFilter mode="search" categories={categories} />
          </div>
          <div className={styleSearchStore.filterBottomArea}>
            <div className={styleSearchStore.btnWrap}>
              <button
                className={styleSearchStore.btnResetFilter}
                onClick={resetFilter}
              >
                초기화
              </button>
              <button
                className={styleSearchStore.btnSearch}
                onClick={onClickSearchBtn}
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <div className={styleSearchStore.storeListArea}>
          {viewStoreItems.length > 0 ? (
            <>
              <ul className={styleSearchStore.storeList}>
                {viewStoreItems.map((record) => (
                  <StoreItem store={record}/>
                ))}
              </ul>
              <Pagination
                nowPage={nowPage}
                totalItems={finalStoreListWithId.length}
                itemsPerPage={viewListItemNum}
                limitBlock={5}
                onPageChange={setNowPage}
              />
            </>
          ) : (
            <div className={styleSearchStore.noData}>
              조회된 맛집이 없습니다.
            </div>
          )}
        </div>
      </section>

      <section className={styleSearchStore.mapArea}>
        <button
          className={`${styleSearchStore.btnSearchArea} ${isMoved ? styleSearchStore.active : ""}`}
          onClick={() => handleSearchViewportArea()}
        >
          범위 내 재검색
        </button>
        <MapComponent
          storeList={finalStoreListWithId}
          lat={lat}
          lng={lng}
          setIsMoved={setIsMoved}
          isChangedRegion={isChangedRegion}
          positionAreaRef={positionAreaRef}
          isSelectedAll={isSelectedAll}
        />
      </section>
    </div>
  );
}

export default SearchStore;
