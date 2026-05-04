import { Link } from "react-router-dom";
import styleSearchStore from "../css/SearchStore.module.css";
import serverUrl from "../db/server.json";

function StoreItem({store}) {
  const SERVER_URL = serverUrl.SERVER_URL;

  return (
    <li key={store.bplcSn} className={styleSearchStore.storeListItem}>
      <Link
        to={`/store/storeDetail?storeId=${store.bplcSn}`}
        className={styleSearchStore.storeListLink}
      >
        <img
          className={styleSearchStore.storeImg}
          src={`${SERVER_URL}${store.bplcPhoto}`}
          alt="store"
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
            {store.bgngTm}-{store.ddlnTm}
          </span>
          <span className={styleSearchStore.storeAddress}>
            {store.address}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default StoreItem;
