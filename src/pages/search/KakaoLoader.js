// import { useEffect } from "react";
// import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

// export default function useKakaoLoader(setIsLoaded) {
//   useEffect(() => {
//     // 이미 로드된 경우 바로 리턴
//     if (window.kakao) {
//       setIsLoaded(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=5794d8a0c2862c16e4c69ad303abfb4b&libraries=clusterer,drawing,services`;
//     script.async = true;

//     script.onload = () => {
//       setIsLoaded(true);  // SDK가 로드되면 상태 변경
//     };

//     script.onerror = (error) => {
//       console.error("Error loading Kakao Maps SDK:", error);
//     };

//     document.head.appendChild(script);

//     // 컴포넌트 언마운트 시 스크립트 제거
//     return () => {
//       document.head.removeChild(script);
//     };
//   }, [setIsLoaded]);  // 의존성 배열에 setIsLoaded 추가
// }
