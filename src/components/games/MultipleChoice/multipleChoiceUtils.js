
import ingredients from "../../../data/ingredients";

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

const getDescription = (description, language = "es") => {
  if (!description) return "";

  if (typeof description === "string") {
    return description;
  }

  return (
    description[language] ||
    description.es ||
    description.en ||
    Object.values(description).find(Boolean) ||
    ""
  );
};

export const getMenuProducts = (menuData) => {
  const products = [];
  const visited = new Set();

  const walk = (node, inheritedCategory = "Menú") => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, inheritedCategory));
      return;
    }

    if (typeof node !== "object") return;

    const category =
      typeof node.category === "string"
        ? node.category
        : typeof node.name === "string" &&
            !node.description &&
            !node.price &&
            (node.items || node.products)
          ? node.name
          : inheritedCategory;

    const isProduct =
      typeof node.name === "string" &&
      !Array.isArray(node.items) &&
      !Array.isArray(node.products) &&
      (node.description || node.price !== undefined || node.img);

    if (isProduct && !visited.has(node)) {
      visited.add(node);

      products.push({
        id: node.id || node.name,
        name: node.name,
        description: node.description || "",
        price: node.price,
        category,
        img: node.img,
      });
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === "name" || key === "description" || key === "price") {
        return;
      }

      const nextCategory =
        key === "items" || key === "products"
          ? category
          : inheritedCategory;

      walk(value, nextCategory);
    });
  };

  walk(menuData);

  return products;
};

const makeQuestion = ({
  id,
  question,
  answer,
  distractors,
  explanation,
  type,
}) => {
  const uniqueOptions = [...new Set([answer, ...distractors])]
    .filter(Boolean);

  if (uniqueOptions.length < 2) return null;

  return {
    id,
    question,
    answer,
    options: shuffleArray(uniqueOptions).slice(0, 4),
    explanation: explanation || "",
    type,
  };
};

const getIngredientQuestions = (fromLanguage, toLanguage) => {
  const validIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.name?.[fromLanguage] &&
      ingredient.name?.[toLanguage]
  );

  return validIngredients.map((ingredient) => {
    const answer = ingredient.name[toLanguage];

    const distractors = shuffleArray(
      validIngredients
        .filter((item) => item.id !== ingredient.id)
        .map((item) => item.name[toLanguage])
        .filter((name) => name !== answer)
    ).slice(0, 3);

    return makeQuestion({
      id: `ingredient-${ingredient.id}-${fromLanguage}-${toLanguage}`,
      question: `How do you say "${ingredient.name[fromLanguage]}" in ${LANGUAGES[toLanguage]}?`,
      answer,
      distractors,
      explanation: `${ingredient.name[fromLanguage]} = ${answer}`,
      type: "ingredient",
    });
  }).filter(Boolean);
};

const getDishQuestions = (products, language) => {
  if (products.length < 2) return [];

  const questions = [];

  // Identify a dish from its description.
  products.forEach((product) => {
    const description = getDescription(product.description, language);

    if (!description) return;

    const distractors = shuffleArray(
      products
        .filter((item) => item.id !== product.id)
        .map((item) => item.name)
    ).slice(0, 3);

    const question = makeQuestion({
      id: `dish-description-${product.id}`,
      question: `Which dish matches this description?\n"${description}"`,
      answer: product.name,
      distractors,
      explanation: product.name,
      type: "dish",
    });

    if (question) questions.push(question);
  });

  // Identify the category of a dish.
  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  if (categories.length > 1) {
    products.forEach((product) => {
      const distractors = shuffleArray(
        categories.filter((category) => category !== product.category)
      ).slice(0, 3);

      const question = makeQuestion({
        id: `dish-category-${product.id}`,
        question: `Which menu category does "${product.name}" belong to?`,
        answer: product.category,
        distractors,
        explanation: `${product.name} belongs to ${product.category}.`,
        type: "category",
      });

      if (question) questions.push(question);
    });
  }

  // Memorize menu prices.
  const pricedProducts = products.filter(
    (product) => product.price !== undefined && product.price !== null
  );

  if (pricedProducts.length > 1) {
    pricedProducts.forEach((product) => {
      const distractors = shuffleArray(
        pricedProducts
          .filter((item) => item.id !== product.id)
          .map((item) => productPrice(item.price))
          .filter((price) => price !== productPrice(product.price))
      ).slice(0, 3);

      const question = makeQuestion({
        id: `dish-price-${product.id}`,
        question: `What is the price of "${product.name}"?`,
        answer: productPrice(product.price),
        distractors,
        explanation: `${product.name}: ${productPrice(product.price)}`,
        type: "price",
      });

      if (question) questions.push(question);
    });
  }

  return questions;
};

const productPrice = (price) => {
  if (typeof price === "number") return `$${price}`;
  return String(price);
};

export const buildMultipleChoiceQuestions = ({
  menuData,
  fromLanguage = "es",
  toLanguage = "en",
  language = "es",
}) => {
  const ingredientQuestions = getIngredientQuestions(
    fromLanguage,
    toLanguage
  );

  const products = getMenuProducts(menuData);
  const dishQuestions = getDishQuestions(products, language);

  return shuffleArray([
    ...ingredientQuestions,
    ...dishQuestions,
  ]);
};
