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
