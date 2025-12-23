import { Link, useLocation, useNavigate } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import Pagination from "../Pagination";
import RegionModal from "./RegionModal";
import MapComponent from "./MapComponent";
import { GetStoreList } from "./GetStoreList";
import styleMain from "../../css/MainPage.module.css";
import useRegionSetting from "./hook/useRegionSetting";
import RegionFilter from "./RegionFilter";

function SearchStore({ storeCategories, sidoList }) {

    console.log(sidoList);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");

    // 커스텀 훅 도입 
    const { regionState, regionSetters, getCurrentLocation } = useRegionSetting();
    const { selectedDo, doName, selectedSi, siName, selectedDong, dongName, lat, lng, storeList } = regionState;
    const { setSelectedDo, setDoName, setSelectedSi, setSiName, setSelectedDong, setDongName, setLat, setLng } = regionSetters;

    //console.log("----------->", selectedDo, selectedSi, selectedDong);
    //console.log("----------->", doName, siName, dongName);

    const [filteredStoreList, setFilteredStoreList] = useState([]); // 화면에 표시될 최종 리스트
    const [storeListByRegion, setStoreListByRegion] = useState([]); // 지역/키워드 기준 원본 리스트
    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태

    const [isMoved, setIsMoved] = useState(false);
    const [isChangedRegion, setIsChangedRegion] = useState(false);
    const [positionArea, setPositionArea] = useState({
        swMinLat: 0, swMinLng: 0, neMaxLat: 0, neMaxLng: 0
    });

    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [isResetFilter, setIsResetFilter] = useState(false);

    // const foodIcons = {
    //     "한식": "🍚"
    //     ,"일식": "🍣"
    //     ,"양식": "🍝"
    //     ,"중식": "🥟"
    //     ,"아시안": "🍜"
    //     ,"햄버거": "🍔"
    //     ,"치킨": "🍗"
    //     ,"디저트": "🍩"
    // }

    // 현재 위치 기반 초기 로드
    // 훅 내부의 storeList가 변경될 때마다 반영
    useEffect(() => {
        if (storeList && storeList.length > 0) {
            setStoreListByRegion(storeList);
            setFilteredStoreList(storeList);
        }
    }, [storeList]); 

    useEffect(() => {
        const initLoad = async () => {

            const queryParams = new URLSearchParams(location.search);
            const sido = queryParams.get("sido");
            const sgg = queryParams.get("sgg");
            const dong = queryParams.get("dong");
            
            const paramDoName = queryParams.get("doName");
            const paramSiName = queryParams.get("siName");
            const paramDongName = queryParams.get("dongName");

            const paramCategories = queryParams.get("categories");

            // 2. 카테고리 배열 생성 (상태 업데이트와 별개로 변수에 담기)
            let categoryArray = [];
            if (paramCategories) {
                categoryArray = paramCategories.split(",");
                setSelectedCategories(categoryArray); // UI 체크 표시용
            }

            if(paramDongName){
                setDongName(paramDongName);
            }
            if(paramSiName){
                setSiName(paramSiName);
            }
            if(paramDoName){
                setDoName(paramDoName);
            }

            let list = [];

            //키워드 검색
            if (keyword) { 
                list = await GetStoreList(`http://localhost:3001/youtaste/search/store/keyword?name=${keyword}`);
            } 
            //메인페이지 필터 설정 
            else if (dong || sgg || sido) { 
                if (dong) {
                    list = await GetStoreList(`http://localhost:3001/youtaste/search/store/dong?dongCd=${dong}`);
                    setSelectedDong(dong); 
                    setSelectedSi(sgg);
                    setSelectedDo(sido);
                    console.log("여기", dong);
                } else if (sgg) {
                    list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${sgg}`);
                    setSelectedSi(sgg);
                    setSelectedDo(sido);
                } else if (sido) {
                    list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sido?sidoCd=${sido}`);
                    setSelectedDo(sido);
                } 
            } 
            else {
                //이미 선택된 지역명(doName)이나 리스트가 있다면 현재 위치로 초기화하지 않음
                if (doName !== "") {
                    return; 
                }
                //이름X, 파라미터X
                getCurrentLocation(); 
                return;
            } 

            // 4. 원본 데이터 저장 (검색이나 초기화 시 사용될 기준 데이터)
            setStoreListByRegion(list);

            // 5. 필터링 로직 (list 변수 그대로 사용)
            let filteredResult = list; // 새 변수에 할당하여 명확하게 처리
            if (categoryArray.length > 0) {
                console.log("필터링 적용 전 개수:", list.length);
                filteredResult = list.filter(record => categoryArray.includes(record.storeCatName));
                console.log("필터링 적용 후 개수:", filteredResult.length);
            }

            // 6. 최종 결과 반영
            setFilteredStoreList(filteredResult);
            setIsChangedRegion(true);
            setNowPage(1); // 검색 시 페이지 번호 초기화
        };
        initLoad();
    }, [location.search, keyword]); 

    // 필터링, 지도범위 적용 최종 맛집 리스트
    const finalStoreListWithId = useMemo(() => {
        if (!Array.isArray(filteredStoreList)) return [];
        return filteredStoreList.map(record => ({ "id": record.bplcSn, ...record }));
    }, [filteredStoreList]);

    // 범위 내 재검색 함수
    const displayViewPortMarkers = async (area) => {
        // area가 비어있는지 확인
        if (!area.swMinLat || area.swMinLat === 0) return;
        
        const { swMinLat, swMinLng, neMaxLat, neMaxLng } = area;
        if (swMinLat === 0) return; // 좌표가 0인 초기상태 방지

        try {
            const url = `http://localhost:3001/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`;
            let list = await GetStoreList(url);

            // 원본 리스트와 필터 리스트를 동시에 업데이트
            setStoreListByRegion(list);

            // 카테고리 필터가 있는 경우 적용 
            if (selectedCategories.length > 0) {
                list = list.filter(record => selectedCategories.includes(record.storeCatName));
            }

            setFilteredStoreList(list);
            setIsMoved(false); // 재검색 후 버튼 비활성화
            setNowPage(1);
        } catch (error) {
            console.error("범위 재검색 오류:", error);
        }
    };

    // 지역 선택 확정
    async function handleRegionConfirm() {
        let list = [];
        if (selectedDong) list = await GetStoreList(`http://localhost:3001/youtaste/search/store/dong?dongCd=${selectedDong}`);
        else if (selectedSi) list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${selectedSi}`);
        else if (selectedDo) list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sido?sidoCd=${selectedDo}`);
        else list = await GetStoreList(`http://localhost:3001/youtaste/search/store/all`);

        setStoreListByRegion(list);
        setIsDimmedMiddleOpen(false);
        setIsChangedRegion(true);

        setIsResetFilter(false);
    }

    // // 카테고리 클릭 핸들러
    // const onSelectCategory = (categoryName) => {
    //     setIsResetFilter(false);
    //     setSelectedCategories(prev => 
    //         prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
    //     );
    // };

    // 검색 버튼 클릭 (카테고리 필터 적용)
    const onClickSearchBtn = () => {
        if (selectedCategories.length === 0) {
            setFilteredStoreList(storeListByRegion);
        } else {
            const list = storeListByRegion.filter(record => selectedCategories.includes(record.storeCatName));
            setFilteredStoreList(list);
        }
        
        setIsChangedRegion(true);

        //map level 조절
        if((!selectedDo || !selectedSi) && !isResetFilter){
            setIsSelectedAll(true); //level 12
        } else {
            setIsSelectedAll(false); //level 7
        }

        setNowPage(1);
        setIsResetFilter(false);
        // URL 파라미터 제거
        navigate("/search/store", { replace: true });
    };

    //필터 초기화
    const resetFilter = () => {
        setSelectedCategories([]);
        setSelectedDo(null);
        setSelectedSi(null);
        setSelectedDong(null);
        setDoName(""); 
        setSiName(""); 
        setDongName("");

        // URL 파라미터 제거
        navigate("/search/store", { replace: true });

        getCurrentLocation();
        
        setIsMoved(false);
        setIsResetFilter(true);
        setIsSelectedAll(false);
        setIsChangedRegion(false); 
    };

    // 페이지네이션
    const [nowPage, setNowPage] = useState(1);
    const viewListItemNum = 10;
    const viewStoreItems = finalStoreListWithId.slice((nowPage - 1) * viewListItemNum, nowPage * viewListItemNum);

    console.log("?????????", viewStoreItems);


    return (
        <div className={`${styleSearchStore.gridMap} contentTopPosition`}>
            <div className={`${styleSearchStore.leftArea} ${isOpen ? styleSearchStore.open : ""}`}>
                <button className={styleSearchStore.btnViewList} onClick={() => setIsOpen(!isOpen)}></button>
                <div className={styleSearchStore.filterArea}>
                    <div className={styleSearchStore.filterTopWrap}>
                        <button className={`${styleSearchStore.btnRegion} ${styleMain.filterBtn}`} onClick={() => setIsDimmedMiddleOpen(true)}>
                            <span className={styleMain.filterIcon}>📍</span>
                            <span className={styleMain.filterText}>
                                {(doName || siName || dongName) ? `${doName} ${siName} ${dongName}` : "지역 선택"}
                            </span>
                            <span className={styleMain.arrowIcon}>▼</span>
                        </button>
                    </div>
                    <div className={styleSearchStore.filterBottomWrap}>
                        <RegionFilter 
                            storeCategories={storeCategories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            setIsResetFilter={setIsResetFilter}
                        />
                        {/* <ul className={styleSearchStore.categoryList}>
                            {storeCategories.map(record => (
                                <li key={record.StoreCatNo}>
                                    <button 
                                        className={selectedCategories.includes(record.storeCatName) ? styleSearchStore.active : ""} 
                                        onClick={() => onSelectCategory(record.storeCatName)}
                                    >
                                        <i className={styleSearchStore.categoryEmoji}>{foodIcons[record.storeCatName]}</i>
                                        {record.storeCatName}
                                    </button>
                                </li>
                            ))}
                        </ul> */}
                    </div>
                    <div className={styleSearchStore.filterBottomArea}>
                        <div className={styleSearchStore.btnWrap}>
                            <button className={styleSearchStore.btnResetFilter} onClick={resetFilter}>초기화</button>
                            <button className={styleSearchStore.btnSearch} onClick={onClickSearchBtn}>검색</button>
                        </div>
                    </div>
                </div>

                <div className={styleSearchStore.storeListArea}>
                    <ul className={styleSearchStore.storeList}>
                        {viewStoreItems.map(record => (
                            <li key={record.bplcSn} className={styleSearchStore.storeListItem}>
                                <Link to={`/search/storeDetail?storeId=${record.bplcSn}`} className={styleSearchStore.storeListLink}>
                                    <img className={styleSearchStore.storeImg} src={`http://localhost:3001/uploads/store/${record.bplcPhoto}`} alt="store" />
                                    <div className={styleSearchStore.storeInfo}>
                                        <h2 className={styleSearchStore.storeName}>{record.bplcNm}</h2>
                                        <div>
                                            <span className={styleSearchStore.storeRating}>{record.avg}</span>
                                            <span className={styleSearchStore.storeCategory}>{record.storeCatName}</span>
                                        </div>
                                        <span className={styleSearchStore.storeTime}><em>영업시간</em>{record.bgngTm}-{record.ddlnTm}</span>
                                        <span className={styleSearchStore.storeAddress}><em>주소</em>{record.address}</span>
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
                </div>
            </div>

            <div className={styleSearchStore.mapArea}>
                {/* 버튼 클릭 시 displayViewPortMarkers 호출 */}
                <button 
                    className={`${styleSearchStore.btnSearchArea} ${isMoved ? styleSearchStore.active : ""}`} 
                    onClick={() => displayViewPortMarkers(positionArea)}
                >
                    범위 내 재검색
                </button>
                <MapComponent 
                    storeList={finalStoreListWithId} 
                    lat={lat} lng={lng} 
                    setIsMoved={setIsMoved}
                    isChangedRegion={isChangedRegion} 
                    setPositionArea={setPositionArea}
                    isSelectedAll={isSelectedAll}
                />
            </div>

            {isDimmedMiddleOpen && (
                <RegionModal 
                    setIsModalOpen={setIsDimmedMiddleOpen}
                    selectedDo={selectedDo} setSelectedDo={setSelectedDo}
                    selectedSi={selectedSi} setSelectedSi={setSelectedSi}
                    selectedDong={selectedDong} setSelectedDong={setSelectedDong}
                    onConfirm={handleRegionConfirm}
                    setDoName={setDoName} setSiName={setSiName} setDongName={setDongName}
                    sidoList={sidoList}
                />
            )}
        </div>
    );
}

export default SearchStore;