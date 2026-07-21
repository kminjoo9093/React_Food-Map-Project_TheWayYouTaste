import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Pagination from "../Pagination";
import MapComponent from "../../components/MapComponent";
import useInitLocationInfo from "../../hooks/useInitLocationInfo";
import { useAppData } from "../../context/AppDataProvider";
import RegionSelector from "../../components/RegionSelector";
import {
  useDongName,
  useFilterStore,
  useSelectedCategories,
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
import { Viewport } from "../../types/types";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import CategoryFilter from "../../components/CategoryFilter";
import { RegionState } from "../../types/region.types";

const LIST_ITEM_NUM = 10;

function SearchStore() {
  const { categories, sidoList } = useAppData();
  const { query, setQuery } = useSearchQuery();

  const positionAreaRef = useRef<Viewport>({
    swMinLat: 0,
    swMinLng: 0,
    neMaxLat: 0,
    neMaxLng: 0,
  });
  const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태

  // 페이지네이션
  const [nowPage, setNowPage] = useState(1);

  // zustand store -> select ui용 (임시 상태)
  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const sidoName = useSidoName();
  const sggName = useSggName();
  const dongName = useDongName();
  const selectedCategories = useSelectedCategories();

  const setCategories = useFilterStore((store) => store.setCategories);
  const resetRegion = useFilterStore((store) => store.resetRegion);
  const resetCategories = useFilterStore((store) => store.resetCategories);
  const setRegion = useFilterStore((store) => store.setRegion);
  const isInitialized = useRef(false);

  const mapQueryToRegion = useCallback(
    (q: typeof query): RegionState => ({
      selectedSido: q.sido,
      selectedSgg: q.sgg,
      selectedDong: q.dong,
      sidoName: q.sidoName ?? "",
      sggName: q.sggName ?? "",
      dongName: q.dongName ?? "",
    }),
    [],
  );

  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [viewportCoords, setViewportCoords] = useState<Viewport | null>(null); // viewport 상태를 별도로 관리
  const [isMoved, setIsMoved] = useState(false);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const isBoundsMode = query.mode === "bounds";
  const hasQueryRegion =
    Boolean(query.sido || query.sgg || query.dong) || isBoundsMode;
  const [searchMode, setSearchMode] = useState(query.mode || "district");

  // 마운트 시 한 번만 URL에서 읽어서 설정
  const [restoredBounds] = useState<Viewport | null>(() => {
    if (query.mode !== "bounds") return null;
    return {
      swMinLat: query.swMinLat ?? 0,
      swMinLng: query.swMinLng ?? 0,
      neMaxLat: query.neMaxLat ?? 0,
      neMaxLng: query.neMaxLng ?? 0,
    };
  });

  useEffect(() => {
    if (query.mode !== "bounds") return;

    const bounds = {
      swMinLat: query.swMinLat ?? 0,
      swMinLng: query.swMinLng ?? 0,
      neMaxLat: query.neMaxLat ?? 0,
      neMaxLng: query.neMaxLng ?? 0,
    };

    setSearchMode("bounds");
    setViewport(bounds);
    setViewportCoords(bounds);
  }, [
    query.mode,
    query.swMinLat,
    query.swMinLng,
    query.neMaxLat,
    query.neMaxLng,
  ]);

  const { coords, getCoords, regionData } = useInitLocationInfo({
    skip: !!hasQueryRegion,
  });

  const sggCode = useSggCodeType({
    sidoFromUrl: query.sido !== null ? String(query.sido) : null,
    sggFromUrl: query.sgg !== null ? String(query.sgg) : null,
    dongFromUrl: query.dong !== null ? String(query.dong) : null,
  });

  //query 없는 상태로 컴포넌트 진입 시 현재 위치 기반 query 생성
  useEffect(() => {
    if (hasQueryRegion) return;
    if (!regionData) return;
    if (sidoName === "전국") return;

    setIsMoved(false);

    setQuery({
      mode: "district",
      sido: selectedSido,
      sgg: selectedSgg,
      sidoName: sidoName,
      sggName: sggName,
    });
  }, [
    hasQueryRegion,
    regionData,
    selectedSido,
    selectedSgg,
    sidoName,
    sggName,
    setQuery,
  ]);

  // storeList 데이터 요청
  const params: {
    keyword: string | undefined;
    sidoCode: number | undefined;
    sggCode: number | undefined;
    dongCode: number | undefined;
  } = useMemo(
    () => ({
      keyword: query.keyword ?? undefined,
      sidoCode: query.sido ?? undefined,
      sggCode: sggCode ?? undefined,
      dongCode: query.dong ?? undefined,
    }),
    [query.keyword, query.sido, sggCode, query.dong],
  );

  const { data: storeList = [], isLoading } = useStoresByCondition(params);
  const { data: viewportStoreList } = useStoresByViewport(viewport);

  // url 값 -> zustand store 상태 동기화 (메인에서 선택한 상태)
  useEffect(() => {
    if (!hasQueryRegion) return;
    if (isInitialized.current) return;

    const nextRegion = mapQueryToRegion(query);

    if (
      nextRegion.selectedSido !== selectedSido ||
      nextRegion.selectedSgg !== selectedSgg ||
      nextRegion.selectedDong !== selectedDong
    ) {
      setRegion(nextRegion);
    }

    setCategories(query.categories ?? []);

    isInitialized.current = true;
  }, [
    hasQueryRegion,
    query,
    mapQueryToRegion,
    selectedSido,
    selectedSgg,
    selectedDong,
    setCategories,
    setRegion,
  ]);

  // 범위 내 재검색 함수
  const handleSearchViewportArea = () => {
    const currentArea = positionAreaRef.current;
    if (!currentArea) return;

    setViewportCoords(currentArea); // 좌표 상태만 업데이트
    setSearchMode("bounds");
    setIsMoved(false); // 재검색 후 버튼 비활성화
  };

  // bounds 모드 : 좌표/카테고리 수정 (URL 반영)
  const updateBoundsQuery = useCallback(
    (coords: Viewport) => {
      setQuery({
        mode: "bounds",
        swMinLat: coords.swMinLat,
        swMinLng: coords.swMinLng,
        neMaxLat: coords.neMaxLat,
        neMaxLng: coords.neMaxLng,
        categories: selectedCategories,
      });
    },
    [selectedCategories, setQuery],
  );

  useEffect(() => {
    if (!viewportCoords) return;
    updateBoundsQuery(viewportCoords);
    // viewport 상태 업데이트 (React Query 쿼리 자동 실행)
    setViewport(viewportCoords);
  }, [viewportCoords, updateBoundsQuery]);

  const onClickSearchBtn = () => {
    if (searchMode === "bounds") {
      if (viewportCoords) updateBoundsQuery(viewportCoords);
      return;
    }

    //district 모드: 이전 bounds 좌표가 섞이면 안 되므로 replace
    setSearchMode("district");
    setQuery({
      mode: "district",
      keyword: query.keyword,
      sido: selectedSido,
      sidoName,
      sgg: selectedSgg,
      sggName,
      dong: selectedDong,
      dongName,
      categories: selectedCategories,
    });
    setViewport(null);
    setViewportCoords(null);

    if (!selectedSido) {
      // map level control
      setIsSelectedAll(true);
    } else {
      setIsSelectedAll(false);
    }

    setTimeout(() => {
      setIsMoved(false);
    }, 300);
  };

  useEffect(() => {
    if (!hasQueryRegion) {
      getCoords();
    }
  }, [hasQueryRegion, getCoords]);

  //데이터 결정
  const baseList = useMemo(() => {
    return searchMode === "bounds"
      ? (viewportStoreList ?? [])
      : (storeList ?? []);
  }, [searchMode, viewportStoreList, storeList]);

  //카테고리 필터링한 맛집 리스트
  const filteredStoreList = useMemo(() => {
    if (query.categories.length === 0) return baseList;

    return baseList.filter((record) =>
      query.categories.includes(record.storeCatNo),
    );
  }, [baseList, query.categories]);

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
    (nowPage - 1) * LIST_ITEM_NUM,
    nowPage * LIST_ITEM_NUM,
  );

  //필터 초기화
  const resetFilter = () => {
    resetRegion();
    resetCategories();

    if (regionData) {
      setRegion({
        selectedSido: regionData.sidoCode,
        selectedSgg: regionData.sggCode,
        selectedDong: null,
        sidoName: regionData.sidoName,
        sggName: regionData.sggName,
        dongName: "",
      });

      setQuery({
        mode: "district",
        sido: regionData.sidoCode,
        sgg: regionData.sggCode,
        sidoName: regionData.sidoName,
        sggName: regionData.sggName,
      });
    } else {
      setQuery({});
    }

    setIsMoved(false);
    setIsSelectedAll(false);
    setSearchMode("district");

    setViewport(null);
    setViewportCoords(null);
  };

  useEffect(() => {
    setNowPage(1); // 검색 시 페이지 번호 초기화
  }, [filteredStoreList]);

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
                itemsPerPage={LIST_ITEM_NUM}
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
          lat={coords?.lat}
          lng={coords?.lng}
          setIsMoved={setIsMoved}
          searchMode={query.mode || "district"}
          positionAreaRef={positionAreaRef}
          isSelectedAll={isSelectedAll}
          hasQueryRegion={hasQueryRegion}
          restoredBounds={restoredBounds}
        />
      </section>
    </div>
  );
}

export default SearchStore;
