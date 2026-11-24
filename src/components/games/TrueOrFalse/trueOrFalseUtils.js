
export const LANGUAGES = ["es", "en", "it", "pt"];

export const shuffleArray = (array) =>
  [...array].sort(() => Math.random() - 0.5);

const TEXT = {
  es: {
    price: (name, price) => `El precio de ${name} es ${price}.`,
    category: (name, category) => `${name} pertenece a la categoría ${category}.`,
    description: (name) => `La descripción de ${name} es:`,
  },
  en: {
    price: (name, price) => `The price of ${name} is ${price}.`,
    category: (name, category) => `${name} belongs to the ${category} category.`,
    description: (name) => `The description of ${name} is:`,
  },
  it: {
    price: (name, price) => `Il prezzo di ${name} è ${price}.`,
    category: (name, category) => `${name} appartiene alla categoria ${category}.`,
    description: (name) => `La descrizione di ${name} è:`,
  },
  pt: {
    price: (name, price) => `O preço de ${name} é ${price}.`,
    category: (name, category) => `${name} pertence à categoria ${category}.`,
    description: (name) => `A descrição de ${name} é:`,
  },
};

const getLocalizedDescription = (item, language) => {
  const descriptions = item.description;

  if (typeof descriptions === "string") return descriptions;

  return (
    descriptions?.[language] ||
    descriptions?.es ||
    descriptions?.en ||
    ""
  );
};

export const getMenuItems = (menuData) => {
  const result = [];

  const walkCategories = (categories, parentName = "") => {
    if (!Array.isArray(categories)) return;

    categories.forEach((category) => {
      const categoryName = category.name || parentName;

      if (Array.isArray(category.items)) {
        category.items.forEach((item) => {
          if (!item?.name) return;

          result.push({
            id: `${categoryName}-${item.name}`,
            name: item.name,
            image: item.img || "",
            category: categoryName,
            price: Number(item.price),
            description: item.description || {},
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

  walkCategories(menuData?.categories);

  return result;
};

const formatPrice = (price, currency = "UYU") => {
  try {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
};

const makeQuestion = ({
  item,
  type,
  isTrue,
  otherItem,
  language,
  currency,
}) => {
  const text = TEXT[language] || TEXT.es;

  if (type === "price") {
    const statedPrice = isTrue ? item.price : otherItem.price;

    return {
      id: `${item.id}-price-${isTrue}`,
      item,
      type,
      isTrue,
      statement: text.price(
        item.name,
        formatPrice(statedPrice, currency)
      ),
      explanation: `${item.name}: ${formatPrice(item.price, currency)}`,
    };
  }

  if (type === "category") {
    const statedCategory = isTrue
      ? item.category
      : otherItem.category;

    return {
      id: `${item.id}-category-${isTrue}`,
      item,
      type,
      isTrue,
      statement: text.category(item.name, statedCategory),
      explanation: `${item.name} — ${item.category}`,
    };
  }

  const statedDescription = isTrue
    ? getLocalizedDescription(item, language)
    : getLocalizedDescription(otherItem, language);

  return {
    id: `${item.id}-description-${isTrue}`,
    item,
    type,
    isTrue,
    statement: text.description(item.name),
    detail: statedDescription,
    isDescription: true,
    explanation: getLocalizedDescription(item, language),
  };
};

export const buildTrueOrFalseQuestions = (
  menuData,
  language = "es",
  totalQuestions = 10
) => {
  const items = getMenuItems(menuData).filter(
    (item) => item.name && Number.isFinite(item.price) && item.price >= 0
  );

  if (items.length < 2) return [];

  const questions = [];

  items.forEach((item) => {
    const otherItems = items.filter(
      (other) => other.id !== item.id
    );

    const differentPrice = otherItems.filter(
      (other) => other.price !== item.price
    );

    const differentCategory = otherItems.filter(
      (other) => other.category !== item.category
    );

    const differentDescription = otherItems.filter((other) => {
      const a = getLocalizedDescription(item, language);
      const b = getLocalizedDescription(other, language);
      return a && b && a !== b;
    });

    const types = [];

    if (differentPrice.length) types.push("price");
    if (differentCategory.length) types.push("category");
    if (differentDescription.length) types.push("description");

    types.forEach((type) => {
      const isTrue = Math.random() < 0.5;

      let otherItem = item;

      if (type === "price") {
        const pool = isTrue
          ? [item]
          : differentPrice;

        otherItem = shuffleArray(pool)[0];
      }

      if (type === "category") {
        const pool = isTrue
          ? [item]
          : differentCategory;

        otherItem = shuffleArray(pool)[0];
      }

      if (type === "description") {
        const pool = isTrue
          ? [item]
          : differentDescription;

        otherItem = shuffleArray(pool)[0];
      }

      if (!isTrue && otherItem.id === item.id) return;

      questions.push(
        makeQuestion({
          item,
          type,
          isTrue,
          otherItem,
          language,
          currency: menuData?.currency || "UYU",
        })
      );
    });
  });

  return shuffleArray(questions)
    .slice(0, totalQuestions)
    .map((question, index) => ({
      ...question,
      id: `${index}-${question.id}`,
    }));
};
