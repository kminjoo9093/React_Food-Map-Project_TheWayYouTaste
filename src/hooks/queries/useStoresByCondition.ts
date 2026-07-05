import { useQuery } from "@tanstack/react-query";
import { getStoreListByCondition } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";
import type { StoreSearchParam } from "../../types";

export function useStoresByCondition(param: StoreSearchParam){
  return useQuery({
    queryFn: () => getStoreListByCondition(param),
    queryKey: QUERY_KEYS.stores.list(param),
  })
}