import styleStoreDetail from "../../css/StoreDetail.module.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import starFill from "../../resources/img/search/iconStarFill.svg";
import starHalf from "../../resources/img/search/iconStarHalf.svg";
import ReviewRegister from "../../pages/review/ReviewRegister";

const REVIEWS_PER_PAGE = 10;

function StoreDetail({ storeList, storeId }) {
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

  // ===== 리뷰 데이터 fetch =====
  useEffect(() => {
    fetch(`/api/reviews?storeId=${storeId}`) // 실제 API 주소 사용
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("리뷰 불러오기 실패:", err);
        setLoading(false);
      });
  }, [storeId]);

  // ===== 페이징 계산 =====
  const indexOfLast = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirst = indexOfLast - REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="contentTopPosition">
      <div className={`container ${styleStoreDetail.container}`}>
        {/* 상단 정보 */}
        <section className={styleStoreDetail.storeInfoArea}>
          <div className={`${styleStoreDetail.storeInfoWrap} contentBox`}>
            <div className={styleStoreDetail.storeNameWrap}>
              <h2 className={styleStoreDetail.storeName}>천황식당</h2>
              <span>한식</span>
            </div>
            <ul className={styleStoreDetail.detailInfoList}>
              <li className={styleStoreDetail.ratingAvgWrap}>
                <img src={starFill} className={styleStoreDetail.ratingStarImg} />
                <img src={starFill} className={styleStoreDetail.ratingStarImg} />
                <img src={starFill} className={styleStoreDetail.ratingStarImg} />
                <img src={starFill} className={styleStoreDetail.ratingStarImg} />
                <img src={starHalf} className={styleStoreDetail.ratingStarImg} />
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
              <button className={styleStoreDetail.linkWriteReview} onClick={() => setIsOpen(true)}>리뷰 작성</button>
              <Link to="/store/report/:userSn" className={styleStoreDetail.linkReportStore}>신고</Link>
            </div>
          </div>

          <div className={`${styleStoreDetail.storeImageWrap} contentBox`}>
            이미지
          </div>

          {/* 메뉴 */}
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

        {/* 리뷰 */}
        <section>
          <div className={`${styleStoreDetail.storeMenuWrap} contentBox`}>
            <h3 className={`${styleStoreDetail.menuHeading} contentHeading`}>리뷰</h3>
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <>
                <ul className={styleStoreDetail.menuList}>
                  {currentReviews.map(review => (
                    <li key={review.id} className={styleStoreDetail.menuItem}>
                      <strong>{review.author}</strong>
                      <span>⭐ {review.rating}</span>
                      <p>{review.content}</p>
                      <small>{review.createdAt}</small>
                    </li>
                  ))}
                </ul>

                {/* 페이지 버튼 */}
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={page === currentPage ? "active" : ""}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <ReviewRegister isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}

export default StoreDetail;
