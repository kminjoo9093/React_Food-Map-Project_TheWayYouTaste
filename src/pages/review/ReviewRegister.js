import { useState } from "react";
import styleReview from "../../css/ReviewRgister.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const today = new Date().toISOString().split("T")[0];

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
              const clickX = e.clientX - left;
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
                left: 0,
              }}
            >
              <FontAwesomeIcon icon={faStar} className={styleReview.star} />
            </div>
          </div>
        );
      })}
      <input
        type="number"
        className={styleReview.starInput}
        min={0}
        max={stars}
        step={0.1}
        value={rating}
        onChange={handleInputChange}
        onFocus={(e) => {
          if (rating === 0) e.target.value = "";
        }}
      />
    </div>
  );
};

// 리뷰 등록 모달 - props에 bplcSn 추가
const ReviewRegister = ({ isOpen, onClose, bplcSn }) => {
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]); // [{file: File, preview: string}]
  const [reviewText, setReviewText] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => {
          const newImages = [...prev];
          newImages[index] = { file, preview: reader.result };
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // DTO 필드명 서버와 맞춤
    const reviewDto = {
      evlScr: rating,
      evlCn: reviewText,
      evlYmd: today,
      bplcSn: bplcSn, // <--- 강제로 박혀있던 1000을 넘겨받은 변수로 수정!
      userSn: 100,  
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewDto));

    // 이미지 파일 첨부
    images.forEach((imgObj) => {
      if (imgObj && imgObj.file) {
        formData.append("images", imgObj.file);
      }
    });

    try {
      const response = await fetch("http://localhost:3001/api/review", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("서버 에러 발생");

      alert("리뷰가 등록되었습니다!");
      onClose();
      window.location.reload(); // 등록 후 목록 갱신을 위해 새로고침 추가
    } catch (err) {
      console.error(err);
      alert("리뷰 등록 실패");
    }
  };

  return (
    <div className={styleReview.modalOverlay} onClick={onClose}>
      <div className={styleReview.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styleReview.closeButton} onClick={onClose}>
          X
        </button>

        <h2 style={{ textAlign: "center" }}>리뷰 등록</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <h3 style={{ marginTop: "20px" }}>별점</h3>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <h3>이미지</h3>
          <div className={styleReview.imgBox}>
            {images.map((imgObj, idx) => (
              <div key={idx} className={styleReview.customFileBox}>
                <label
                  htmlFor={`reviewImage${idx}`}
                  className={`${styleReview.customFileLabel} ${imgObj ? "completed" : ""}`}
                >
                  {imgObj ? (
                    <div className={styleReview.imagePreview}>
                      <img src={imgObj.preview} alt={`미리보기${idx + 1}`} className={styleReview.previewImage} />
                    </div>
                  ) : (
                    <span className={styleReview.imgText}>+</span>
                  )}
                </label>
                <input
                  type="file"
                  id={`reviewImage${idx}`}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, idx)}
                  className={styleReview.hiddenFileInput}
                />
              </div>
            ))}

            {(images.length === 0 || images[images.length - 1]) && images.length < 3 && (
              <div className={styleReview.customFileBox}>
                <label htmlFor={`reviewImage${images.length}`} className={styleReview.customFileLabel}>
                  <span className={styleReview.imgText}>+</span>
                </label>
                <input
                  type="file"
                  id={`reviewImage${images.length}`}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, images.length)}
                  className={styleReview.hiddenFileInput}
                />
              </div>
            )}
          </div>

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

          {rating > 0 ? (
            <button className={styleReview.subBtn} type="submit">
              등록
            </button>
          ) : (
            <button
              className={styleReview.subBtn}
              type="button"
              onClick={() => alert("입력하신 값을 다시 한번 확인해주세요")}
            >
              등록
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReviewRegister;