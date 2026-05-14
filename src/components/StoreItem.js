import { Link } from "react-router-dom";
import styleSearchStore from "../css/SearchStore.module.css";
import { getStoreImage } from "../lib/utils/getStoreImage";
import { formatTime } from "../lib/utils/formatTime";

function StoreItem({ store }) {
  return (
    <li key={store.bplcSn} className={styleSearchStore.storeListItem}>
      <Link
        to={`/store/storeDetail?storeId=${store.bplcSn}`}
        className={styleSearchStore.storeListLink}
      >
        <img
          className={styleSearchStore.storeImg}
          src={getStoreImage(store.storeCatNo)}
          alt="가게 이미지"
        />
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
