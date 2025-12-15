import styleRegionModal from "../../css/RegionModal.module.css";
import { useState } from "react";

function RegionModal({isModalOpen, setIsModalOpen}){
    const [selectedDo, setSelectedDo] = useState("");
    const [selectedSi, setSelectedSi] = useState("");
    const [selectedDong, setSelectedDong] = useState("");
    // const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(isModalOpen);

    return (
        <>
        {/* 지역 선택 모달 */}
        {setIsModalOpen && (
            <div className={styleRegionModal.regionDimmed}>
              <div className={styleRegionModal.regionDimmedMiddle}>
                    <div className={styleRegionModal.topWrap}>
                        <h2 className={styleRegionModal.heading}>지역 선택</h2>
                    </div>
                    <div className={styleRegionModal.regionContainer}>
                        {/* 도 리스트 */}
                        <div className={styleRegionModal.regionColumn}>
                                <h3 className={styleRegionModal.title}>광역시/도</h3>
                                <ul className={styleRegionModal.regionList} >
                                    <li id="경남" className={styleRegionModal.regionItem}>경남</li>
                                    <li id="경북" className={styleRegionModal.regionItem}>경북</li>
                                    <li id="경기" className={styleRegionModal.regionItem}>경기</li>
                                </ul>
                                {/* {Object.keys(regionData).map((d) => (
                                <div
                                        key={d}
                                        className={`${styleMain.regionItem} ${
                                        selectedDo === d ? styleMain.activeItem : ""
                                        }`}
                                        onClick={() => {
                                        setSelectedDo(d);
                                        setSelectedSi("");
                                        setSelectedDong("");
                                        }}
                                    >
                                        {d}
                                </div>
                                ))} */}
                        </div>

                        {/* 시 리스트 */}
                        <div className={styleRegionModal.regionColumn}>
                            <h3 className={styleRegionModal.title}>시/군/구</h3>
                            <ul className={styleRegionModal.regionList} >
                                <li id="진주시" className={styleRegionModal.regionItem}>진주시</li>
                                <li id="사천시" className={styleRegionModal.regionItem}>사천시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                                <li id="통영시" className={styleRegionModal.regionItem}>통영시</li>
                            </ul>
                            {/* {selectedDo &&
                            Object.keys(regionData[selectedDo]).map((s) => (
                                <div
                                key={s}
                                className={`${styleMain.regionItem} ${
                                    selectedSi === s ? styleMain.activeItem : ""
                                }`}
                                onClick={() => {
                                    setSelectedSi(s);
                                    setSelectedDong("");
                                }}
                                >
                                {s}
                                </div>
                            ))} */}
                        </div>

                        {/* 동 리스트 */}
                        <div className={styleRegionModal.regionColumn}>
                            <h3 className={styleRegionModal.title}>읍/면/동</h3>
                            <ul className={styleRegionModal.regionList} >
                                <li id="충무공동" className={styleRegionModal.regionItem}>충무공동</li>
                                <li id="상대동" className={styleRegionModal.regionItem}>상대동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                                <li id="가좌동" className={styleRegionModal.regionItem}>가좌동</li>
                            </ul>
                            {/* {selectedSi &&
                            regionData[selectedDo][selectedSi].map((dong) => (
                                <div
                                key={dong}
                                className={`${styleMain.regionItem} ${
                                    selectedDong === dong ? styleMain.activeItem : ""
                                }`}
                                onClick={() => setSelectedDong(dong)}
                                >
                                {dong}
                                </div>
                            ))} */}
                        </div>
                    </div>

                    <div className={styleRegionModal.bottomWrap}>
                        <button
                        className={styleRegionModal.regionConfirm}
                        onClick={() => setIsModalOpen(false)}
                        >
                        확인
                        </button>
                    </div>
                    <button className={styleRegionModal.btnClose} onClick={() => setIsModalOpen(false)}></button>
                </div>
            </div>
        )}
    </>
    )
}

export default RegionModal;