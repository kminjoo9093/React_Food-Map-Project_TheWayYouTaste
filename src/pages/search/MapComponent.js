import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";

export default function MapComponent({storeList, lat, lng }) {
  useKakaoLoader({
    appkey: "5794d8a0c2862c16e4c69ad303abfb4b",
    libraries: ["clusterer", "drawing", "services"],
  });

  const [center, setCenter] = useState({
    lat: 37.5665, // Default latitude (Seoul)
    lng: 126.9780, // Default longitude (Seoul)
  });

  useEffect(() => {
    if (lat && lng) {
      setCenter({ lat, lng });
    }
  }, [lat, lng]);

   return (
    <>
      <Map
          center={center}   // { lat: 위도, lng: 경도 }
          style={{ width: "100%", height: "100%" }}
          level={4}         // 지도 줌 레벨
          >
              {storeList.map(store => (
                  <MapMarker
                      key={store.BPLC_SN}
                      position={{ lat: store.LAT, lng: store.LOT }}
                      title={store.BPLC_NM}
                  />
              ))}
      </Map>
    </>
  );
}
