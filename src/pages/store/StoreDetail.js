import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import ReviewRegister from "../review/ReviewRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import styleStoreDetail from "../../css/StoreDetail.module.css";
import { GetStoreList } from "../search/GetStoreList";
import serverUrl from "../../db/server.json";

function StoreDetail({ storeList }) {
    const REVIEWS_PER_PAGE = 5;
    const navigate = useNavigate();
    
    //리뷰작성시 로그인여부 확인
    const [user, setUser] = useState(null); // 로그인 사용자 정보
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
    const [isInitialized, setIsInitialized] = useState(false); // 초기화

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // 사용자 정보가 있다면 상태에 저장
            setIsLoggedIn(true); // 로그인 상태로 설정
        }
        setIsInitialized(true);
    }, []);

    const [searchParams] = useSearchParams();
    const storeId = searchParams.get("storeId");
    const [storeData, setStoreData] = useState({});
    const SERVER_URL = serverUrl.SERVER_URL;

    const [isOpen, setIsOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function getStoreData() {
            // 음식점 데이터
            let storeInfo = await GetStoreList(`${SERVER_URL}/youtaste/search/store/detail?storeId=${storeId}`);
            setStoreData(storeInfo);
        }
        getStoreData();
    }, [storeId]);

    function formatNumber(number) {
        if (!number) return "0원";
        const parsedPrice = number.toLocaleString("ko-KR") + "원"; 
        return parsedPrice;
    }

    function showStoreImage(imgData) {
        if(imgData){
            return <img src={`${SERVER_URL}${imgData}`} alt="대표 이미지"
                        className={styleStoreDetail.storeImage}></img>;
        } else {
            return <span>등록된 이미지가 없습니다.</span>;
        }
    }

    function showAmtyServices(services) {
        if (!services || !Array.isArray(services)) {
            return null; 
        }

        let serviceType = "";
        return services.map((item, index) => {
            switch (item) {
                case "parking": serviceType = "주차 가능"; break;
                case "pet": serviceType = "애완동물 동반"; break;
                case "takeout": serviceType = "포장 가능"; break;
                default: serviceType = ""; break;
            }
            return (
                <span key={index} className={styleStoreDetail[item]}>
                    <i className={styleStoreDetail.serviceIcon}></i>
                    {serviceType}
                </span>
            );
        });
    }

    useEffect(() => {
        if (!storeId) return;
        fetch(`${SERVER_URL}/api/reviews/${storeId}`)
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

    const StarRatingView = ({ rating, starSize="1.5rem", starBoxSize="2rem", marginRight="-0.3rem", ratingFont="1.5rem"}) => {
        const stars = 5;
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {Array.from({ length: stars }).map((_, index) => {
                    const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);
                    return (
                        <div
                            key={index}
                            style={{ position: "relative", width: starBoxSize, height: starBoxSize, marginRight: marginRight }}
                        >
                            <FontAwesomeIcon icon={faStar} style={{ color: "#ccc", fontSize: starSize, marginTop: "2px" }} />
                            <div
                                style={{
                                    width: `${fillPercentage}%`,
                                    overflow: "hidden",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <FontAwesomeIcon icon={faStar} style={{ color: "#ffc107", fontSize: starSize, marginTop: "2px" }} />
                            </div>
                        </div>
                    );
                })}
                <span style={{ marginLeft: "8px", fontSize: ratingFont, fontWeight: "bold", color: "#333" }}>
                    {(rating || 0).toFixed(1)}
                </span>
            </div>
        );
    };


    // ===== 리뷰 항목 컴포넌트 (좋아요 로직 포함) =====
    const ReviewItem = ({ review }) => {
        const { evlSn, evlScr, evlCn, evlYmd, evlPhoto1, evlPhoto2, evlPhoto3, likeSum, nickname } = review;
        
        const [likes, setLikes] = useState(likeSum || 0);
        const [isLiked, setIsLiked] = useState(false);

        // 추가된 부분: 페이지 로드 시 좋아요 상태 및 최신 개수 가져오기
        useEffect(() => {
            // 최신 좋아요 개수 가져오기
            fetch(`${SERVER_URL}/api/review/${evlSn}/likes/count`)
                .then(res => res.json())
                .then(data => setLikes(data))
                .catch(err => console.error("좋아요 개수 조회 실패:", err));

            // 내가 좋아요를 눌렀는지 상태 확인 (로그인 시에만)
            if (user && user.userSn) {
                fetch(`${SERVER_URL}/api/review/${evlSn}/likes/${user.userSn}/status`)
                    .then(res => res.json())
                    .then(data => setIsLiked(data))
                    .catch(err => console.error("좋아요 상태 조회 실패:", err));
            }
        }, [evlSn, user]);

        const toggleLike = () => {
            if (!user || !user.userSn) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            const nextStatus = !isLiked;
            
            fetch(`${SERVER_URL}/api/review/${evlSn}/likes/${user.userSn}/toggle`, {
                method: 'POST'
            })
            .then(res => {
                if (!res.ok) throw new Error("좋아요 실패");
                return res.text();
            })
            .then(message => {
                setLikes(prev => nextStatus ? prev + 1 : prev - 1);
                setIsLiked(nextStatus);
            })
            .catch(err => console.error("좋아요 통신 에러:", err));
        };

        return (
            <li style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px", listStyle: "none" }}>
                <div>
                    <strong style={{display: "block"}}>{nickname}</strong>
                    <div className={styleStoreDetail.reviewBox}>
                        <div style={{display : "flex", alignItems : "center"}}>
                            <StarRatingView rating={evlScr} />
                            <span style={{margin: "0 10px", color: "#ccc"}}>│</span>
                            <small>{evlYmd}</small>
                        </div>
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
                                gap: "5px",
                                transition: "all 0.2s"
                            }}
                        >
                            <FontAwesomeIcon icon={faThumbsUp} />
                            {likes}
                        </button>
                    </div>
                </div>

                <div className={styleStoreDetail.reviewImages}>
                    {evlPhoto1 && <img src={`${SERVER_URL}/uploads/review/${evlPhoto1}`} alt="사진 1" />}
                    {evlPhoto2 && <img src={`${SERVER_URL}/uploads/review/${evlPhoto2}`} alt="사진 2" />}
                    {evlPhoto3 && <img src={`${SERVER_URL}/uploads/review/${evlPhoto3}`} alt="사진 3" />}
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

    if (!storeData.bplcNm) {
        return <div className='contentTopPosition'>정보를 불러오는 중입니다...</div>;
    }

    return (
        <div className='contentTopPosition'>
            <div className={`container ${styleStoreDetail.container}`}>
                <section className={styleStoreDetail.storeInfoArea}>
                    <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
                        <div className={styleStoreDetail.storeNameWrap}>
                            <h2 className={styleStoreDetail.storeName}>{storeData.bplcNm}</h2>
                            <span className={styleStoreDetail.storeCatName}>{storeData.storeCatName}</span>
                        </div>
                        <ul className={styleStoreDetail.detailInfoList}>
                            <li className={styleStoreDetail.ratingAvgWrap}>
                                    <StarRatingView rating={storeData.avg} starSize={"3rem"} starBoxSize={"4rem"} marginRight={"0rem"} ratingFont={"2.8rem"}/>
                            </li>
                            <li className={styleStoreDetail.time}>
                                <em className={styleStoreDetail.detailTitle}>영업시간</em>
                                {storeData.bgngTm} - {storeData.ddlnTm}
                            </li>
                            <li className={styleStoreDetail.tel}>
                                <em className={styleStoreDetail.detailTitle}>전화번호</em>
                                <a href={`tel:${storeData.tel}`} className={styleStoreDetail.telNumber}>{storeData.tel}</a>
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
                            <button
                                className={styleStoreDetail.linkWriteReview}
                                onClick={() => {
                                    if (isLoggedIn) {
                                        setIsOpen(true);
                                    } else {
                                        navigate("/login", { replace: true });
                                    }
                                }}
                            >

                                리뷰 작성
                            </button>

                            <Link to={`/store/report/${user?.userSn || ''}`} state={{ 
                                                                                        bplcSn: storeId, 
                                                                                        storeName: storeData.bplcNm, 
                                                                                        address: storeData.address,
                                                                                        userName: user?.nickname // 
                                                                                    }}className={styleStoreDetail.linkReportStore}>신고</Link>

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
                                    <span className={styleStoreDetail.menuNm}>{name}</span>
                                    <div className={styleStoreDetail.menudots}></div>
                                    <span className={styleStoreDetail.menuPrice}>
                                        {formatNumber(price)}
                                    </span>
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
                    userSn={user?.userSn} 
                />
            </div>
        </div>
    );
}

export default StoreDetail;