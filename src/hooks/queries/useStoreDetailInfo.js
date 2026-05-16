import { useQuery } from "@tanstack/react-query";
import { getStoreDetailInfo } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";

export function useStoreDetailInfo(id){
  return useQuery({
    queryFn: () => getStoreDetailInfo(id),
    queryKey: QUERY_KEYS.stores.detail(id),
  })
}