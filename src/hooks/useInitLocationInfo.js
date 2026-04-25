import { useEffect, useState } from "react";
import { useGeolocation } from "./useGeolocation";
import { useRegionByCoords } from "./queries/useRegionByCoords";

export default function useInitLocationInfo() {
  const [selectedSido, setSelectedSido] = useState(null); 
  const [selectedSgg, setSelectedSgg] = useState(null); 
  const [selectedDong, setSelectedDong] = useState(null); 
  const [sidoName, setSidoName] = useState("");
  const [sggName, setSggName] = useState("");
  const [dongName, setDongName] = useState("");

  // 현재 위치 기반 초기 로드
  const { lat, lng, getLocation } = useGeolocation();
  const { data: regionData, isLoading: regionLoading } = useRegionByCoords({
    lat,
    lng,
  });

  useEffect(()=>{
    if(regionData){
      selectedSido(regionData?.sidoCode);
      setSelectedSgg(regionData?.sggCode);
      setSidoName(regionData.sidoName || "");
      setSggName(regionData.sggName || "");
    }
  }, [regionData])

  return {
    regionState: {
      selectedSido,
      sidoName,
      selectedSgg,
      sggName,
      selectedDong,
      dongName,
      lat,
      lng,
    },
    regionSetters: {
      setSelectedSido,
      setSelectedSgg,
      setSelectedDong,
      setSidoName,
      setSggName,
      setDongName,
    },
    getLocation,
  };
}
