import styleStoreDetail from "../../css/StoreDetail.module.css";
import { Link } from "react-router-dom";
import UseSearchStoreFetch from "./hook/UseSearchStoreFetch";
import starFill from "../../resources/img/search/iconStarFill.svg";
import starHalf from "../../resources/img/search/iconStarHalf.svg";

function StoreDetail(){
    const menuData = [
        {   
            "MENU_SN": 1111
            ,"BPLC_SN": 1
            ,"MENU_NM": "메뉴1"
            ,"MENU_PRC": 11000
        }
        ,{   
            "MENU_SN": 2222
            ,"BPLC_SN": 1
            ,"MENU_NM": "메뉴2"
            ,"MENU_PRC": 12000
        }
        ,{   
            "MENU_SN": 3333
            ,"BPLC_SN": 1
            ,"MENU_NM": "메뉴3"
            ,"MENU_PRC": 13000
        }
        ,{   
            "MENU_SN": 4444
            ,"BPLC_SN": 1
            ,"MENU_NM": "메뉴4"
            ,"MENU_PRC": 14000
        }
        ,{   
            "MENU_SN": 5555
            ,"BPLC_SN": 1
            ,"MENU_NM": "메뉴5"
            ,"MENU_PRC": 15000
        }
        ,{   
            "MENU_SN": 6666
            ,"BPLC_SN": 1
            ,"MENU_NM": "메뉴6"
            ,"MENU_PRC": 16000
        }
    ]

    // const menuData = UseSearchStoreFetch(`http://localhost:3001/search/storeDetail?BPLC_SN=${BPLCSN}`);
    console.log(menuData);

    let menuList = menuData.map(record => {
            return {"id" : record.MENU_SN, ...record}
        });

    function formatNumber(number){
        const parsedPrice = number.toLocaleString("ko-KR") + "원"; 
        return parsedPrice;
    }

    return (
        <div className='contentTopPosition'>
            <div className={`container ${styleStoreDetail.container}`}>
                <section className={styleStoreDetail.storeInfoArea}>
                    <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
                        <div className={styleStoreDetail.storeNameWrap}>
                            <h2 className={styleStoreDetail.storeName}>천황식당</h2>
                            <span>한식</span>
                        </div>
                        <ul className={styleStoreDetail.detailInfoList}>
                            <li className={styleStoreDetail.ratingAvgWrap}>
                                <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                <img src={starFill} className={styleStoreDetail.ratingStarImg}/>
                                <img src={starHalf} className={styleStoreDetail.ratingStarImg}/>
                                <em className={styleStoreDetail.ratingAvg}>4.5</em>
                            </li>
                            <li className={styleStoreDetail.time}>
                                <em className={styleStoreDetail.detailTitle}>영업시간</em>
                                09:00 - 21:00
                            </li>
                            <li className={styleStoreDetail.tel}>
                                <em className={styleStoreDetail.detailTitle}>전화번호</em>
                                <a href="tel:+01011111001" className={styleStoreDetail.telNumber}>010-1111-1001</a>
                            </li>
                            <li className={styleStoreDetail.address}>
                                <em className={styleStoreDetail.detailTitle}>주소</em>
                                경남 진주시 촉석로207번길 3
                            </li>
                            <li className={styleStoreDetail.serviceTypes}>
                                <span className={styleStoreDetail.parking}><i className={styleStoreDetail.serviceIcon}></i>주차 가능</span>
                                <span className={styleStoreDetail.pet}><i className={styleStoreDetail.serviceIcon}></i>애완동물 동반</span>
                                <span className={styleStoreDetail.takeOut}><i className={styleStoreDetail.serviceIcon}></i>포장 가능</span>
                            </li>
                        </ul>
                        <div className={styleStoreDetail.linkWrap}>
                            <Link to="#" className={styleStoreDetail.linkWriteReview}>리뷰 작성</Link>
                            <Link to="#" className={styleStoreDetail.linkReportStore}>신고</Link>
                        </div>
                    </div>
                    <div className={`${styleStoreDetail.storeImageWrap} contentBox`}>
                        이미지
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
            </div>
        </div>
    )
}

export default StoreDetail;