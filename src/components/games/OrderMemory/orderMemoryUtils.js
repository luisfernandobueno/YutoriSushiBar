
export const LANGUAGES = {
  es: "Español",
  en: "English",
  it: "Italiano",
  pt: "Português",
};

export const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const EXCLUDED_CATEGORIES =
  /bebidas?|drinks?|vinos?|wines?|salsas?|sauces?/i;

export function getMenuItems(menuData) {
  const products = [];

  const visitCategories = (categories, parentName = "") => {
    if (!Array.isArray(categories)) return;

    categories.forEach((category) => {
      if (!category || typeof category !== "object") return;

      const categoryName = category.name || parentName;

      if (Array.isArray(category.items)) {
        if (!EXCLUDED_CATEGORIES.test(categoryName)) {
          category.items.forEach((item) => {
            if (!item || typeof item.name !== "string") return;

            products.push({
              id: `${categoryName}-${item.name}`,
              name: item.name,
              image: item.img || "",
              category: categoryName,
              price: Number(item.price) || 0,
              description: item.description || {},
            });
          });
        }
      }

      if (Array.isArray(category.subcategories)) {
        visitCategories(category.subcategories, categoryName);
      }

      if (Array.isArray(category.categories)) {
        visitCategories(category.categories, categoryName);
      }
    });
  };

  visitCategories(menuData?.categories || []);

  const uniqueProducts = new Map();

  products.forEach((product) => {
    uniqueProducts.set(product.id, product);
  });

  return [...uniqueProducts.values()];
}

export function buildOrderMemoryRound(menuData, orderLength = 4) {
  const menuItems = getMenuItems(menuData);

  if (menuItems.length < 4) {
    return {
      order: [],
      questions: [],
    };
  }

  const actualLength = Math.min(orderLength, menuItems.length);
  const order = shuffleArray(menuItems).slice(0, actualLength);

  const questions = order.map((correctItem, index) => {
    const distractors = shuffleArray(
      menuItems.filter((item) => item.id !== correctItem.id)
    ).slice(0, 3);

    return {
      id: `${correctItem.id}-${index}`,
      position: index + 1,
      correctItem,
      options: shuffleArray([correctItem, ...distractors]),
    };
  });

  return {
    order,
    questions,
  };
}

export function getLocalizedDescription(description, language = "es") {
  if (typeof description === "string") return description;

  if (!description || typeof description !== "object") return "";

  return (
    description[language] ||
    description.es ||
    description.en ||
    description.it ||
    description.pt ||
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
