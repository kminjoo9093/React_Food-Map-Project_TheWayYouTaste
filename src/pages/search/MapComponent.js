import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import { Map, MapMarker, MarkerClusterer, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import iconStar from "../../resources/img/search/iconStar.svg";
import iconCategory from "../../resources/img/search/iconTag.svg";
import styleMap from "../../css/Map.module.css";
import serverUrl from "../../db/server.json"; 

export default function MapComponent({ storeList, lat, lng, setIsMoved, isChangedRegion, setPositionArea, isSelectedAll }) {
    
    // 카카오 로더 설정
    useKakaoLoader({
        appkey: "5794d8a0c2862c16e4c69ad303abfb4b",
        libraries: ["clusterer", "drawing", "services"],
    });

    const [center, setCenter] = useState({
        lat: lat || 37.5665,
        lng: lng || 126.9780
    });
    const SERVER_URL = serverUrl.SERVER_URL;
    //지도 레벨
    const [level, setLevel] = useState(7);

	// 인포윈도우 Open 여부를 저장하는 state
    const [openMarkerId, setOpenMarkerId] = useState("");

    // 1. 현재 위치 기반으로 중심점 설정
    useEffect(() => {
        if (lat && lng) {
            setCenter({ lat, lng });
        }
    }, [lat, lng]);

    useEffect(()=>{ 
        if(isSelectedAll){
            setLevel(12);
        } else {
            setLevel(7);
        }
    }, [isSelectedAll])    

    // 2. 지역 변경 시 마커들의 평균 위치로 중심 이동
    useEffect(() => {
        if (!storeList || storeList.length === 0) return;
        if (!isChangedRegion) return;

		// 1. 유효한 좌표를 가진 데이터만 필터링
		const validStores = storeList.filter(
			s => !isNaN(parseFloat(s.lat)) && !isNaN(parseFloat(s.lot))
		);

		if (validStores.length === 0) return;

        // API 데이터의 키값 확인: lat, lot (로그 기준)
        const avgLat = storeList.reduce((sum, s) => sum + (parseFloat(s.lat) || 0), 0) / storeList.length;
        const avgLng = storeList.reduce((sum, s) => sum + (parseFloat(s.lot) || 0), 0) / storeList.length;

		// avgLat이 0이거나 NaN이면 setCenter X
		if (avgLat && avgLng && avgLat !== 0) {
			setCenter({ lat: avgLat, lng: avgLng });
		}

    }, [storeList, isChangedRegion, lat, lng]);

    return (
        <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={level}
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
                <CustomOverlayMap position={{ lat, lng }}>
                    <div className={styleMap.curMarker}>
                    {/* 텍스트 말풍선 */}
                    <div className={styleMap.curInfoWindow}>
                        내 위치
                    </div>
                    
                    {/* 위치를 나타내는 점 (애니메이션 포함 가능) */}
                    <div className={styleMap.curPoint}></div>
                    </div>
                </CustomOverlayMap>
            )}

            <MarkerClusterer averageCenter={true} minLevel={4} disableClickZoom={false}>
                {storeList.map((store) => (
                    <Fragment key={store.bplcSn}>
                        <MapMarker
                            key={store.bplcSn}
                            position={{ lat: parseFloat(store.lat), lng: parseFloat(store.lot) }}
                            title={store.bplcNm}
                            onClick={() => setOpenMarkerId(store.bplcSn)}
                        />
                    </Fragment>
                ))}
            </MarkerClusterer>

            {/* 인포윈도우 */}
            {storeList.map((store) => (
                openMarkerId === store.bplcSn && (
                    <CustomOverlayMap
                        key={`overlay-${store.bplcSn}`}
                        position={{ lat: parseFloat(store.lat), lng: parseFloat(store.lot) }}
                        yAnchor={1.3}
                        zIndex={1000}
                    >
                        <div className={styleMap.infoWindow}>
                            <button className={styleMap.closeBtn}
                                onClick={(e) => {
                                    e.stopPropagation(); // 지도 클릭 이벤트가 발생하는 것 방지
                                    setOpenMarkerId("");
                                }}
                            >X</button>
                            
                            <Link to={`/search/storeDetail?storeId=${store.bplcSn}`} className={styleMap.link}>
                                <div className={styleMap.storeInfo}>
                                    <h3 className={styleMap.storeNm}>{store.bplcNm}</h3>
                                    <p className={styleMap.infoBottom}>
                                        {store.avg && <span><img src={iconStar}/>{store.avg}</span>}
                                        {store.storeCatName && <span><img src={iconCategory} />{store.storeCatName}</span>}
                                    </p>
                                </div>
                                <img src={`${SERVER_URL}${store.bplcPhoto}`}
                                // <img src={`${SERVER_URL}/uploads/store/${store.bplcPhoto}`}
                                    className={styleMap.infoImg} 
                                />
                            </Link>
                        </div>
                    </CustomOverlayMap>
                )
            ))}
            
        </Map>
    );
}