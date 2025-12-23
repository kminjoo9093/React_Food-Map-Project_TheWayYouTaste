import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ReviewRegister from "../../pages/review/ReviewRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import styleStoreDetail from "../../css/StoreDetail.module.css";
import { GetStoreList } from "./GetStoreList";

function StoreDetail() {
    const REVIEWS_PER_PAGE = 5;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const storeId = searchParams.get("storeId");

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [storeData, setStoreData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        async function getStoreData() {
            try {
                let storeInfo = await GetStoreList(`http://localhost:3001/youtaste/search/store/detail?storeId=${storeId}`);
                if (storeInfo && (storeInfo.status || storeInfo.error)) {
                    setStoreData(null);
                } else {
                    setStoreData(storeInfo);
                }
            } catch (err) {
                setStoreData(null);
            }
        }
        if (storeId) getStoreData();
    }, [storeId]);

    useEffect(() => {
        if (!storeId) return;
        setLoading(true);
        fetch(`http://localhost:3001/api/reviews/${storeId}`)
            .then(res => res.json())
            .then(data => {
                setReviews(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("리뷰 로드 실패", err);
                setLoading(false);
            });
    }, [storeId]);

    const formatNumber = (number) => {
        const n = Number(number);
        return isNaN(n) ? "0원" : n.toLocaleString("ko-KR") + "원";
    };

    const showAmtyServices = (services) => {
        if (!services || !Array.isArray(services) || services.length === 0) return null;
        return services.map((item, index) => {
            let serviceType = "";
            switch (item) {
                case "parking": serviceType = "주차 가능"; break;
                case "pet": serviceType = "애완동물 동반"; break;
                case "takeout": serviceType = "포장 가능"; break;
                default: serviceType = item; break;
            }
            return (
                <span key={index} className={styleStoreDetail[item]}>
                    <i className={styleStoreDetail.serviceIcon}></i> {serviceType}
                </span>
            );
        });
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // --- 내부 컴포넌트: 별점 뷰 ---
    const StarRatingView = ({ rating, starSize = "1.5rem", starBoxSize = "2rem", marginRight = "-0.3rem" }) => {
        const validRating = Number(rating) || 0;
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {Array.from({ length: 5 }).map((_, index) => {
                    const fillPercentage = Math.min(Math.max((validRating - index) * 100, 0), 100);
                    return (
                        <div key={index} style={{ position: "relative", width: starBoxSize, height: starBoxSize, marginRight }}>
                            <FontAwesomeIcon icon={faStar} style={{ color: "#ccc", fontSize: starSize }} />
                            <div style={{ width: `${fillPercentage}%`, overflow: "hidden", position: "absolute", top: 0, left: 0 }}>
                                <FontAwesomeIcon icon={faStar} style={{ color: "#ffc107", fontSize: starSize }} />
                            </div>
                        </div>
                    );
                })}
                <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{validRating.toFixed(1)}</span>
            </div>
        );
    };

    // --- 내부 컴포넌트: 리뷰 아이템 (좋아요 포함) ---
    const ReviewItem = ({ review }) => {
        const [likes, setLikes] = useState(review.likeSum || 0);
        const [isLiked, setIsLiked] = useState(false);

        useEffect(() => {
            if (user?.userSn) {
                fetch(`http://localhost:3001/api/review/${review.evlSn}/likes/${user.userSn}/status`)
                    .then(res => res.json())
                    .then(data => setIsLiked(data));
            }
        }, [review.evlSn, user]);

        const toggleLike = () => {
            if (!isLoggedIn) { alert("로그인이 필요합니다."); navigate("/login"); return; }
            const nextStatus = !isLiked;
            fetch(`http://localhost:3001/api/review/${review.evlSn}/likes/${user.userSn}/toggle`, { method: 'POST' })
                .then(() => {
                    setLikes(prev => nextStatus ? prev + 1 : prev - 1);
                    setIsLiked(nextStatus);
                });
        };

        return (
            <li className={styleStoreDetail.reviewItemRow}>
                <div className={styleStoreDetail.reviewHeader}>
                    <strong>{review.nickname}</strong>
                    <div className={styleStoreDetail.reviewMeta}>
                        <StarRatingView rating={review.evlScr} starSize="1.2rem" starBoxSize="1.5rem" />
                        <span className={styleStoreDetail.divider}>│</span>
                        <small>{review.evlYmd}</small>
                        <button onClick={toggleLike} className={`${styleStoreDetail.likeBtn} ${isLiked ? styleStoreDetail.liked : ""}`}>
                            <FontAwesomeIcon icon={faThumbsUp} /> {likes}
                        </button>
                    </div>
                </div>
                <div className={styleStoreDetail.reviewImages}>
                    {[review.evlPhoto1, review.evlPhoto2, review.evlPhoto3].map((img, i) => 
                        img && <img key={i} src={`http://localhost:3001/uploads/review/${img}`} alt="리뷰사진" />
                    )}
                </div>
                <p className={styleStoreDetail.reviewContent}>{review.evlCn}</p>
            </li>
        );
    };

    // 데이터 로딩 중
    if (!storeData || !storeData.bplcNm) {
        return <div className='contentTopPosition'>정보를 불러오는 중입니다...</div>;
    }

    const indexOfLast = currentPage * REVIEWS_PER_PAGE;
    const indexOfFirst = indexOfLast - REVIEWS_PER_PAGE;
    const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

    return (
        <div className='contentTopPosition'>
            <div className={`container ${styleStoreDetail.container}`}>
                <section className={styleStoreDetail.storeInfoArea}>
                    <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
                        <div className={styleStoreDetail.storeNameWrap}>
                            <h2 className={styleStoreDetail.storeName}>{storeData.bplcNm}</h2>
                            <span className={styleStoreDetail.categoryBadge}>{storeData.storeCatName}</span>
                        </div>
                        <ul className={styleStoreDetail.detailInfoList}>
                            <li className={styleStoreDetail.ratingAvgWrap}>
                                <StarRatingView rating={storeData.avg} starSize="3rem" starBoxSize="3.5rem" marginRight="0rem" />
                            </li>
                            <li><em className={styleStoreDetail.detailTitle}>영업시간</em> {storeData.bgngTm} - {storeData.ddlnTm}</li>
                            <li>
                                <em className={styleStoreDetail.detailTitle}>전화번호</em>
                                {storeData.tel ? <a href={`tel:${storeData.tel}`}>{storeData.tel}</a> : "정보 없음"}
                            </li>
                            <li><em className={styleStoreDetail.detailTitle}>주소</em> {storeData.address}</li>
                            <li className={styleStoreDetail.serviceTypes}>{showAmtyServices(storeData.amenity)}</li>
                        </ul>
                        <div className={styleStoreDetail.linkWrap}>
                            <button className={styleStoreDetail.linkWriteReview} onClick={() => isLoggedIn ? setIsOpen(true) : navigate("/login")}>리뷰 작성</button>
                            <Link to={`/store/report/${user?.userSn || ''}`} state={{ 
                                                                                        bplcSn: storeId, 
                                                                                        storeName: storeData.bplcNm, 
                                                                                        address: storeData.address,
                                                                                        userName: user?.nickname // 
                                                                                    }}className={styleStoreDetail.linkReportStore}>신고</Link>
                        </div>
                    </div>
                    <div className={`${styleStoreDetail.storeImageWrap} contentBox`}>
                        <img src={storeData.bplcPhoto ? `http://localhost:3001/uploads/${storeData.bplcPhoto}` : "/default-img.jpg"} alt="store" />
                    </div>
                </section>

                <section className={`${styleStoreDetail.storeMenuWrap} contentBox`}>
                    <h3 className="contentHeading">메뉴</h3>
                    <ul className={styleStoreDetail.menuList}>
                        {storeData.menuObj && Object.entries(storeData.menuObj).map(([name, price], idx) => (
                            <li key={idx} className={styleStoreDetail.menuItem}>
                                {name} <span className={styleStoreDetail.menuPrice}>{formatNumber(price)}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={`${styleStoreDetail.reviewListWrap} contentBox`}>
                    <h3 className="contentHeading">리뷰</h3>
                    {loading ? <p>로딩 중...</p> : (
                        <>
                            <ul className={styleStoreDetail.reviewList}>
                                {currentReviews.length > 0 ? currentReviews.map(r => <ReviewItem key={r.evlSn} review={r} />) : <p>등록된 리뷰가 없습니다.</p>}
                            </ul>
                            <div className={styleStoreDetail.pagination}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page} 
                                        onClick={() => handlePageChange(page)}
                                        className={page === currentPage ? styleStoreDetail.activePage : ""}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <ReviewRegister isOpen={isOpen} onClose={() => setIsOpen(false)} bplcSn={storeId} userSn={user?.userSn} />
            </div>
        </div>
    );
}

export default StoreDetail;