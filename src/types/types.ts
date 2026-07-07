export type SearchMode = "district" | "bounds";

export type Coords = {
  lat: number;
  lng: number;
};

export type Viewport = {
  swMinLat: number;
  swMinLng: number;
  neMaxLat: number;
  neMaxLng: number;
};
