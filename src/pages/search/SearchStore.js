import global from "../../css/Global.module.css";
import styleSearchStore from "../../css/SearchStore.module.css";

function SearchStore(){
    return(
        <div className={styleSearchStore.grid}>
            <div>왼쪽</div>
            <div>지도</div>
        </div>
    )
}

export default SearchStore;