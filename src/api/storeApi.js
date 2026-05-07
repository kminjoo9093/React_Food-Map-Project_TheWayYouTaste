import { getData } from "./http";

export async function getStoreListByCondition(param) {
  const { keyword, sidoCode, sggCode, dongCode } = param;

  if (keyword) {
    return getData(`/store?bplcNm=${encodeURIComponent(keyword)}`);
  }
  if (dongCode) {
    return getData(`/store?dongCd=${dongCode}`);
  }
  if (sggCode) {
    // return getData(`/store?sggCd=${sggCode}`);
    const sidoStoreData = await getData(`/store?sidoCd=${sidoCode}`);
    const sggStoreData = sidoStoreData.filter((record) =>
      String(record.sggCd).startsWith(String(sggCode)),
    );

    return sggStoreData;
  }
  if (sidoCode) {
    return getData(`/store?sidoCd=${sidoCode}`);
  }

  return getData("/store");
}

// 실제 서비스 환경에서는 백엔드에서 좌표 기반(Bounding Box) 필터링 수행
// 현재는 json-server 환경이므로 프론트에서 필터링 처리
export async function getStoreListByViewport(viewport) {
  const { swMinLat, swMinLng, neMaxLat, neMaxLng } = viewport;

  const data = await getData("/store");

  const filtered = data.filter((record) => {
    const lat = Number(record.lat);
    const lng = Number(record.lng);
    return (
      lat >= swMinLat && lat <= neMaxLat && lng >= swMinLng && lng <= neMaxLng
    );
  });

  return filtered;
}
