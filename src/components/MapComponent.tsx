import { Fragment } from "react";
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
import { getImageCdn } from "../lib/utils/getImageCdn";
import type { Store } from "../types/store.types";
import { SearchMode, Viewport } from "../types/types";

const MAP_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;

interface MapComponentProps {
  storeList: Store[],
  lat?: number,
  lng?: number,
  setIsMoved: (isMoved: boolean) => void,
  searchMode: SearchMode,
  positionAreaRef: React.RefObject<Viewport>,
  isSelectedAll: boolean,
  hasQueryRegion: boolean,
  restoredBounds: Viewport | null,
}

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
}: MapComponentProps) {
  const mapRef = useRef<kakao.maps.Map>(null);
  const [level, setLevel] = useState(7);
  const [openMarkerId, setOpenMarkerId] = useState<number | null>(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const isFirstIdle = useRef(true);
  const initialCenter = {
    lat: lat || 37.5665,
    lng: lng || 126.978,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarkers(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useKakaoLoader({
    appkey: MAP_KEY as string,
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    if (isSelectedAll) {
      setLevel(12);
    } else {
      setLevel(7);
    }
  }, [isSelectedAll]);

  function getBoundsFromStores(storeList: Store[]) {
    const bounds = new window.kakao.maps.LatLngBounds();
    let hasValidPoint = false;

    if (storeList && storeList.length > 0) {
      storeList.forEach((store) => {
        const sLat = store.lat;
        const sLng = store.lng;
        if (!isNaN(sLat) && !isNaN(sLng)) {
          bounds.extend(new window.kakao.maps.LatLng(sLat, sLng));
          hasValidPoint = true;
        }
      });
    }

    return { bounds, hasValidPoint };
  }

  function moveToBounds(map: kakao.maps.Map, bounds: kakao.maps.LatLngBounds) {
    const padding = window.innerWidth < 768 ? 80 : 50;
    map.setBounds(bounds, padding, padding, padding, padding);
  }

  function moveToInitLocation(map: kakao.maps.Map, lat: number, lng: number) {
    if (!map || !lat || !lng) return;
    const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
    map.setCenter(moveLatLng);
    map.setLevel(7);
  }

  // 지도 포커싱
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (isSelectedAll) return; // 전국 검색 모드는 고정

    const timer = setTimeout(() => {
      // 초기 진입: 사용자 현재 위치로 포커싱
      if (!hasQueryRegion && lat && lng) {
        moveToInitLocation(map, lat, lng);
        return;
      }

      // 지역 필터 설정: bounds로 포커싱
      if (searchMode === "district" && hasQueryRegion && storeList.length > 0) {
        const { bounds, hasValidPoint } = getBoundsFromStores(storeList);
        if (hasValidPoint) {
          moveToBounds(map, bounds);
          return;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [storeList, isSelectedAll, lat, lng, searchMode, hasQueryRegion]);

  // 새로고침 시 bounds 복원
  useEffect(() => {
    if (!restoredBounds || searchMode !== "bounds") return;

    const timer = setTimeout(() => {
      const map = mapRef.current;
      if (!map) return;

      const sw = new window.kakao.maps.LatLng(
        restoredBounds.swMinLat,
        restoredBounds.swMinLng,
      );
      const ne = new window.kakao.maps.LatLng(
        restoredBounds.neMaxLat,
        restoredBounds.neMaxLng,
      );
      const kakaoMapBounds = new window.kakao.maps.LatLngBounds();
      kakaoMapBounds.extend(sw);
      kakaoMapBounds.extend(ne);
      map.setBounds(kakaoMapBounds);
    }, 50); // 지도 초기 idle 이벤트보다 늦게 실행되도록

    return () => clearTimeout(timer);
  }, [restoredBounds, searchMode]);

  return (
    <Map
      center={initialCenter}
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

        positionAreaRef.current = {
          swMinLat: sw.getLat(),
          swMinLng: sw.getLng(),
          neMaxLat: ne.getLat(),
          neMaxLng: ne.getLng(),
        };

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
                  lat: store.lat,
                  lng: store.lng,
                }}
                title={store.bplcNm}
                onClick={() => setOpenMarkerId(store.bplcSn)}
              />
              {/* 인포윈도우 */}
              {openMarkerId === store.bplcSn && (
                <CustomOverlayMap
                  key={`overlay-${store.bplcSn}`}
                  position={{
                    lat: store.lat,
                    lng: store.lng,
                  }}
                  yAnchor={1.25}
                  zIndex={1000}
                >
                  <div className={styleMap.infoWindow}>
                    <button
                      className={styleMap.closeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMarkerId(null);
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
                        src={getImageCdn(getStoreImage(store.storeCatNo),
                          "w_200,h_200",
                        )}
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
