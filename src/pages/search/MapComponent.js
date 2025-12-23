import { useEffect, useState } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import { GetStoreList } from "./GetStoreList";
import markerStar from "../../resources/img/search/markerStar.png";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

export default function MapComponent({ storeList, setFilteredStoreList, selectedCategories, lat, lng, isMoved, setIsMoved, isChangedRegion, onViewportChange, setPositionArea }) {
    
    // 카카오 로더 설정
    useKakaoLoader({
        appkey: "5794d8a0c2862c16e4c69ad303abfb4b",
        libraries: ["clusterer", "drawing", "services"],
    });

	//const [map, setMap] = useState(); // 지도 객체 저장용 - test

    const [center, setCenter] = useState({
        lat: lat || 37.5665,
        lng: lng || 126.9780
    });

	// 인포윈도우 Open 여부를 저장하는 state
    const [openMarkerId, setOpenMarkerId] = useState("");

	//지도 동작 상태
	//   const [isMoved, setIsMoved] = useState(false);
	//지도 동작 횟수
	//const [moveCount, setMoveCount] = useState(0);
	//지도 동작 후 저장된 리스트
	//const [filteredList, setFilteredList] = useState([]);

	//const [viewport, setViewport] = useState(null); //test


    // 1. 현재 위치 기반으로 중심점 설정
    useEffect(() => {
        if (lat && lng) {
            setCenter({ lat, lng });
        }
    }, [lat, lng]);

    // 2. 지역 변경 시 마커들의 평균 위치로 중심 이동
    useEffect(() => {
        if (!storeList || storeList.length === 0) return;
        if (!isChangedRegion) return;

		//test====================
		// if (!map || !storeList || storeList.length === 0 || !isChangedRegion) return;
		// // 모든 마커를 포함하는 경계(Bounds) 생성
		// const bounds = new kakao.maps.LatLngBounds();

		// storeList.forEach(store => {
		// 	if (store.lat && store.lot) {
		// 		bounds.extend(new kakao.maps.LatLng(store.lat, store.lot));
		// 	}
		// });

		// // 지도를 해당 영역에 맞게 조정
		// map.setBounds(bounds);

		// 1. 유효한 좌표를 가진 데이터만 필터링
		const validStores = storeList.filter(
			s => !isNaN(parseFloat(s.lat)) && !isNaN(parseFloat(s.lot))
		);

		if (validStores.length === 0) return;
		//============================================

        // API 데이터의 키값 확인: lat, lot (로그 기준)
        const avgLat = storeList.reduce((sum, s) => sum + (parseFloat(s.lat) || 0), 0) / storeList.length;
        const avgLng = storeList.reduce((sum, s) => sum + (parseFloat(s.lot) || 0), 0) / storeList.length;

		// 만약 avgLat이 0이거나 NaN이면 setCenter를 하지 않도록 방어해야 합니다.
		if (avgLat && avgLng && avgLat !== 0) {
			setCenter({ lat: avgLat, lng: avgLng });
		}

    }, [storeList, isChangedRegion]);

	//인포윈도우 표시
    function showInfoWindow(store) {
        return (
            <div style={{ padding: "5px", minWidth: "150px" }}>
                <Link to={`/search/storeDetail?storeId=${store.bplcSn}`}> 
                    {store.bplcNm}
                </Link>
            </div>
        );
    }

    return (
        <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={7}
            onIdle={(map) => {
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();

                // 부모의 state를 업데이트할 때 이전 값과 비교하여 불필요한 리렌더링 방지
                setPositionArea(prev => {
                    if (prev.swMinLat === sw.getLat() && prev.neMaxLat === ne.getLat()) return prev;
                    return {
                        swMinLat: sw.getLat(),
                        swMinLng: sw.getLng(),
                        neMaxLat: ne.getLat(),
                        neMaxLng: ne.getLng()
                    };
                });
                setIsMoved(true);
            }}
        >
            {/* 현재 위치 마커 */}
            {lat && lng && (
                <MapMarker position={{ lat, lng }}>
                    <div style={{ padding: "5px", color: "#000", textAlign: "center" }}>현재위치</div>
                </MapMarker>
            )}

            <MarkerClusterer averageCenter={true} minLevel={4}>
                {storeList.map((store) => (
                    <MapMarker
                        key={store.bplcSn}
                        position={{ lat: store.lat, lng: store.lot }}
                        title={store.bplcNm}
                        onClick={() => setOpenMarkerId(store.bplcSn)}

						// 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시
						onMouseOver={
						() => setOpenMarkerId(store.bplcSn) 
						}

						// 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거
						onMouseOut={
						() => setOpenMarkerId(store.bplcSn) 
						}
                    >
                        {openMarkerId === store.bplcSn && showInfoWindow(store)}
                    </MapMarker>
                ))}
            </MarkerClusterer>
        </Map>
    );
}