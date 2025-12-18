import { useState } from "react";
import styleReview from "../../css/ReviewRgister.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// 별점 컴포넌트
const StarRating = ({ rating, setRating }) => {
  const stars = 5;

  const handleInputChange = (e) => { 
    let value = parseFloat(e.target.value);
    if (isNaN(value)) value = 0;
    if (value > stars) value = stars;
    if (value < 0) value = 0;
    setRating(value);
  };

  return (
    <div className={styleReview.starContainer} style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: stars }).map((_, index) => {
        const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);

        return (
          <div
            key={index}
            className={styleReview.starItem}
            style={{ cursor: "pointer", position: "relative" }}
            onClick={(e) => {
              const { left, width } = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - left; // 클릭 위치
              const newRating = clickX < width / 2 ? index + 0.5 : index + 1;
              setRating(newRating);
            }}
          >
            <FontAwesomeIcon icon={faStar} className={styleReview.star} />
            <div
              className={styleReview.fill}
              style={{
                width: `${fillPercentage}%`,
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0
              }}
            >
              <FontAwesomeIcon icon={faStar} className={styleReview.star} />
            </div>
          </div>
        );
      })}
      {/* 숫자 입력으로 별점 수정 */}
      <input
        type="number"
        className={styleReview.starInput}
        min={0}
        max={stars}
        step={0.1}
        value={rating}
        onChange={handleInputChange}
        onFocus={(e) => {
        e.target.value = "";
        }}
        />
    </div>
  );
};

// 리뷰 등록 모달
const ReviewRegister = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [reviewText, setReviewText] = useState("");


  if (!isOpen) return null;

  const handleFileChange = (event, setPreview) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    // 모달 창 닫기
    <div className={styleReview.modalOverlay} onClick={onClose}>
      <div
        className={styleReview.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styleReview.closeButton} onClick={onClose}>
          닫기
        </button>

        <h2>리뷰 등록</h2>

        {/* 별점 등록 */}
        <div>
        <h3>별점</h3>
        <StarRating rating={rating} setRating={setRating} />
        </div>

        {/* 이미지 업로드 */}
        <h3>이미지</h3>
        <div className={styleReview.imgBox}>
          {[imagePreview1, imagePreview2, imagePreview3].map((preview, idx) => (
            <div key={idx} className={styleReview.customFileBox}>
              <label
                htmlFor={`reviewImage${idx + 1}`}
                className={`${styleReview.customFileLabel} ${
                  preview ? "completed" : ""
                }`}
              >
                {preview ? (
                  <div className={styleReview.imagePreview}>
                    <img
                      src={preview}
                      alt={`미리보기${idx + 1}`}
                      className={styleReview.previewImage}
                    />
                  </div>
                ) : (
                  <span className={styleReview.imgText}>+</span>
                )}
              </label>
              <input
                type="file"
                id={`reviewImage${idx + 1}`}
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    idx === 0
                      ? setImagePreview1
                      : idx === 1
                      ? setImagePreview2
                      : setImagePreview3
                  )
                }
                className={styleReview.hiddenFileInput}
              />
            </div>
          ))}
        </div>

        {/* 리뷰 텍스트 */}
        <h3>내용</h3>
        <textarea
          className={styleReview.reviewBox}
          maxLength={500}
          value={reviewText}
          style={{ fontSize: 15 }}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <div style={{ fontSize: 12, color: "#555", textAlign: "right" }}>
          {reviewText.length} / 500
        </div>
        <br />
        <button type="submit">등록</button>
        
      </div>
    </div>
  );
};

export default ReviewRegister;
