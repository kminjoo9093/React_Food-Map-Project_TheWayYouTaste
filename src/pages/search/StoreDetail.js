import styleGlobal from "../../css/Global.module.css";
import styleStoreDetail from "../../css/StoreDetail.module.css";
import { Link } from "react-router-dom";

function StoreDetail(){
    return (
        <>
            <div className={`${styleGlobal.container} ${styleStoreDetail.container}`}>
                <section className={styleStoreDetail.storeInfoArea}>
                    <div className={styleStoreDetail.storeInfoWrap}>
                        <div className={styleStoreDetail.storeNameWrap}>
                            <h2 className={styleStoreDetail.storeName}>상호명</h2>
                            <span>카테고리</span>
                        </div>
                        <ul>
                            <li>별점 총점</li>
                            <li>영업시간</li>
                            <li>주소</li>
                        </ul>
                        <div className={styleStoreDetail.linkWrap}>
                            <Link to="#" className={styleStoreDetail.linkWriteReview}>리뷰 작성</Link>
                            <Link to="#" className={styleStoreDetail.linkReportStore}>신고</Link>
                        </div>
                    </div>
                    <div className={styleStoreDetail.storeImageWrap}>
                        이미지
                    </div>
                    <div className={styleStoreDetail.storeMenuWrap}>
                        메뉴, 편의정보
                    </div>
                </section>
                <section className={styleStoreDetail.storeReviewArea}>
                    리뷰
                </section>
            </div>
        </>
    )
}

export default StoreDetail;