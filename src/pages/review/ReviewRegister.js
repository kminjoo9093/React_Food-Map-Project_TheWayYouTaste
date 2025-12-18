import React, { useState } from "react";
import styleReview from "../../css/ReviewRgister.module.css";

// 리뷰 별 이미지
import starImage from '../../resources/img/system/review.png';

const ReviewRegister = ({ isOpen, onClose }) => {
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [reviewText, setReviewText] = useState("");

  // 모달이 열려 있을 때만 렌더링
  if (!isOpen) return null;

  const handleFileChange1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview1(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview2(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange3 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview3(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event) => {
    setReviewText(event.target.value);
  };

  return (
    
    <div className={styleReview.modalOverlay} onClick={onClose}>
      <div className={styleReview.modalContent} onClick={(e) => e.stopPropagation()}>

          <button className={styleReview.button} onClick={onClose}>닫기</button>

          <h2>리뷰 등록</h2>

        <h3>별점</h3>
              {/* 이미지로 별을 표시 */}]
              <div>
                <img
                  src={starImage}
                  alt="star"
                  style={{
                    width: '30px', 
                    height: '30px',
                    objectFit: 'cover',
                    // opacity: index < rating ? 1 : 0.2, // 별점이 낮으면 불투명도 조정
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <img
                  src={starImage}
                  alt="star"
                  style={{
                    width: '30px', 
                    height: '30px',
                    objectFit: 'cover',
                    // opacity: index < rating ? 1 : 0.2, // 별점이 낮으면 불투명도 조정
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <img
                  src={starImage}
                  alt="star"
                  style={{
                    width: '30px', 
                    height: '30px',
                    objectFit: 'cover',
                    // opacity: index < rating ? 1 : 0.2, // 별점이 낮으면 불투명도 조정
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <img
                  src={starImage}
                  alt="star"
                  style={{
                    width: '30px', 
                    height: '30px',
                    objectFit: 'cover',
                    // opacity: index < rating ? 1 : 0.2, // 별점이 낮으면 불투명도 조정
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <img
                  src={starImage}
                  alt="star"
                  style={{
                    width: '30px', 
                    height: '30px',
                    objectFit: 'cover',
                    // opacity: index < rating ? 1 : 0.2, // 별점이 낮으면 불투명도 조정
                    transition: 'opacity 0.3s ease',
                  }}
                />
              </div>

        <h3>이미지</h3>
        <div className={styleReview.imgBox}>
          {/* 첫 번째 이미지 파일 버튼 */}
          <div className={styleReview.customFileBox}>
            <label
              htmlFor="reviewImage1"
              className={`${styleReview.customFileLabel} ${imagePreview3 ? "completed" : ""}`}
            >
              {imagePreview1 ? (
                <div className={styleReview.imagePreview}>
                  <img src={imagePreview1} alt="미리보기1" className={styleReview.previewImage} />
                </div>
              ) : (
                <span className={styleReview.imgText}>+</span>
              )}
            </label>
            <input
              type="file"
              id="reviewImage1"
              accept="image/*"
              onChange={handleFileChange1}
              className={styleReview.hiddenFileInput}
            />
          </div>

          {/* 두 번째 이미지 파일 버튼 */}
          <div className={styleReview.customFileBox}>
            <label
              htmlFor="reviewImage2"
              className={`${styleReview.customFileLabel} ${imagePreview3 ? "completed" : ""}`}
            >
              {imagePreview2 ? (
                <div className={styleReview.imagePreview}>
                  <img src={imagePreview2} alt="미리보기2" className={styleReview.previewImage} />
                </div>
              ) : (
                <span className={styleReview.imgText}>+</span>
              )}
            </label>
            <input
              type="file"
              id="reviewImage2"
              accept="image/*"
              onChange={handleFileChange2}
              className={styleReview.hiddenFileInput}
            />
          </div>

          {/* 세 번째 이미지 파일 버튼 */}
          <div className={styleReview.customFileBox}>
            <label
              htmlFor="reviewImage3"
              className={`${styleReview.customFileLabel} ${imagePreview3 ? "completed" : ""}`}
            >
              {imagePreview3 ? (
                <div className="imagePreview">
                  <img src={imagePreview3} alt="미리보기3" className={styleReview.previewImage} />
                </div>
              ) : (
                <span className={styleReview.imgText}>+</span>
              )}
            </label>
            <input
              type="file"
              id="reviewImage3"
              accept="image/*"
              onChange={handleFileChange3}
              className={styleReview.hiddenFileInput}
            />
          </div>
        </div>

        <br />
        <h3>내용</h3>
        {/* 리뷰 내용 입력 */}
        <input
          className={styleReview.reviewBox}
          type="text"
          maxLength={500}
          value={reviewText}
          onChange={handleTextChange}
        />
        <br />
        <button type="submit">등록</button>
      </div>
    </div>
  );
};

export default ReviewRegister;
