import { Map, useKakaoLoader  } from "react-kakao-maps-sdk";

function KakaoLoader(){
   const [loading, error] = useKakaoLoader({
    appkey: '5794d8a0c2862c16e4c69ad303abfb4b',
    libraries: ['services', 'clusterer'],
  });
  console.log('loading ----- > ' + loading);
  console.log('error ----- > ' + error);
  if(!loading){
    console.log('error-----------------');
    console.log(error);
  }
//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "100%",
      }}
      level={3} // 지도의 확대 레벨
    />
  );
}

export default KakaoLoader;