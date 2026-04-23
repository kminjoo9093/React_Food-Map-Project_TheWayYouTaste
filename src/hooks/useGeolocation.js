import { useCallback, useState } from "react";

export function useGeolocation() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  // if (!navigator.geolocation) {
  //   console.log("2. Geolocation 미지원");
  //   return;
  // }

  // const geoOptions = {
  //   enableHighAccuracy: true,
  //   timeout: 10000,
  //   maximumAge: 0,
  // };

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLng(longitude);
    });
  }, []);

  return {lat, lng, getLocation};
}
