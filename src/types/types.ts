import type { Category } from "./category.types";
import type { Dong, Sgg, Sido } from "./region.types";
import type { Menu, Store } from "./store.types";

export type SearchMode = "district" | "bounds";

export interface DbJson {
  category: Category[];
  store: Store[];
  menu: Menu[];
  sido: Sido[];
  sgg: Sgg[];
  dong: Dong[];
}

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
