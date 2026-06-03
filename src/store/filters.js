import { create } from "zustand";

export const useFilterStore = create((set) => ({
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
  setRegion: ({ selectedSido, selectedSgg, selectedDong, sidoName, sggName, dongName }) =>
    set({
      selectedSido,
      selectedSgg,
      selectedDong,
      sidoName,
      sggName,
      dongName,
    }),
  resetRegion: () =>
    set({
      selectedSido: null,
      selectedSgg: null,
      selectedDong: null,

      sidoName: "",
      sggName: "",
      dongName: "",
    }),

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
