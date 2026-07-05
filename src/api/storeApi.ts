import type { Store, StoreSearchParam } from "../types/store.types";
import type { Viewport } from "../types/types";
import { apiFetch } from "./client";

export async function getStoreListByCondition(
  param: StoreSearchParam,
): Promise<Store[]> {
  const { keyword, sidoCode, sggCode, dongCode } = param;

  if (keyword) {
    return apiFetch<Store[]>(`/store?bplcNm=${encodeURIComponent(keyword)}`);
  }
  if (dongCode) {
    return apiFetch<Store[]>(`/store?dongCd=${dongCode}`);
  }
  // 실제 서비스 환경에서는 백엔드에서 SQL Like 데이터 조회 수행
  // 현재 json-server 환경의 데이터 조회 방식 한계로 인해
  // 시도 데이터 조회 후 시군구 코드 기반 필터링 수행
  if (sggCode) {
    const sidoStoreData = await apiFetch<Store[]>(`/store?sidoCd=${sidoCode}`);
    const sggStoreData = sidoStoreData.filter((record) =>
      String(record.sggCd).startsWith(String(sggCode)),
    );

    return sggStoreData;
  }
  if (sidoCode) {
    return apiFetch<Store[]>(`/store?sidoCd=${sidoCode}`);
  }

  return apiFetch<Store[]>("/store");
}

// 실제 서비스 환경에서는 백엔드에서 좌표 기반(Bounding Box) 필터링 수행
// 현재는 json-server 환경이므로 프론트에서 필터링 처리
export async function getStoreListByViewport(
  viewport: Viewport,
): Promise<Store[]> {
  const { swMinLat, swMinLng, neMaxLat, neMaxLng } = viewport;

  const data = await apiFetch<Store[]>("/store");

  const filtered = data.filter((record) => {
    const lat = Number(record.lat);
    const lng = Number(record.lng);
    return (
      lat >= swMinLat && lat <= neMaxLat && lng >= swMinLng && lng <= neMaxLng
    );
  });

  return filtered;
}

export async function getStoreDetailInfo(id: number) {
  const data = await apiFetch<Store[]>(`/store?bplcSn=${id}`);
  return data[0];
}
