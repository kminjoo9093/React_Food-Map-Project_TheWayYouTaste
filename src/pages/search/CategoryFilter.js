import styleSearchStore from "../../css/SearchStore.module.css";

export default function CategoryFilter({storeCategories, selectedCategories, setSelectedCategories, setIsResetFilter, mode}){
    const foodIcons = {
        "한식": "🍚", "일식": "🍣", "양식": "🍝", "중식": "🥟",
        "아시안": "🍜", "햄버거": "🍔", "치킨": "🍗", "디저트": "🍩"
    };

    const filterClass = mode === 'main' ? styleSearchStore.mainMode : styleSearchStore.searchMode;

    const onSelectCategory = (categoryName) => {
        setIsResetFilter(false);
        setSelectedCategories(prev => 
            prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
        );
    };

    return (
       <ul className={`${styleSearchStore.categoryList} ${filterClass}`}>
            {storeCategories.map(record => (
                <li key={record.storeCatNo}>
                    <button 
                        type="button" /* 타입 명시 */
                        className={selectedCategories.includes(record.storeCatName) ? styleSearchStore.active : ""} 
                        onClick={() => onSelectCategory(record.storeCatName)}
                    >
                        <span className={styleSearchStore.categoryEmoji}>
                            {foodIcons[record.storeCatName] || "🍴"}
                        </span>
                        <span className={styleSearchStore.categoryText}>
                            {record.storeCatName}
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}