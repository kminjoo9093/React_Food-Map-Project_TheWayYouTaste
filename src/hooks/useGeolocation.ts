import { useCallback, useState } from "react";

export function useGeolocation() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const getCoords = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
      },
      (error) => {
        console.error("위치를 찾지 못했습니다.");
      },
    );
  }, []);

  return { lat, lng, getCoords };
}
