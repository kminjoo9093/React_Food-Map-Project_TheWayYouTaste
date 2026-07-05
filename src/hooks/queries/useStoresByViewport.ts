import { useQuery } from "@tanstack/react-query";
import { getStoreListByViewport } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";
import type { Viewport } from "../../types/types";

export function useStoresByViewport(viewport: Viewport) {
  return useQuery({
    queryFn: () => getStoreListByViewport(viewport),
    queryKey: QUERY_KEYS.stores.viewport(viewport),
    enabled: !!viewport,
  });
}
