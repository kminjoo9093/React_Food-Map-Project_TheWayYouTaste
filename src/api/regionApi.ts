import type { Dong, Sgg } from "../types/region.types";
import { apiFetch } from "./client";

export function getSggList(selectedSido: number): Promise<Sgg[]> {
  return apiFetch<Sgg[]>(`/sgg?sidoCd=${selectedSido}`);
}

export function getDongList(selectedSgg: number): Promise<Dong[]> {
  return apiFetch<Dong[]>(`/dong?sggCd=${selectedSgg}`);
}
