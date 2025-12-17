import React, { useState, useEffect } from 'react';
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';

function KakaoLoader() {
  const [loading, error] = useKakaoLoader({
    appkey: '5794d8a0c2862c16e4c69ad303abfb4b',  // 본인의 앱 키
    libraries: ['services', 'clusterer'],
  });

  const [mapLoaded, setMapLoaded] = useState(false);
  const [message, setMessage] = useState('');  // 상태 추가

  // Kakao SDK가 로딩 완료되면 `mapLoaded` 상태를 true로 설정
  useEffect(() => {
    if (!loading && !error && window.kakao) {
      setMapLoaded(true);  // SDK가 로딩되었으면 mapLoaded를 true로 설정
    }
  }, [loading, error]);

  // 로딩 중일 때는 "Loading..." 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생한 경우
  if (error) {
    console.error('Map loading error:', error);
    return <div>Error loading the map: {error.message || error}</div>;
  }

  // 지도 로딩이 완료되면 지도 컴포넌트를 렌더링
  if (!mapLoaded) {
    return <div>Waiting for map to load...</div>;
  }

  // 지도 클릭 핸들러
  const handleClick = (e) => {
    // 클릭된 위치의 위도와 경도를 상태에 저장
    const lat = e.latLng.getLat();
    const lng = e.latLng.getLng();
    setMessage(`클릭된 위치: 위도 ${lat}, 경도 ${lng}`); // 상태 업데이트
  };

  return (
    <div>
      <Map
        center={{
          lat: 33.450701,  // 초기 중심 좌표 (위도)
          lng: 126.570667,  // 초기 중심 좌표 (경도)
        }}
        style={{
          width: '100%',  // 지도 크기 (너비)
          height: '500px',  // 지도 크기 (높이)
        }}
        level={3}  // 지도 확대 레벨
        onClick={handleClick}  // 클릭 이벤트 핸들러
      />

      {/* 클릭된 위치를 화면에 표시 */}
      <div>{message}</div> {/* 클릭된 위치 정보 표시 */}
    </div>
  );
}

export default KakaoLoader;
