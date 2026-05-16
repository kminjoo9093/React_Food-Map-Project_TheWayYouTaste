import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function StarRatingView({
  rating,
  starSize = "1.5rem",
  starBoxSize = "2rem",
  marginRight = "-0.3rem",
  ratingFont = "1.5rem",
}) {
  const stars = 5;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: stars }).map((_, index) => {
        const fillPercentage = Math.min(
          Math.max((rating - index) * 100, 0),
          100,
        );
        return (
          <div
            key={index}
            style={{
              position: "relative",
              width: starBoxSize,
              height: starBoxSize,
              marginRight: marginRight,
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "#ccc", fontSize: starSize, marginTop: "2px" }}
            />
            <div
              style={{
                width: `${fillPercentage}%`,
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <FontAwesomeIcon
                icon={faStar}
                style={{
                  color: "#ffc107",
                  fontSize: starSize,
                  marginTop: "2px",
                }}
              />
            </div>
          </div>
        );
      })}
      <span
        style={{
          marginLeft: "8px",
          fontSize: ratingFont,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {(rating || 0).toFixed(1)}
      </span>
    </div>
  );
}

export default StarRatingView;