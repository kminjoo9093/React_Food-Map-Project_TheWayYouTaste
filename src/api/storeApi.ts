import type { Store, StoreSearchParam } from "../types/store.types";
import type { Viewport } from "../types/types";
import { apiFetch } from "./client";
import { memoizeAsync } from "./cache";

const getStores = memoizeAsync(() => apiFetch<Store[]>("/stores.json"));

export async function getStoreListByCondition(
  param: StoreSearchParam,
): Promise<Store[]> {
  const { keyword, sidoCode, sggCode, dongCode } = param;
  const stores = await getStores();

  if (keyword) {
    return stores.filter((record) => record.bplcNm.includes(keyword));
  }
  if (dongCode) {
    return stores.filter((record) => record.dongCd === dongCode);
  }
  // 실제 서비스 환경에서는 백엔드에서 SQL Like 데이터 조회 수행
  // 현재 json-server 환경에서 데이터 조회
  if (sggCode) {
    return stores.filter((record) =>
      String(record.sggCd).startsWith(String(sggCode)),
    );
  }
  if (sidoCode) {
    return stores.filter((record) => record.sidoCd === sidoCode);
  }

  return stores;
}

// 실제 서비스 환경에서는 백엔드에서 좌표 기반(Bounding Box) 필터링 수행
// 현재는 json-server 환경이므로 프론트에서 필터링 처리
export async function getStoreListByViewport(
  viewport: Viewport,
): Promise<Store[]> {
  const { swMinLat, swMinLng, neMaxLat, neMaxLng } = viewport;
  const stores = await getStores();

  const filtered = stores.filter((record) => {
    const lat = Number(record.lat);
    const lng = Number(record.lng);
    return (
      lat >= swMinLat && lat <= neMaxLat && lng >= swMinLng && lng <= neMaxLng
    );
  });

  return filtered;
}

export async function getStoreDetailInfo(id: number) {
  const stores = await getStores();
  return stores.find((record) => record.bplcSn === id);
}
