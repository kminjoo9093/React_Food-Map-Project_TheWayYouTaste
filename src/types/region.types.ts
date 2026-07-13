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

export type RegionByCoords = {
  sidoCode: number;
  sggCode: number;
  dongCode: number;
  sidoName: string;
  sggName: string;
  dongName: string;
};

export type RegionState = {
  selectedSido: number | null;
  selectedSgg: number | null;
  selectedDong: number | null;
  sidoName: string;
  sggName: string;
  dongName: string;
};