import React, { Fragment, useMemo } from "react";
import { useEffect, useState, useRef } from "react";
import {
  Map,
  MapMarker,
  MarkerClusterer,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import iconStar from "../resources/img/search/iconStar.svg";
import iconCategory from "../resources/img/search/iconTag.svg";
import styleMap from "../css/Map.module.css";
import { getStoreImage } from "../lib/utils/getStoreImage";

const MAP_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;

export default function MapComponent({
  storeList,
  lat,
  lng,
  setIsMoved,
  searchMode,
  positionAreaRef,
  isSelectedAll,
  hasQueryRegion,
  restoredBounds,
}) {
  const mapRef = useRef();
  const [level, setLevel] = useState(7); //지도 레벨
  // const [center, setCenter] = useState({
  //   lat: lat || 37.5665,
  //   lng: lng || 126.978,
  // });
  //test
  const currentCenter = useMemo(() => {
    return {
      lat: lat || 37.5665,
      lng: lng || 126.978,
    };
  }, [lat, lng]);
  const [openMarkerId, setOpenMarkerId] = useState(""); // 인포윈도우 Open 여부
  const [showMarkers, setShowMarkers] = useState(false);
  const isFirstIdle = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarkers(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 카카오 로더 설정
  useKakaoLoader({
    appkey: MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  // 수정: 초기 map 포커싱
  useEffect(() => {
    const map = mapRef.current;
    if (!map || searchMode === "bounds" || hasQueryRegion) return;

    if (lat && lng) {
      const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
      map.setCenter(moveLatLng);
    }
  }, [lat, lng, searchMode, hasQueryRegion]);

  // useEffect(() => {
  //   if (searchMode === "bounds") return;
  //   if (hasQueryRegion) return;

  //   if (lat && lng) {
  //     setCenter({ lat, lng });
  //   }
  // }, [lat, lng, searchMode, hasQueryRegion]); //hasQueryRegion

  useEffect(() => {
    if (isSelectedAll) {
      setLevel(12);
    } else {
      setLevel(7);
    }
  }, [isSelectedAll]);

  function getBoundsFromStores(storeList) {
    const bounds = new window.kakao.maps.LatLngBounds();
    let hasValidPoint = false;

    if (storeList && storeList.length > 0) {
      storeList.forEach((store) => {
        const sLat = parseFloat(store.lat);
        const sLng = parseFloat(store.lng);
        if (!isNaN(sLat) && !isNaN(sLng)) {
          bounds.extend(new window.kakao.maps.LatLng(sLat, sLng));
          hasValidPoint = true;
        }
      });
    }

    return { bounds, hasValidPoint };
  }

  function moveToBounds(map, bounds) {
    const padding = window.innerWidth < 768 ? 80 : 50;
    map.setBounds(bounds, padding, padding, padding, padding);
  }

  function moveToInitLocation(map, lat, lng) {
    if (!map || !lat || !lng) return;
    const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
    map.setCenter(moveLatLng);
    map.setLevel(7);
  }

  //bounds 모드 새로고침
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;
    if (!restoredBounds) return;

    const sw = new window.kakao.maps.LatLng(
      restoredBounds.swMinLat,
      restoredBounds.swMinLng,
    );

    const ne = new window.kakao.maps.LatLng(
      restoredBounds.neMaxLat,
      restoredBounds.neMaxLng,
    );

    const bounds = new window.kakao.maps.LatLngBounds(sw, ne);

    moveToBounds(map, bounds);
  }, [restoredBounds]);

  // setBounds (지역 변경 or 스토어 리스트 변경)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (isSelectedAll) return; // 전국 검색 모드 -> 고정 level(12)

    // 실행 타이밍 조절 (맵 렌더링 완료 대기)
    const timer = setTimeout(() => {
      //district
      if (searchMode === "district" && hasQueryRegion && storeList.length > 0) {
        const { bounds, hasValidPoint } = getBoundsFromStores(storeList);
        if (hasValidPoint) {
          moveToBounds(map, bounds);
        }
        return;
      }

      //초기 진입
      if (!hasQueryRegion && lat && lng) {
        moveToInitLocation(map, lat, lng);
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [storeList, isSelectedAll, lat, lng, searchMode, hasQueryRegion]);

  //test
  if (hasQueryRegion && storeList.length === 0) {
    return <div>지도 로딩중</div>;
  }

  return (
    <Map
      // center={center}
      //test
      center={currentCenter}
      style={{ width: "100%", height: "100%" }}
      level={level}
      ref={mapRef}
      onIdle={(map) => {
        if (isFirstIdle.current) {
          isFirstIdle.current = false;
          return;
        }

        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const newPos = {
          swMinLat: sw.getLat(),
          swMinLng: sw.getLng(),
          neMaxLat: ne.getLat(),
          neMaxLng: ne.getLng(),
        };

        positionAreaRef.current = newPos;

        setIsMoved(true);
      }}
    >
      {/* 현재 위치 마커 */}
      {lat && lng && (
        <CustomOverlayMap position={{ lat, lng }}>
          <div className={styleMap.curMarker}>
            <div className={styleMap.curInfoWindow}>내 위치</div>
            <div className={styleMap.curPoint}></div>
          </div>
        </CustomOverlayMap>
      )}

      {showMarkers && (
        <MarkerClusterer
          averageCenter={true}
          minLevel={4}
          disableClickZoom={false}
        >
          {storeList.map((store) => (
            <Fragment key={store.bplcSn}>
              <MapMarker
                key={store.bplcSn}
                position={{
                  lat: parseFloat(store.lat),
                  lng: parseFloat(store.lng),
                }}
                title={store.bplcNm}
                onClick={() => setOpenMarkerId(store.bplcSn)}
              />
              {/* 인포윈도우 */}
              {openMarkerId === store.bplcSn && (
                <CustomOverlayMap
                  key={`overlay-${store.bplcSn}`}
                  position={{
                    lat: parseFloat(store.lat),
                    lng: parseFloat(store.lng),
                  }}
                  yAnchor={1.25}
                  zIndex={1000}
                >
                  <div className={styleMap.infoWindow}>
                    <button
                      className={styleMap.closeBtn}
                      onClick={(e) => {
                        e.stopPropagation(); // 지도 클릭 이벤트가 발생하는 것 방지
                        setOpenMarkerId("");
                      }}
                    >
                      X
                    </button>

                    <Link
                      to={`/store/storeDetail?storeId=${store.bplcSn}`}
                      className={styleMap.link}
                    >
                      <div className={styleMap.storeInfo}>
                        <h3 className={styleMap.storeNm}>{store.bplcNm}</h3>
                        <span className={styleMap.address}>
                          {store.address}
                        </span>
                        <p className={styleMap.infoBottom}>
                          {store.avg && (
                            <span>
                              <img
                                src={iconStar}
                                alt="평균 평점"
                                loading="lazy"
                              />
                              {store.avg}
                            </span>
                          )}
                          {store.storeCatName && (
                            <span>
                              <img
                                src={iconCategory}
                                alt="음식 카테고리"
                                loading="lazy"
                              />
                              {store.storeCatName}
                            </span>
                          )}
                        </p>
                      </div>
                      <img
                        src={`https://taste-440136652.imgix.net/${getStoreImage(store.storeCatNo)}?w=200&h=200&auto=format`}
                        alt={`${store.bplcNm} 식당 대표 이미지`}
                        className={styleMap.infoImg}
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </CustomOverlayMap>
              )}
            </Fragment>
          ))}
        </MarkerClusterer>
      )}
    </Map>
  );
}
