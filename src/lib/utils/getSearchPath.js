export const getSearchPath = ({region, categories}) => {
    // 파라미터 생성
    const params = new URLSearchParams();

    if (region?.selectedSido) params.append("sido", String(region.selectedSido).trim());
    if (region?.selectedSgg) params.append("sgg", String(region.selectedSgg).trim());
    if (region?.selectedDong) params.append("dong", String(region.selectedDong).trim());
    if (region?.doName) params.append("doName", String(region.doName).trim());
    if (region?.siName) params.append("siName", String(region.siName).trim());
    if (region?.dongName) params.append("dongName", String(region.dongName).trim());

  // 선택된 카테고리들 파라미터에 추가
    if (Array.isArray(categories) && categories.length > 0) {
      params.append("categories", categories.join(","));
    } else if (categories?.selectedCategories?.length > 0) {
      params.append("categories", categories.selectedCategories.join(","));
    }

    // 검색 페이지로 이동
    return `/search/store?${params.toString()}`;
  };