import korean from "../../resources/img/search/food_korean.webp";
import japanese from "../../resources/img/search/food_japanese.webp";
import western from "../../resources/img/search/food_western.webp";
import chinese from "../../resources/img/search/food_chinese.webp";
import asian from "../../resources/img/search/food_asian.webp";
import burger from "../../resources/img/search/food_burger.webp";
import chicken from "../../resources/img/search/food_chicken.webp";
import dessert from "../../resources/img/search/food_dessert.webp";
import noImage from "../../resources/img/default.webp";

const categoryImages = {
  c01: korean,
  c02: japanese,
  c03: western,
  c04: chinese,
  c05: asian,
  c06: burger,
  c07: chicken,
  c08: dessert,
}

export const getStoreImage = (category) => categoryImages[category] || noImage;