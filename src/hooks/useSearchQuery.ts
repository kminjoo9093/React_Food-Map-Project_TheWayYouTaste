import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { CategoryCode } from "../types/category.types";

interface SearchQuery {
  mode: "bounds" | "district";
  keyword: string | null;
  categories: CategoryCode[];

  sido: number | null;
  sgg: number | null;
  dong: number | null;
  sidoName: string | null;
  sggName: string | null;
  dongName: string | null;

  swMinLat: number | null;
  swMinLng: number | null;
  neMaxLat: number | null;
  neMaxLng: number | null;
}

// URL 문자열(URLSearchParams) -> SearchQuery 객체로 읽기
function parseSearchQuery(searchParams: URLSearchParams): SearchQuery {
  return {
    mode: searchParams.get("mode") === "bounds" ? "bounds" : "district",

    keyword: searchParams.get("keyword"),

    sido: searchParams.get("sido") ? Number(searchParams.get("sido")) : null,
    sgg: searchParams.get("sgg") ? Number(searchParams.get("sgg")) : null,
    dong: searchParams.get("dong") ? Number(searchParams.get("dong")) : null,

    sidoName: searchParams.get("doName"),
    sggName: searchParams.get("siName"),
    dongName: searchParams.get("dongName"),

    categories: (searchParams.get("categories")?.split(",") ??
      []) as CategoryCode[],

    swMinLat: searchParams.get("swMinLat")
      ? Number(searchParams.get("swMinLat"))
      : null,
    swMinLng: searchParams.get("swMinLng")
      ? Number(searchParams.get("swMinLng"))
      : null,
    neMaxLat: searchParams.get("neMaxLat")
      ? Number(searchParams.get("neMaxLat"))
      : null,
    neMaxLng: searchParams.get("neMaxLng")
      ? Number(searchParams.get("neMaxLng"))
      : null,
  };
}

// SearchQuery 객체 -> URL 문자열로 쓰기
function buildSearchParams(
  query: Partial<SearchQuery>,
): Record<string, string> {
  const params: Record<string, string> = {};

  if (query.mode) params.mode = query.mode;
  if (query.keyword) params.keyword = query.keyword;

  if (query.sido) params.sido = String(query.sido);
  if (query.sgg) params.sgg = String(query.sgg);
  if (query.dong) params.dong = String(query.dong);

  if (query.sidoName) params.doName = query.sidoName;
  if (query.sggName) params.siName = query.sggName;
  if (query.dongName) params.dongName = query.dongName;

  if (query.categories?.length) params.categories = query.categories.join(",");

  if (query.swMinLat != null) params.swMinLat = String(query.swMinLat);
  if (query.swMinLng != null) params.swMinLng = String(query.swMinLng);
  if (query.neMaxLat != null) params.neMaxLat = String(query.neMaxLat);
  if (query.neMaxLng != null) params.neMaxLng = String(query.neMaxLng);

  return params;
}

export function useSearchQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(() => parseSearchQuery(searchParams), [searchParams]);

  const setQuery = (
    next: Partial<SearchQuery>,
    mode: "merge" | "replace" = "merge",
  ) => {
    const merged = mode === "merge" ? { ...query, ...next } : next;
    setSearchParams(buildSearchParams(merged));
  };

  return {
    query,
    setQuery,
    setSearchParams,
  };
}
