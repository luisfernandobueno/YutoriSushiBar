
const ingredients = [
  {
    id: "salmon",
    name: {
      es: "Salmón",
      en: "Salmon",
      it: "Salmone",
      pt: "Salmão"
    },
    category: "fish"
  },
  {
    id: "bluefin_tuna",
    name: {
      es: "Atún rojo",
      en: "Bluefin tuna",
      it: "Tonno rosso",
      pt: "Atum-rabilho"
    },
    category: "fish"
  },
  {
    id: "white_fish",
    name: {
      es: "Pesca blanca",
      en: "White fish",
      it: "Pesce bianco",
      pt: "Peixe branco"
    },
    category: "fish"
  },
  {
    id: "shrimp",
    name: {
      es: "Langostino / Camarón",
      en: "Prawn / Shrimp",
      it: "Gambero",
      pt: "Camarão"
    },
    category: "seafood"
  },
  {
    id: "kanikama",
    name: {
      es: "Kanikama",
      en: "Imitation crab",
      it: "Surimi",
      pt: "Kanikama"
    },
    category: "seafood"
  },
  {
    id: "crab_tartar",
    name: {
      es: "Kani tartar",
      en: "Crab-style tartare",
      it: "Tartare di surimi",
      pt: "Tartar de kani"
    },
    category: "seafood"
  },
  {
    id: "cream_cheese",
    name: {
      es: "Queso crema",
      en: "Cream cheese",
      it: "Formaggio cremoso",
      pt: "Cream cheese"
    },
    category: "dairy"
  },
  {
    id: "mozzarella",
    name: {
      es: "Queso muzzarella",
      en: "Mozzarella cheese",
      it: "Mozzarella",
      pt: "Queijo muçarela"
    },
    category: "dairy"
  },
  {
    id: "avocado",
    name: {
      es: "Palta",
      en: "Avocado",
      it: "Avocado",
      pt: "Abacate"
    },
    category: "vegetables"
  },
  {
    id: "arugula",
    name: {
      es: "Rúcula",
      en: "Arugula",
      it: "Rucola",
      pt: "Rúcula"
    },
    category: "vegetables"
  },
  {
    id: "chives",
    name: {
      es: "Ciboulette",
      en: "Chives",
      it: "Erba cipollina",
      pt: "Cebolinha"
    },
    category: "vegetables"
  },
  {
    id: "carrot",
    name: {
      es: "Zanahoria",
      en: "Carrot",
      it: "Carota",
      pt: "Cenoura"
    },
    category: "vegetables"
  },
  {
    id: "bell_pepper",
    name: {
      es: "Morrón",
      en: "Bell pepper",
      it: "Peperone",
      pt: "Pimentão"
    },
    category: "vegetables"
  },
  {
    id: "cabbage",
    name: {
      es: "Repollo",
      en: "Cabbage",
      it: "Cavolo",
      pt: "Repolho"
    },
    category: "vegetables"
  },
  {
    id: "zucchini",
    name: {
      es: "Zucchini",
      en: "Zucchini",
      it: "Zucchina",
      pt: "Abobrinha"
    },
    category: "vegetables"
  },
  {
    id: "mango",
    name: {
      es: "Mango",
      en: "Mango",
      it: "Mango",
      pt: "Manga"
    },
    category: "fruit"
  },
  {
    id: "passion_fruit",
    name: {
      es: "Maracuyá",
      en: "Passion fruit",
      it: "Frutto della passione",
      pt: "Maracujá"
    },
    category: "fruit"
  },
  {
    id: "cherry_tomato",
    name: {
      es: "Tomate cherry",
      en: "Cherry tomato",
      it: "Pomodorino",
      pt: "Tomate-cereja"
    },
    category: "vegetables"
  },
  {
    id: "sweet_potato",
    name: {
      es: "Boniato",
      en: "Sweet potato",
      it: "Patata dolce",
      pt: "Batata-doce"
    },
    category: "vegetables"
  },
  {
    id: "corn",
    name: {
      es: "Choclo",
      en: "Corn",
      it: "Mais",
      pt: "Milho"
    },
    category: "vegetables"
  },
  {
    id: "edamame",
    name: {
      es: "Edamame",
      en: "Edamame",
      it: "Edamame",
      pt: "Edamame"
    },
    category: "vegetables"
  },
  {
    id: "sesame",
    name: {
      es: "Sésamo",
      en: "Sesame",
      it: "Sesamo",
      pt: "Gergelim"
    },
    category: "seeds"
  },
  {
    id: "cashews",
    name: {
      es: "Castañas de cajú",
      en: "Cashews",
      it: "Anacardi",
      pt: "Castanha-de-caju"
    },
    category: "nuts"
  },
  {
    id: "peanuts",
    name: {
      es: "Maní",
      en: "Peanuts",
      it: "Arachidi",
      pt: "Amendoim"
    },
    category: "nuts"
  },
  {
    id: "almonds",
    name: {
      es: "Almendras",
      en: "Almonds",
      it: "Mandorle",
      pt: "Amêndoas"
    },
    category: "nuts"
  },
  {
    id: "walnuts",
    name: {
      es: "Nueces",
      en: "Walnuts",
      it: "Noci",
      pt: "Nozes"
    },
    category: "nuts"
  },
  {
    id: "nori",
    name: {
      es: "Alga nori",
      en: "Nori seaweed",
      it: "Alga nori",
      pt: "Alga nori"
    },
    category: "seaweed"
  },
  {
    id: "rice",
    name: {
      es: "Arroz",
      en: "Rice",
      it: "Riso",
      pt: "Arroz"
    },
    category: "grains"
  },
  {
    id: "quinoa",
    name: {
      es: "Quinoa",
      en: "Quinoa",
      it: "Quinoa",
      pt: "Quinoa"
    },
    category: "grains"
  },
  {
    id: "spaghetti",
    name: {
      es: "Spaghetti",
      en: "Spaghetti",
      it: "Spaghetti",
      pt: "Espaguete"
    },
    category: "grains"
  },
  {
    id: "cilantro",
    name: {
      es: "Cilantro",
      en: "Cilantro",
      it: "Coriandolo",
      pt: "Coentro"
    },
    category: "herbs"
  },
  {
    id: "red_onion",
    name: {
      es: "Cebolla morada",
      en: "Red onion",
      it: "Cipolla rossa",
      pt: "Cebola roxa"
    },
    category: "vegetables"
  },
  {
    id: "lettuce",
    name: {
      es: "Lechuga",
      en: "Lettuce",
      it: "Lattuga",
      pt: "Alface"
    },
    category: "vegetables"
  },
  {
    id: "parsley",
    name: {
      es: "Perejil",
      en: "Parsley",
      it: "Prezzemolo",
      pt: "Salsa"
    },
    category: "herbs"
  },
  {
    id: "celery",
    name: {
      es: "Apio",
      en: "Celery",
      it: "Sedano",
      pt: "Aipo"
    },
    category: "vegetables"
  },
  {
    id: "lemon",
    name: {
      es: "Limón",
      en: "Lemon",
      it: "Limone",
      pt: "Limão"
    },
    category: "fruit"
  },
  {
    id: "lime",
    name: {
      es: "Lima",
      en: "Lime",
      it: "Lime",
      pt: "Limão-taiti"
    },
    category: "fruit"
  },
  {
    id: "orange",
    name: {
      es: "Naranja",
      en: "Orange",
      it: "Arancia",
      pt: "Laranja"
    },
    category: "fruit"
  },
  {
    id: "beetroot",
    name: {
      es: "Remolacha",
      en: "Beetroot",
      it: "Barbabietola",
      pt: "Beterraba"
    },
    category: "vegetables"
  },
  {
    id: "chicken",
    name: {
      es: "Pollo",
      en: "Chicken",
      it: "Pollo",
      pt: "Frango"
    },
    category: "meat"
  },
  {
    id: "beef_tenderloin",
    name: {
      es: "Lomo",
      en: "Beef tenderloin",
      it: "Filetto di manzo",
      pt: "Filé-mignon"
    },
    category: "meat"
  },
  {
    id: "pork",
    name: {
      es: "Bondiola de cerdo",
      en: "Pork shoulder",
      it: "Coppa di maiale",
      pt: "Paleta suína"
    },
    category: "meat"
  },
  {
    id: "egg",
    name: {
      es: "Huevo",
      en: "Egg",
      it: "Uovo",
      pt: "Ovo"
    },
    category: "other"
  },
  {
    id: "soy_sauce",
    name: {
      es: "Salsa de soja",
      en: "Soy sauce",
      it: "Salsa di soia",
      pt: "Molho de soja"
    },
    category: "sauces"
  },
  {
    id: "teriyaki_sauce",
    name: {
      es: "Salsa teriyaki",
      en: "Teriyaki sauce",
      it: "Salsa teriyaki",
      pt: "Molho teriyaki"
    },
    category: "sauces"
  },
  {
    id: "oyster_sauce",
    name: {
      es: "Salsa de ostras",
      en: "Oyster sauce",
      it: "Salsa di ostriche",
      pt: "Molho de ostras"
    },
    category: "sauces"
  },
  {
    id: "sweet_chili",
    name: {
      es: "Salsa sweet chili",
      en: "Sweet chili sauce",
      it: "Salsa sweet chili",
      pt: "Molho sweet chili"
    },
    category: "sauces"
  },
  {
    id: "honey_mustard",
    name: {
      es: "Mostaza miel",
      en: "Honey mustard",
      it: "Senape al miele",
      pt: "Mostarda com mel"
    },
    category: "sauces"
  },
  {
    id: "huancaina_sauce",
    name: {
      es: "Salsa huancaína",
      en: "Huancaína sauce",
      it: "Salsa huancaína",
      pt: "Molho huancaína"
    },
    category: "sauces"
  },
  {
    id: "ponzu_sauce",
    name: {
      es: "Salsa ponzu",
      en: "Ponzu sauce",
      it: "Salsa ponzu",
      pt: "Molho ponzu"
    },
    category: "sauces"
  },
  {
    id: "sriracha",
    name: {
      es: "Sriracha",
      en: "Sriracha",
      it: "Sriracha",
      pt: "Sriracha"
    },
    category: "sauces"
  },
  {
    id: "mayonnaise",
    name: {
      es: "Mayonesa",
      en: "Mayonnaise",
      it: "Maionese",
      pt: "Maionese"
    },
    category: "sauces"
  },
  {
    id: "ketchup",
    name: {
      es: "Ketchup",
      en: "Ketchup",
      it: "Ketchup",
      pt: "Ketchup"
    },
    category: "sauces"
  }
];

export default ingredients;
