import { useEffect, useRef } from "react";
import { useGeolocation } from "./useGeolocation";
import { useRegionByCoords } from "./queries/useRegionByCoords";
import { useFilterStore } from "../store/filters";

export default function useInitLocationInfo({ skip }: {skip: boolean}) {
  const { coords, getCoords } = useGeolocation();
  const { data: regionData } = useRegionByCoords(coords);
  const setRegion = useFilterStore((store) => store.setRegion);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (skip) return;
    getCoords();
  }, [skip, getCoords]);

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

  return { coords, getCoords, regionData };
}
