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
    const [storeData, setStoreData] = useState({});
    console.log("스토어 아이디 --> ", storeId);

    useEffect(()=>{
        async function getStoreData(){
            //음식점 데이터
            let storeInfo = await GetStoreList(`http://localhost:3001/youtaste/search/store/detail?storeId=${storeId}`);
            
            // 만약 amenity가 문자열 "parking,pet"으로 온다면 배열로 변환
            // if (storeInfo.amenity && typeof storeInfo.amenity === 'string') {
            //     storeInfo.amenity = storeInfo.amenity.split(',').map(s => s.trim());
            // }
            setStoreData(storeInfo);
            console.log("상세정보데이터 : ", storeInfo);
        }
        getStoreData();
    }, [storeId])

    function formatNumber(number){
        const parsedPrice = number.toLocaleString("ko-KR") + "원"; 
        return parsedPrice;
    }

    function showStoreImage(image){
        //null일 경우 대체 이미지 또는 안내글 결정하기
        return null;
    }

    function showAmtyServices(services){
        console.log(services);
        if (!services || !Array.isArray(services)) {
            return null; 
        }

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

    if (!storeData.bplcNm) {
        return <div className='contentTopPosition'>정보를 불러오는 중입니다...</div>;
    }

    return (
        <div className='contentTopPosition'>
            {storeData && (
                <div className={`container ${styleStoreDetail.container}`}>
                    <section className={styleStoreDetail.storeInfoArea}>
                        <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
                            <div className={styleStoreDetail.storeNameWrap}>
                                <h2 className={styleStoreDetail.storeName}>{storeData.bplcNm}</h2>
                                <span>{storeData.storeCatName}</span>
                            </div>
                            <ul className={styleStoreDetail.detailInfoList}>
                                <li className={styleStoreDetail.ratingAvgWrap}>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                    <img src={starHalf} className={styleStoreDetail.ratingStarImg}/>
                                    <em className={styleStoreDetail.ratingAvg}>{storeData.avg}</em>
                                </li>
                                <li className={styleStoreDetail.time}>
                                    <em className={styleStoreDetail.detailTitle}>영업시간</em>
                                    {storeData.bgngTm} - {storeData.ddlnTm}
                                </li>
                                <li className={styleStoreDetail.tel}>
                                    <em className={styleStoreDetail.detailTitle}>전화번호</em>
                                    <a href="tel:+01011111001" className={styleStoreDetail.telNumber}>{storeData.tel}</a>
                                </li>
                                <li className={styleStoreDetail.address}>
                                    <em className={styleStoreDetail.detailTitle}>주소</em>
                                    {storeData.address}
                                </li>
                                <li className={styleStoreDetail.serviceTypes}>
                                    {showAmtyServices(storeData.amenity)}
                                </li>
                            </ul>
                            <div className={styleStoreDetail.linkWrap}>
                                <button className={styleStoreDetail.linkWriteReview} onClick={() => setIsOpen(true)}>리뷰 작성</button>
                                <Link to="/store/report/:userSn" className={styleStoreDetail.linkReportStore}>신고</Link>
                            </div>
                        </div>
                        <div className={`${styleStoreDetail.storeImageWrap} contentBox`}>
                            {showStoreImage(storeData.bplcPhoto)}
                        </div>
                        <div className={`${styleStoreDetail.storeMenuWrap} contentBox`}>
                            <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>메뉴</h3>
                            <ul className={styleStoreDetail.menuList}>
                                {storeData.menuObj && Object.entries(storeData.menuObj).map(([name, price], index) => (
                                    <li key={index} className={styleStoreDetail.menuItem}>
                                        {name} {/* 이름 직접 출력 */}
                                        <span className={styleStoreDetail.menuPrice}>
                                            {formatNumber(price)} {/* 가격 직접 출력 */}
                                        </span>
                                    </li>
                                ))}
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