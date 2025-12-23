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

    const [lat, setLat] = useState(37.5665); //서울로 바꾸기
    const [lng, setLng] = useState(126.9780);
    const [storeList, setStoreList] = useState([]); // 훅 내부에서 데이터 관리

    const LOCAL_API_KEY = "bd23a565a07fd608d593c2c99d192e8f";
    
    // 현재 위치 기반 초기 로드
    const getCurrentLocation = useCallback(async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLng(longitude);

                let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
                const headers = { Authorization: `KakaoAK ${LOCAL_API_KEY}` };

                try {
                    const response = await fetch(localUrl, { headers });
                    const data = await response.json();
                    const currentSggCode = data.documents[0].code.slice(0, 5);
                    const currentSidoCode = currentSggCode.slice(0, 2);

                    const listBySgg = await GetStoreList(`http://localhost:3001/youtaste/search/store/sgg?sggCd=${currentSggCode}`);

                    setSelectedDo(currentSidoCode);
                    setSelectedSi(currentSggCode);
                    setStoreList(listBySgg);

                } catch (error) {
                    console.error('위치 정보 로드 실패: ', error);
                }
            });
        }
    }, []);

    // 필터 초기화 함수 추가 
    const resetRegion = useCallback(() => {
        setSelectedDo(null); 
        setDoName("");
        setSelectedSi(null); 
        setSiName("");
        setSelectedDong(null); 
        setDongName("");
    }, []);

    return {
        regionState: { selectedDo, doName, selectedSi, siName, selectedDong, dongName, lat, lng, storeList },
        regionSetters: { setSelectedDo, setDoName, setSelectedSi, setSiName, setSelectedDong, setDongName, setLat, setLng},
        getCurrentLocation
  };
}