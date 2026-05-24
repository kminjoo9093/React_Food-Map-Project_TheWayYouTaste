import { Link } from "react-router-dom";
import styleSearchStore from "../css/SearchStore.module.css";
import { getStoreImage } from "../lib/utils/getStoreImage";
// import { getStoreImage } from "../lib/utils/getStoreImage copy";
import { formatTime } from "../lib/utils/formatTime";

function StoreItem({ store }) {
  return (
    <li key={store.bplcSn} className={styleSearchStore.storeListItem}>
      <Link
        to={`/store/detail/${store.bplcSn}`}
        className={styleSearchStore.storeListLink}
      >
        <div className={styleSearchStore.storeImg}>
          <img
            // src={getStoreImage(store.storeCatNo)}
            src={`https://taste-440136652.imgix.net${getStoreImage(store.storeCatNo)}?w=200&h=200&auto=format`}
            alt="가게 이미지"
          />
        </div>
        <div className={styleSearchStore.storeInfo}>
          <h2 className={styleSearchStore.storeName}>{store.bplcNm}</h2>
          <div className={styleSearchStore.avgNCat}>
            <span className={styleSearchStore.storeRating}>{store.avg}</span>
            <span className={styleSearchStore.storeCategory}>
              {store.storeCatName}
            </span>
          </div>
          <span className={styleSearchStore.storeTime}>
            {`${formatTime(store.bgngTm)} - ${formatTime(store.ddlnTm)}`}
          </span>
          <span className={styleSearchStore.storeAddress}>{store.address}</span>
        </div>
      </Link>
    </li>
  );
}

export default StoreItem;
