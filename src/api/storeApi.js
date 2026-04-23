import { getData } from "./http";

export function getStoreListBySgg(sggCode){
  return getData(`/youtaste/search/store/sgg?sggCd=${sggCode}`);
}
