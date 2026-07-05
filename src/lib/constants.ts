import type { StoreSearchParam } from "../types/store.types";
import type { Viewport } from "../types/types";

export const QUERY_KEYS = {
  region: {
    coords: (lat: number, lng: number) => ["region", lat, lng],
    sgg: (sidoCode: number) => ["region", "sgg", sidoCode],
    dong: (sggCode: number) => ["region", "dong", sggCode],
  },
  stores: {
    list: (params: StoreSearchParam) => ["stores", "list", params],
    viewport: (viewport: Viewport) => ["stores", "viewport", viewport],
    detail: (storeId: number) => ["store", storeId],
  },
};
