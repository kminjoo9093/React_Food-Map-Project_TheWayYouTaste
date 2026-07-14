import { useQuery } from "@tanstack/react-query";
import { fetchRegionByCoords } from "../../api/fetchRegionByCoords";
import { QUERY_KEYS } from "../../lib/constants";
import type { Coords } from "../../types/types";

export function useRegionByCoords(coords: Coords | null) {
  return useQuery({
    queryFn: () => fetchRegionByCoords(coords!),
    queryKey: QUERY_KEYS.region.coords(coords),
    enabled: coords !== null,
    staleTime: Infinity,
  });
}
