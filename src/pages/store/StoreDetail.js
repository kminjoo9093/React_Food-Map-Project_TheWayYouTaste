import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReviewRegister from "../review/ReviewRegister";
import styleStoreDetail from "../../css/StoreDetail.module.css";
import serverUrl from "../../config/server.json";
import { formatPrice } from "../../lib/utils/formatPrice";
import { getStoreImage } from "../../lib/utils/getStoreImage";
import { formatTime } from "../../lib/utils/formatTime";
import StarRatingView from "../../components/StarRatingView";
import ReviewList from "../../components/ReviewList";
import { useStoreDetailInfo } from "../../hooks/queries/useStoreDetailInfo";

const REVIEWS_PER_PAGE = 5;

function StoreDetail({ storeList }) {
  const navigate = useNavigate();
  const param = useParams();
  const storeId = param.id;

  //리뷰작성시 로그인여부 확인
  const [user, setUser] = useState(null); // 로그인 사용자 정보
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  // const [isInitialized, setIsInitialized] = useState(false); // 초기화

  const SERVER_URL = serverUrl.SERVER_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 사용자 정보가 있다면 상태에 저장
      setIsLoggedIn(true); // 로그인 상태로 설정
    }
    // setIsInitialized(true);
  }, []);

  const { data: storeData, isLoading } = useStoreDetailInfo(Number(storeId));

  function showAmtyServices(services) {
    if (!services || !Array.isArray(services)) {
      return null;
    }

    let serviceType = "";
    return services.map((item, index) => {
      switch (item) {
        case "parking":
          serviceType = "주차 가능";
          break;
        case "pet":
          serviceType = "애완동물 동반";
          break;
        case "takeout":
          serviceType = "포장 가능";
          break;
        default:
          serviceType = "";
          break;
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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("리뷰 불러오기 실패:", err);
        setLoading(false);
      });
  }, [storeId, SERVER_URL]);

  const indexOfLast = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirst = indexOfLast - REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="contentTopPosition">가게 정보를 불러오는 중입니다...</div>
    );
  }

  return (
    <div className="contentTopPosition">
      <div className={`container ${styleStoreDetail.container}`}>
        <section className={styleStoreDetail.storeInfoArea}>
          <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
            <div className={styleStoreDetail.storeNameWrap}>
              <h2 className={styleStoreDetail.storeName}>{storeData.bplcNm}</h2>
              <span className={styleStoreDetail.storeCatName}>
                {storeData.storeCatName}
              </span>
            </div>
            <ul className={styleStoreDetail.detailInfoList}>
              <li className={styleStoreDetail.ratingAvgWrap}>
                <StarRatingView
                  rating={storeData.avg}
                  starSize={"3rem"}
                  starBoxSize={"4rem"}
                  marginRight={"0rem"}
                  ratingFont={"2.8rem"}
                />
              </li>
              <li className={styleStoreDetail.time}>
                <em className={styleStoreDetail.detailTitle}>영업시간</em>
                {`${formatTime(storeData.bgngTm)} - ${formatTime(storeData.ddlnTm)}`}
              </li>
              <li className={styleStoreDetail.tel}>
                <em className={styleStoreDetail.detailTitle}>전화번호</em>
                <a
                  href={`tel:${storeData.tel}`}
                  className={styleStoreDetail.telNumber}
                >
                  {storeData.tel}
                </a>
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

              <Link
                to={`/store/report/${user?.userSn || ""}`}
                state={{
                  bplcSn: storeId,
                  storeName: storeData.bplcNm,
                  address: storeData.address,
                  userName: user?.nickname, //
                }}
                className={styleStoreDetail.linkReportStore}
              >
                신고
              </Link>
            </div>
          </div>
          <div className={`${styleStoreDetail.storeImgWrap} contentBox`}>
            <img
              src={getStoreImage(storeData.storeCatNo)}
              alt="가게 대표 이미지"
              className={styleStoreDetail.storeImg}
            />
          </div>
          <div className={`${styleStoreDetail.storeMenuWrap} contentBox`}>
            <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>
              메뉴
            </h3>
            <ul className={styleStoreDetail.menuList}>
              {storeData.menuObj &&
                Object.entries(storeData.menuObj).map(
                  ([name, price], index) => (
                    <li key={index} className={styleStoreDetail.menuItem}>
                      <span className={styleStoreDetail.menuNm}>{name}</span>
                      <div className={styleStoreDetail.menudots}></div>
                      <span className={styleStoreDetail.menuPrice}>
                        {formatPrice(price)}
                      </span>
                    </li>
                  ),
                )}
            </ul>
          </div>
        </section>

        <section>
          <div className={`${styleStoreDetail.reviewListWrap} contentBox`}>
            <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>
              리뷰
            </h3>
            <div className={styleStoreDetail.reviewList}>
              <ReviewList
                reviews={currentReviews}
                loading={loading}
                user={user}
              />
              <div
                className="pagination"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: page === currentPage ? "#333" : "#fff",
                        color: page === currentPage ? "#fff" : "#333",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    >
                      {page}
                    </button>
                  ),
                )}
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
