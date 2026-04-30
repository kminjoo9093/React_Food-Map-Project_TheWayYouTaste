import { getData } from "./http";

export function getSggList(selectedSido) {
  return getData(`/youtaste/search/sgg?sidoCd=${selectedSido}`);
}

export function getDongList(selectedSgg) {
  return getData(`/youtaste/search/dong?sggCd=${selectedSgg}`);
}
