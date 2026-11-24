import { useState } from "react";

import menuData from "./data/menu.json";

import GameNavbar from "./components/layout/GameNavbar";

import Flashcards from "./components/games/Flashcards/Flashcards";
import MultipleChoice from "./components/games/MultipleChoice/MultipleChoice";
import IngredientQuiz from "./components/games/IngredientQuiz/IngredientQuiz";
import GuessTheDish from "./components/games/GuessTheDish/GuessTheDish";
import PriceChallenge from "./components/games/PriceChallenge/PriceChallenge";
import TrueOrFalse from "./components/games/TrueOrFalse/TrueOrFalse";
import OddOneOut from "./components/games/OddOneOut/OddOneOut";
import CategorySorting from "./components/games/CategorySorting/CategorySorting";

// Games still to be created
 import DescriptionChallenge from "./components/games/DescriptionChallenge/DescriptionChallenge";
import SpeedRound from "./components/games/SpeedRound/SpeedRound";
import OrderMemory from "./components/games/OrderMemory/OrderMemory";
import CustomerScenarios from "./components/games/CustomerScenarios/CustomerScenarios";
import WaiterSimulation from "./components/games/WaiterSimulation/WaiterSimulation";

import BusinessInfo from "./components/games/BusinessInfo/BusinessInfo";


const GAME_COMPONENTS = {
  flashcards: Flashcards,
  "multiple-choice": MultipleChoice,
  "ingredient-quiz": IngredientQuiz,
  "guess-the-dish": GuessTheDish,
  "price-challenge": PriceChallenge,
  "true-or-false": TrueOrFalse,
  "odd-one-out": OddOneOut,
  "category-sorting": CategorySorting,

  // Games 10–14
   "description-challenge": DescriptionChallenge,
  "speed-round": SpeedRound,
  "order-memory": OrderMemory,
"customer-scenarios": CustomerScenarios,
   "waiter-simulation": WaiterSimulation,
"business-info": BusinessInfo,

};

function App() {
  const [activeGame, setActiveGame] = useState("flashcards");

  const ActiveGame = GAME_COMPONENTS[activeGame];

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <GameNavbar
        activeGame={activeGame}
        onSelectGame={setActiveGame}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {ActiveGame ? (
          <ActiveGame menuData={menuData} />
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-white">
              Game not found
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Please select an available game from the navigation.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;