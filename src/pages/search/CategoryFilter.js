import styleCategory from "../../css/CategoryFilter.module.css";

const foodIcons = {
  c01: "🍚",
  c02: "🍣",
  c03: "🍝",
  c04: "🥟",
  c05: "🍜",
  c06: "🍔",
  c07: "🍗",
  c08: "🍩",
};
export default function CategoryFilter({
  categories,
  selectedCategories,
  setSelectedCategories,
  setIsResetFilter,
  mode,
}) {
  const filterClass =
    mode === "main" ? styleCategory.mainMode : styleCategory.searchMode;

  const onSelectCategory = (categoryName) => {
    setIsResetFilter(false);
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
  };

  return (
    <ul className={`${styleCategory.categoryList} ${filterClass}`}>
      {categories.map((category) => (
        <li key={category.storeCatNo}>
          <button
            type="button"
            className={
              selectedCategories.includes(category.storeCatName)
                ? styleCategory.active
                : ""
            }
            onClick={() => onSelectCategory(category.storeCatName)}
          >
            <span className={styleCategory.categoryEmoji}>
              {foodIcons[category.storeCatNo] || "🍴"}
            </span>
            <span className={styleCategory.categoryText}>
              {category.storeCatName}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
