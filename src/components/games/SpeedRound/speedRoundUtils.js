
export const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

export const shuffleArray = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const getDescription = (description, language) => {
  if (typeof description === "string") {
    return description.trim();
  }

  if (!description || typeof description !== "object") return "";

  return (
    description[language]?.trim() ||
    description.es?.trim() ||
    description.en?.trim() ||
    description.it?.trim() ||
    description.pt?.trim() ||
    ""
  );
};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

const getMenuItems = (menuData, language) => {
  if (!Array.isArray(menuData?.categories)) return [];

  const items = [];

  const excludedCategories = [
    "BEBIDAS",
    "BEBIDA",
    "DRINKS",
    "VINOS",
    "VINO",
    "WINES",
    "SALSAS",
    "SAUCES",
  ];

  const walk = (category, parentName = "") => {
    if (!category || typeof category !== "object") return;

    const categoryName = category.name || parentName;

    if (excludedCategories.includes(normalize(categoryName))) return;

    if (Array.isArray(category.items)) {
      category.items.forEach((item, index) => {
        if (!item || typeof item.name !== "string") return;

        const price = Number(item.price);

        items.push({
          id: `${normalize(categoryName)}-${item.name}-${index}`,
          name: item.name,
          category: categoryName || "Menú",
          price: Number.isFinite(price) ? price : null,
          description: getDescription(item.description, language),
          image: item.img || "",
        });
      });
    }

    if (Array.isArray(category.subcategories)) {
      category.subcategories.forEach((child) =>
        walk(child, categoryName)
      );
    }

    if (Array.isArray(category.categories)) {
      category.categories.forEach((child) =>
        walk(child, categoryName)
      );
    }
  };

  menuData.categories.forEach((category) => walk(category));

  return items;
};

const formatPrice = (price, currency) =>
  new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: currency || "UYU",
    maximumFractionDigits: 0,
  }).format(price);

const makeOptions = (correct, candidates) => {
  const unique = [...new Set(candidates.filter(Boolean))].filter(
    (value) => value !== correct
  );

  if (unique.length < 3) return null;

  return shuffleArray([
    correct,
    ...shuffleArray(unique).slice(0, 3),
  ]);
};

export const buildSpeedQuestions = (menuData, language = "en") => {
  const items = getMenuItems(menuData, language);

  if (items.length < 4) return [];

  const currency = menuData?.currency || "UYU";
  const questions = [];

  const dishNames = [...new Set(items.map((item) => item.name))];
  const descriptions = [
    ...new Set(items.map((item) => item.description).filter(Boolean)),
  ];
  const categories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];
  const prices = [
    ...new Set(
      items
        .filter((item) => item.price !== null)
        .map((item) => item.price)
    ),
  ];

  const addQuestion = (prompt, answer, candidates, image = "") => {
    const options = makeOptions(answer, candidates);

    if (!options) return;

    questions.push({
      id: `${questions.length}-${prompt}`,
      prompt,
      answer,
      options,
      image,
    });
  };

  items.forEach((item) => {
    // Type 1: Identify the dish from its description.
    if (item.description && dishNames.length >= 4) {
      addQuestion(
        `"${item.description}" — Which dish is being described?`,
        item.name,
        dishNames,
      );
    }

    // Type 2: Remember the price.
    if (item.price !== null && prices.length >= 4) {
      const answer = formatPrice(item.price, currency);
      const priceOptions = prices.map((price) =>
        formatPrice(price, currency)
      );

      addQuestion(
        `What is the price of ${item.name}?`,
        answer,
        priceOptions,
        item.image,
      );
    }

    // Type 3: Remember the category.
    if (item.category && categories.length >= 4) {
      addQuestion(
        `Which category does ${item.name} belong to?`,
        item.category,
        categories,
        item.image,
      );
    }

    // Type 4: Match a description to a dish.
    if (item.description && dishNames.length >= 4) {
      addQuestion(
        `Which dish matches this description: "${item.description}"?`,
        item.name,
        dishNames,
      );
    }
  });

  return shuffleArray(questions);
};
