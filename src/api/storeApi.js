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

export function getStoreListByViewport(viewport) {
  const { swMinLat, swMinLng, neMaxLat, neMaxLng } = viewport;
  // return getData(
  //   `/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`,
  // );

  return getData(
    `/youtaste/search/store/position?swMinLat=${swMinLat}&neMaxLat=${neMaxLat}&swMinLng=${swMinLng}&neMaxLng=${neMaxLng}`,
  );
}
