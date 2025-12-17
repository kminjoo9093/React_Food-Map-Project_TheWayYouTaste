import React, { useState } from "react";
import "../../css/Modal.css";

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
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>리뷰 등록</h2>

        <h3>이미지</h3>
        <div className="imgBox">
          {/* 첫 번째 이미지 파일 버튼 */}
          <div className="customFileBox">
            <label
              htmlFor="reviewImage1"
              className={`customFileLabel ${imagePreview1 ? "completed" : ""}`}
            >
              {imagePreview1 ? (
                <div className="imagePreview">
                  <img src={imagePreview1} alt="미리보기1" className="previewImage" />
                </div>
              ) : (
                <span className="imgText">+</span>
              )}
            </label>
            <input
              type="file"
              id="reviewImage1"
              accept="image/*"
              onChange={handleFileChange1}
              className="hiddenFileInput"
            />
          </div>

          {/* 두 번째 이미지 파일 버튼 */}
          <div className="customFileBox">
            <label
              htmlFor="reviewImage2"
              className={`customFileLabel ${imagePreview2 ? "completed" : ""}`}
            >
              {imagePreview2 ? (
                <div className="imagePreview">
                  <img src={imagePreview2} alt="미리보기2" className="previewImage" />
                </div>
              ) : (
                <span className="imgText">+</span>
              )}
            </label>
            <input
              type="file"
              id="reviewImage2"
              accept="image/*"
              onChange={handleFileChange2}
              className="hiddenFileInput"
            />
          </div>

          {/* 세 번째 이미지 파일 버튼 */}
          <div className="customFileBox">
            <label
              htmlFor="reviewImage3"
              className={`customFileLabel ${imagePreview3 ? "completed" : ""}`}
            >
              {imagePreview3 ? (
                <div className="imagePreview">
                  <img src={imagePreview3} alt="미리보기3" className="previewImage" />
                </div>
              ) : (
                <span className="imgText">+</span>
              )}
            </label>
            <input
              type="file"
              id="reviewImage3"
              accept="image/*"
              onChange={handleFileChange3}
              className="hiddenFileInput"
            />
          </div>
        </div>

        <br />
        <h3>내용</h3>
        {/* 리뷰 내용 입력 */}
        <input
          className="reviewBox"
          type="text"
          maxLength={50}
          value={reviewText}
          onChange={handleTextChange}
        />
        <br />
        <button className="button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ReviewRegister;
