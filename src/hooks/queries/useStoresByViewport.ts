import { useQuery } from "@tanstack/react-query";
import { getStoreListByViewport } from "../../api/storeApi";
import { QUERY_KEYS } from "../../lib/constants";
import type { Viewport } from "../../types/types";

export function useStoresByViewport(viewport: Viewport | null) {
  return useQuery({
    queryFn: () => getStoreListByViewport(viewport!),
    queryKey: QUERY_KEYS.stores.viewport(viewport),
    enabled: viewport !== null,
    gcTime: 60 * 1000
  });
}
