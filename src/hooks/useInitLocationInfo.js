import { useEffect, useState } from "react";
import { useGeolocation } from "./useGeolocation";
import { useRegionByCoords } from "./queries/useRegionByCoords";
import { useFilterStore } from "../store/filters";

export default function useInitLocationInfo() {
  const { lat, lng, getLocation } = useGeolocation();
  const { data: regionData, isLoading: regionLoading } = useRegionByCoords({
    lat,
    lng,
  });

  const setRegion = useFilterStore((store) => store.setRegion);

  useEffect(() => {
    if (regionData) {
      setRegion({
        sidoCode: regionData.sidoCode,
        sggCode: regionData.sggCode,
        dongCode: null,
        sidoName: regionData.sidoName,
        sggName: regionData.sggName,
        dongName: "",
      });
    }
  }, [regionData]);

  return {
    lat,
    lng,
    getLocation,
  };
}
