import { createContext, useEffect, useState } from "react";
import { getData } from "../api/http";

export const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [sidoList, setSidoList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      const [categoryData, sidoData] = await Promise.all([
        getData("/youtaste/search"),
        getData("/youtaste/search/sido"),
      ]);
      setCategories(categoryData);
      setSidoList(sidoData);
    } catch (error) {
      console.error("공통 데이터 요청 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchAppData();
  }, [])

  return (
    <AppDataContext.Provider value={{categories, sidoList, loading}}>
      {children}
    </AppDataContext.Provider>
  )
}
