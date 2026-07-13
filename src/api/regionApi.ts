import type { Dong, Sgg, Sido } from "../types/region.types";
import { apiFetch } from "./client";
import { memoizeAsync } from "./cache";

export interface RegionData {
  sido: Sido[];
  sgg: Sgg[];
  dong: Dong[];
};

export const getRegions = memoizeAsync(() =>
  apiFetch<RegionData>("/regions.json"),
);

export async function getSggList(selectedSido: number): Promise<Sgg[]> {
  const regions = await getRegions();
  return regions.sgg.filter((record) => record.sidoCd === selectedSido);
}

export async function getDongList(selectedSgg: number): Promise<Dong[]> {
  const regions = await getRegions();
  return regions.dong.filter((record) => record.sggCd === selectedSgg);
}
