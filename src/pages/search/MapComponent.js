import { Map, MapMarker} from 'react-kakao-maps-sdk';
import { useEffect, useRef } from 'react';
import KakaoLoader from './KakaoLoader';

function MapComponent({storeList, lat, lng}) {
    
    const center = {lat, lng};

    return (
      <>
        <KakaoLoader/>
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

  // const mapRef = useRef(null);

  // useEffect(() => {
  //   const kakao = window.kakao;
  //   const container = mapRef.current; // 지도를 담을 영역의 DOM 참조

  //   // 지도를 생성할 때 필요한 기본 옵션
  //   const options = {
  //     center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표.
  //     level: 3, //
  //   };

  //   new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
  // }, []);

  // return (
  //   <>
  //     <h1>카카오맵</h1>
  //     <div ref={mapRef} style={{ width: '500px', height: '400px' }}></div>
  //   </>
  // );
}

export default MapComponent;






