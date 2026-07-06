import { useCallback, useState } from "react";
import { Coords } from "../types/types";

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);

  const getCoords = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("위치를 찾지 못했습니다.");
      },
    );
  }, []);

  return { coords, getCoords };
}
