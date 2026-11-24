import ingredients from "../../../data/ingredients";

export const LANGUAGES = ["es", "en", "it", "pt"];

export const shuffleArray = (array) =>
  [...array].sort(() => Math.random() - 0.5);

const getLocalizedName = (value, language) => {
  if (typeof value === "string") return value;
  return value?.[language] || value?.es || value?.en || "";
};

export const getMenuItems = (menuData) => {
  const result = [];

  const walk = (categories, parentName = "") => {
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
            description: item.description || {},
          });
        });
      }

      walk(category.subcategories, categoryName);
      walk(category.categories, categoryName);
    });
  };

  walk(menuData?.categories);

  return result.filter(
    (item, index, array) =>
      array.findIndex((other) => other.id === item.id) === index
  );
};

const buildCategoryQuestions = (menuData, language) => {
  const items = getMenuItems(menuData);
  const groups = {};

  items.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  const categories = Object.entries(groups).filter(
    ([, categoryItems]) => categoryItems.length >= 3
  );

  if (categories.length < 2) return [];

  const questions = [];

  categories.forEach(([categoryName, categoryItems]) => {
    const otherCategories = categories.filter(
      ([name]) => name !== categoryName
    );

    if (!otherCategories.length) return;

    const otherCategory = shuffleArray(otherCategories)[0];
    const threeItems = shuffleArray(categoryItems).slice(0, 3);
    const oddItem = shuffleArray(otherCategory[1])[0];

    if (threeItems.length !== 3 || !oddItem) return;

    const options = shuffleArray([...threeItems, oddItem]);

    questions.push({
      id: `menu-${categoryName}-${oddItem.id}`,
      type: "menu",
      options,
      oddItemId: oddItem.id,
      explanation: {
        es: `Tres platos pertenecen a "${categoryName}". ${oddItem.name} pertenece a "${oddItem.category}".`,
        en: `Three dishes belong to "${categoryName}". ${oddItem.name} belongs to "${oddItem.category}".`,
        it: `Tre piatti appartengono a "${categoryName}". ${oddItem.name} appartiene a "${oddItem.category}".`,
        pt: `Três pratos pertencem a "${categoryName}". ${oddItem.name} pertence a "${oddItem.category}".`,
      },
    });
  });

  return questions;
};

const buildIngredientQuestions = (language) => {
  const groups = {};

  ingredients.forEach((ingredient) => {
    if (!ingredient.category) return;
    if (!groups[ingredient.category]) groups[ingredient.category] = [];
    groups[ingredient.category].push(ingredient);
  });

  const validGroups = Object.entries(groups).filter(
    ([, group]) => group.length >= 3
  );

  if (validGroups.length < 2) return [];

  return validGroups.map(([category, group]) => {
    const otherGroups = validGroups.filter(([name]) => name !== category);
    const otherGroup = shuffleArray(otherGroups)[0];

    const common = shuffleArray(group).slice(0, 3);
    const odd = shuffleArray(otherGroup[1])[0];

    const options = shuffleArray([...common, odd]);

    const categoryNames = {
      fish: {
        es: "pescados y mariscos",
        en: "fish and seafood",
        it: "pesce e frutti di mare",
        pt: "peixes e frutos do mar",
      },
      vegetable: {
        es: "vegetales",
        en: "vegetables",
        it: "verdure",
        pt: "vegetais",
      },
      meat: {
        es: "carnes",
        en: "meats",
        it: "carni",
        pt: "carnes",
      },
      sauce: {
        es: "salsas",
        en: "sauces",
        it: "salse",
        pt: "molhos",
      },
      dairy: {
        es: "lácteos",
        en: "dairy products",
        it: "latticini",
        pt: "laticínios",
      },
    };

    const commonLabel =
      categoryNames[category]?.[language] || category;

    const oddLabel =
      categoryNames[odd.category]?.[language] || odd.category;

    return {
      id: `ingredient-${category}-${odd.id}`,
      type: "ingredient",
      options,
      oddItemId: odd.id,
      explanation: {
        es: `Los otros tres pertenecen al grupo "${commonLabel}". ${getLocalizedName(odd.name, language)} pertenece a "${oddLabel}".`,
        en: `The other three belong to "${commonLabel}". ${getLocalizedName(odd.name, language)} belongs to "${oddLabel}".`,
        it: `Gli altri tre appartengono al gruppo "${commonLabel}". ${getLocalizedName(odd.name, language)} appartiene a "${oddLabel}".`,
        pt: `Os outros três pertencem ao grupo "${commonLabel}". ${getLocalizedName(odd.name, language)} pertence a "${oddLabel}".`,
      },
    };
  });
};

export const buildOddOneOutQuestions = (
  menuData,
  language = "es",
  totalQuestions = 10
) => {
  const menuQuestions = buildCategoryQuestions(menuData, language);
  const ingredientQuestions = buildIngredientQuestions(language);

  return shuffleArray([
    ...menuQuestions,
    ...ingredientQuestions,
  ]).slice(0, totalQuestions);
};

export const getOptionName = (option, type, language) => {
  return type === "ingredient"
    ? getLocalizedName(option.name, language)
    : option.name;
};