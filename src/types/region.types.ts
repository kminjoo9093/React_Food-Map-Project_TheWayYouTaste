export interface Sido {
  sidoCd: number;
  sidoNm: string;
};

export interface Sgg {
  sidoCd: number;
  sggCd: number;
  sggNm: string;
};

export interface Dong {
  sggCd: number;
  dgCd: number;
  dgNm: string;
};

export interface RegionByCoords {
  sidoCode: number;
  sggCode: number;
  dongCode: number;
  sidoName: string;
  sggName: string;
  dongName: string;
};

export interface RegionState {
  selectedSido: number | null;
  selectedSgg: number | null;
  selectedDong: number | null;
  sidoName: string;
  sggName: string;
  dongName: string;
};