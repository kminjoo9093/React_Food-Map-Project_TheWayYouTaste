import type { Category } from "../types/category.types";
import { apiFetch } from "./client";
import { memoizeAsync } from "./cache";

export const getCategories = memoizeAsync(() =>
  apiFetch<Category[]>("/categories.json"),
);
