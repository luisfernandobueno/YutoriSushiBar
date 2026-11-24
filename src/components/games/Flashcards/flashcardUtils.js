
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

const createId = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getIngredientCards = (fromLanguage, toLanguage) => {
  return ingredients
    .filter((ingredient) => ingredient.name?.[fromLanguage] && ingredient.name?.[toLanguage])
    .map((ingredient) => ({
      id: `ingredient-${ingredient.id}-${fromLanguage}-${toLanguage}`,
      type: "ingredient",
      front: ingredient.name[fromLanguage],
      back: ingredient.name[toLanguage],
      category: ingredient.category,
      explanation: `${LANGUAGES[fromLanguage]} → ${LANGUAGES[toLanguage]}`,
    }));
};

// Supports categories, subcategories, products and items.
const getMenuProducts = (menuData) => {
  const products = [];

  const visit = (node, inheritedCategory = "Menu") => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, inheritedCategory));
      return;
    }

    if (typeof node !== "object") return;

    const isProduct =
      typeof node.name === "string" &&
      (node.description || node.price !== undefined || node.img);

    if (isProduct) {
      products.push({
        ...node,
        category: node.category || inheritedCategory,
      });
      return;
    }

    const currentCategory =
      typeof node.name === "string" ? node.name : inheritedCategory;

    ["categories", "subcategories", "products", "items"].forEach((key) => {
      if (Array.isArray(node[key])) {
        visit(node[key], currentCategory);
      }
    });
  };

  visit(menuData?.categories || []);

  return products;
};

const getDescription = (description, language) => {
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
};

const getDishCards = (menuData, language) => {
  const products = getMenuProducts(menuData);

  return products
    .filter((product) => product.name && getDescription(product.description, language))
    .map((product) => ({
      id: `dish-${product.id || createId(product.name)}-${language}`,
      type: "dish",
      front: product.name,
      back: getDescription(product.description, language),
      category: product.category,
      price: product.price,
      image: product.img || null,
      explanation: `Descripción en ${LANGUAGES[language]}`,
    }));
};

export const buildFlashcardDeck = ({
  mode,
  menuData,
  fromLanguage,
  toLanguage,
}) => {
  if (mode === "ingredients") {
    return getIngredientCards(fromLanguage, toLanguage);
  }

  if (mode === "dishes") {
    return getDishCards(menuData, toLanguage);
  }

  return [];
};
