import { useQuery } from "@tanstack/react-query";
import { fetchRegionByCoords } from "../../api/fetchRegionByCoords";
import { QUERY_KEYS } from "../../lib/constants";

export function useRegionByCoords({lat, lng}){
  return useQuery({
    queryFn: () => fetchRegionByCoords({lat, lng}),
    queryKey: QUERY_KEYS.region.coords(lat, lng),
    enabled: !!lat && !!lng,
  })
}