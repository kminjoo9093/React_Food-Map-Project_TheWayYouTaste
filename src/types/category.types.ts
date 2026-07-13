export type CategoryCode =
  | "c01"
  | "c02"
  | "c03"
  | "c04"
  | "c05"
  | "c06"
  | "c07"
  | "c08";

export interface Category {
  storeCatNo: CategoryCode;
  storeCatName: string;
};

export type CategoryFilterMode = "main" | "search";
