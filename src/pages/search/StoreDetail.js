import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import starFill from "../../resources/img/search/iconStarFill.svg";
import starHalf from "../../resources/img/search/iconStarHalf.svg";
import ReviewRegister from "../../pages/review/ReviewRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import styleStoreDetail from "../../css/StoreDetail.module.css";
import { GetStoreList } from "./GetStoreList";
import { useNavigate } from "react-router-dom";

function StoreDetail({ storeList }) {

    const REVIEWS_PER_PAGE = 5;
    const navigate = useNavigate();
   
    /* 리뷰작성시 로그인여부 확인 */
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

    //console.log("sssss : ", storeList);
    //console.log("스토어 아이디 --> ", storeId);

    const [isOpen, setIsOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        async function getStoreData(){
            //음식점 데이터
            let storeInfo = await GetStoreList(`http://localhost:3001/youtaste/search/store/detail?storeId=${storeId}`);
            console.log("store info --> ", storeInfo);
            // 만약 amenity가 문자열 "parking,pet"으로 온다면 배열로 변환
            // if (storeInfo.amenity && typeof storeInfo.amenity === 'string') {
            //     storeInfo.amenity = storeInfo.amenity.split(',').map(s => s.trim());
            // }
            setStoreData(storeInfo);
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

    // function showNickName(userSn) {
    //     const user = users.find(u => u.user_sn === userSn);
    //     return user ? user.nickname : "알 수 없음";
    // }

    function showAmtyServices(services){
        //console.log(services);
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
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    // ===== 리뷰 항목 컴포넌트 (좋아요 로직 포함) =====
    const ReviewItem = ({ review }) => {
        const { evlSn, evlScr, userSn, evlCn, evlYmd, evlPhoto1, evlPhoto2, evlPhoto3, likeSum, nickname } = review;
        
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


        if (!storeData.bplcNm) {
            return <div className='contentTopPosition'>정보를 불러오는 중입니다...</div>;
        }

        return (
            <li style={{ borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px", listStyle: "none" }}>
                <div>

                    <strong style={{display: "block"}}>{nickname}</strong>

                    <div className={styleStoreDetail.reviewBox}>
                        <div style={{display : "flex", alignItems : "center"}}>
                            <StarRatingView rating={evlScr} />
                            │ 
                            <small>{evlYmd}</small>
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
                </div>

                <div className={styleStoreDetail.reviewImages}>
                    {evlPhoto2 && <img src={`http://localhost:3001/uploads/review/${evlPhoto1}`} alt="리뷰 사진 1" />}
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
                                    <StarRatingView rating={storeData.avg} starSize={"3rem"} starBoxSize={"4rem"} marginRight={"0rem"} ratingFont={"2.8rem"}/>
                                    {/* <em className={styleStoreDetail.ratingAvg}>{storeData.avg}</em> */}
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
                )
            
            }
        </div>
    );
}

export default StoreDetail;