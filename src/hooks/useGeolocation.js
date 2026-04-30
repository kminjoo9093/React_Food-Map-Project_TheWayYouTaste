import { useCallback, useState } from "react";

export function useGeolocation() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLng(longitude);
    });
  }, []);

  return { lat, lng, getLocation };
}
