import { CategoryCode } from "./category.types";

export interface Store {
  bplcSn: number;
  bplcNm: string;
  address: string;
  lat: number;
  lng: number;
  storeCatNo: CategoryCode;
  storeCatName: string;
  avg: number;
  dongCd: number;
  sggCd: number;
  sidoCd: number;
  sggNm: string;
  dongNm: string;
  telno: string;
  bgngTm: string;
  ddlnTm: string;
  parkingYn: boolean;
  takeoutYn: boolean;
  petYn: boolean;
  bplcPhoto: string | null;
};

export interface StoreSearchParam {
  keyword?: string;
  sidoCode?: number;
  sggCode?: number;
  dongCode?: number;
};

export interface Menu {
  MENU_SN: number;
  BPLC_SN: number;
  MENU_NM: string;
  MENU_PRC: number;
}