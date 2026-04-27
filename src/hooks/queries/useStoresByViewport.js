import { useQuery } from "@tanstack/react-query";
import { getStoreListByViewport } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";

export function useStoresByViewport(area){
  return useQuery({
    queryFn: () => getStoreListByViewport(area),
    queryKey: QUERY_KEYS.stores.viewport(area),
    enabled: false, //버튼 클릭 시 실행
  })
}