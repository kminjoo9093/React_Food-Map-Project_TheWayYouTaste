import { Link, useLocation, useNavigate } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Pagination from "../Pagination";
import RegionModal from "./RegionModal";
import MapComponent from "./MapComponent";
import { GetStoreList } from "./GetStoreList";
import styleMain from "../../css/MainPage.module.css";
import useRegionSetting from "./hook/useRegionSetting";
import CategoryFilter from "./CategoryFilter";
import serverUrl from "../../db/server.json";

function SearchStore({ storeCategories, sidoList, regionState={}, regionSetters={}, getCurrentLocation}) {

    const positionAreaRef = useRef({
        swMinLat: 0,
        swMinLng: 0,
        neMaxLat: 0,
        neMaxLng: 0
    });

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");
    
    // 커스텀 훅 도입 
    const { selectedDo, doName, selectedSi, siName, selectedDong, dongName, lat, lng, storeList } = regionState;
    const { setSelectedDo, setDoName, setSelectedSi, setSiName, setSelectedDong, setDongName, setLat, setLng } = regionSetters;
    //const { regionState, regionSetters, getCurrentLocation } = useRegionSetting();
    // const { selectedDo, doName, selectedSi, siName, selectedDong, dongName, lat, lng, storeList } = regionState;
    // const { setSelectedDo, setDoName, setSelectedSi, setSiName, setSelectedDong, setDongName, setLat, setLng } = regionSetters;
    const SERVER_URL = serverUrl.SERVER_URL;

    // 1. 상태 선언 (초기값은 부모가 준 값)
    // const [lat, setLat] = useState(initialLat);
    // const [lng, setLng] = useState(initialLng);
    
    // // 지역 이름 상태 (초기값이 필요한 경우)
    // const [doName, setDoName] = useState("");
    // const [siName, setSiName] = useState("");
    // const [dongName, setDongName] = useState("");
    
    // // 지역 코드 상태
    // const [selectedDo, setSelectedDo] = useState(null);
    // const [selectedSi, setSelectedSi] = useState(null);
    // const [selectedDong, setSelectedDong] = useState(null);

    //-----------------------------------------

    const [filteredStoreList, setFilteredStoreList] = useState([]); // 화면에 표시될 최종 리스트
    const [storeListByRegion, setStoreListByRegion] = useState([]); // 지역/키워드 기준 원본 리스트
    const [selectedCategories, setSelectedCategories] = useState([]); //선택 카테고리(임시)
    const [appliedCategories, setAppliedCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태

    const [isMoved, setIsMoved] = useState(false);
    const [isChangedRegion, setIsChangedRegion] = useState(false);
    const [positionArea, setPositionArea] = useState({
        swMinLat: 0, swMinLng: 0, neMaxLat: 0, neMaxLng: 0
    });

    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [isResetFilter, setIsResetFilter] = useState(false);
    const [isSearchArea, setIsSearchArea] = useState(false);


    // 2. [추가] URL 파라미터에서 직접 이름을 추출 (Props가 늦을 때를 대비)
    const urlDoName = queryParams.get("doName");
    const urlSiName = queryParams.get("siName");
    const urlDongName = queryParams.get("dongName");

    // 3. 화면에 표시할 최종 이름 결정 (URL에 있으면 URL꺼, 없으면 Props꺼)
    const displayDoName = urlDoName || doName || "";
    const displaySiName = urlSiName || siName || "";
    const displayDongName = urlDongName || dongName || "";


    // 2. [중요] 부모로부터 lat, lng가 뒤늦게 도착했을 때 처리
    // useEffect(() => {
    //     if (initialLat && initialLng && !lat) { // 처음 한 번만 설정
    //         setLat(initialLat);
    //         setLng(initialLng);
    //     }
    // }, [initialLat, initialLng]);



    // 현재 위치 기반 초기 로드
    // 훅 내부의 storeList가 변경될 때마다 반영
    useEffect(() => {
        if (storeList && storeList.length > 0) {
            setStoreListByRegion(storeList);
            setFilteredStoreList(storeList);
        }
    }, [storeList]); 



    // 부모가 넘겨준 regionState에 이름이 생기면, 내부 상태로 강제 동기화
    useEffect(() => {
        if (doName) setDoName(doName);
        if (siName) setSiName(siName);
        if (dongName) setDongName(dongName);
    }, [doName, siName, dongName]); // 부모 Props의 이름들이 바뀌면 실행



    // useEffect(() => {
    //     const initLoad = async () => {
    //         const queryParams = new URLSearchParams(location.search);

    //         // const keyword = queryParams.get("keyword");

    //         //현재 위치
    //        // URL에 좌표 파라미터가 있다면 우선순위 적용
    //         const paramLat = queryParams.get("lat");
    //         const paramLng = queryParams.get("lng");
    //         if (paramLat && paramLng) {
    //             setLat(parseFloat(paramLat));
    //             setLng(parseFloat(paramLng));
    //         }

    //         //지역 필터
    //         const sido = queryParams.get("sido");
    //         const sgg = queryParams.get("sgg");
    //         const dong = queryParams.get("dong");
            
    //         const paramDoName = queryParams.get("doName");
    //         const paramSiName = queryParams.get("siName");
    //         const paramDongName = queryParams.get("dongName");

    //         if(paramDongName){
    //             setDongName(paramDongName);
    //         }
    //         if(paramSiName){
    //             setSiName(paramSiName);
    //         }
    //         if(paramDoName){
    //             setDoName(paramDoName);
    //         }

    //         //카테고리
    //         const paramCategories = queryParams.get("categories");

    //         let categoryArray = [];
    //         if (paramCategories) {
    //             categoryArray = paramCategories.split(",");
    //             setSelectedCategories(categoryArray); // UI 체크 표시용
    //         }

    //         let list = []; //맛집 목록

    //         //키워드 검색
    //         if (keyword) { 
    //             list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/keyword?name=${keyword}`);
    //         } 
    //         //메인페이지 필터 설정 
    //         else if (dong || sgg || sido) { 
    //             if (dong) {
    //                 list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/dong?dongCd=${dong}`);
    //                 setSelectedDong(dong); 
    //                 setSelectedSi(sgg);
    //                 setSelectedDo(sido);
    //             } else if (sgg) {
    //                 list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/sgg?sggCd=${sgg}`);
    //                 setSelectedSi(sgg);
    //                 setSelectedDo(sido);
    //             } else if (sido) {
    //                 list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/sido?sidoCd=${sido}`);
    //                 setSelectedDo(sido);
    //             } 
    //         } else {
    //             if (selectedDong || selectedSi || selectedDo) {
    //                 const targetCd = selectedDong || selectedSi || selectedDo;
    //                 const type = selectedDong ? 'dong' : (selectedSi ? 'sgg' : 'sido');
    //                 list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/${type}?${type}Cd=${targetCd}`);
    //             } else {
    //                 // 정말 아무 정보도 없다면 현재 위치 잡기
    //                 getCurrentLocation();
    //                 return; 
    //             }
    //             // if (lat && lng) {
    //             //     // 여기서 부모 좌표 기반으로 리스트를 가져오는 API 호출 (예: /search/store/around)
    //             //     // 만약 useRegionSetting의 getCurrentLocation 내부 로직이 필요하다면
    //             //     // 해당 fetch 부분만 함수로 빼서 여기서 실행하세요.
    //                 // getCurrentLocation(); 
    //             // }
    //             // return;
    //         } 

    //         if(list.length > 0){
    //             // 원본 데이터 저장 (검색이나 초기화 시 사용될 기준 데이터)
    //             setStoreListByRegion(list);

    //             // 필터링 로직 (list 변수 그대로 사용)
    //             let filteredResult = list; // 새 변수에 할당하여 명확하게 처리
    //             if (categoryArray.length > 0) {
    //                 filteredResult = list.filter(record => categoryArray.includes(record.storeCatName));
    //             }

                
    //             // 6. 최종 결과 반영
    //             setFilteredStoreList(filteredResult);
    //             setIsChangedRegion(true);
    //             setNowPage(1); // 검색 시 페이지 번호 초기화
    //         }
    //     };
    //     initLoad();
    // }, [location.search, keyword]); 

    //리스트 갱신
    
    

    useEffect(() => {
    const initLoad = async () => {
        const queryParams = new URLSearchParams(location.search);

        // 1. URL 파라미터 우선 확인
        const paramLat = queryParams.get("lat");
        const paramLng = queryParams.get("lng");
        const paramDoName = queryParams.get("doName");
        const paramSiName = queryParams.get("siName");
        const paramDongName = queryParams.get("dongName");
        const sido = queryParams.get("sido");
        const sgg = queryParams.get("sgg");
        const dong = queryParams.get("dong");

        // 2. URL에 이름 정보가 있다면 Setter 호출 (부모 상태 업데이트)
        if (paramDongName) setDongName(paramDongName);
        if (paramSiName) setSiName(paramSiName);
        if (paramDoName) setDoName(paramDoName);
        if (paramLat && paramLng) {
            setLat(parseFloat(paramLat));
            setLng(parseFloat(paramLng));
        }

        //카테고리
        const paramCategories = queryParams.get("categories");

        let categoryArray = [];
        if (paramCategories) {
            categoryArray = paramCategories.split(",");
            setSelectedCategories(categoryArray); // UI 체크 표시용
        }

        let list = [];

        // 3. 데이터 로딩 우선순위 결정
        if (keyword) {
            list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/keyword?name=${keyword}`);
        } 
        // URL에 지역 코드가 있는 경우
        else if (dong || sgg || sido) {
            if (dong) {
                list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/dong?dongCd=${dong}`);
                setSelectedDong(dong); setSelectedSi(sgg); setSelectedDo(sido);
            } else if (sgg) {
                list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/sgg?sggCd=${sgg}`);
                setSelectedSi(sgg); setSelectedDo(sido);
            } else if (sido) {
                list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/sido?sidoCd=${sido}`);
                setSelectedDo(sido);
            }
        } 
        // ★ [여기가 핵심] URL엔 없지만 부모 Props(regionState)에 이미 지역 코드가 있는 경우
        else if (selectedDong || selectedSi || selectedDo) {
            const code = selectedDong || selectedSi || selectedDo;
            const type = selectedDong ? 'dong' : (selectedSi ? 'sgg' : 'sido');
            list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/${type}?${type}Cd=${code}`);
        } 
        // 정말 아무것도 없다면 현재 위치 잡기
        else {
            getCurrentLocation();
            return; 
        }

        // 4. 결과가 있다면 상태 반영
        if (list && list.length > 0) {
            setStoreListByRegion(list);
            setFilteredStoreList(list);
            setIsChangedRegion(true); // 지도를 해당 위치로 이동시킴
            setNowPage(1);
        }
    };

    initLoad();
}, [location.search, keyword]); // [주의] selectedDong 등을 의존성에 넣으면 무한루프 위험이 있으니 주소창 변경 시에만 작동하게 합니다.


    
    
    useEffect(() => {
        if (!storeListByRegion) return;

        if (selectedCategories.length === 0) {
            
            setFilteredStoreList(storeListByRegion);
        } else {
            setFilteredStoreList(
                storeListByRegion.filter(record =>
                    appliedCategories.includes(record.storeCatName)
                )
            );
        }

        // setIsChangedRegion(true);
        setNowPage(1);
    }, [storeListByRegion, appliedCategories]);

    // 필터링, 지도범위 적용 최종 맛집 리스트
    const finalStoreListWithId = useMemo(() => {
        if (!Array.isArray(filteredStoreList)) return [];
        return filteredStoreList.map(record => ({ "id": record.bplcSn, ...record }));
    }, [filteredStoreList]);

    // 범위 내 재검색 함수
    const displayViewPortMarkers = useCallback( async (area) => {
        
        setIsSearchArea(true);

        // area가 비어있는지 확인
        if (!area || area.swMinLat === 0) return;
        
        const { swMinLat, swMinLng, neMaxLat, neMaxLng } = area;
        if (swMinLat === 0) return; // 좌표가 0인 초기상태 방지

        try {
            // 지역변경x, 현재 화면에서 찾는 것임을 명시
            setIsChangedRegion(false);

            const url = `${SERVER_URL}/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`;
            let list = await GetStoreList(url);

            // 데이터가 없을 경우 처리
            if (!list) return;

            // 원본 리스트와 필터 리스트를 동시에 업데이트
            setStoreListByRegion(list);

            setIsMoved(false); // 재검색 후 버튼 비활성화
            setNowPage(1);
        } catch (error) {
            console.error("범위 재검색 오류:", error);
        }
    }, [selectedCategories, SERVER_URL]);

    // 지역 선택 확정
    async function handleRegionConfirm() {
        let list = [];
        if (selectedDong) list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/dong?dongCd=${selectedDong}`);
        else if (selectedSi) list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/sgg?sggCd=${selectedSi}`);
        else if (selectedDo) list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/sido?sidoCd=${selectedDo}`);
        else list = await GetStoreList(`${SERVER_URL}/youtaste/search/store/all`);

        setStoreListByRegion(list);
        setIsDimmedMiddleOpen(false);
        setIsChangedRegion(true);

        setIsResetFilter(false);
        setIsSearchArea(false);
    }

    // 검색 버튼 클릭 (카테고리 필터 적용)
    const onClickSearchBtn = () => {
        setAppliedCategories([...selectedCategories]); //적용되는 카테고리 리스트로 복사

        //map level 조절
        if((!selectedDo || !selectedSi) && !isResetFilter){
            setIsSelectedAll(true); //level 12
        } else {
            setIsSelectedAll(false); //level 7
        }

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

        setIsSearchArea(false);
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

    return (
        <div className={`${styleSearchStore.gridMap} contentTopPosition`}>
            <div className={`${styleSearchStore.leftArea} ${isOpen ? styleSearchStore.open : ""}`}>
                <button className={styleSearchStore.btnViewList} onClick={() => setIsOpen(!isOpen)}>&nbsp;</button>
                <div className={styleSearchStore.filterArea}>
                    <div className={styleSearchStore.filterTopWrap}>
                        <button className={`${styleSearchStore.btnRegion} ${styleMain.filterBtn}`} onClick={() => setIsDimmedMiddleOpen(true)}>
                            <span className={styleMain.filterIcon}>📍</span>
                            <span className={styleMain.filterText}>
                                {isSearchArea ? "범위 내" : (displayDoName || displaySiName || displayDongName) ? `${displayDoName} ${displaySiName} ${displayDongName}` : "지역 선택"}
                            </span>
                            <span className={styleMain.arrowIcon}>▼</span>
                        </button>
                    </div>
                    <div className={styleSearchStore.filterBottomWrap}>
                        <CategoryFilter 
                            mode="search"
                            storeCategories={storeCategories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            setIsResetFilter={setIsResetFilter}
                        />
                    </div>
                    <div className={styleSearchStore.filterBottomArea}>
                        <div className={styleSearchStore.btnWrap}>
                            <button className={styleSearchStore.btnResetFilter} onClick={resetFilter}>초기화</button>
                            <button className={styleSearchStore.btnSearch} onClick={onClickSearchBtn}>검색</button>
                        </div>
                    </div>
                </div>

                <div className={styleSearchStore.storeListArea}>
                    {viewStoreItems.length > 0 ? (
                        <>
                            <ul className={styleSearchStore.storeList}>
                                {
                                    viewStoreItems.map(record => (
                                    <li key={record.bplcSn} className={styleSearchStore.storeListItem}>
                                        <Link to={`/search/storeDetail?storeId=${record.bplcSn}`} className={styleSearchStore.storeListLink}>
                                            <img className={styleSearchStore.storeImg} src={`${SERVER_URL}/uploads/store/${record.bplcPhoto}`} alt="store" />
                                            <div className={styleSearchStore.storeInfo}>
                                                <h2 className={styleSearchStore.storeName}>{record.bplcNm}</h2>
                                                <div className={styleSearchStore.avgNCat}>
                                                    <span className={styleSearchStore.storeRating}>{record.avg}</span>
                                                    <span className={styleSearchStore.storeCategory}>{record.storeCatName}</span>
                                                </div>
                                                <span className={styleSearchStore.storeTime}>{record.bgngTm}-{record.ddlnTm}</span>
                                                <span className={styleSearchStore.storeAddress}>{record.address}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    ))
                                }
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
            </div>

            <div className={styleSearchStore.mapArea}>
                 <button 
                    className={`${styleSearchStore.btnSearchArea} ${isMoved ? styleSearchStore.active : ""}`} 
                    onClick={() => displayViewPortMarkers(positionAreaRef.current)}
                >
                    범위 내 재검색
                </button>
                <MapComponent 
                    storeList={finalStoreListWithId} 
                    lat={lat} lng={lng} 
                    setIsMoved={setIsMoved}
                    isChangedRegion={isChangedRegion} 
                    setPositionArea={setPositionArea}
                    positionAreaRef={positionAreaRef} 
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