import { Link, useLocation } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import Pagination from "../Pagination";
import RegionModal from "./RegionModal";
import MapComponent from "./MapComponent";
import { GetStoreList } from "./GetStoreList";
import imgSushi from "../../resources/img/search/imgSushi.jpg";

function SearchStore({ storeCategories, sidoList }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");

    const [filteredStoreList, setFilteredStoreList] = useState([]); // 화면에 표시될 최종 리스트
    const [storeListByRegion, setStoreListByRegion] = useState([]); // 지역/키워드 기준 원본 리스트
    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [isOpen, setIsOpen] = useState(false);

    // 지역 및 위치 상태
    const [lat, setLat] = useState(37.5665);
    const [lng, setLng] = useState(126.9780);
    const [isMoved, setIsMoved] = useState(false);
    const [isChangedRegion, setIsChangedRegion] = useState(false);
    const [positionArea, setPositionArea] = useState({
        swMinLat: 0, swMinLng: 0, neMaxLat: 0, neMaxLng: 0
    });

    const [selectedDo, setSelectedDo] = useState(null);
    const [doName, setDoName] = useState("");
    const [selectedSi, setSelectedSi] = useState(null);
    const [siName, setSiName] = useState("");
    const [selectedDong, setSelectedDong] = useState(null);
    const [dongName, setDongName] = useState("");
    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);

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
                    const currentSigunguCode = data.documents[0].code.slice(0, 5);

                    const listBySgg = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${currentSigunguCode}`);
                    setStoreListByRegion(listBySgg);
                    setFilteredStoreList(listBySgg);
                } catch (error) {
                    console.error('위치 정보 로드 실패: ', error);
                }
            });
        }
    }, []);

    // 초기 진입 및 검색어 처리
    useEffect(() => {
        const initLoad = async () => {
            if (keyword) {
                try {
                    const list = await GetStoreList(`http://localhost:3001/youtaste/search/store/keyword?name=${keyword}`);
                    setStoreListByRegion(list);
                    setFilteredStoreList(list);
                    if (list.length > 0) {
                        setLat(list[0].lat);
                        setLng(list[0].lot);
                    }
                } catch (e) { console.error(e); }
            } else {
                getCurrentLocation();
            }
        };
        initLoad();
    }, [keyword, getCurrentLocation]);

    // 카테고리 필터링 적용 Logic
    const finalStoreListWithId = useMemo(() => {
        return filteredStoreList.map(record => ({ "id": record.bplcSn, ...record }));
    }, [filteredStoreList]);

    // [핵심] 범위 내 재검색 함수 수정
    const displayViewPortMarkers = async (area) => {
        const { swMinLat, swMinLng, neMaxLat, neMaxLng } = area;
        if (swMinLat === 0) return; // 좌표가 0인 초기상태 방지

        try {
            const url = `http://localhost:3001/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`;
            let list = await GetStoreList(url);

            // 카테고리 필터가 있는 경우 적용 (DB 필드명 확인 필수: storeCatName 인지 MENU_CAT 인지)
            if (selectedCategories.length > 0) {
                list = list.filter(record => selectedCategories.includes(record.storeCatName));
            }

            setFilteredStoreList(list);
            setIsMoved(false); // 재검색 후 버튼 비활성화
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
        setFilteredStoreList(list);
        setIsDimmedMiddleOpen(false);
        setIsChangedRegion(true);
    }

    // 카테고리 클릭 핸들러
    const onSelectCategory = (categoryName) => {
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
        setNowPage(1);
    };

    const resetFilter = () => {
        setSelectedCategories([]);
        setSelectedDo(null);
        setSelectedSi(null);
        setSelectedDong(null);
        setDoName(""); setSiName(""); setDongName("");
        getCurrentLocation();
    };

    // 페이지네이션
    const [nowPage, setNowPage] = useState(1);
    const viewListItemNum = 10;
    const viewStoreItems = finalStoreListWithId.slice((nowPage - 1) * viewListItemNum, nowPage * viewListItemNum);

    const foodIcons = { 1: "🍚", 2: "🍣", 3: "🥟", 4: "🍝", 5: "🍜", 6: "🍔"};

    return (
        <div className={`${styleSearchStore.gridMap} contentTopPosition`}>
            <div className={`${styleSearchStore.leftArea} ${isOpen ? styleSearchStore.open : ""}`}>
                <button className={styleSearchStore.btnViewList} onClick={() => setIsOpen(!isOpen)}></button>
                <div className={styleSearchStore.filterArea}>
                    <div className={styleSearchStore.filterTopWrap}>
                        <button className={styleSearchStore.btnRegion} onClick={() => setIsDimmedMiddleOpen(true)}>
                            {doName ? `${doName} ${siName} ${dongName}`.trim() : "지역 선택"}
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
                                        <i className={styleSearchStore.categoryEmoji}>{foodIcons[record.StoreCatNo]}</i>
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
                                    <img className={styleSearchStore.storeImg} src={imgSushi} alt="store" />
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
                    setFilteredStoreList={setFilteredStoreList} 
                    selectedCategories={selectedCategories} 
                    lat={lat} lng={lng} 
                    isMoved={isMoved} setIsMoved={setIsMoved}
                    isChangedRegion={isChangedRegion} 
                    setPositionArea={setPositionArea}
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