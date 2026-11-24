
export const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export function getPricedMenuItems(menuData) {
  if (!Array.isArray(menuData?.categories)) return [];

  const items = [];

  const walkCategories = (categories, parentName = "") => {
    if (!Array.isArray(categories)) return;

    categories.forEach((category) => {
      const categoryName = category?.name || parentName;

      if (Array.isArray(category.items)) {
        category.items.forEach((item) => {
          const price = Number(item?.price);

          if (
            !item?.name ||
            !item?.img ||
            !Number.isFinite(price) ||
            price < 0
          ) {
            return;
          }

          items.push({
            id: `${categoryName}-${item.name}`,
            name: item.name,
            image: item.img,
            category: categoryName,
            description: item.description || {},
            price,
          });
        });
      }

      if (Array.isArray(category.subcategories)) {
        walkCategories(category.subcategories, categoryName);
      }

      if (Array.isArray(category.categories)) {
        walkCategories(category.categories, categoryName);
      }
    });
  };

  walkCategories(menuData.categories);

  return [
    ...new Map(items.map((item) => [item.id, item])).values(),
  ];
}

export function buildPriceQuestions(menuData, totalQuestions = 10) {
  const items = getPricedMenuItems(menuData);

  const availablePrices = [
    ...new Set(items.map((item) => item.price)),
  ];

  if (items.length === 0 || availablePrices.length < 4) {
    return [];
  }

  const selectedItems = shuffleArray(items).slice(
    0,
    Math.min(totalQuestions, items.length)
  );

  return selectedItems.map((item, index) => {
    const incorrectPrices = shuffleArray(
      availablePrices.filter((price) => price !== item.price)
    ).slice(0, 3);

    return {
      id: `${item.id}-${index}`,
      item,
      correctPrice: item.price,
      options: shuffleArray([
        item.price,
        ...incorrectPrices,
      ]),
    };
  });
}

export function getPriceDescription(item, language = "es") {
  if (!item?.description) return "";

  if (typeof item.description === "string") {
    return item.description;
  }

  return (
    item.description[language] ||
    item.description.es ||
    item.description.en ||
    ""
  );
}

export function formatPrice(price, currency = "UYU") {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}