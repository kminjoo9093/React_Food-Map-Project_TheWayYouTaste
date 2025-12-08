import mainstyle from '../../css/MainPage.module.css';

const foodIcons = [
  { emoji: "🍚", label: "한식" },
  { emoji: "🍣", label: "일식" },
  { emoji: "🥟", label: "중식" },
  { emoji: "🍝", label: "양식" },
  { emoji: "🍔", label: "햄버거" },
  { emoji: "🍗", label: "치킨" },
];

const icons= [
  { emoji: "🐕", label: "반려동물허용" },
  { emoji: "🅿️", label: "주차" },
  { emoji: "🥡", label: "포장" }
];

function MainPage() {
  return (
    <>
     <h1>The Way You Taste</h1>
     <div className={mainstyle.mainContainer}>
      <h3>원하시는 식당 유형을 선택해 주세요</h3>
        <div>
          <p>필터가 들어올 곳 입니다.</p>
        </div>
        <div className={mainstyle.iconGrid}>
          {foodIcons.map((item, index) => (
            <div key={index} className={mainstyle.iconBtn}>
              {item.emoji}
              <div className={mainstyle.tooltip}>{item.label}</div>
            </div>
          ))}
        </div>
        <div className={mainstyle.iconGrid}>
          {icons.map((item, index) => (
            <div key={index} className={mainstyle.iconBtn}>
              {item.emoji}
              <div className={mainstyle.tooltip}>{item.label}</div>
            </div>
          ))}
        </div>
        <div className={mainstyle.iconRight}>
          <div className={mainstyle.iconBtn}>🔍
            <div className={mainstyle.tooltip}>검색</div>
          </div>
        </div>
      </div>
    </>

  );
}

export default MainPage;
