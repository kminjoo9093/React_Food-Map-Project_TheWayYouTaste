import { useEffect, useState } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import { GetStoreList } from "./GetStoreList";
import markerStar from "../../resources/img/search/markerStar.png";

export default function MapComponent({storeList, setFilteredStoreList, selectedCategories, lat, lng, isMoved, setIsMoved, isChangedRegion, onViewportChange, setPositionArea }) {
  useKakaoLoader({
    appkey: "5794d8a0c2862c16e4c69ad303abfb4b",
    libraries: ["clusterer", "drawing", "services"],
  });

  const [center, setCenter] = useState({
    lat: lat, // Default latitude (current position)
    lng: lng, // Default longitude (current position)
  });
  console.log("지금 중심 --> ", center);

  // 인포윈도우 Open 여부를 저장하는 state
  const [openMarkerId, setOpenMarkerId] = useState("");

  //지도 동작 상태
	//   const [isMoved, setIsMoved] = useState(false);
  //지도 동작 횟수
  //const [moveCount, setMoveCount] = useState(0);
  //지도 동작 후 저장된 리스트
  //const [filteredList, setFilteredList] = useState([]);

  //const [viewport, setViewport] = useState(null); //test

  useEffect(() => {
    if (lat && lng) {
      setCenter({ lat, lng });
    }
  }, [lat, lng]);

	//좌표 중심 구하기 --> 수정 필요 idle 이벤트가 안됐을 때 적용되도록
   useEffect(() => {
		if (!storeList.length) return;
		if (!isChangedRegion) return;
		//if (isMoved) return;

		const avgLat = storeList.reduce((sum, s) => sum + s.LAT, 0) / storeList.length;
		const avgLng = storeList.reduce((sum, s) => sum + s.LOT, 0) / storeList.length;

		setCenter({ lat: avgLat, lng: avgLng });
	}, [storeList, isChangedRegion]);


	

	//인포윈도우 표시
	function showInfoWindow(store){
		return <div>
					<Link to={`/search/storeDetail?storeId=${store.BPLC_SN}`}> 
						{store.BPLC_NM}
					</Link>
				</div>
	}

   return (
    <>
      <Map
			center={center}   // { lat: 위도, lng: 경도 }
			style={{ width: "100%", height: "100%" }}
			level={7}         // 지도 줌 레벨
			onIdle={async(map) => {

					//test
					//setIsMoved(true);
					// setMoveCount(prev => prev += 1);

					const bounds = map.getBounds();
					const changedCenter = map.getCenter(); //중심좌표 - test
					const sw = bounds.getSouthWest();
					const ne = bounds.getNorthEast();

					//const newLat = changedCenter.getLat();
					//const newLng = changedCenter.getLng();

					//====== test ===========
					// setCenter({lat: newLat, lng: newLng});
					// console.log("바뀐 중심 : ", {lat: newLat, lng: newLng});
					//========================

					console.log("남서:", sw.getLat(), sw.getLng());
					console.log("북동:", ne.getLat(), ne.getLng());

					// let swMinLat = sw.getLat();
					// let swMinLng = sw.getLng();
					// let neMaxLat = ne.getLat();
					// let neMaxLng = ne.getLng();

					setPositionArea({
						swMinLat: sw.getLat(),
						swMinLng: sw.getLng(),
						neMaxLat: ne.getLat(),
						neMaxLng: ne.getLng()
					})
					setIsMoved(true);

					//test
					//await displayViewPortMarkers(swMinLat, swMinLng, neMaxLat, neMaxLng); //지도 범위 내 맛집 리스트 불러오고, 마커 표시
				}}
          >
				
				<MapMarker  // 현재 위치 마커
					position={{
					// 마커가 표시될 위치입니다
					lat: lat,
					lng: lng,
					}}
				>
					{/* MapMarker의 자식을 넣어줌으로 해당 자식이 InfoWindow로 만들어지게 합니다 */}
					{/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
					<div style={{ padding: "5px", color: "#000", textAlign: "center"}}>
						현재위치
					</div>
				</MapMarker>
	
				<MarkerClusterer
					averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
					minLevel={4} // 클러스터 할 최소 지도 레벨
					>
					{storeList.map((store) => (
						<MapMarker
							key={store.BPLC_SN}
							position={{ lat: store.LAT, lng: store.LOT }}
							title={store.BPLC_NM}
							// image={{
							// 	src: markerStar, 
							// 	size: {
							// 	width: 25,
							// 	height: 35,
							// 	},
							// 	options: {
							// 	offset: {
							// 		x: 15,
							// 		y: 40,
							// 	},
							// 	},
							// }}
							clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
							// 마커에 마우스오버 이벤트를 등록합니다
							onMouseOver={
							// 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
							() => setOpenMarkerId(store.BPLC_SN) 
							}
							// 마커에 마우스아웃 이벤트를 등록합니다
							onMouseOut={
							// 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
							() => setOpenMarkerId(store.BPLC_SN) 
							}
							onClick={() => setOpenMarkerId(store.BPLC_SN)}
						>
							{openMarkerId === store.BPLC_SN && showInfoWindow(store)}
						</MapMarker>
					))}
				</MarkerClusterer>

      </Map>
    </>
  );
}
