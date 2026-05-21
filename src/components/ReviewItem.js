import { useEffect, useState } from "react";
import styleStoreDetail from "../css/StoreDetail.module.css";
import { Navigate } from "react-router-dom";
import StarRatingView from "./StarRatingView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import serverUrl from "../config/server.json";

function ReviewItem({ review, user }) {
  const {
    evlSn,
    evlScr,
    evlCn,
    evlYmd,
    evlPhoto1,
    evlPhoto2,
    evlPhoto3,
    likeSum,
    nickname,
  } = review;

  const [likes, setLikes] = useState(likeSum || 0);
  const [isLiked, setIsLiked] = useState(false);
  const SERVER_URL = serverUrl.SERVER_URL;

  // 추가된 부분: 페이지 로드 시 좋아요 상태 및 최신 개수 가져오기
  useEffect(() => {
    // 최신 좋아요 개수 가져오기
    fetch(`${SERVER_URL}/api/review/${evlSn}/likes/count`)
      .then((res) => res.json())
      .then((data) => setLikes(data))
      .catch((err) => console.error("좋아요 개수 조회 실패:", err));

    // 내가 좋아요를 눌렀는지 상태 확인 (로그인 시에만)
    if (user && user.userSn) {
      fetch(`${SERVER_URL}/api/review/${evlSn}/likes/${user.userSn}/status`)
        .then((res) => res.json())
        .then((data) => setIsLiked(data))
        .catch((err) => console.error("좋아요 상태 조회 실패:", err));
    }
  }, [evlSn, SERVER_URL, user]);

  const toggleLike = () => {
    if (!user || !user.userSn) {
      alert("로그인이 필요합니다.");
      Navigate("/login");
      return;
    }

    const nextStatus = !isLiked;

    fetch(`${SERVER_URL}/api/review/${evlSn}/likes/${user.userSn}/toggle`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("좋아요 실패");
        return res.text();
      })
      .then((message) => {
        setLikes((prev) => (nextStatus ? prev + 1 : prev - 1));
        setIsLiked(nextStatus);
      })
      .catch((err) => console.error("좋아요 통신 에러:", err));
  };

  return (
    <li
      style={{
        borderBottom: "1px solid #eee",
        paddingBottom: "20px",
        marginBottom: "20px",
        listStyle: "none",
      }}
    >
      <div>
        <strong style={{ display: "block" }}>{nickname}</strong>
        <div className={styleStoreDetail.reviewBox}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <StarRatingView rating={evlScr} />
            <span style={{ margin: "0 10px", color: "#ccc" }}>│</span>
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
              transition: "all 0.2s",
            }}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            {likes}
          </button>
        </div>
      </div>

      <div className={styleStoreDetail.reviewImages}>
        {evlPhoto1 && (
          <img src={`${SERVER_URL}/uploads/review/${evlPhoto1}`} alt="사진 1" />
        )}
        {evlPhoto2 && (
          <img src={`${SERVER_URL}/uploads/review/${evlPhoto2}`} alt="사진 2" />
        )}
        {evlPhoto3 && (
          <img src={`${SERVER_URL}/uploads/review/${evlPhoto3}`} alt="사진 3" />
        )}
      </div>
      <p>{evlCn}</p>
    </li>
  );
}

export default ReviewItem;
