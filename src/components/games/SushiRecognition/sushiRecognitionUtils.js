export const LANGUAGES = ["es", "en", "it", "pt"];

export const shuffleArray = (array) =>
  [...array].sort(() => Math.random() - 0.5);

const SUSHI_KEYWORDS =
  /sushi|nigiri|sashimi|uramaki|hosomaki|temaki|maki|roll|rolls|geisha|gunkan|hot roll|spring roll/i;

const NON_SUSHI_CATEGORIES =
  /bebidas|drinks|vinos|wine|cervezas|beer|salsas|sauces|postres|desserts/i;

export const getMenuDishes = (menuData) => {
  const dishes = [];

  const walk = (categories, parentName = "") => {
    if (!Array.isArray(categories)) return;

    categories.forEach((category) => {
      const categoryName = category.name || parentName;

      if (Array.isArray(category.items)) {
        category.items.forEach((item) => {
          if (!item?.name || !item?.img) return;

          dishes.push({
            id: `${categoryName}-${item.name}`,
            name: item.name,
            image: item.img,
            category: categoryName,
            description: item.description || {},
          });
        });
      }

      walk(category.subcategories, categoryName);
      walk(category.categories, categoryName);
    });
  };

  walk(menuData?.categories);

  return dishes.filter(
    (dish, index, array) =>
      array.findIndex((other) => other.id === dish.id) === index
  );
};

const isLikelySushi = (dish) => {
  const category = dish.category || "";
  const name = dish.name || "";

  if (NON_SUSHI_CATEGORIES.test(category)) return false;

  return (
    SUSHI_KEYWORDS.test(category) ||
    SUSHI_KEYWORDS.test(name)
  );
};

export const buildSushiRecognitionQuestions = (
  menuData,
  totalQuestions = 10
) => {
  const allDishes = getMenuDishes(menuData);

  const sushiDishes = allDishes.filter(isLikelySushi);

  // Prefer sushi-specific items. If there aren't enough, use
  // other pictured menu dishes as additional recognition practice.
  const pool =
    sushiDishes.length >= 4
      ? sushiDishes
      : allDishes;

  if (pool.length < 4) return [];

  const selectedDishes = shuffleArray(pool).slice(
    0,
    Math.min(totalQuestions, pool.length)
  );

  return selectedDishes.map((dish, index) => {
    const distractors = shuffleArray(
      pool.filter((item) => item.id !== dish.id)
    ).slice(0, 3);

    return {
      id: `sushi-recognition-${index}-${dish.id}`,
      answer: dish,
      options: shuffleArray([dish, ...distractors]),
    };
  });
};