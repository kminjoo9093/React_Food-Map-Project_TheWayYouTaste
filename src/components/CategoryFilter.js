import styleCategory from "../css/CategoryFilter.module.css";
import { useFilterStore } from "../store/filters";

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
export default function CategoryFilter({ categories, mode }) {
  const selectedCategories = useFilterStore(
    (store) => store.selectedCategories,
  );
  const toggleCategories = useFilterStore((store) => store.toggleCategories);
  const filterClass =
    mode === "main" ? styleCategory.mainMode : styleCategory.searchMode;

  return (
    <ul className={`${styleCategory.categoryList} ${filterClass}`}>
      {categories.map((category) => (
        <li key={category.storeCatNo}>
          <button
            type="button"
            className={
              selectedCategories.includes(category.storeCatNo)
                ? styleCategory.active
                : ""
            }
            onClick={() => toggleCategories(category.storeCatNo)}
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
