
import ingredients from "../../../data/ingredients";

export const INGREDIENT_LANGUAGES = {
  es: "Español",
  en: "English",
  it: "Italiano",
  pt: "Português",
};

const INGREDIENT_ALIASES = {
  avocado: ["palta", "aguacate"],
  shrimp: ["langostino", "langostinos", "camarón", "camarones"],
  chives: ["ciboulette", "cebollín", "cebollino"],
  salmon: ["salmón"],
  bluefin_tuna: ["atún rojo", "atún bluefin"],
  cream_cheese: ["queso crema", "cream cheese"],
  mozzarella: ["mozzarella"],
  sweet_potato: ["boniato", "batata", "camote"],
  scallion: ["cebolla de verdeo", "verdeo"],
  soy_sauce: ["salsa de soja", "soja"],
  cherry_tomato: ["tomate cherry", "tomates cherry"],
  red_onion: ["cebolla morada", "cebolla roja"],
  bell_pepper: ["morrón", "pimiento"],
  cilantro: ["cilantro", "coriandro"],
  nori: ["alga nori", "nori"],
  edamame: ["edamame"],
  cashews: ["castañas de cajú", "anacardos"],
  peanuts: ["maní", "cacahuetes"],
  teriyaki: ["salsa teriyaki", "teriyaki"],
  oyster_sauce: ["salsa de ostras"],
  sweet_chili: ["salsa sweet chili", "salsa de chile dulce"],
  passion_fruit: ["maracuyá", "fruta de la pasión"],
  huancaina: ["huancaína", "salsa huancaína"],
  ponzu: ["salsa ponzu", "ponzu"],
  sriracha: ["sriracha"],
  beef_tenderloin: ["lomo de res", "lomo vacuno", "lomo"],
  white_fish: ["pescado blanco"],
  crab_tartare: ["tartar de cangrejo"],
  kanikama: ["kani kama", "kanikama"],
};

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsPhrase = (text, phrase) => {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);

  if (!normalizedPhrase || normalizedPhrase.length < 3) return false;

  const pattern = new RegExp(
    `(^|\\s)${escapeRegex(normalizedPhrase)}(?=\\s|$)`
  );

  return pattern.test(normalizedText);
};

const getSpanishDescription = (description) => {
  if (!description) return "";

  if (typeof description === "string") {
    return description;
  }

  return description.es || description.en || "";
};

const getMenuProducts = (menuData) => {
  const products = [];
  const visited = new Set();

  const walk = (node, category = "Menú") => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, category));
      return;
    }

    if (typeof node !== "object") return;

    const hasChildren =
      Array.isArray(node.products) ||
      Array.isArray(node.items) ||
      Array.isArray(node.subcategories) ||
      Array.isArray(node.categories);

    const currentCategory =
      typeof node.category === "string"
        ? node.category
        : typeof node.name === "string" && hasChildren
          ? node.name
          : category;

    const isProduct =
      typeof node.name === "string" &&
      !hasChildren &&
      Boolean(node.description);

    if (isProduct && !visited.has(node)) {
      visited.add(node);

      products.push({
        id: node.id || node.name,
        name: node.name,
        description: node.description,
        category: currentCategory,
      });
    }

    Object.entries(node).forEach(([key, value]) => {
      if (["name", "description", "price", "img", "id"].includes(key)) {
        return;
      }

      walk(value, currentCategory);
    });
  };

  walk(menuData);

  return products;
};

const getIngredientTerms = (ingredient) => {
  const spanishName = ingredient.name?.es;

  return [
    spanishName,
    ...(INGREDIENT_ALIASES[ingredient.id] || []),
  ].filter(Boolean);
};

const findIngredientsInDescription = (description) => {
  return ingredients.filter((ingredient) => {
    const terms = getIngredientTerms(ingredient);

    return terms.some((term) => containsPhrase(description, term));
  });
};

const getTranslatedIngredient = (ingredient, language) =>
  ingredient.name?.[language] ||
  ingredient.name?.es ||
  ingredient.id;

const createQuestion = (product, correctIngredient, matchedIngredients, language) => {
  const correctAnswer = getTranslatedIngredient(
    correctIngredient,
    language
  );

  const distractors = ingredients
    .filter((ingredient) => ingredient.id !== correctIngredient.id)
    .map((ingredient) => getTranslatedIngredient(ingredient, language))
    .filter((name) => name !== correctAnswer);

  const uniqueDistractors = [...new Set(distractors)];

  if (uniqueDistractors.length < 3) return null;

  const shuffledOptions = [
    correctAnswer,
    ...shuffleArray(uniqueDistractors).slice(0, 3),
  ];

  return {
    id: `ingredient-${product.id}-${correctIngredient.id}`,
    dish: product.name,
    category: product.category,
    question: `Which ingredient is included in "${product.name}"?`,
    answer: correctAnswer,
    options: shuffleArray(shuffledOptions),
    explanation: matchedIngredients
      .map((ingredient) => ingredient.name?.es)
      .filter(Boolean)
      .join(", "),
    type: "ingredient",
  };
};

export const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const buildIngredientQuestions = ({
  menuData,
  language = "en",
}) => {
  if (!menuData) return [];

  const products = getMenuProducts(menuData);
  const questions = [];

  products.forEach((product) => {
    const description = getSpanishDescription(product.description);

    if (!description) return;

    const matchedIngredients =
      findIngredientsInDescription(description);

    if (matchedIngredients.length === 0) return;

    matchedIngredients.forEach((ingredient) => {
      const question = createQuestion(
        product,
        ingredient,
        matchedIngredients,
        language
      );

      if (question) questions.push(question);
    });
  });

  return shuffleArray(questions);
};
