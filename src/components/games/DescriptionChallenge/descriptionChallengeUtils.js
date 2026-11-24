export const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

export const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const getDescription = (description, language) => {
  if (typeof description === "string") {
    return description.trim();
  }

  if (!description || typeof description !== "object") {
    return "";
  }

  return (
    description[language]?.trim() ||
    description.es?.trim() ||
    description.en?.trim() ||
    description.it?.trim() ||
    description.pt?.trim() ||
    ""
  );
};

export const getDescribedDishes = (menuData, language = "es") => {
  if (!menuData?.categories || !Array.isArray(menuData.categories)) {
    return [];
  }

  const dishes = [];

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

  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();

  const walkCategory = (category, parentName = "") => {
    if (!category || typeof category !== "object") return;

    const categoryName = category.name || parentName;
    const normalizedCategory = normalize(categoryName);

    if (excludedCategories.includes(normalizedCategory)) {
      return;
    }

    if (Array.isArray(category.items)) {
      category.items.forEach((item, index) => {
        if (!item || typeof item.name !== "string") return;

        const description = getDescription(item.description, language);

        if (!description) return;

        dishes.push({
          id: `${normalizedCategory}-${item.name}-${index}`,
          name: item.name,
          image: item.img || "",
          category: categoryName || "Menú",
          description,
        });
      });
    }

    if (Array.isArray(category.subcategories)) {
      category.subcategories.forEach((subcategory) =>
        walkCategory(subcategory, categoryName)
      );
    }

    if (Array.isArray(category.categories)) {
      category.categories.forEach((subcategory) =>
        walkCategory(subcategory, categoryName)
      );
    }
  };

  menuData.categories.forEach((category) => walkCategory(category));

  // Avoid duplicate descriptions, which could make questions ambiguous.
  const seen = new Set();

  return dishes.filter((dish) => {
    const key = dish.description
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

export const buildDescriptionQuestions = (
  menuData,
  language = "es",
  totalQuestions = 10
) => {
  const dishes = getDescribedDishes(menuData, language);

  if (dishes.length < 4) return [];

  const shuffledDishes = shuffleArray(dishes);
  const questions = [];

  shuffledDishes.forEach((dish) => {
    if (questions.length >= totalQuestions) return;

    const distractors = shuffleArray(
      dishes.filter(
        (candidate) =>
          candidate.id !== dish.id &&
          candidate.description !== dish.description
      )
    ).slice(0, 3);

    if (distractors.length < 3) return;

    const options = shuffleArray([
      {
        id: dish.id,
        description: dish.description,
        correct: true,
      },
      ...distractors.map((candidate) => ({
        id: candidate.id,
        description: candidate.description,
        correct: false,
      })),
    ]);

    questions.push({
      id: dish.id,
      dish,
      options,
      correctAnswer: dish.description,
    });
  });

  return questions;
};