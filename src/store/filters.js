import { create } from "zustand";

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
      sidoName: sidoNm,
      selectedSgg: null,
      sggName: "",
      selectedDong: null,
      dongName: "",
    }),
  setSgg: (sggCd, sggNm) =>
    set({
      selectedSgg: sggCd,
      sggName: sggNm,
      selectedDong: null,
      dongName: "",
    }),
  setDong: (dongCd, dongNm) =>
    set({
      selectedDong: dongCd,
      dongName: dongNm,
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
