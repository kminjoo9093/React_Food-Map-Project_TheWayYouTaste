import { useNavigate, useSearchParams } from "react-router-dom";
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
  useDongName,
  useFilterStore,
  useSelectedDong,
  useSelectedSgg,
  useSelectedSido,
  useSggName,
  useSidoName,
} from "../../store/filters";
import { useStoresByCondition } from "../../hooks/queries/useStoresByCondition";
import { useStoresByViewport } from "../../hooks/queries/useStoresByViewport";
import StoreItem from "../../components/StoreItem";
import { useSggCodeType } from "../../hooks/useSggCodeType";

function SearchStore() {
  const { categories, sidoList } = useContext(AppDataContext);
  const positionAreaRef = useRef({
    swMinLat: 0,
    swMinLng: 0,
    neMaxLat: 0,
    neMaxLng: 0,
  });

  // 페이지네이션
  const [nowPage, setNowPage] = useState(1);
  const viewListItemNum = 10;

  // url -> 실제 필터 적용, 검색, 데이터 요청에 활용
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const sidoFromUrl = searchParams.get("sido");
  const sggFromUrl = searchParams.get("sgg");
  const dongFromUrl = searchParams.get("dong");
  const categoriesFromUrl = searchParams.get("categories");
  const urlCategoryArray = useMemo(() => {
    return categoriesFromUrl ? categoriesFromUrl.split(",") : [];
  }, [categoriesFromUrl]);

  // zustand store -> select ui용 (임시 상태)
  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const sidoName = useSidoName();
  const sggName = useSggName();
  const dongName = useDongName();
  const selectedCategories = useFilterStore(
    (store) => store.selectedCategories,
  );

  console.log(selectedSido, selectedSgg, selectedDong);

  const setCategories = useFilterStore((store) => store.setCategories);
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
  const [searchMode, setSearchMode] = useState("district");
  const [isMoved, setIsMoved] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const hasQueryRegion = Boolean(sidoFromUrl || sggFromUrl || dongFromUrl);
  const { lat, lng, getCoords, regionData } = useInitLocationInfo({
    skip: !!hasQueryRegion,
  });

  const sggCode = useSggCodeType({ sidoFromUrl, sggFromUrl, dongFromUrl });

  //query 없는 상태로 컴포넌트 진입 시 현재 위치 기반 query 생성
  useEffect(() => {
    if (hasQueryRegion) return;
    if (!regionData) return;

    setIsMoved(false);

    setSearchParams({
      mode: "district",
      sido: selectedSido,
      sgg: selectedSgg,
      doName: sidoName,
      siName: sggName,
    });
  }, [
    hasQueryRegion,
    regionData,
    selectedSido,
    selectedSgg,
    sidoName,
    sggName,
    setSearchParams,
  ]);

  // storeList 데이터 요청
  const params = useMemo(
    () => ({
      keyword,
      sidoCode: sidoFromUrl,
      sggCode,
      dongCode: dongFromUrl,
    }),
    [keyword, sidoFromUrl, sggCode, dongFromUrl],
  );

  const { data: storeList = [], isLoading } = useStoresByCondition(params);
  const { data: viewportStoreList } = useStoresByViewport(viewport);

  // url 값 - zustand store 상태 동기화
  useEffect(() => {
    if (!hasQueryRegion) return;

    const nextRegion = mapQueryToRegion({
      sidoCode: sidoFromUrl,
      sggCode: sggFromUrl,
      dongCode: dongFromUrl,
      sidoName: searchParams.get("doName"),
      sggName: searchParams.get("siName"),
      dongName: searchParams.get("dongName"),
    });

    if (
      nextRegion.selectedSido !== selectedSido ||
      nextRegion.selectedSgg !== selectedSgg ||
      nextRegion.selectedDong !== selectedDong
    ) {
      setRegion(nextRegion);
    }

    //카테고리
    setCategories(urlCategoryArray);
  }, [
    hasQueryRegion,
    sidoFromUrl,
    sggFromUrl,
    dongFromUrl,
    searchParams,
    selectedSido,
    selectedSgg,
    selectedDong,
    setCategories,
    urlCategoryArray,
    setRegion,
  ]);

  // 범위 내 재검색 함수
  const handleSearchViewportArea = () => {
    const currentArea = positionAreaRef.current;
    if (!currentArea) return;

    setViewport(currentArea);
    setSearchParams({
      mode: "bounds",
      swMinLat: currentArea.swMinLat,
      swMinLng: currentArea.swMinLng,
      neMaxLat: currentArea.neMaxLat,
      neMaxLng: currentArea.neMaxLng,
    });

    setSearchMode("bounds");
    setIsMoved(false); // 재검색 후 버튼 비활성화
    setNowPage(1);
  };

  //데이터 결정
  const baseList = useMemo(() => {
    return searchMode === "bounds"
      ? (viewportStoreList ?? [])
      : (storeList ?? []);
  }, [searchMode, viewportStoreList, storeList]);

  //카테고리 필터링한 맛집 리스트
  const filteredStoreList = useMemo(() => {
    if (urlCategoryArray.length === 0) return baseList;

    return baseList.filter((record) =>
      urlCategoryArray.includes(String(record.storeCatNo)),
    );
  }, [baseList, urlCategoryArray]);

  // 필터링, 지도범위 적용 최종 맛집 리스트
  const finalStoreListWithId = useMemo(() => {
    if (!Array.isArray(filteredStoreList)) return [];
    return filteredStoreList.map((record) => ({
      id: record.bplcSn,
      ...record,
    }));
  }, [filteredStoreList]);

  //렌더링 될 맛집 리스트
  const viewStoreItems = finalStoreListWithId.slice(
    (nowPage - 1) * viewListItemNum,
    nowPage * viewListItemNum,
  );

  // 검색 버튼 클릭 (카테고리 필터 적용)
  const onClickSearchBtn = () => {
    setSearchMode("district");

    const nextParams = {};

    if (keyword) nextParams.keyword = keyword;
    if (selectedSido) {
      nextParams.sido = selectedSido;
      nextParams.doName = sidoName;
    }
    if (selectedSgg) {
      nextParams.sgg = selectedSgg;
      nextParams.siName = sggName;
    }
    if (selectedDong) {
      nextParams.dong = selectedDong;
      nextParams.dongName = dongName;
    }
    if (selectedCategories.length > 0) {
      nextParams.categories = selectedCategories.join(",");
    }

    setSearchParams(nextParams);

    //map level 조절
    if (!selectedSido) {
      setIsSelectedAll(true); //level 12
    } else {
      setIsSelectedAll(false); //level 7
    }

    //지도 idle 후 범위 내 재검색 버튼 숨기기
    setTimeout(() => {
      setIsMoved(false);
    }, 300);
  };

  // useEffect(() => {
  //   if (!hasQueryRegion) {
  //     getCoords();
  //   }
  // }, [hasQueryRegion, getCoords]);

  //필터 초기화
  const resetFilter = () => {
    resetRegion();
    resetCategories();

    setSearchParams({});

    setIsMoved(false);
    setIsSelectedAll(false);
    setSearchMode("district");
  };

  useEffect(() => {
    if (nowPage !== 1) {
      setNowPage(1); // 검색 시 페이지 번호 초기화
    }
  }, [filteredStoreList, nowPage]);

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
          <RegionSelector
            sidoList={sidoList}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            setIsMoved={setIsMoved}
          />
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
                disabled={searchMode === "bounds"}
                className={styleSearchStore.btnSearch}
                onClick={onClickSearchBtn}
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <div className={styleSearchStore.storeListArea}>
          {!isLoading && viewStoreItems.length > 0 ? (
            <>
              <ul className={styleSearchStore.storeList}>
                {viewStoreItems.map((record) => (
                  <StoreItem key={record.bplcSn} store={record} />
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
          searchMode={searchMode}
          positionAreaRef={positionAreaRef}
          isSelectedAll={isSelectedAll}
          hasQueryRegion={hasQueryRegion}
        />
      </section>
    </div>
  );
}

export default SearchStore;
