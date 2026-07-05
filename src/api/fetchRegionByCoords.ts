import type { Coords, Region } from "../types";

type KakaoRegionDocument = {
  region_type: "B" | "H";
  code: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  x: number;
  y: number;
};

type KakaoRegionResponse = {
  meta: {
    total_count: number;
  };
  documents: KakaoRegionDocument[];
};

export async function fetchRegionByCoords({ lat, lng }:Coords) : Promise<Region | null> {
  const key = process.env.REACT_APP_KAKAO_LOCAL_API_KEY;
  let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`;
  const headers = { Authorization: `KakaoAK ${key}` };

  const response = await fetch(localUrl, { headers });
  const data: KakaoRegionResponse = await response.json();

  const regionInfo = data.documents.find((region) => region.region_type === "B");
  if(!regionInfo) return null;

  const sggCode = regionInfo.code.slice(0, 5);
  const sidoCode = sggCode.slice(0, 2);
  const dongCode = regionInfo.code;
  const sidoName = regionInfo.region_1depth_name;
  const sggName = regionInfo.region_2depth_name;
  const dongName = regionInfo.region_3depth_name;

  return {sggCode, sidoCode, dongCode, sidoName, sggName, dongName};
}
