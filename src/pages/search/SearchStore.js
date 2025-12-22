import { Link } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useMemo, useState } from "react";
import UseSearchStoreFetch from "./hook/UseSearchStoreFetch";
import Pagination from "../Pagination";
import RegionModal from "./RegionModal";
import MapComponent from "./MapComponent";
import {GetStoreList} from "./GetStoreList";
import imgSushi from "../../resources/img/search/imgSushi.jpg";

function SearchStore({storeCategories, sidoList}){

    //const [allCategories, setAllCategories] = useState([]);

    let categoryList = useMemo(()=>{
        return storeCategories.map(record => {
            return {"id" : record.StoreCatNo, ...record};
        })
    }, [storeCategories])

    let [filteredStoreList, setFilteredStoreList] = useState([]); //필터링된 리스트
    const [selectedCategories, setSelectedCategories] = useState([]); //선택된 카테고리
    const [isOpen, setIsOpen] = useState(false);

    //지역 필터 설정
    const [isChangedRegion, setIsChangedRegion] = useState(false);
    const [selectedDo, setSelectedDo] = useState(null);
    const [doName, setDoName] = useState("");
    const [selectedSi, setSelectedSi] = useState(null);
    const [siName, setSiName] = useState("");
    const [selectedDong, setSelectedDong] = useState(null);
    const [dongName, setDongName] = useState("");
    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);

    const [storeListByRegion, setStoreListByRegion] = useState([]);//맨처음 받아오는 사용자 위치 기반 시군구 전체 맛집리스트
    const [lat, setLat] = useState(); //위도, Y
    const [lng, setLng] = useState(); //경도, X
    //지도 동작 상태
    const [isMoved, setIsMoved] = useState(false);

    //const [viewport, setViewport] = useState(null);

    const [positionArea, setPositionArea] = useState({
        swMinLat: 0,
        swMinLng: 0,
        neMaxLat: 0,
        neMaxLng: 0
    })

    //범위 내 재검색을 눌렀는지
    const [isSearchArea, setIsSearchArea] = useState(false);

    //지도 동작 후 저장된 리스트
    const [filteredList, setFilteredList] = useState([]);


    //test - 현재 위치 기반 시도, 시군구 코드
    const LOCAL_API_KEY = "bd23a565a07fd608d593c2c99d192e8f";
    // useEffect(()=>{
        const getCurrentLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async(position)=>{
                    const {latitude, longitude} = position.coords;
                    setLat(latitude);
                    setLng(longitude);
                    console.log(latitude, longitude);
                    let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;

                    const headers = {
                        Authorization: `KakaoAK ${LOCAL_API_KEY}`,
                        'Content-Type': 'application/json',
                        };

                        try {
                            const response = await fetch(localUrl, {
                                method: 'GET',
                                headers: headers,
                                // body: body,
                            });
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            const data = await response.json();
                            
                            //console.log("법정동코드 : ", data.documents[0].code);
                            const currentDongCode = data.documents[0].code;
                            const currentSigunguCode = currentDongCode.slice(0, 5);
                            //console.log("시군구 코드 -> ", currentSigunguCode);

                            //사용자 위치 기반 시군구 전체 리스트
                            let listBySgg = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${currentSigunguCode}`);
                            setStoreListByRegion(listBySgg);
                            console.log("위치 기반(시군구) 맛집 리스트 --> ", listBySgg);

                            // setFilteredStoreList(storeListByRegion);
                            setFilteredStoreList(listBySgg);

                            //필터 시도, 시군구 선택
                            // setSelectedDo(currerntSidoCode);
                            // setSelectedSi(currentSigunguCode);
                        } catch (error) {
                            console.error('Error fetching: ', error);
                        }
                })
            }
        }

        useEffect(()=>{
            getCurrentLocation();
        }, [])
    // }, []) //처음 접속, 초기화
    
    
    async function handleRegionConfirm(){
        const filterdRegionData = [selectedDong, selectedSi, selectedDo];
        console.log("여기", filterdRegionData);

        let list = [];
        
        if(selectedDong){ //읍면동 선택
            list = await GetStoreList(`http://localhost:3001/youtaste/search/store/dong?dongCd=${selectedDong}`);
        } else if (selectedSi){ //시군구 전체 선택(읍면동 null)
            list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${selectedSi}`);
        } else if (selectedDo) { //시도 전체 선택(읍면동, 시군구 null)
            //시도 전체 - 코드로 받을지 문자열로 받을지
            list = await GetStoreList(`http://localhost:3001/youtaste/search/store/sido?sidoCd=${selectedDo}`);
        } else {
            //모두 null (전국)
            console.log("모두 null 인지 확인");
            list = await GetStoreList(`http://localhost:3001/youtaste/search/store/all`);
        }
        //console.log(storeListFilteredRegion);
        setStoreListByRegion(list); //지역 기준 원본 리스트
        setIsDimmedMiddleOpen(false);
        setIsChangedRegion(true);

        console.log("지금은 시도기반 리스트!! --> ", list);
    }
    
    const finalStoreListWithId = useMemo(()=>{
        return filteredStoreList.map(record => {
                    return {"id" : record.bplcSn, ...record}
                });
    }, [filteredStoreList])

    const foodIcons = {
        1: "🍚"
        ,2: "🍝"
        ,3: "🥟"
        ,4: "🍣"
        ,5: "🍜"
        ,6: "🍩"
    }

    function renderCategoryEmoji(category){
        return <i className={styleSearchStore.categoryEmoji}>{foodIcons[category]}</i>
    }


    function onSelectCategory(category){
        //이미 선택된 카테고리면 빼고, 아니면 넣기
        setSelectedCategories(prev => {
            if(prev.includes(category)){
                const updatedCategoryList = prev.filter(cat => cat !== category);
                //console.log(catArr);
                return updatedCategoryList;
            } else {
                const updatedCategoryList = [...prev, category];
                console.log("선택한 카테고리 : ", updatedCategoryList);
                return updatedCategoryList;
            }
        })
    }

    //지도(남서, 북동 좌표) 기반 맛집 목록 받아오기
    async function displayViewPortMarkers(positionArea){
        const { swMinLat, swMinLng, neMaxLat, neMaxLng } = positionArea;
        let storeListByPosition 
                                = await GetStoreList(`http://localhost:3001/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`);

        setFilteredList(storeListByPosition);

        //선택된 카테고리가 있는 경우
        if(selectedCategories.length > 0){
            storeListByPosition = storeListByPosition.filter(record => selectedCategories.includes(record.MENU_CAT));
        }

        //실제 지도에 표시될 맛집 리스트
        setFilteredStoreList(storeListByPosition); 
        //console.log("뷰포트 좌표 범위 내 맛집 리스트 : ", storeListByPosition);
        
    }

    //필터 설정 후 검색버튼 눌렀을 때 
    async function onClickSearchBtn(){
        console.log("selectedCategories : ", selectedCategories);

        if(selectedCategories.length === 0){
            //카테고리 선택 X => 선택한 지역 필터 기반 맛집
            setFilteredStoreList(storeListByRegion);
            return;
        } else {

            //카테고리 선택 o (현재위치 or 지역 필터 기반 - storeListByRegion)
            //지역 필터 설정한걸 이미 리스트로 받아오고 - 지역필터 확인 누른 시점, 거기서 카테고리 조회하는 방식 - 검색 누르는 시점
            const storeList = storeListByRegion.filter(record => {
                //selectedCategories에 있는 카테고리와 일치하는 맛집들
                selectedCategories.includes(record.MENU_CAT);
            })
            setFilteredStoreList(storeList);
            console.log("카테고리 필터 리스트 : ", storeList);
        }

        setNowPage(1);
    }

    function showSelectedRegion(){
        let regionDepth = "지역 선택";

        if (doName) regionDepth = doName; 
        if (siName) regionDepth += ` ${siName}`; 
        if (dongName) regionDepth += ` ${dongName}`;
        
        //지역내 재검색 눌렀을 경우
        if(isSearchArea) regionDepth = "지역 선택"; 

        return regionDepth;
    }

    function resetFilter(){
        setSelectedCategories([]);
        setFilteredStoreList([]); //나중에 현재 위치 기반 리스트로 설정해주기

        resetRegionFilter();

        getCurrentLocation(); //현재위치 기반
        console.log("필터 초기화");
        
    }

    function resetRegionFilter(){
        //현재 위치 기반 시도, 시군구까지만 선택되어있도록
        // setCurrentRegion(); //현재 시도, 시군구 설정
        setSelectedDo(null);
        setSelectedSi(null);
        setSelectedDong(null);
        setDoName("");
        setSiName("");
        setDongName("");
    }

    function coverMapArea(){
        setIsOpen(prev => !prev);
    }

    // Pagination
    const viewListItemNum = 10;
    const limitBlock = 5;
    const [nowPage, setNowPage] = useState(1);
    const totalPages = Math.ceil(finalStoreListWithId.length / viewListItemNum);

    const paginate = (pageNumber) => setNowPage(pageNumber);

    const goPrev = () => {
        if (nowPage > 1) setNowPage(nowPage - 1);
    };

    const goNext = () => {
        if (nowPage < totalPages) setNowPage(nowPage + 1);
    };

    const nowBlock = Math.floor((nowPage - 1) / limitBlock); //0 : 1 - 5까지
    const startPage = nowBlock * limitBlock + 1;
    const endPage = Math.min(startPage + limitBlock - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const indexOfLastItem = nowPage * viewListItemNum;
    const indexOfStartItem = indexOfLastItem - viewListItemNum;
    const viewStoreItems = finalStoreListWithId.slice(indexOfStartItem, indexOfLastItem);

    return(
        <div className={`${styleSearchStore.gridMap} contentTopPosition`}>
            <div className={`${styleSearchStore.leftArea} ${isOpen ? styleSearchStore.open : ""}`} >
                <button id="btnViewList" 
                        onClick={coverMapArea}
                        className={styleSearchStore.btnViewList}
                >
                    {/* <img src={arrow} alt="목록 펼쳐보기"/> */}
                </button>
                <div className={styleSearchStore.filterArea}>
                    <div className={styleSearchStore.filterTopWrap}>
                        <button className={styleSearchStore.btnRegion} onClick={() => setIsDimmedMiddleOpen(true)}>
                            {showSelectedRegion()}
                        </button>
                    </div>
                    <div className={styleSearchStore.filterBottomWrap}>
                        <ul className={styleSearchStore.categoryList}>
                            {
                                categoryList.map(record => (
                                    <li key={record.id}>
                                        <button id={record.storeCatNo} 
                                                className={selectedCategories.includes(record.storeCatName) ? styleSearchStore.active : null} 
                                                onClick={() => onSelectCategory(record.storeCatName)}
                                        >
                                            {renderCategoryEmoji(record.storeCatNo)}
                                            {record.storeCatName}
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className={styleSearchStore.filterBottomArea}>
                        {/* <span className={styleSearchStore.conditions}>
                            { renderSelectedRegion() }
                        </span> */}
                        <div className={styleSearchStore.btnWrap}>
                            <button className={styleSearchStore.btnResetFilter} onClick={resetFilter}>초기화</button>
                            <button className={styleSearchStore.btnSearch} onClick={()=>onClickSearchBtn()}>검색</button>
                        </div>

                    </div>
                </div>
                <div className={styleSearchStore.storeListArea}>
                    <ul className={styleSearchStore.storeList}>
                        {
                            viewStoreItems.map(record => {
                                // let imgSrc = record.bplcPhoto

                                return (<li key={record.bplcSn} className={styleSearchStore.storeListItem}>
                                        <Link to={`/search/storeDetail?storeId=${record.bplcSn}`} className={styleSearchStore.storeListLink}
                                        >
                                            <img className={styleSearchStore.storeImg} src={imgSushi} />
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
                                    </li>);
                            })
                        }
                        
                    </ul>
                    <Pagination
                        nowPage={nowPage}
                        totalItems={finalStoreListWithId.length}
                        itemsPerPage={viewListItemNum}
                        limitBlock={limitBlock}
                        onPageChange={setNowPage}
                    />
                </div>
            </div>
            <div className={styleSearchStore.mapArea}>
                <button className={`${styleSearchStore.btnSearchArea} ${isMoved ? styleSearchStore.active : ""}`} 
                        //onClick={()=>{setIsMoved(false)}}
                        onClick={async () => {
                           // if (!viewport) return;
                            setIsSearchArea(true);
                            await displayViewPortMarkers(positionArea);
                            // setFilteredStoreList(list);
                            //setIsMoved(false);
                        }}
                        >범위 내 재검색</button>
                <MapComponent storeList={finalStoreListWithId} setFilteredStoreList = {setFilteredStoreList} 
                                selectedCategories={selectedCategories} lat={lat} lng={lng} isMoved={isMoved} setIsMoved={setIsMoved}
                                isChangedRegion={isChangedRegion} setPositionArea={setPositionArea}
                                />
            </div>

            {/* 지역 선택 모달 */}
            {isDimmedMiddleOpen && 
                <RegionModal 
                            setIsModalOpen = {setIsDimmedMiddleOpen}
                            selectedDo = {selectedDo}
                            setSelectedDo = {setSelectedDo}
                            selectedSi = {selectedSi}
                            setSelectedSi = {setSelectedSi}
                            selectedDong = {selectedDong}
                            setSelectedDong = {setSelectedDong}
                            onConfirm = {handleRegionConfirm}
                            // doName = {doName} 
                            setDoName = {setDoName}
                            // siName = {siName} 
                            setSiName = {setSiName}
                            // dongName = {dongName}
                            setDongName = {setDongName}
                            sidoList = {sidoList}

                />
            }
        </div>
    )
}

export default SearchStore;