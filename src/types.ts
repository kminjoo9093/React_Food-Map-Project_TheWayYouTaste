export type SearchMode = "district" | "bounds";

export type Category = {
  storeCatNo: string;
  storeCatName: string;
};

export type Sido = {
  sidoCd: number;
  sidoNm: string;
};

export type Sgg = {
  sidoCd: number;
  sggCd: number;
  sggNm: string;
};

export type Dong = {
  sggCd: number;
  dgCd: number;
  dgNm: string;
};

export type Coords = {
  lat: number;
  lng: number;
}

export type Viewport = {
  [key: string]: number;
};

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
}

export type Region = {
  sidoCode: string;
  sggCode: string;
  dongCode: string;
  sidoName: string;
  sggName: string;
  dongName: string;
};