import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/constants";
import { getDongList } from "../../api/regionApi";

export function useDongList(selectedSgg){
  return useQuery({
    queryFn: () => getDongList(selectedSgg),
    queryKey: QUERY_KEYS.region.dong(selectedSgg),
    enabled: !!selectedSgg,
  })
}