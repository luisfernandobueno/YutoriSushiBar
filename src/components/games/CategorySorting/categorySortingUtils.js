export const LANGUAGES = ["es", "en", "it", "pt"];

export const shuffleArray = (array) =>
  [...array].sort(() => Math.random() - 0.5);

export const getMenuCategories = (menuData) => {
  const categories = [];

  const walk = (nodes, parentName = "") => {
    if (!Array.isArray(nodes)) return;

    nodes.forEach((node) => {
      const categoryName = node.name || parentName;

      if (Array.isArray(node.items) && node.items.length > 0) {
        const products = node.items
          .filter((item) => item?.name)
          .map((item) => ({
            id: `${categoryName}-${item.name}`,
            name: item.name,
            image: item.img || "",
            description: item.description || {},
            price: item.price,
          }));

        if (products.length) {
          categories.push({
            id: categoryName,
            name: categoryName,
            products,
          });
        }
      }

      walk(node.subcategories, categoryName);
      walk(node.categories, categoryName);
    });
  };

  walk(menuData?.categories);

  return categories;
};

export const buildCategorySortingQuestions = (
  menuData,
  totalQuestions = 10
) => {
  const categories = getMenuCategories(menuData).filter(
    (category) => category.products.length > 0
  );

  if (categories.length < 4) return [];

  const allQuestions = [];

  categories.forEach((category) => {
    category.products.forEach((product) => {
      const otherCategories = categories.filter(
        (other) => other.id !== category.id
      );

      if (otherCategories.length < 3) return;

      const distractors = shuffleArray(otherCategories).slice(0, 3);

      allQuestions.push({
        id: `category-sort-${product.id}`,
        product,
        correctCategory: category,
        options: shuffleArray([
          category,
          ...distractors,
        ]),
      });
    });
  });

  return shuffleArray(allQuestions)
    .slice(0, totalQuestions)
    .map((question, index) => ({
      ...question,
      id: `${index}-${question.id}`,
    }));
};