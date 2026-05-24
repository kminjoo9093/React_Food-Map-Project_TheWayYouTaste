const categoryImages = {
  c01: "images/food_korean.webp",
  c02: "images/food_japanese.webp",
  c03: "images/food_western.webp",
  c04: "images/food_chinese.webp",
  c05: "images/food_asian.webp",
  c06: "images/food_burger.webp",
  c07: "images/food_chicken.webp",
  c08: "images/food_dessert.webp",
}

export const getStoreImage = (category) => categoryImages[category] || "images/default.webp";