import global from "../../css/Global.module.css";
import responsive from "../../css/Responsive.module.css";
import styleSearchStore from "../../css/SearchStore.module.css";
import stylePagination from "../../css/Pagination.module.css";
import { useState } from "react";
import UseSearchStoreFetch from "./hook/UseSearchStoreFetch";

function SearchStore(){

    // const [storeList, setStoreList] = useState([]);
    // const [categoryList, setCategoryList] = useState([]);

    const stores = UseSearchStoreFetch("http://localhost:3001/store");
    const categories = UseSearchStoreFetch("http://localhost:3001/category");

    //전체 데이터
    //console.log(stores);
    //console.log(categories);

    let storeList = stores.map(record => {
            return {"id" : record.BPLC_SN, ...record}
        });
    //console.log(storeList);
    
    let categoryList = categories.map(record => {
            return {"id" : record.STORE_CAT_NO, ...record}
        });
    //console.log(categoryList);

    const [selectedCategories, setSelectedCategories] = useState([]);
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

    function resetFilter(){
        setSelectedCategories([]);
        console.log("필터 초기화");
    }

    // Pagination
    const viewListItemNum = 10;
    const limitBlock = 5;
    const [nowPage, setNowPage] = useState(1);
    const totalPages = Math.ceil(storeList.length / viewListItemNum);

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

    const indexOfLastItem = (nowPage * viewListItemNum) + 1;
    const indexOfStartItem = indexOfLastItem - viewListItemNum;
    const viewStoreItems = storeList.slice(indexOfStartItem, indexOfLastItem);

    return(
        <div className={styleSearchStore.gridMap}>
            <div className={styleSearchStore.leftArea}>
                <div className={styleSearchStore.filterArea}>
                    <button className={styleSearchStore.btnResetFilter} onClick={resetFilter}>초기화</button>
                    <button className={styleSearchStore.btnRegion}>지역 설정</button>
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
                <div className={styleSearchStore.storeListArea}>
                    <ul className={styleSearchStore.storeList}>
                        {
                            viewStoreItems.map(record => {
                                return (<li key={record.BPLC_SN} className={styleSearchStore.storeListItem}>
                                        <a href="#" className={styleSearchStore.storeListLink}>
                                            <img className={styleSearchStore.storeImg} src="#" />
                                            <div className={styleSearchStore.storeInfo}>
                                                <div>
                                                    <h2 className={styleSearchStore.storeName}>{record.BPLC_NM}</h2>
                                                    <span className={styleSearchStore.storeCategory}>{record.MENU_CAT}</span>
                                                </div>
                                                <span className={styleSearchStore.storeRating}>{record.AVG}</span>
                                                <span className={styleSearchStore.storeTime}>영업시간</span>
                                            </div>
                                        </a>
                                    </li>);
                            })
                        }
                        
                    </ul>
                    <div className={stylePagination.pagination}>
                        <button onClick={goPrev} disabled={nowPage === 1}> 이전 </button>
                        {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={nowPage === number ? stylePagination.active : ""}
                        >
                            {number}
                        </button>
                        
                        ))}
                        <button onClick={goNext} disabled={nowPage === totalPages}> 다음 </button>
                    </div>
                </div>
            </div>
            <div>지도</div>
        </div>
    )
}

export default SearchStore;