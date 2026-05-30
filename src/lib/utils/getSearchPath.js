export const getSearchPath = ({region, categories, keyword}) => {

    const params = new URLSearchParams({
      mode: "district"
    });

    if(keyword) params.append("keyword", String(keyword.trim()));

    if (region?.selectedSido) params.append("sido", String(region.selectedSido).trim());
    if (region?.selectedSgg) params.append("sgg", String(region.selectedSgg).trim());
    if (region?.selectedDong) params.append("dong", String(region.selectedDong).trim());
    if (region?.sidoName) params.append("doName", String(region.sidoName).trim());
    if (region?.sggName) params.append("siName", String(region.sggName).trim());
    if (region?.dongName) params.append("dongName", String(region.dongName).trim());

    if (Array.isArray(categories) && categories.length > 0) {
      params.append("categories", categories.join(","));
    } else if (categories?.selectedCategories?.length > 0) {
      params.append("categories", categories.selectedCategories.join(","));
    }

    return `/search/store?${params.toString()}`;
  };