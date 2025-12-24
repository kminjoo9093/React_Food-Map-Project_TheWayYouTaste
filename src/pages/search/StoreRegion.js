import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import styleRanking from "../../css/StoreRegion.module.css"; 
import styleMain from "../../css/MainPage.module.css";
import { GetStoreList } from "./GetStoreList";
import RegionModal from "./RegionModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCommentDots, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../Pagination";
import serverUrl from "../../db/server.json";

function StoreRegion({ storeCategories, sidoList }) {
    const SERVER_URL = serverUrl.SERVER_URL;
    const [nowPage, setNowPage] = useState(1);
    const viewPeople = 5;
    const lastMember = nowPage * viewPeople;
    const firstMember = lastMember - viewPeople;
  // const pendingMembers = members.filter(r => !r.prcsYn); 
    const nowMembers = sidoList.slice(firstMember, lastMember);

    const [storeList, setStoreList] = useState([]);
    const [sortType, setSortType] = useState("avg"); 
    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
    
    // 지역 선택 코드 상태 
    const [selectedDo, setSelectedDo] = useState(null);
    const [selectedSi, setSelectedSi] = useState(null);
    const [selectedDong, setSelectedDong] = useState(null);

    // 지역 선택 이름 상태
    const [doName, setDoName] = useState("");
    const [siName, setSiName] = useState("");
    const [dongName, setDongName] = useState("");

    const [regionName, setRegionName] = useState("전체 지역");

    // 데이터 가져오기
    const fetchRankedData = useCallback(async () => {
        let url = `${SERVER_URL}/youtaste/search/store/all`;
        
        if (selectedDong) url = `${SERVER_URL}/youtaste/search/store/dong?dongCd=${selectedDong}`;
        else if (selectedSi) url = `${SERVER_URL}/youtaste/search/store/sgg?sggCd=${selectedSi}`;
        else if (selectedDo) url = `${SERVER_URL}/youtaste/search/store/sido?sidoCd=${selectedDo}`;

        try {
            const list = await GetStoreList(url);
            setStoreList(list);
        } catch (error) {
            console.error("랭킹 데이터 로드 실패:", error);
        }
    }, [selectedDo, selectedSi, selectedDong]);

    useEffect(() => {
        fetchRankedData();
    }, [fetchRankedData]);

    // 정렬 로직 
    const sortedList = useMemo(() => {
        const list = [...storeList];
        if (sortType === "avg") {
            return list.sort((a, b) => Number(b.avg || 0) - Number(a.avg || 0));
        } else if (sortType === "review") {
            return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }
        return list;
    }, [storeList, sortType]);

    // 지역 확정 핸들러 
    const handleRegionConfirm = () => {
        const combinedName = `${doName} ${siName} ${dongName}`.trim();
        setRegionName(combinedName || "전체 지역");
        setIsDimmedMiddleOpen(false);
    };

    return (
        <div className="contentTopPosition container">
            <section className={styleRanking.rankingHeader}>
                <h2 className={styleRanking.title}>
                    <FontAwesomeIcon icon={faTrophy} style={{color: "#ffca28", marginRight: "10px"}} />
                    지역별 맛집 랭킹
                </h2>
                
                <div className={styleRanking.filterBar}>
                    {/* 지역 선택 버튼 */}
                    <button className={styleMain.filterBtn} onClick={() => setIsDimmedMiddleOpen(true)} style={{textAlign : "center"}}>
                        <span className={styleMain.filterIcon}>📍</span>
                        <span className={styleMain.filterText}>
                        {regionName}
                        </span>
                        <span className={styleMain.arrowIcon}>▼</span>
                    </button>

                    <div className={styleRanking.sortTabs}>
                        <button 
                            className={sortType === "avg" ? styleRanking.activeTab : ""} 
                            onClick={() => setSortType("avg")}
                        >
                            별점 높은 순
                        </button>
                        <button 
                            className={sortType === "review" ? styleRanking.activeTab : ""} 
                            onClick={() => setSortType("review")}
                        >
                            리뷰 많은 순
                        </button>
                    </div>
                </div>
            </section>

            <section className={styleRanking.rankingListArea}>
                <ul className={styleRanking.list}>
                    {sortedList.slice(0, 20).map((store, index) => (
                        <li key={store.bplcSn} className={styleRanking.rankItem}>
                            <div className={styleRanking.rankBadge}>{index + 1}</div>
                            
                            <Link to={`/search/storeDetail?storeId=${store.bplcSn}`} className={styleRanking.itemLink}>
                                <div className={styleRanking.imgBox}>
                                    <img src={`http://localhost:3001${store.bplcPhoto}`} alt={store.bplcNm} />
                                </div>
                                
                                <div className={styleRanking.infoBox}>
                                    <div className={styleRanking.infoTop}>
                                        <h3>{store.bplcNm}</h3>
                                        <span className={styleRanking.category}>{store.storeCatName}</span>
                                    </div>
                                    
                                    <div className={styleRanking.stats}>
                                        <span className={styleRanking.rating}>
                                            <FontAwesomeIcon icon={faStar} /> {Number(store.avg || 0).toFixed(1)}
                                        </span>
                                        <span className={styleRanking.reviews}>
                                            <FontAwesomeIcon icon={faCommentDots} /> {store.reviewCount || 0}
                                        </span>
                                    </div>
                                    
                                    <p className={styleRanking.address}>{store.address}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                {sortedList.length === 0 && <p style={{textAlign: 'center', padding: '50px'}}>해당 지역에 등록된 맛집이 없습니다.</p>}
            </section>

            {/* 지역 선택 모달 */}
            {isDimmedMiddleOpen && (
                <RegionModal 
                    setIsModalOpen={setIsDimmedMiddleOpen}
                    selectedDo={selectedDo} setSelectedDo={setSelectedDo}
                    selectedSi={selectedSi} setSelectedSi={setSelectedSi}
                    selectedDong={selectedDong} setSelectedDong={setSelectedDong}
                    setDoName={setDoName} 
                    setSiName={setSiName} 
                    setDongName={setDongName}
                    onConfirm={handleRegionConfirm} // 수정된 핸들러 연결
                    sidoList={sidoList}
                />
            )}
            <Pagination
                nowPage={nowPage}
                totalItems={sidoList.length}
                itemsPerPage={viewPeople}
                limitBlock={5}
                onPageChange={setNowPage}
            />
        </div>
    );
}

export default StoreRegion;