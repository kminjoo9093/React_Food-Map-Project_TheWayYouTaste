import { getData } from "./http";

export function getSggList(selectedSido) {
  // return getData(`/youtaste/search/sgg?sidoCd=${selectedSido}`);
  return getData(`/sgg?sidoCd=${selectedSido}`);
}

export function getDongList(selectedSgg) {
  // return getData(`/youtaste/search/dong?sggCd=${selectedSgg}`);
  return getData(`/dong?sggCd=${selectedSgg}`);
}
