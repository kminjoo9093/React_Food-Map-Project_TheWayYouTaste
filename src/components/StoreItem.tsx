import { Link } from "react-router-dom";
import styleSearchStore from "../css/SearchStore.module.css";
import { getStoreImage } from "../lib/utils/getStoreImage";
import { formatTime } from "../lib/utils/formatTime";
import { Store } from "../types/store.types";
import { getImageCdn } from "../lib/utils/getImageCdn";

function StoreItem({ store }: { store: Store }) {
  return (
    <li key={store.bplcSn} className={styleSearchStore.storeListItem}>
      <Link
        to={`/store/detail/${store.bplcSn}`}
        className={styleSearchStore.storeListLink}
      >
        <div className={styleSearchStore.storeImg}>
          <img
            src={getImageCdn(getStoreImage(store.storeCatNo), "w_200,h_200")}
            alt={`${store.bplcNm} 식당 대표 이미지`}
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
