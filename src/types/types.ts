export type SearchMode = "district" | "bounds";

export type Coords = {
  lat: number;
  lng: number;
};

export type Viewport = {
  [key: string]: number;
};