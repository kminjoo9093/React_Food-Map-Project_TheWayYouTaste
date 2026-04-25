import style from "../css/RegionSelector.module.css";
import { useState } from "react";
import RegionModal from "./RegionModal";

export default function RegionSelector({regionState, regionSetters, sidoList, isSearchArea}) {
  const [isModalOpen, setIsModalOpen] = useState(false); //지역 모달 오픈 상태

  return (
    <div>
      <div className={style.filterBox}>
        <button
          className={style.filterBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <span className={style.filterIcon}>📍</span>
          <span className={style.filterText}>
            {regionState.sidoName || regionState.sggName || regionState.dongName
              ? `${regionState.sidoName} ${regionState.sggName} ${regionState.dongName}`.trim()
              : "지역 선택"}
          </span>
          <span className={style.arrowIcon}>▼</span>
        </button>
      </div>

      {isModalOpen && (
        <RegionModal
          regionState={regionState}
          regionSetters={regionSetters}
          onConfirm={() => setIsModalOpen(false)}
          sidoList={sidoList}
        />
      )}
    </div>
  );
}
