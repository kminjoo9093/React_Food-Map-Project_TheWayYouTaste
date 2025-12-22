import styleStoreDetail from "../../css/StoreDetail.module.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import starFill from "../../resources/img/search/iconStarFill.svg";
import starHalf from "../../resources/img/search/iconStarHalf.svg";
import ReviewRegister from "../../pages/review/ReviewRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const REVIEWS_PER_PAGE = 5;

function StoreDetail({ storeList }) {
    const { storeId } = useParams(); 
    const [isOpen, setIsOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const menuData = [
        { "MENU_SN": 1111, "BPLC_SN": 1, "MENU_NM": "메뉴1", "MENU_PRC": 11000 },
        { "MENU_SN": 2222, "BPLC_SN": 1, "MENU_NM": "메뉴2", "MENU_PRC": 12000 },
        { "MENU_SN": 3333, "BPLC_SN": 1, "MENU_NM": "메뉴3", "MENU_PRC": 13000 },
        { "MENU_SN": 4444, "BPLC_SN": 1, "MENU_NM": "메뉴4", "MENU_PRC": 14000 },
        { "MENU_SN": 5555, "BPLC_SN": 1, "MENU_NM": "메뉴5", "MENU_PRC": 15000 },
        { "MENU_SN": 6666, "BPLC_SN": 1, "MENU_NM": "메뉴6", "MENU_PRC": 16000 },
    ];

    const menuList = menuData.map(record => ({ id: record.MENU_SN, ...record }));

    function formatNumber(number) {
        return number.toLocaleString("ko-KR") + "원";
    }

    useEffect(() => {
        if (!storeId) return;

        fetch(`http://localhost:3001/api/reviews/${storeId}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("리뷰 불러오기 실패:", err);
                setLoading(false);
            });
    }, [storeId]);

    const indexOfLast = currentPage * REVIEWS_PER_PAGE;
    const indexOfFirst = indexOfLast - REVIEWS_PER_PAGE;
    const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const StarRatingView = ({ rating }) => {
        const stars = 5;
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {Array.from({ length: stars }).map((_, index) => {
                    const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);
                    return (
                        <div
                            key={index}
                            style={{ position: "relative", width: "2rem", height: "2rem", marginRight: "-0.3rem" }}
                        >
                            <FontAwesomeIcon icon={faStar} style={{ color: "#ccc" }} />
                            <div
                                style={{
                                    width: `${fillPercentage}%`,
                                    overflow: "hidden",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <FontAwesomeIcon icon={faStar} style={{ color: "#ffc107" }} />
                            </div>
                        </div>
                    );
                })}
                <span style={{ marginLeft: "8px", fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    // ===== 리뷰 항목 컴포넌트 (좋아요 로직 포함) =====
    const ReviewItem = ({ review }) => {
        const { evlSn, evlScr, userSn, evlCn, evlYmd, evlPhoto1, evlPhoto2, evlPhoto3, likeSum } = review;
        
        // 각각의 리뷰 아이템이 자신의 좋아요 상태를 가짐
        const [likes, setLikes] = useState(likeSum || 0);
        const [isLiked, setIsLiked] = useState(false);

        const toggleLike = () => {
            const nextStatus = !isLiked;
            fetch(`http://localhost:3001/api/review/like/${evlSn}?isPlus=${nextStatus}`, {
                method: 'POST'
            })
            .then(res => res.json())
            .then(updatedCount => {
                setLikes(updatedCount);
                setIsLiked(nextStatus);
            })
            .catch(err => console.error("좋아요 통신 에러:", err));
        };

        return (
            <li style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px", listStyle: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <StarRatingView rating={evlScr} />
                        <small>{evlYmd}</small> <br/>
                        <strong>사용자 {userSn}</strong>
                    </div>
                    {/* 좋아요 버튼 추가 */}
                    <button 
                        onClick={toggleLike}
                        style={{
                            cursor: "pointer",
                            border: "1px solid #ddd",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            backgroundColor: isLiked ? "#ff4757" : "#fff",
                            color: isLiked ? "#fff" : "#333",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                        }}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {likes}
                    </button>
                </div>

                <div className={styleStoreDetail.reviewImages}>
                    {evlPhoto1 && <img src={`http://localhost:3001/uploads/review/${evlPhoto1}`} alt="리뷰 사진 1" />}
                    {evlPhoto2 && <img src={`http://localhost:3001/uploads/review/${evlPhoto2}`} alt="리뷰 사진 2" />}
                    {evlPhoto3 && <img src={`http://localhost:3001/uploads/review/${evlPhoto3}`} alt="리뷰 사진 3" />}
                </div>
                <p>{evlCn}</p>
            </li>
        );
    };

    const ReviewList = ({ reviews, loading }) => {
        if (loading) return <p>로딩 중...</p>;
        if (reviews.length === 0) return <p>등록된 리뷰가 없습니다.</p>;
        return (
            <ul className={styleStoreDetail.reviewList} style={{ padding: 0 }}>
                {reviews.map((review) => (
                    <ReviewItem key={review.evlSn} review={review} />
                ))}
            </ul>
        );
    };

    return (
        <div className="contentTopPosition">
            <div className={`container ${styleStoreDetail.container}`}>
                <section className={styleStoreDetail.storeInfoArea}>
                    <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
                        <div className={styleStoreDetail.storeNameWrap}>
                            <h2 className={styleStoreDetail.storeName}>천황식당</h2>
                            <span>한식</span>
                        {/* 스토어 별점 */}
                        </div>
                        <ul className={styleStoreDetail.detailInfoList}>
                            <li className={styleStoreDetail.ratingAvgWrap}>
                                <img src={starFill} className={styleStoreDetail.ratingStarImg} alt="star" />
                                <img src={starFill} className={styleStoreDetail.ratingStarImg} alt="star" />
                                <img src={starFill} className={styleStoreDetail.ratingStarImg} alt="star" />
                                <img src={starFill} className={styleStoreDetail.ratingStarImg} alt="star" />
                                <img src={starHalf} className={styleStoreDetail.ratingStarImg} alt="star" />
                                <em className={styleStoreDetail.ratingAvg}>4.5</em>
                            </li>
                            <li className={styleStoreDetail.time}><em className={styleStoreDetail.detailTitle}>영업시간</em> 09:00 - 21:00</li>
                            <li className={styleStoreDetail.tel}><em className={styleStoreDetail.detailTitle}>전화번호</em> <a href="tel:+01011111001" className={styleStoreDetail.telNumber}>010-1111-1001</a></li>
                            <li className={styleStoreDetail.address}><em className={styleStoreDetail.detailTitle}>주소</em> 경남 진주시 촉석로207번길 3</li>
                            <li className={styleStoreDetail.serviceTypes}>
                                <span className={styleStoreDetail.parking}><i className={styleStoreDetail.serviceIcon}></i>주차 가능</span>
                                <span className={styleStoreDetail.pet}><i className={styleStoreDetail.serviceIcon}></i>애완동물 동반</span>
                                <span className={styleStoreDetail.takeOut}><i className={styleStoreDetail.serviceIcon}></i>포장 가능</span>
                            </li>
                        </ul>
                        <div className={styleStoreDetail.linkWrap}>
                            <button className={styleStoreDetail.linkWriteReview} onClick={() => setIsOpen(true)}>리뷰 작성</button>
                            <Link to="/store/report/:userSn" className={styleStoreDetail.linkReportStore}>신고</Link>
                        </div>
                    </div>

                    <div className={`${styleStoreDetail.storeImageWrap} contentBox`}>이미지</div>

                    <div className={`${styleStoreDetail.storeMenuWrap} contentBox`}>
                        <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>메뉴</h3>
                        <ul className={styleStoreDetail.menuList}>
                            {menuList.map(record => (
                                <li key={record.id} className={styleStoreDetail.menuItem}>
                                    {record.MENU_NM}
                                    <span className={styleStoreDetail.menuPrice}>{formatNumber(record.MENU_PRC)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section>
                    <div className={`${styleStoreDetail.reviewListWrap} contentBox`}>
                        <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>리뷰</h3>
                        <div className={styleStoreDetail.reviewList}>
                            <ReviewList reviews={currentReviews} loading={loading} />
                            <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: page === currentPage ? "#333" : "#fff",
                                            color: page === currentPage ? "#fff" : "#333",
                                            border: "1px solid #ccc",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <ReviewRegister 
                    isOpen={isOpen} 
                    onClose={() => setIsOpen(false)} 
                    bplcSn={storeId} 
                />
            </div>
        </div>
    );
}

export default StoreDetail;