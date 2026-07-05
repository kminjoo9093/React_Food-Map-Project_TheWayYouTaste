import type { Dong, Sgg } from "../types";
import { apiFetch } from "./client";

//매개변수 타입 임시 정의
export function getSggList(selectedSido: number): Promise<Sgg[]> {
  return apiFetch<Sgg[]>(`/sgg?sidoCd=${selectedSido}`);
}

export function getDongList(selectedSgg: number): Promise<Dong[]> {
  return apiFetch<Dong[]>(`/dong?sggCd=${selectedSgg}`);
}
