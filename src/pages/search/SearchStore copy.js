import { Link, useLocation, useNavigate } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import Pagination from "../Pagination";
import RegionModal from "./RegionModal";
import MapComponent from "./MapComponent";
import { GetStoreList } from "./GetStoreList";
import styleMain from "../../css/MainPage.module.css";
import imgSushi from "../../resources/img/search/imgSushi.jpg";

function SearchStore({ storeCategories, sidoList }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");

    const [filteredStoreList, setFilteredStoreList] = useState([]); // 화면에 표시될 최종 리스트
    const [storeListByRegion, setStoreListByRegion] = useState([]); // 지역/키워드 기준 원본 리스트
    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [isOpen, setIsOpen] = useState(false); //모달 오픈 상태

    // 지역 및 위치 상태
    const [lat, setLat] = useState(37.5665); //서울로 바꾸기
    const [lng, setLng] = useState(126.9780);
    const [isMoved, setIsMoved] = useState(false);
    const [isChangedRegion, setIsChangedRegion] = useState(false);
    const [positionArea, setPositionArea] = useState({
        swMinLat: 0, swMinLng: 0, neMaxLat: 0, neMaxLng: 0
    });

    const [selectedDo, setSelectedDo] = useState(null); //code
    const [doName, setDoName] = useState("");
    const [selectedSi, setSelectedSi] = useState(null); //code
    const [siName, setSiName] = useState("");
    const [selectedDong, setSelectedDong] = useState(null); //code
    const [dongName, setDongName] = useState("");
    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
    const [isSelectedAll, setIsSelectedAll] = useState(false);

    const [isResetFilter, setIsResetFilter] = useState(false);

    const foodIcons = {
        "한식": "🍚"
        ,"일식": "🍣"
        ,"양식": "🍝"
        ,"중식": "🥟"
        ,"아시안": "🍜"
        ,"햄버거": "🍔"
        ,"치킨": "🍗"
        ,"디저트": "🍩"
    }

    const LOCAL_API_KEY = "bd23a565a07fd608d593c2c99d192e8f";

    // 현재 위치 기반 초기 로드
    const getCurrentLocation = useCallback(async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLng(longitude);

                let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
                const headers = { Authorization: `KakaoAK ${LOCAL_API_KEY}` };

                try {
                    const response = await fetch(localUrl, { headers });
                    const data = await response.json();
                    const currentSggCode = data.documents[0].code.slice(0, 5);
                    const currentSidoCode = currentSggCode.slice(0, 2);

                    const listBySgg = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${currentSggCode}`);
                    setStoreListByRegion(listBySgg);
                    setFilteredStoreList(listBySgg);
                    setSelectedDo(currentSidoCode);
                    setSelectedSi(currentSggCode);
                } catch (error) {
                    console.error('위치 정보 로드 실패: ', error);
                }
            });
        }
    }, []);

    // 초기 진입 및 검색어 처리
    useEffect(() => {
        const initLoad = async () => {

            const queryParams = new URLSearchParams(location.search);
            const sido = queryParams.get("sido");
            const sgg = queryParams.get("sgg");
            const dong = queryParams.get("dong");

            let list = [];

            //키워드 검색
            if (keyword) { 
                    const list = await GetStoreList(`http://localhost:3001/youtaste/search/store/keyword?name=${keyword}`);
            } 
            //메인페이지 필터 설정 
            else if (dong || sgg || sido) { 
                if (dong) {
                    list = await GetStoreList(`http://localhost:3001/youtaste/search/store/dong?dongCd=${dong}`);
                    setSelectedDong(dong); 
                } else if (sgg) {
                    list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${sgg}`);
                    setSelectedSi(sgg);
                } else if (sido) {
                    list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sido?sidoCd=${sido}`);
                    setSelectedDo(sido);
                } 
            } 
            else {
                getCurrentLocation(); // 파라미터 없으면 현재위치
                return;
            } 

            // 3. 결과 반영
            setStoreListByRegion(list);
            setFilteredStoreList(list);

            setIsChangedRegion(true);
        };
        initLoad();
    }, [location.search, keyword]); 

    // 필터링, 지도범위 적용 최종 맛집 리스트
    const finalStoreListWithId = useMemo(() => {
        return filteredStoreList.map(record => ({ "id": record.bplcSn, ...record }));
    }, [filteredStoreList]);

    // 범위 내 재검색 함수
    const displayViewPortMarkers = async (area) => {
        // 1. area가 비어있는지 확인
        if (!area.swMinLat || area.swMinLat === 0) return;
        
        const { swMinLat, swMinLng, neMaxLat, neMaxLng } = area;
        if (swMinLat === 0) return; // 좌표가 0인 초기상태 방지

        try {
            const url = `http://localhost:3001/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`;
            let list = await GetStoreList(url);

            // 4. 원본 리스트와 필터 리스트를 동시에 업데이트
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

    // 카테고리 클릭 핸들러
    const onSelectCategory = (categoryName) => {
        setIsResetFilter(false);
        setSelectedCategories(prev => 
            prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
        );
    };

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
        setIsChangedRegion(false); //test
    };

    // 페이지네이션
    const [nowPage, setNowPage] = useState(1);
    const viewListItemNum = 10;
    const viewStoreItems = finalStoreListWithId.slice((nowPage - 1) * viewListItemNum, nowPage * viewListItemNum);


    return (
        <div className={`${styleSearchStore.gridMap} contentTopPosition`}>
            <div className={`${styleSearchStore.leftArea} ${isOpen ? styleSearchStore.open : ""}`}>
                <button className={styleSearchStore.btnViewList} onClick={() => setIsOpen(!isOpen)}></button>
                <div className={styleSearchStore.filterArea}>
                    <div className={styleSearchStore.filterTopWrap}>
                        <button className={`${styleSearchStore.btnRegion} ${styleMain.filterBtn}`} onClick={() => setIsDimmedMiddleOpen(true)}>
                            <span className={styleMain.filterIcon}>📍</span>
                            <span className={styleMain.filterText}>
                                {doName ? `${doName} ${siName} ${dongName}`.trim() : "지역 선택"}
                            </span>
                            <span className={styleMain.arrowIcon}>▼</span>
                        </button>
                    </div>
                    <div className={styleSearchStore.filterBottomWrap}>
                        <ul className={styleSearchStore.categoryList}>
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
                        </ul>
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