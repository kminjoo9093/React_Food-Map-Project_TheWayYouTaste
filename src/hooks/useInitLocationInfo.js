import { useEffect, useRef } from "react";
import { useGeolocation } from "./useGeolocation";
import { useRegionByCoords } from "./queries/useRegionByCoords";
import {
  useFilterStore,
} from "../store/filters";

export default function useInitLocationInfo({ skip }) {
  const { lat, lng, getCoords } = useGeolocation();
  const { data: regionData, isLoading } = useRegionByCoords({
    lat,
    lng,
  });
  if(isLoading) alert("현재 위치 기반 지역 정보를 불러오는데 실패했습니다.");
  const setRegion = useFilterStore((store) => store.setRegion);
  const isInitialized = useRef(false);

  useEffect(() => {
    getCoords();
  }, [getCoords]);

  useEffect(() => {
    if (skip) return;
    if (!regionData) return;
    if (isInitialized.current) return;

    setRegion({
      selectedSido: regionData.sidoCode,
      selectedSgg: regionData.sggCode,
      selectedDong: null,
      sidoName: regionData.sidoName,
      sggName: regionData.sggName,
      dongName: "",
    });

    isInitialized.current = true;
  }, [regionData, skip]); 

  return { lat, lng, getCoords };
}
