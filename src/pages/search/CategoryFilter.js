import styleSearchStore from "../../css/SearchStore.module.css";

export default function CategoryFilter({storeCategories, selectedCategories, setSelectedCategories, setIsResetFilter}){

    const foodIcons = {
        "한식": "🍚"
        ,"일식": "🍣"
        ,"양식": "🍝"
        ,"중식": "🥟"
        ,"아시안": "🍜"
        ,"햄버거": "🍔"
        ,"치킨": "🍗"
        ,"디저트": "🍩"
    };

    // 카테고리 클릭 핸들러
    const onSelectCategory = (categoryName) => {
        setIsResetFilter(false);
        setSelectedCategories(prev => 
            prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
        );
    };

    return (
        <>
            <ul className={styleSearchStore.categoryList}>
                {storeCategories.map(record => (
                    <li key={record.StoreCatNo}>
                        <button 
                            className={selectedCategories.includes(record.storeCatName) ? styleSearchStore.active : ""} 
                            onClick={() => onSelectCategory(record.storeCatName)}
                        >
                            <i className={styleSearchStore.categoryEmoji}>{foodIcons[record.storeCatName]}</i>
                            {record.storeCatName}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
}