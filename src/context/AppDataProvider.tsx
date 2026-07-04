import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getData } from "../api/http";
import { Sido } from "../types";

type Category = {
  storeCatNo: string;
  storeCatName: string;
};

type AppDataContextType = {
  categories: Category[];
  sidoList: Sido[];
  loading: boolean;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children } : {children: ReactNode}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sidoList, setSidoList] = useState<Sido[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      const [categoryData, sidoData] = await Promise.all([
        getData("/category"),
        getData("/sido"),
      ]);
      setCategories(categoryData);
      setSidoList(sidoData);
    } catch (error) {
      console.error("공통 데이터 요청 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  return (
    <AppDataContext.Provider value={{ categories, sidoList, loading }}>
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if(!context) {
    throw new Error("AppDataProvider 내부에서만 사용할 수 있는 hook입니다.")
  }
  return context;
}