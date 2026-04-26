import { create } from "zustand";
import { shallow } from "zustand/shallow";

export const useFilterStore = create((set) => ({
  selectedSido: null,
  selectedSgg: null,
  selectedDong: null,

  sidoName: "",
  sggName: "",
  dongName: "",

  selectedCategories: [],

  //action
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
  setRegion: ({ sidoCode, sggCode, dongCode, sidoName, sggName, dongName }) =>
    set({
      selectedSido: sidoCode,
      selectedSgg: sggCode,
      selectedDong: dongCode,
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
  toggleCategories: (categoryId) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(categoryId)
        ? state.selectedCategories.filter((id) => id !== categoryId)
        : [...state.selectedCategories, categoryId],
    })),
  resetCategories: () => set({ selectedCategories: [] }),
}));

export const useRegionCode = () =>
  useFilterStore(
    (store) => ({
      selectedSido: store.selectedSido,
      selectedSgg: store.selectedSgg,
      selectedDong: store.selectedDong,
    }),
    shallow,
  );

export const useRegionName = () =>
  useFilterStore((store) => ({
    sidoName: store.sidoName,
    sggName: store.sggName,
    dongName: store.dongName,
  }));

export const useCategories = () =>
  useFilterStore((store) => ({
    selectedCategories: store.selectedCategories,
  }));

export const useCategoryActions = () =>
  useFilterStore((store) => ({
    setCategories: store.setCategories,
    toggleCategories: store.toggleCategories,
    resetCategories: store.resetCategories,
  }));

export const useFilterReset = () =>
  useFilterStore((store) => ({
    resetRegion: store.resetRegion,
    resetCategories: store.resetCategories,
  }));
