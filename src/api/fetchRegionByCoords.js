export async function fetchRegionByCoords({ lat, lng }) {
  const key = process.env.REACT_APP_KAKAO_LOCAL_API_KEY;
  let localUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`;
  const headers = { Authorization: `KakaoAK ${key}` };

  const response = await fetch(localUrl, { headers });
  const data = await response.json();
  
  if (!data.documents || data.documents.length === 0) return null;

  const regionInfo = data.documents[0];
  const sggCode = regionInfo.code.slice(0, 5);
  const sidoCode = sggCode.slice(0, 2);
  const dongCode = regionInfo.code;
  const sidoName = regionInfo.region_1depth_name;
  const sggName = regionInfo.region_2depth_name;
  const dongName = regionInfo.region_3depth_name;

  return {sggCode, sidoCode, dongCode, sidoName, sggName, dongName};
}
