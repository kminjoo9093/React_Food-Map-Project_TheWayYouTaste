import { Link, useLocation, useNavigate } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Pagination from "../Pagination";
import MapComponent from "./MapComponent";
import CategoryFilter from "../../components/CategoryFilter";
import serverUrl from "../../db/server.json";
import useInitLocationInfo from "../../hooks/useInitLocationInfo";
import { useContext } from "react";
import { AppDataContext } from "../../context/AppDataProvider";
import RegionSelector from "../../components/RegionSelector";
import {
  useCategories,
  useCategoryActions,
  useFilterReset,
  useFilterStore,
  useRegionCode,
} from "../../store/filters";
import { useStoresByCondition } from "../../hooks/queries/useStoresByCondition";
import { useStoresByViewport } from "../../hooks/queries/useStoresByViewport";
import { useGeolocation } from "../../hooks/useGeolocation";

function SearchStore() {
  const { categories, sidoList } = useContext(AppDataContext);
  const positionAreaRef = useRef({
    swMinLat: 0,
    swMinLng: 0,
    neMaxLat: 0,
    neMaxLng: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  // const { lat, lng, getLocation } = useGeolocation();
  const { selectedSido, selectedSgg, selectedDong } = useRegionCode();
  const { selectedCategories, appliedCategories } = useCategories();
  const { setCategories, applyCategories } = useCategoryActions();
  const { resetRegion, resetCategories } = useFilterReset();
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

  const SERVER_URL = serverUrl.SERVER_URL;
  const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태

  const [isMoved, setIsMoved] = useState(false);
  const [isChangedRegion, setIsChangedRegion] = useState(false);

  // const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isResetFilter, setIsResetFilter] = useState(false);
  const [isSearchViewport, setIsSearchViewport] = useState(false);

  //지도 검색 페이지에서 초기 sgg기반 리스트
  useInitLocationInfo();

  // URL에서 카테고리 가져오기
  const paramCategories = queryParams.get("categories");

  // URL에 있으면 배열로 변환, 없으면 빈 배열
  const urlCategoryArray = useMemo(() => {
    return paramCategories ? paramCategories.split(",") : [];
  }, [paramCategories]);

  //fetch -> query storeList 요청
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
    setRegion(
      mapQueryToRegion({
        sidoCode: queryParams.get("sido"),
        sggCode: queryParams.get("sgg"),
        dongCode: queryParams.get("dong"),
        sidoName: queryParams.get("doName"),
        sggName: queryParams.get("siName"),
        dongName: queryParams.get("dongName"),
      }),
    );

    //카테고리
    if (urlCategoryArray.length > 0) {
      setCategories(urlCategoryArray);
      applyCategories(urlCategoryArray);
    }
  }, [location.search]);

  useEffect(() => {
    setNowPage(1); // 검색 시 페이지 번호 초기화
  }, [filteredStoreList]);

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

    return baseList.filter((record) =>
      appliedCategories.includes(record.storeCatName),
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
    if (!selectedSido || (selectedSido && !selectedSgg)) {
      //&& !isResetFilter
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
    // setIsResetFilter(true);
    setIsSelectedAll(false);
    setIsChangedRegion(true);

    getLocation();
  };

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
          <RegionSelector
            sidoList={sidoList}
            // mode="main"
          />
          <div className={styleSearchStore.filterBottomWrap}>
            <CategoryFilter
              mode="search"
              categories={categories}
              // setIsResetFilter={setIsResetFilter}
            />
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
                  <li
                    key={record.bplcSn}
                    className={styleSearchStore.storeListItem}
                  >
                    <Link
                      to={`/store/storeDetail?storeId=${record.bplcSn}`}
                      className={styleSearchStore.storeListLink}
                    >
                      <img
                        className={styleSearchStore.storeImg}
                        // src={`${SERVER_URL}${record.bplcPhoto}`}
                        src={
                          record.bplcPhoto
                            ? `${SERVER_URL}${record.bplcPhoto}`
                            : "/default.png"
                        }
                        alt="store"
                      />
                      <div className={styleSearchStore.storeInfo}>
                        <h2 className={styleSearchStore.storeName}>
                          {record.bplcNm}
                        </h2>
                        <div className={styleSearchStore.avgNCat}>
                          <span className={styleSearchStore.storeRating}>
                            {record.avg}
                          </span>
                          <span className={styleSearchStore.storeCategory}>
                            {record.storeCatName}
                          </span>
                        </div>
                        <span className={styleSearchStore.storeTime}>
                          {record.bgngTm}-{record.ddlnTm}
                        </span>
                        <span className={styleSearchStore.storeAddress}>
                          {record.address}
                        </span>
                      </div>
                    </Link>
                  </li>
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
