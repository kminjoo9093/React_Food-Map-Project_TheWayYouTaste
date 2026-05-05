import { getData } from "./http";

export function getStoreListByCondition(param) {
  const { keyword, sidoCode, sggCode, dongCode } = param;

  // if (keyword) {
  //   return getData(`/youtaste/search/store/keyword?name=${keyword}`);
  // }
  // if (dongCode) {
  //   return getData(`/youtaste/search/store/dong?dongCd=${dongCode}`);
  // }
  // if (sggCode) {
  //   return getData(`/youtaste/search/store/sgg?sggCd=${sggCode}`);
  // }
  // if (sidoCode) {
  //   return getData(`/youtaste/search/store/sido?sidoCd=${sidoCode}`);
  // }

  // return getData("/store");

  if (keyword) {
    return getData(`/store?bplcNm=${encodeURIComponent(keyword)}`);
  }
  if (dongCode) {
    return getData(`/store?dongCd=${dongCode}`);
  }
  if (sggCode) {
    return getData(`/store?sggCd=${sggCode}`);
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
  // return getData(
  //   `/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`,
  // );

  const data = await getData("/store");

  const filtered = data.filter((record) => {
    const lat = Number(record.lat);
    const lng = Number(record.lng);
    return (
      lat >= swMinLat &&
      lat <= neMaxLat &&
      lng >= swMinLng &&
      lng <= neMaxLng
    );
  });

  return filtered;
}
