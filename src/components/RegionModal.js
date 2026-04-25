import styleRegionModal from "../../css/RegionModal.module.css";
import { useEffect, useState } from "react";
import serverUrl from "../../db/server.json";

function RegionModal({ regionState, regionSetters, onConfirm, sidoList }) {
  const { selectedSido, selectedSgg, selectedDong } = regionState;
  const {
    setSelectedSido,
    setSelectedSgg,
    setSelectedDong,
    setSidoName,
    setSggName,
    setDongName,
  } = regionSetters;
  const [sggList, setSggList] = useState([]);
  const [dongList, setDongList] = useState([]);
  const SERVER_URL = serverUrl.SERVER_URL;
  //시도 리스트 받아오기
  const sidoData = sidoList || [];
  let newSidoList = sidoData.map((record) => {
    return { id: record.sidoCd, ...record };
  });

  //시군구 리스트 받아오기
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSido) {
        setSggList([]);
        return;
      }
      try {
        // const sggListRes = await fetch(`${SERVER_URL}/youtaste/search/sgg?sidoCd=${selectedSido}`);
        const res = await fetch(`${SERVER_URL}/sgg?sidoCd=${selectedSido}`);
        const data = res.ok ? await res.json() : [];

        let list = data.map((record) => {
          return { id: record.sggCd, ...record };
        });
        setSggList(list);
      } catch (err) {
        console.log("데이터 로드 중 오류: ", err);
      }
    };

    fetchData();
  }, [selectedSido]);

  //읍면동 리스트 받아오기
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSgg) {
        setDongList([]);
        return;
      }
      try {
        // const dongListRes = await fetch(`${SERVER_URL}/youtaste/search/dong?sggCd=${selectedSgg}`);
        const dongListRes = await fetch(
          selectedSgg ? `${SERVER_URL}/dong?sggCd=${selectedSgg}` : null,
        );
        const dongListData = dongListRes.ok ? await dongListRes.json() : [];
        let list = dongListData.map((record) => {
          return { id: record.dgCd, ...record };
        });
        setDongList(list);
      } catch (err) {
        console.log("데이터 로드 중 오류: ", err);
      }
    };
    fetchData();
  }, [selectedSgg]);

  function handleSelectDo(sidoCd, sidoNm) {
    setSelectedSido(sidoCd); //code
    setSidoName(sidoNm || ""); //지역명
    setSelectedSgg(null);
    setSggName("");
    setSelectedDong(null);
    setDongName("");
  }

  function handleSelectSi(sggCd, siName) {
    setSelectedSgg(sggCd);
    setSggName(siName || "");
    setSelectedDong(null);
    setDongName("");
  }

  function handleSelectDong(dgCd, dgNm) {
    setSelectedDong(dgCd);
    setDongName(dgNm || "");
  }

  return (
    <>
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
                  onClick={() => handleSelectDo(null)}
                >
                  전체
                </li>
                {newSidoList &&
                  newSidoList.map((record) => (
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
                        handleSelectDo(record.sidoCd, record.sidoNm);
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
                    onClick={() => handleSelectSi(null)}
                  >
                    전체
                  </li>
                  {sggList &&
                    sggList.map((record) => (
                      <li
                        key={record.id}
                        className={`${styleRegionModal.regionItem}
                                                                ${
                                                                  selectedSgg ===
                                                                  record.sggCd
                                                                    ? styleRegionModal.activeItem
                                                                    : ""
                                                                }
                                                    `}
                        onClick={() =>
                          handleSelectSi(record.sggCd, record.sggNm)
                        }
                      >
                        {record.sggNm}
                      </li>
                    ))}
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
                    onClick={() => handleSelectDong(null)}
                  >
                    전체
                  </li>
                  {dongList &&
                    dongList.map((record) => (
                      <li
                        key={record.id}
                        className={`${styleRegionModal.regionItem}
                                                        ${
                                                          selectedDong ===
                                                          record.dgCd
                                                            ? styleRegionModal.activeItem
                                                            : ""
                                                        }
                                                        `}
                        onClick={() =>
                          handleSelectDong(record.dgCd, record.dgNm)
                        }
                      >
                        {record.dgNm}
                      </li>
                    ))}
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
    </>
  );
}

export default RegionModal;
