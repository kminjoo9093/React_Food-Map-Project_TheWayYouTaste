import style from "../css/RegionSelector.module.css";
import { useState } from "react";
import RegionModal from "./RegionModal";
import { useDongName, useSggName, useSidoName } from "../store/filters";
import type { SearchMode } from "../types";

interface RegionSelectorProps {
  sidoList: any; //임시. Sido 타입 정의 후 any 제거
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode)=>void
}

export default function RegionSelector({
  sidoList,
  searchMode,
  setSearchMode,
}: RegionSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); //지역 모달 오픈 상태
  const sidoName = useSidoName();
  const sggName = useSggName();
  const dongName = useDongName();

  return (
    <div>
      <div className={style.filterBox}>
        <button
          className={style.filterBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <span className={style.filterIcon}>📍</span>
          <span className={style.filterText}>
            {searchMode === "bounds"
              ? "범위 내 검색"
              : sidoName || sggName || dongName
                ? `${sidoName} ${sggName} ${dongName}`.trim()
                : "지역 선택"}
          </span>
          <span className={style.arrowIcon}>▼</span>
        </button>
      </div>

      {isModalOpen && (
        <RegionModal
          setIsModalOpen={setIsModalOpen}
          sidoList={sidoList}
          setSearchMode={setSearchMode}
        />
      )}
    </div>
  );
}
