import styleRegionModal from "../../css/RegionModal.module.css";
import { useSggList } from "../hooks/queries/useSggList";
import { useDongList } from "../hooks/queries/useDongList";
import { useFilterStore, useRegionCode } from "../store/filters";

function RegionModal({ onConfirm, sidoList }) {
  const { selectedSido, selectedSgg, selectedDong } = useRegionCode();
  const setSido = useFilterStore((store)=>store.setSido);
  const setSgg = useFilterStore((store)=>store.setSgg);
  const setDong = useFilterStore((store)=>store.setDong);

  const sidoData = sidoList || [];

  //시군구 리스트
  const {
    data: sggList = [],
    isLoading: isSggLoading,
    isError: isSggError,
  } = useSggList(selectedSido);
  //읍면동 리스트
  const {
    data: dongList = [],
    isLoading: isDongLoading,
    isError: isDongError,
  } = useDongList(selectedSgg);

  return (
    <div className={styleRegionModal.regionDimmed}>
      <div className={styleRegionModal.regionDimmedMiddle}>
        <div className={styleRegionModal.topWrap}>
          <h2 className={styleRegionModal.heading}>지역 선택</h2>
          <span className={styleRegionModal.noticeMsg}>
            등록된 맛집이 있는 지역만 조회할 수 있습니다.
          </span>
        </div>
        <div className={styleRegionModal.regionContainer}>
          {/* 도 리스트 */}
          <div className={styleRegionModal.regionColumn}>
            <h3 className={styleRegionModal.title}>광역시/도</h3>
            <ul className={styleRegionModal.regionList}>
              <li
                className={`${styleRegionModal.regionItem} 
                                                    ${selectedSido === null ? styleRegionModal.activeItem : ""}`}
                onClick={() => setSido(null, "")}
              >
                전체
              </li>
              {sidoData.map((record) => (
                <li
                  key={record.id}
                  className={`${styleRegionModal.regionItem}
                                                            ${
                                                              selectedSido ===
                                                              record.sidoCd
                                                                ? styleRegionModal.activeItem
                                                                : ""
                                                            }
                                                `}
                  onClick={() => {
                    setSido(record.sidoCd, record.sidoNm);
                  }}
                >
                  {record.sidoNm}
                </li>
              ))}
            </ul>
          </div>

          {/* 시 리스트 */}
          <div className={styleRegionModal.regionColumn}>
            <h3 className={styleRegionModal.title}>시/군/구</h3>
            {selectedSido && (
              <ul className={styleRegionModal.regionList}>
                <li
                  className={`${styleRegionModal.regionItem} 
                                                    ${selectedSgg === null ? styleRegionModal.activeItem : ""}`}
                  onClick={() => setSgg(null, "")}
                >
                  전체
                </li>
                {isSggLoading ? (
                  <li>불러오는 중...</li>
                ) : isSggError ? (
                  <li>데이터를 불러오지 못했어요.</li>
                ) : (
                  sggList.map((record) => (
                    <li
                      key={record.sggCd}
                      className={`${styleRegionModal.regionItem}
                                                                ${
                                                                  selectedSgg ===
                                                                  record.sggCd
                                                                    ? styleRegionModal.activeItem
                                                                    : ""
                                                                }
                                                    `}
                      onClick={() => setSgg(record.sggCd, record.sggNm)}
                    >
                      {record.sggNm}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* 동 리스트 */}
          <div className={styleRegionModal.regionColumn}>
            <h3 className={styleRegionModal.title}>읍/면/동</h3>
            {selectedSgg && (
              <ul className={styleRegionModal.regionList}>
                <li
                  className={`${styleRegionModal.regionItem} 
                                                    ${selectedDong === null ? styleRegionModal.activeItem : ""}`}
                  onClick={() => setDong(null, "")}
                >
                  전체
                </li>
                {isDongLoading ? (
                  <li>불러오는 중...</li>
                ) : isDongError ? (
                  <li>데이터를 불러오지 못했어요.</li>
                ) : (
                  dongList.map((record) => (
                    <li
                      key={record.dgCd}
                      className={`${styleRegionModal.regionItem}
                                                        ${
                                                          selectedDong ===
                                                          record.dgCd
                                                            ? styleRegionModal.activeItem
                                                            : ""
                                                        }
                                                        `}
                      onClick={() => setDong(record.dgCd, record.dgNm)}
                    >
                      {record.dgNm}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        <div className={styleRegionModal.bottomWrap}>
          <button
            className={styleRegionModal.regionConfirm}
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
        <button
          className={styleRegionModal.btnClose}
          style={{ border: "1px solid #fff " }}
          onClick={onConfirm}
        ></button>
      </div>
    </div>
  );
}

export default RegionModal;
