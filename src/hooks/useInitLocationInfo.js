import { useEffect, useRef } from "react";
import { useGeolocation } from "./useGeolocation";
import { useRegionByCoords } from "./queries/useRegionByCoords";
import {
  useFilterStore,
  useSelectedSgg,
  useSelectedSido,
} from "../store/filters";

export default function useInitLocationInfo({ skip }) {
  const { lat, lng, getLocation } = useGeolocation();
  const { data: regionData, isLoading: regionLoading } = useRegionByCoords({
    lat,
    lng,
  });
  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const setRegion = useFilterStore((store) => store.setRegion);
  const isInitialized = useRef(false);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (skip) return;
    if (!regionData) return;
    if (isInitialized.current) return;

    if (
      String(regionData.sidoCode) === String(selectedSido) &&
      String(regionData.sggCode) === String(selectedSgg)
    ) {
      isInitialized.current = true;
      return;
    }

    isInitialized.current = true;

    console.log("세팅시도!?");
    setRegion({
      selectedSido: regionData.sidoCode,
      selectedSgg: regionData.sggCode,
      selectedDong: null,
      sidoName: regionData.sidoName,
      sggName: regionData.sggName,
      dongName: "",
    });
  }, [regionData, skip, selectedSido, selectedSgg]);

  return { lat, lng, getLocation };
}
