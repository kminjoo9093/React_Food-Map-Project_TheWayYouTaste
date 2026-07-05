import { create } from "zustand";
import { CategoryCode } from "../types/category.types";

type RegionState = {
  selectedSido: number | null;
  selectedSgg: number | null;
  selectedDong: number | null;
  sidoName: string;
  sggName: string;
  dongName: string;
};

type FilterStore = RegionState & {
  selectedCategories: string[];

  setSido: (sidoCd: number | null, sidoNm: string) => void;
  setSgg: (sggCd: number | null, sggNm: string) => void;
  setDong: (dongCd: number | null, dongNm: string) => void;
  setRegion: (region: RegionState) => void;
  setCategories: (categories: string[]) => void;
  toggleCategories: (storeCatNo: CategoryCode) => void;
};

const initialRegionState: RegionState = {
  selectedSido: null,
  selectedSgg: null,
  selectedDong: null,
  sidoName: "",
  sggName: "",
  dongName: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
  selectedSido: null,
  selectedSgg: null,
  selectedDong: null,
  sidoName: "",
  sggName: "",
  dongName: "",
  selectedCategories: [],

  //actions
  setSido: (sidoCd, sidoNm) =>
    set({
      selectedSido: sidoCd,
      sidoName: sidoNm || "",
      selectedSgg: null,
      sggName: "",
      selectedDong: null,
      dongName: "",
    }),
  setSgg: (sggCd, sggNm) =>
    set({
      selectedSgg: sggCd,
      sggName: sggNm || "",
      selectedDong: null,
      dongName: "",
    }),
  setDong: (dongCd, dongNm) =>
    set({
      selectedDong: dongCd,
      dongName: dongNm || "",
    }),
  setRegion: (region) => set(region),
  resetRegion: () => set(initialRegionState),
  setCategories: (categories) => set({ selectedCategories: categories }),
  toggleCategories: (storeCatNo) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(storeCatNo)
        ? state.selectedCategories.filter((id) => id !== storeCatNo)
        : [...state.selectedCategories, storeCatNo],
    })),
  resetCategories: () => set({ selectedCategories: [] }),
}));

export const useSelectedSido = () =>
  useFilterStore((store) => store.selectedSido);
export const useSelectedSgg = () =>
  useFilterStore((store) => store.selectedSgg);
export const useSelectedDong = () =>
  useFilterStore((store) => store.selectedDong);
export const useSidoName = () => useFilterStore((store) => store.sidoName);
export const useSggName = () => useFilterStore((store) => store.sggName);
export const useDongName = () => useFilterStore((store) => store.dongName);
export const useSelectedCategories = () =>
  useFilterStore((store) => store.selectedCategories);
