import { useQuery } from "@tanstack/react-query";
import { getSggList } from "../../api/regionApi";
import { QUERY_KEYS } from "../../lib/constants";

export function useSggList(selectedSido){
  return useQuery({
    queryFn: () => getSggList(selectedSido),
    queryKey: QUERY_KEYS.region.sgg(selectedSido),
    enabled: !!selectedSido,
  })
}