import { useQuery } from "@tanstack/react-query";
import { getStoreListByCondition } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";

export function useStoresByCondition(param){
  return useQuery({
    queryFn: () => getStoreListByCondition(param),
    queryKey: QUERY_KEYS.stores.list(param),
    enabled: !!(
      param.keyword || param.sidoCode || param.sggCode || param.dongCode
    ),
  })
}