import type { Store, StoreSearchParam } from "../types/store.types";
import type { Viewport } from "../types/types";
import { apiFetch } from "./client";
import { memoizeAsync } from "./cache";

const getStores = memoizeAsync(() => apiFetch<Store[]>("/stores.json"));

// 실제 서비스 환경에서는 백엔드에서 데이터 조회 수행
// 현재 json-server 환경에서 데이터 조회
export async function getStoreListByCondition(
  param: StoreSearchParam,
): Promise<Store[]> {
  const { keyword, sidoCode, sggCode, dongCode } = param;
  const stores = await getStores();

  let filtered = stores;

  if (dongCode) {
    filtered = filtered.filter((record) => record.dongCd === dongCode);
  } else if (sggCode) {
    filtered = filtered.filter((record) =>
      String(record.sggCd).startsWith(String(sggCode)),
    );
  } else if (sidoCode) {
    filtered = filtered.filter((record) => record.sidoCd === sidoCode);
  }

  if (keyword) {
    filtered = filtered.filter((record) => record.bplcNm.includes(keyword));
  }

  return filtered;
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
