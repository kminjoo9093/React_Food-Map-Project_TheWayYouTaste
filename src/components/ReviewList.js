import styleStoreDetail from "../css/StoreDetail.module.css";
import ReviewItem from "./ReviewItem";

function ReviewList({ reviews, loading, user }) {
  if (loading) return <p>로딩 중...</p>;
  if (reviews.length === 0) return <p>등록된 리뷰가 없습니다.</p>;
  return (
    <ul className={styleStoreDetail.reviewList} style={{ padding: 0 }}>
      {reviews.map((review) => (
        <ReviewItem key={review.evlSn} review={review} user={user}/>
      ))}
    </ul>
  );
}

export default ReviewList;