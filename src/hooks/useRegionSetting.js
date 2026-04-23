import { useEffect, useState } from "react";
import { useGeolocation } from "./useGeolocation";
import { getRegionByCoords } from "../api/fetchRegionByCoords";
import { getStoreListBySgg } from "../api/storeApi";
import { useRegionByCoords } from "./queries/useRegionByCoords";
import { useStoreListBySggCode } from "./queries/useStoreListBySggCode";

export default function useRegionSetting() {
  const [selectedDo, setSelectedDo] = useState(null); //code
  const [selectedSi, setSelectedSi] = useState(null); //code
  const [selectedDong, setSelectedDong] = useState(null); //code

  // 현재 위치 기반 초기 로드
  const { lat, lng, getLocation } = useGeolocation();
  const { data: regionData, isLoading: regionLoading } = useRegionByCoords({
    lat,
    lng,
  });
  const sggCode = regionData?.sggCode;
  const sidoCode = regionData?.sidoCode;
  const { data: storeList, isLoading: storeLoading } =
    useStoreListBySggCode(sggCode);

  useEffect(()=>{
    if(regionData){
      setSelectedDo(sidoCode);
      setSelectedSi(sggCode);
    }
  }, [sidoCode, sggCode])

  return {
    regionState: {
      selectedDo,
      sidoName: regionData?.sidoName ?? "",
      selectedSi,
      sggName: regionData?.sggName ?? "",
      selectedDong,
      // dongName,
      lat,
      lng,
      storeList,
      isLoading : regionLoading || storeLoading,
    },
    regionSetters: {
      setSelectedDo,
      setSelectedSi,
      setSelectedDong,
    },
    getLocation,
  };
}
