import { getData } from "./http";

export function getSggList(selectedSido) {
  return getData(`/sgg?sidoCd=${selectedSido}`);
}

export function getDongList(selectedSgg) {
  return getData(`/dong?sggCd=${selectedSgg}`);
}
