import { Link } from "react-router-dom";
import styleSearchStore from "../../css/SearchStore.module.css";
import stylePagination from "../../css/Pagination.module.css";
import { useState } from "react";
import UseSearchStoreFetch from "./hook/UseSearchStoreFetch";
import Pagination from "../Pagination";

function SearchStore(){

    // const [storeList, setStoreList] = useState([]);
    // const [categoryList, setCategoryList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); //선택된 카테고리
    const [isOpen, setIsOpen] = useState(false);

    const stores = UseSearchStoreFetch("http://localhost:3001/store");
    const categories = UseSearchStoreFetch("http://localhost:3001/category");

    //전체 데이터
    //console.log(stores);
    //console.log(categories);

    let storeList = stores.map(record => {
            return {"id" : record.BPLC_SN, ...record}
        });
    // console.log(storeList);
    
    let categoryList = categories.map(record => {
            return {"id" : record.STORE_CAT_NO, ...record}
        });
    //console.log(categoryList);

    function onSelectCategory(id){
        //이미 선택된 카테고리면 빼고, 아니면 넣기
        setSelectedCategories(prev => {
            if(prev.includes(id)){
                const catArr = prev.filter(category => category !== id);
                console.log(catArr);
                return catArr;
            } else {
                console.log("선택한 카테고리 : ", [...prev, id]);
                return [...prev, id];
            }
           
        });
    }

    // 음식 카테고리에 일치하는 맛집 목록만 표시하기
    // let filterdStoreList = storeList.filter(record => {
    //     //selectedCategories에 있는 카테고리와 일치하는 맛집들
    //     selectedCategories.forEach(category => {
            
    //     })
    // })


    function resetFilter(){
        setSelectedCategories([]);
        console.log("필터 초기화");
    }

    function coverMapArea(){
        setIsOpen(prev => !prev);
    }

    // Pagination
    const viewListItemNum = 10;
    const [nowPage, setNowPage] = useState(1);

    const indexOfLastItem = nowPage * viewListItemNum;
    const indexOfStartItem = indexOfLastItem - viewListItemNum;
    const viewStoreItems = storeList.slice(indexOfStartItem, indexOfLastItem);

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
                        <button className={styleSearchStore.btnResetFilter} onClick={resetFilter}>초기화</button>
                        <button className={styleSearchStore.btnRegion}>지역 설정</button>
                    </div>
                    <div className={styleSearchStore.filterBottomWrap}>
                        <ul className={styleSearchStore.categoryList}>
                            {
                                categoryList.map(record => (
                                    <li key={record.STORE_CAT_NO}>
                                    <button id={record.STORE_CAT_NO} 
                                            className={selectedCategories.includes(record.STORE_CAT_NO) ? styleSearchStore.active : null} 
                                            onClick={() => onSelectCategory(record.STORE_CAT_NO)}
                                    >
                                        {record.STORE_CAT}
                                    </button>
                                    </li>
                                ))
                            }
                        </ul>   
                    </div>
                </div>
                <div className={styleSearchStore.storeListArea}>
                    <ul className={styleSearchStore.storeList}>
                        {
                            viewStoreItems.map(record => {
                                return (<li key={record.BPLC_SN} className={styleSearchStore.storeListItem}>
                                        <Link to="/search/storeDetail" className={styleSearchStore.storeListLink}>
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
                        totalItems={storeList.length}
                        itemsPerPage={viewListItemNum}
                        limitBlock={5}
                        onPageChange={setNowPage}
                    />
                </div>
            </div>
            <div className={styleSearchStore.mapArea}>지도</div>
        </div>
    )
}

export default SearchStore;