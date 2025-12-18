import styleRegionModal from "../../css/RegionModal.module.css";
import { useEffect, useState } from "react";
import UseSearchStoreFetch from "./hook/UseSearchStoreFetch";

function RegionModal({isModalOpen, setIsModalOpen, selectedDo, setSelectedDo, selectedSi, setSelectedSi, selectedDong, setSelectedDong, onConfirm
                        , doName, setDoName, siName, setSiName, dongName, setDongName
    }){
    // const [selectedDo, setSelectedDo] = useState();
    // const [selectedSi, setSelectedSi] = useState(null);
    // const [selectedDong, setSelectedDong] = useState(null);

    // const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(isModalOpen);

    const sidoData = UseSearchStoreFetch("http://localhost:3001/sido");
    const sigunguData = UseSearchStoreFetch(selectedDo ? `http://localhost:3001/sigungu?sidoCode=${selectedDo}` : null);
    const dongData = UseSearchStoreFetch(selectedSi ? `http://localhost:3001/dong?sigunguCode=${selectedSi}` : null);

    // console.log("herehere", dongData);

    let sidoList = sidoData.map(record => {
        return {"id" : record.sidoCode, ...record}
    });
    
    let sigunguList = sigunguData.map(record => {
        return {"id" : record.sigunguCode, ...record}
    });

    let dongDataList;
    try {
        let dongList = dongData[0].dongList;
        dongDataList = dongList.map(record => {
            record =  {id : record.dongCode, ...record};
            return record;
        });
    } catch (error) {
        dongDataList = [];
    }
    // console.log("here:", dongList);
    //console.log("시도 리스트:", sidoList);
    useEffect(()=>{
        console.log("선택된 시도 코드 :" , selectedDo);
    }, [selectedDo]);

    useEffect(()=>{
        console.log("선택된 시군구 코드 :" , selectedSi);
    }, [selectedSi]);

    useEffect(()=>{
        console.log("선택된 동 코드 :" , selectedDong);
    }, [selectedDong]);

    function handleSelectDo(sidoCode, sidoName){
        setSelectedDo(sidoCode);
        setDoName(sidoName || "");
        setSelectedSi(null);
        setSiName("");
        setSelectedDong(null);
        setDongName("");
    }

    function handleSelectSi(sigunguCode, siName){
    setSelectedSi(sigunguCode);
    setSiName(siName || "");
    setSelectedDong(null);
    setDongName("");
    }

    function handleSelectDong(dongCode, dongName){
        setSelectedDong(dongCode);
        setDongName(dongName || "");
    }

    return (
        <>
        {/* 지역 선택 모달 */}
        {setIsModalOpen && (
            <div className={styleRegionModal.regionDimmed}>
              <div className={styleRegionModal.regionDimmedMiddle}>
                    <div className={styleRegionModal.topWrap}>
                        <h2 className={styleRegionModal.heading}>지역 선택</h2>
                        <span className={styleRegionModal.noticeMsg}>등록된 맛집이 있는 지역만 조회할 수 있습니다.</span>
                    </div>
                    <div className={styleRegionModal.regionContainer}>
                        {/* 도 리스트 */}
                        <div className={styleRegionModal.regionColumn}>
                                <h3 className={styleRegionModal.title}>광역시/도</h3>
                                <ul className={styleRegionModal.regionList} >
                                    <li className={`${styleRegionModal.regionItem} 
                                                    ${selectedDo === null ? styleRegionModal.activeItem : ""}`} 
                                        onClick={()=>handleSelectDo(null)}>전체</li>
                                    {
                                        sidoList.map(record => (
                                            <li key={record.id} 
                                                className={`${styleRegionModal.regionItem}
                                                            ${selectedDo === record.sidoCode 
                                                                ? styleRegionModal.activeItem : ""}
                                                `}
                                                onClick={()=> handleSelectDo(record.sidoCode, record.sidoName)}
                                                >
                                                {record.sidoName}
                                            </li>
                                        ))
                                        
                                    }
                                </ul>
                        </div>

                        {/* 시 리스트 */}
                        <div className={styleRegionModal.regionColumn}>
                            <h3 className={styleRegionModal.title}>시/군/구</h3>
                            {selectedDo && 
                                <ul className={styleRegionModal.regionList} >
                                    <li className={`${styleRegionModal.regionItem} 
                                                    ${selectedSi === null ? styleRegionModal.activeItem : ""}`} 
                                        onClick={()=>handleSelectSi(null)}>전체</li>
                                    {
                                        sigunguList.map(record => (
                                            <li key={record.id} 
                                                className={`${styleRegionModal.regionItem}
                                                                ${selectedSi === record.sigunguCode 
                                                                    ? styleRegionModal.activeItem : ""}
                                                    `}
                                                onClick={()=> handleSelectSi(record.sigunguCode, record.sigunguName)}
                                                >
                                                {record.sigunguName}
                                            </li>
                                        ))
                                        
                                    }
                                </ul>
                            }
                        
                        </div>

                        {/* 동 리스트 */}
                        <div className={styleRegionModal.regionColumn}>
                            <h3 className={styleRegionModal.title}>읍/면/동</h3>
                            {selectedSi && 
                                <ul className={styleRegionModal.regionList} >
                                    <li className={`${styleRegionModal.regionItem} 
                                                    ${selectedDong === null ? styleRegionModal.activeItem : ""}`} 
                                        onClick={()=>handleSelectDong(null)}>전체</li>
                                    {
                                        dongDataList.map(record => (
                                        <li key={record.id} 
                                            className={`${styleRegionModal.regionItem}
                                                        ${selectedDong === record.dongCode 
                                                            ? styleRegionModal.activeItem : ""}
                                                        `}
                                            onClick={()=> handleSelectDong(record.dongCode, record.dongName)}
                                            >
                                            {record.dongName}
                                        </li>
                                        ))
                                    }
                                </ul>
                            }
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
                    <button className={styleRegionModal.btnClose} onClick={()=>setIsModalOpen(false)}></button>
                </div>
            </div>
        )}
    </>
    )
}

export default RegionModal;