import { useState, useCallback } from "react";
import { GetStoreList } from "../GetStoreList";


export default function useRegionSetting() {
    const [selectedDo, setSelectedDo] = useState(null); //code
    const [doName, setDoName] = useState("");
    const [selectedSi, setSelectedSi] = useState(null); //code
    const [siName, setSiName] = useState("");
    const [selectedDong, setSelectedDong] = useState(null); //code
    const [dongName, setDongName] = useState("");
    const [isDimmedMiddleOpen, setIsDimmedMiddleOpen] = useState(false);
    const [isSelectedAll, setIsSelectedAll] = useState(false);

    const [lat, setLat] = useState(null); //37.5665
    const [lng, setLng] = useState(null); //126.9780
    const [storeList, setStoreList] = useState([]); // 훅 내부에서 데이터 관리
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    const LOCAL_API_KEY = "bd23a565a07fd608d593c2c99d192e8f";
    
    // 현재 위치 기반 초기 로드
    const getCurrentLocation = useCallback(async () => {
        console.log("1. getCurrentLocation 진입");
        setIsLoading(true); // 시작할 때 true

        if (!navigator.geolocation) {
            setIsLoading(false); 
            console.log("2. Geolocation 미지원");
            return;
        }

        // 옵션 추가: 정확도 높이고, 캐시된 위치 정보 사용 안함
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(async (position) => {
            // console.log("3. 위치 정보를 받아옴", position.coords);
            setIsLoading(false);
            
            const { latitude, longitude } = position.coords;
            // console.log("위도:", latitude, "경도:", longitude);
            setLat(latitude);
            setLng(longitude);

            let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
            const headers = { Authorization: `KakaoAK ${LOCAL_API_KEY}` };
            
            try {
                const response = await fetch(localUrl, { headers });
                const data = await response.json();
                // console.log("4. 카카오 API 응답 성공", data);
                
                if (data.documents && data.documents.length > 0) {
                    console.log("여기야", data.documents[0]);
                    const currentSggCode = data.documents[0].code.slice(0, 5);
                    const currentSidoCode = currentSggCode.slice(0, 2);
                    const listBySgg = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${currentSggCode}`);

                    setSelectedDo(currentSidoCode);
                    setSelectedSi(currentSggCode);

                    setDoName(data.documents[0].region_1depth_name); // 시도명
                    setSiName(data.documents[0].region_2depth_name);  // 시군구명
                    
                    setStoreList(listBySgg);
                }
            } catch (err) {
                    console.error("5. API 호출 중 에러", err);
                }
            }, (err) => {
                console.error("6. 위치 권한/획득 에러", err);
            }, geoOptions);
    }, []);

    // 필터 초기화 함수 추가 
    // const resetRegion = useCallback(() => {
    //     setSelectedDo(null); 
    //     setDoName("");
    //     setSelectedSi(null); 
    //     setSiName("");
    //     setSelectedDong(null); 
    //     setDongName("");
    // }, []);

    return {
        regionState: { selectedDo, doName, selectedSi, siName, selectedDong, dongName, lat, lng, storeList, isLoading },
        regionSetters: { setSelectedDo, setDoName, setSelectedSi, setSiName, setSelectedDong, setDongName, setLat, setLng},
        getCurrentLocation
  };
}