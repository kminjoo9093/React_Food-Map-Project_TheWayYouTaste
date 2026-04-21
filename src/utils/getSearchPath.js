export const getSearchPath = ({region, location, categories}) => {
    // 파라미터 생성
    const params = new URLSearchParams();

    if (region.selectedDo) params.append("sido", String(region.selectedDo).trim());
    if (region.selectedSi) params.append("sgg", String(region.selectedSi).trim());
    if (region.selectedDong) params.append("dong", String(region.selectedDong).trim());
    if (region.doName) params.append("doName", String(region.doName).trim());
    if (region.siName) params.append("siName", String(region.siName).trim());
    if (region.dongName) params.append("dongName", String(region.dongName).trim());

    if (location.lat) params.append("lat", location.lat); // 위도 추가
    if (location.lng) params.append("lng", location.lng); // 경도 추가

    // 선택된 카테고리들 파라미터에 추가
    if (categories.selectedCategories.length > 0) {
      params.append("categories", categories.selectedCategories.join(","));
    }

    // 검색 페이지로 이동
    return `/search/store?${params.toString()}`;
  };