import { useNavigate, useSearchParams } from "react-router-dom";
import style from "../css/SearchForm.module.css";
import searchIcon from "../resources/img/system/search.png";
import { useEffect, useState } from "react";
import {
  useDongName,
  useSelectedCategories,
  useSelectedDong,
  useSelectedSgg,
  useSelectedSido,
  useSggName,
  useSidoName,
} from "../store/filters";
import { getSearchPath } from "../lib/utils/getSearchPath";

type Device = "mobile" | "pc";

export default function SearchForm({ device }: { device: Device }) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const urlKeyword = params.get("keyword") as string;
  
  const mode = device === "mobile" ? style.mob : style.pc;

  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const sidoName = useSidoName();
  const sggName = useSggName();
  const dongName = useDongName();
  const selectedCategories = useSelectedCategories();

  const searchUrl = getSearchPath({
    region: {
      selectedSido,
      sidoName,
      selectedSgg,
      sggName,
      selectedDong,
      dongName,
    },
    categories: selectedCategories,
    keyword: keyword,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword === urlKeyword ) return; 
    navigate(searchUrl);
  };

  useEffect(()=>{
    setKeyword(urlKeyword || "");
  }, [urlKeyword])


  return (
    <div className={`${style.searchContainer} ${mode}`}>
      <form onSubmit={handleSearch} className={style.searchForm}>
        <input
          type="text"
          placeholder="식당명을 검색하세요"
          className={style.searchInput}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className={style.searchBtn}>
          <img src={searchIcon} alt="검색하기 버튼" />
        </button>
      </form>
    </div>
  );
}
