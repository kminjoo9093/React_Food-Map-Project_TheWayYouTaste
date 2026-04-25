import { useQuery } from "@tanstack/react-query";
import { getStoreListBySgg } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";

export function useStoresBySggCode(sggCode){
  return useQuery({
    queryFn: () => getStoreListBySgg(sggCode),
    queryKey: QUERY_KEYS.stores.list(sggCode),
    enabled: !!sggCode,
  })
}