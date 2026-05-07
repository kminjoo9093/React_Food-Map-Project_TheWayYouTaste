import korean from "../../resources/img/search/food_korean.jpg";
import japanese from "../../resources/img/search/food_japanese.jpg";
import western from "../../resources/img/search/food_western.jpg";
import chinese from "../../resources/img/search/food_chinese.jpg";
import asian from "../../resources/img/search/food_asian.jpg";
import burger from "../../resources/img/search/food_burger.jpg";
import chicken from "../../resources/img/search/food_chicken.jpg";
import dessert from "../../resources/img/search/food_dessert.jpg";
import noImage from "../../resources/img/default.jpg";

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