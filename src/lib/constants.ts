import type { StoreSearchParam } from "../types/store.types";
import type { Coords, Viewport } from "../types/types";

export const QUERY_KEYS = {
  region: {
    coords: (coords: Coords | null) => ["region", coords],
    sgg: (sidoCode: number | null) => ["region", "sgg", sidoCode],
    dong: (sggCode: number | null) => ["region", "dong", sggCode],
  },
  stores: {
    list: (params: StoreSearchParam) => ["stores", "list", params],
    viewport: (viewport: Viewport | null) => ["stores", "viewport", viewport],
    detail: (storeId: number) => ["store", storeId],
  },
};
