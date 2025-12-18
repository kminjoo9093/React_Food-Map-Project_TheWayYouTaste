import { Link } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import { useEffect, useState } from "react";
import UseSearchStoreFetch from "./hook/UseSearchStoreFetch";
import Pagination from "../Pagination";
import RegionModal from "./RegionModal";
import MapComponent from "./MapComponent";
import {GetStoreList} from "./GetStoreList";

function SearchStore(){

    //const stores = UseSearchStoreFetch("http://localhost:3001/store");
    const categoryData = UseSearchStoreFetch("http://localhost:3001/category");
    //console.log("전체 카테고리 리스트 : ", categoryData);

    let [filteredStoreList, setFilteredStoreList] = useState([]); //필터링된 리스트
    // const [categoryList, setCategoryList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); //선택된 카테고리
    const [isOpen, setIsOpen] = useState(false);

    //test - 지역 필터 설정
    const [isChangedRegion, setIsChangedRegion] = useState(false);
    const [selectedDo, setSelectedDo] = useState(null);
    const [doName, setDoName] = useState("");
    const [selectedSi, setSelectedSi] = useState(null);
    const [siName, setSiName] = useState("");
    const [selectedDong, setSelectedDong] = useState(null);
    const [dongName, setDongName] = useState("");
    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
    //test
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
    const [
        , setFilteredList] = useState([]);


    //test - 현재 위치 기반 시도, 시군구 코드
    const LOCAL_API_KEY = "bd23a565a07fd608d593c2c99d192e8f";
    // useEffect(()=>{
        const getCurrentLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async(position)=>{
                    const {latitude, longitude} = position.coords;
                    //console.log(position);
                    setLat(latitude);
                    setLng(longitude);
                    console.log(latitude, longitude);
                    let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
                    //let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=127.0098&y=37.2734`; //수원시 팔달구

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
                            
                            // console.log("행정구역정보 : ", data.documents[0]);
                            console.log("법정동코드 : ", data.documents[0].code);
                            const currentDongCode = data.documents[0].code;
                            const currentSigunguCode = currentDongCode.slice(0, 5);
                            const currerntSidoCode = currentSigunguCode.slice(0, 2);
                            console.log("시군구 코드 -> ", currentSigunguCode);
                            //사용자 위치 기반 시군구 전체 리스트
                            let list = await GetStoreList(`http://localhost:3001/store?SGG_CD=${currentSigunguCode}`);
                            setStoreListByRegion(list);
                            //console.log("여기여기 ", storeListByRegion);

                            // setFilteredStoreList(storeListByRegion);
                            setFilteredStoreList(list);

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
            list = await GetStoreList(`http://localhost:3001/store?STDG_CD=${selectedDong}`);
        } else if (selectedSi){ //시군구 전체 선택(읍면동 null)
            list = await GetStoreList(`http://localhost:3001/store?SGG_CD=${selectedSi}`);
        } else if (selectedDo) { //시도 전체 선택(읍면동, 시군구 null)
            //시도 전체 - 코드로 받을지 문자열로 받을지
            list = await GetStoreList(`http://localhost:3001/store?DO_CD=${selectedDo}`);
        } else {
            //모두 null (전국)
            console.log("모두 null 인지 확인");
            list = await GetStoreList(`http://localhost:3001/store`);
        }
        //console.log(storeListFilteredRegion);
        setIsDimmedMiddleOpen(false);
        setStoreListByRegion(list); //지역 기준 원본 리스트

        //test
        setIsChangedRegion(true);
        // setFilteredStoreList(list); //화면에 보여줄 리스트
    }


    // async function getStoreList(url){
    //     try{
    //         //const url = "http://localhost:3001/store";
    //         const res = await fetch(url);
    //         if(!res.ok){
    //             throw new Error(`Http error! status : ${res.status}`);
    //         }
    //         //ok인 경우
    //         return await res.json();
    //         //console.log(data);
    //     } catch(err){
    //         console.error("when getting data, has error : " + err);
    //         return [];
    //     }
    // }
    
    let newFilteredStoreList = filteredStoreList;
    useEffect(()=>{
        newFilteredStoreList = filteredStoreList.map(record => {
                return {"id" : record.BPLC_SN, ...record}
            });
        console.log("storeList : ", newFilteredStoreList);
    }, [filteredStoreList])
    

    
    let categoryList = categoryData.map(record => {
            return {"id" : record.STORE_CAT_NO, ...record}
        });

    //console.log("카테고리 리스트: ", categoryList);

    const foodIcons = {
        c01: "🍚"
        ,c02: "🍝"
        ,c03: "🥟"
        ,c04: "🍣"
        ,c05: "🍜"
        ,c06: "🍩"
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

    async function displayViewPortMarkers(positionArea){
    
        const { swMinLat, swMinLng, neMaxLat, neMaxLng } = positionArea;

        //db에서 조회해서 리스트 가져오기
        //const storeListByPosition = await GetStoreList(`http://localhost:3001/store?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`);
        const storeListByPosition = await GetStoreList(`http://localhost:3001/store`);

        // 이 부분 위도 경도 범위 검증은 백엔드에서. 지금은 테스트니까 여기서 함
        let listByMovedPos = storeListByPosition.filter((record) => {
            return (
                record.LAT >= swMinLat &&
                record.LAT <= neMaxLat &&
                record.LOT >= swMinLng &&
                record.LOT <= neMaxLng
            );
        });
        setFilteredList(listByMovedPos);

        if(selectedCategories.length > 0){
            listByMovedPos = listByMovedPos.filter(record => selectedCategories.includes(record.MENU_CAT));
        }

        setFilteredStoreList(listByMovedPos); //실제 지도에 표시될 맛집 리스트
        console.log("뷰포트 좌표 범위 내 맛집 리스트 : ", listByMovedPos);
        
    }

    //검색버튼 눌렀을 때 
    async function onClickSearchBtn(){
        console.log("selectedCategories : ", selectedCategories);

        if(selectedCategories.length === 0){
            //카테고리 선택 X => 선택한 지역 필터 기반 맛집
            setFilteredStoreList(storeListByRegion);
            return;
        }

        //카테고리 선택 o (현재위치 or 지역 필터 기반 - storeListByRegion)
        //지역 필터 설정한걸 이미 리스트로 받아오고 - 지역필터 확인 누른 시점, 거기서 카테고리 조회하는 방식 - 검색 누르는 시점
        const storeList = storeListByRegion.filter(record => {
            //selectedCategories에 있는 카테고리와 일치하는 맛집들
            return selectedCategories.includes(record.MENU_CAT);
        })
        console.log("카테고리 필터 리스트 : ", storeList);
        setFilteredStoreList(storeList);

        //지역 필터 설정 + 음식 카테고리 설정
        // let url = `http://localhost:3001/store?MENU_CAT=${selectedCategories}`;
        // if(selectedDong){
        //     url += `&STDG_CD=${selectedDong}`;
        // }
        // if(selectedSi){
        //     url += `&SGG_CD=${selectedSi}`;
        // }
        // if(selectedDo){
        //     url += `&DO_CD=${selectedDo}`;
        // }
        // let list = await getStoreList(url);
        // console.log("카테고리 + 지역 필터 리스트 : ", list);
        // setFilteredStoreList(list);
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
    const totalPages = Math.ceil(newFilteredStoreList.length / viewListItemNum);

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
    const viewStoreItems = newFilteredStoreList.slice(indexOfStartItem, indexOfLastItem);

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
                                        <button id={record.STORE_CAT_NO} 
                                                className={selectedCategories.includes(record.STORE_CAT) ? styleSearchStore.active : null} 
                                                onClick={() => onSelectCategory(record.STORE_CAT)}
                                        >
                                            {renderCategoryEmoji(record.STORE_CAT_NO)}
                                            {record.STORE_CAT}
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
                                return (<li key={record.BPLC_SN} className={styleSearchStore.storeListItem}>
                                        <Link to={`/search/storeDetail?storeId=${record.BPLC_SN}`} className={styleSearchStore.storeListLink}
                                        >
                                            <img className={styleSearchStore.storeImg} src="#" />
                                            <div className={styleSearchStore.storeInfo}>
                                                <h2 className={styleSearchStore.storeName}>{record.BPLC_NM}</h2>
                                                <div>
                                                    <span className={styleSearchStore.storeRating}>{record.AVG}</span>
                                                    <span className={styleSearchStore.storeCategory}>{record.MENU_CAT}</span>
                                                </div>
                                                <span className={styleSearchStore.storeTime}>영업시간</span>
                                                <span className={styleSearchStore.storeAddress}>{record.DADDR}</span>
                                            </div>
                                        </Link>
                                    </li>);
                            })
                        }
                        
                    </ul>
                    <Pagination
                        nowPage={nowPage}
                        totalItems={newFilteredStoreList.length}
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
                <MapComponent storeList={newFilteredStoreList} setFilteredStoreList = {setFilteredStoreList} 
                                selectedCategories={selectedCategories} lat={lat} lng={lng} isMoved={isMoved} setIsMoved={setIsMoved}
                                isChangedRegion={isChangedRegion} setPositionArea={setPositionArea}
                                />
            </div>

            {/* 지역 선택 모달 */}
            {isDimmedMiddleOpen && 
                <RegionModal isModalOpen = {isDimmedMiddleOpen} 
                            setIsModalOpen = {setIsDimmedMiddleOpen}
                            selectedDo = {selectedDo}
                            setSelectedDo = {setSelectedDo}
                            selectedSi = {selectedSi}
                            setSelectedSi = {setSelectedSi}
                            selectedDong = {selectedDong}
                            setSelectedDong = {setSelectedDong}
                            onConfirm = {handleRegionConfirm}
                            doName = {doName} 
                            setDoName = {setDoName}
                            siName = {siName} 
                            setSiName = {setSiName}
                            dongName = {dongName}
                            setDongName = {setDongName}
                />
            }
        </div>
    )
}

export default SearchStore;