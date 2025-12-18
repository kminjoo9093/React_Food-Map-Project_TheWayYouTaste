import styleStoreDetail from "../../css/StoreDetail.module.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import starFill from "../../resources/img/search/iconStarFill.svg";
import starHalf from "../../resources/img/search/iconStarHalf.svg";
import ReviewRegister from "../../pages/review/ReviewRegister";
import { useSearchParams } from "react-router-dom";
import { GetStoreList } from "./GetStoreList";


function StoreDetail(){

    const [isOpen, setIsOpen] = useState(false);

    const [searchParams] = useSearchParams();
  	const storeId = searchParams.get("storeId");
    const [storeData, setStoreData] = useState([]);
    console.log("스토어 아이디 --> ", storeId);
    const [menuData, setMenuData] = useState([]);

    useEffect(()=>{
        async function getStoreData(){
            //음식점 데이터
            let store = await GetStoreList(`http://localhost:3001/store?BPLC_SN=${storeId}`);
            setStoreData(store);
            console.log("상세정보데이터 : ", store);
            //메뉴 데이터
            let menu = await GetStoreList(`http://localhost:3001/menu?BPLC_SN=${storeId}`);
            setMenuData(menu);
            console.log(menu);
        }

        if(storeId) getStoreData();
    }, [storeId])

    let storeInfoObj = storeData[0]; 
    console.log("가게정보 : ", storeInfoObj);

    let menuList = menuData.map(record => {
            return {"id" : record.MENU_SN, ...record}
        });

    function formatNumber(number){
        const parsedPrice = number.toLocaleString("ko-KR") + "원"; 
        return parsedPrice;
    }

    function showStoreImage(image){
        //null일 경우 대체 이미지 또는 안내글 결정하기
        return null;
    }

    function showAmtyServices(services){
        let serviceType = "";

        return services.map(item => {
            switch (item) {
                case "parking" :
                    serviceType = "주차 가능"
                    break;
                case "pet" :
                    serviceType = "애완동물 동반"
                    break;
                case "takeout" :
                    serviceType = "포장 가능"
                    break;
                default : 
                    serviceType = ""
                    break;
            }
            return <span className={styleStoreDetail[item]}>
                        <i className={styleStoreDetail.serviceIcon}></i>
                        {serviceType}
                    </span>
        })
    }

    return (
        <div className='contentTopPosition'>
            {storeInfoObj && (
                <div className={`container ${styleStoreDetail.container}`}>
                    <section className={styleStoreDetail.storeInfoArea}>
                        <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
                            <div className={styleStoreDetail.storeNameWrap}>
                                <h2 className={styleStoreDetail.storeName}>{storeInfoObj.BPLC_NM}</h2>
                                <span>{storeInfoObj.MENU_CAT}</span>
                            </div>
                            <ul className={styleStoreDetail.detailInfoList}>
                                <li className={styleStoreDetail.ratingAvgWrap}>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starHalf} className={styleStoreDetail.ratingStarImg}/>
                                    <em className={styleStoreDetail.ratingAvg}>{storeInfoObj.AVG}</em>
                                </li>
                                <li className={styleStoreDetail.time}>
                                    <em className={styleStoreDetail.detailTitle}>영업시간</em>
                                    {storeInfoObj.BGNG_TM} - {storeInfoObj.DDLN_TM}
                                </li>
                                <li className={styleStoreDetail.tel}>
                                    <em className={styleStoreDetail.detailTitle}>전화번호</em>
                                    <a href="tel:+01011111001" className={styleStoreDetail.telNumber}>{storeInfoObj.BPLC_TELNO}</a>
                                </li>
                                <li className={styleStoreDetail.address}>
                                    <em className={styleStoreDetail.detailTitle}>주소</em>
                                    {storeInfoObj.DADDR}
                                </li>
                                <li className={styleStoreDetail.serviceTypes}>
                                    {showAmtyServices(storeInfoObj.AMTY_SRVC)}
                                </li>
                            </ul>
                            <div className={styleStoreDetail.linkWrap}>
                                <button className={styleStoreDetail.linkWriteReview} onClick={() => setIsOpen(true)}>리뷰 작성</button>
                                <Link to="/store/report/:userSn" className={styleStoreDetail.linkReportStore}>신고</Link>
                            </div>
                        </div>
                        <div className={`${styleStoreDetail.storeImageWrap} contentBox`}>
                            {showStoreImage(storeInfoObj.BPLC_PHOTO)}
                        </div>
                        <div className={`${styleStoreDetail.storeMenuWrap} contentBox`}>
                            <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>메뉴</h3>
                            <ul className={styleStoreDetail.menuList}>
                                { menuList.map(record => {
                                    return <li key={record.id} className={styleStoreDetail.menuItem}>{record.MENU_NM}
                                                <span className={styleStoreDetail.menuPrice}>{formatNumber(record.MENU_PRC)}</span>
                                            </li>
                                }) }
                            </ul>
                        </div>
                    </section>
                    <section className={`${styleStoreDetail.storeReviewArea}`}>
                        <h3 className="contentHeading">리뷰</h3>
                    </section>
                    <ReviewRegister isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </div>
                )
            
            }
            
        </div>
    )
}

export default StoreDetail;