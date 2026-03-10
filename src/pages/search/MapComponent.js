import React, { Fragment } from "react";
import { useEffect, useState, useRef } from "react";
import { Map, MapMarker, MarkerClusterer, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import iconStar from "../../resources/img/search/iconStar.svg";
import iconCategory from "../../resources/img/search/iconTag.svg";
import styleMap from "../../css/Map.module.css";
import serverUrl from "../../db/server.json"; 

export default function MapComponent({ storeList, lat, lng, setIsMoved, isChangedRegion, positionAreaRef, isSelectedAll }) {
    
    const mapRef = useRef(); // Map 객체에 접근하기 위한 ref 추가
    const isInitialCenterSetRef = useRef(false);

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

	// 인포윈도우 Open 여부
    const [openMarkerId, setOpenMarkerId] = useState("");

    // 현재 위치 기반으로 중심점 설정
    useEffect(() => {
        if (lat && lng) {
            setCenter({ lat, lng });
            isInitialCenterSetRef.current = true;
        }
    }, [lat, lng]);

    useEffect(()=>{ 
        if(isSelectedAll){
            setLevel(12);
        } else {
            setLevel(7);
        }
    }, [isSelectedAll])    



    //  setBounds (지역 변경 or 스토어 리스트 변경)
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // 전국 검색 모드 -> 고정 level(12)
        if (isSelectedAll) return;

        // 범위 내 재검색 -> 지도를 자동으로 움직이지(setBounds) 않음
    if (!isChangedRegion && isInitialCenterSetRef.current) return;

        // 실행 타이밍 조절 (지연 시간을 주어 맵 인스턴스 안정화)
        const timer = setTimeout(() => {
            
            if(isSelectedAll) return;

            // isChangedRegion이 true일 때만 지도를 강제로 움직임
             if (!isChangedRegion && isInitialCenterSetRef.current) return;
            
            const bounds = new window.kakao.maps.LatLngBounds();
            let hasValidPoint = false;

            // 스토어 마커들을 범위에 포함
            if (storeList && storeList.length > 0) {
                storeList.forEach((store) => {
                    const sLat = parseFloat(store.lat);
                    const sLng = parseFloat(store.lot);
                    if (!isNaN(sLat) && !isNaN(sLng)) {
                        bounds.extend(new window.kakao.maps.LatLng(sLat, sLng));
                        hasValidPoint = true;
                    }
                });
            }

            if (hasValidPoint) {
                // 맛집들이 있다면 그 맛집들을 다 보여주는 최적의 범위로 이동
                const padding = window.innerWidth < 768 ? 80 : 50; 
                map.setBounds(bounds, padding, padding, padding, padding);
            } 
            // 맛집이 없거나 초기화된 경우 -> 내 위치(lat, lng)로 이동
            else if (lat && lng) {
                const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
                map.setCenter(moveLatLng);
                map.setLevel(7);
            }
        }, 100);

        return () => clearTimeout(timer);
        
    }, [storeList, isSelectedAll, lat, lng, isChangedRegion]);

    return (
        <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={level}
            ref={mapRef} 
            onIdle={(map) => {
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();

                const newPos = {
                    swMinLat: sw.getLat(),
                    swMinLng: sw.getLng(),
                    neMaxLat: ne.getLat(),
                    neMaxLng: ne.getLng()
                };

                // Ref 업데이트 (비동기 처리 없이 즉시 반영됨)
                positionAreaRef.current = newPos;

                if (isInitialCenterSetRef.current) {
                    setIsMoved(true); 
                }
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
                    
                    {/* 위치를 나타내는 점 */}
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
                        yAnchor={1.25}
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
                                    <span className={styleMap.address}>{store.address}</span>
                                    <p className={styleMap.infoBottom}>
                                        {store.avg && <span><img src={iconStar}/>{store.avg}</span>}
                                        {store.storeCatName && <span><img src={iconCategory} />{store.storeCatName}</span>}
                                    </p>
                                </div>
                                <img src={`${SERVER_URL}${store.bplcPhoto}`}
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