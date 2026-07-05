export type Store = {
  bplcSn: number;
  bplcNm: string;
  address: string;
  lat: number;
  lng: number;
  storeCatNo: string;
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

export type StoreSearchParam = {
  keyword?: string;
  sidoCode?: number;
  sggCode?: number;
  dongCode?: number;
};
