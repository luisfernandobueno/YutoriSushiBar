const EXCLUDED_CATEGORIES = [
  "BEBIDAS",
  "SALSAS",
  "VINOS",
];

export const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const normalizeText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

export function getMenuDishes(menuData) {
  if (!menuData?.categories) return [];

  const dishes = [];

  const excluded = EXCLUDED_CATEGORIES.map(normalizeText);

  const walkCategories = (categories) => {
    if (!Array.isArray(categories)) return;

    categories.forEach((category) => {
      const categoryName = category?.name || "";

      if (excluded.includes(normalizeText(categoryName))) {
        return;
      }

      if (Array.isArray(category?.items)) {
        category.items.forEach((item) => {
          if (!item?.name || !item?.img) return;

          dishes.push({
            id: `${normalizeText(categoryName)}-${normalizeText(item.name)}`,
            name: item.name,
            image: item.img,
            category: categoryName,
            description: item.description || {},
            price: item.price ?? null,
          });
        });
      }

      if (Array.isArray(category?.subcategories)) {
        walkCategories(category.subcategories);
      }

      if (Array.isArray(category?.categories)) {
        walkCategories(category.categories);
      }
    });
  };

  walkCategories(menuData.categories);

  // Remove duplicate dishes.
  return [
    ...new Map(dishes.map((dish) => [dish.id, dish])).values(),
  ];
}

export function buildGuessTheDishQuestions(
  menuData,
  totalQuestions = 10
) {
  const dishes = getMenuDishes(menuData);

  if (dishes.length < 4) return [];

  const shuffledDishes = shuffleArray(dishes).slice(
    0,
    Math.min(totalQuestions, dishes.length)
  );

  return shuffledDishes.map((dish, index) => {
    const distractors = shuffleArray(
      dishes.filter((item) => item.id !== dish.id)
    ).slice(0, 3);

    return {
      id: `${dish.id}-${index}`,
      correctAnswer: dish,
      options: shuffleArray([dish, ...distractors]),
    };
  });
}

export function getDishDescription(dish, language = "es") {
  if (!dish?.description) return "";

  if (typeof dish.description === "string") {
    return dish.description;
  }

  return (
    dish.description[language] ||
    dish.description.es ||
    dish.description.en ||
    ""
  );
}