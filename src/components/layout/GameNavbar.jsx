import { Gamepad2, Lock } from "lucide-react";

const games = [
  {
    id: "flashcards",
    number: 1,
    name: "Flashcards",
    available: true,
  },
  {
    id: "multiple-choice",
    number: 2,
    name: "Multiple Choice",
    available: true,
  },
  {
    id: "ingredient-quiz",
    number: 3,
    name: "Ingredient Quiz",
    available: true,
  },
  {
    id: "guess-the-dish",
    number: 4,
    name: "Guess the Dish",
    available: true,
  },
  {
    id: "price-challenge",
    number: 5,
    name: "Price Challenge",
    available: true,
  },
  {
    id: "true-or-false",
    number: 6,
    name: "True or False",
    available: true,
  },
  {
    id: "odd-one-out",
    number: 7,
    name: "Odd One Out",
    available: true,
  },
  {
    id: "sushi-recognition",
    number: 8,
    name: "Sushi Recognition",
    available: true,
  },
  {
    id: "category-sorting",
    number: 9,
    name: "Category Sorting",
    available: true,
  },
  {
    id: "description-challenge",
    number: 10,
    name: "Description Challenge",
    available: true,
  },
  {
    id: "speed-round",
    number: 11,
    name: "Speed Round",
    available: true,
  },
  {
    id: "order-memory",
    number: 12,
    name: "Order Memory",
    available: true,
  },
  {
    id: "customer-scenarios",
    number: 13,
    name: "Customer Scenarios",
    available: true,
  },
  {
    id: "waiter-simulation",
    number: 14,
    name: "Waiter Simulation",
    available: true,
  },

{
  id: "business-info",
  number: 15,
  name: "About Yutori",
  available: true,
}

];

function GameNavbar({ activeGame, onSelectGame }) {
    return (
        <header className="border-b border-zinc-800 bg-[#0d0d0d]">
            <div className="mx-auto max-w-7xl px-4 py-4">
                {/* Brand */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700">
                        <Gamepad2 size={21} className="text-white" />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-wide text-white">
                            YUTORI <span className="text-red-500">ACADEMY</span>
                        </h1>
                        <p className="text-xs text-zinc-500">
                            Learn the menu. Master the service.
                        </p>
                    </div>
                </div>

                {/* Game navigation */}
                <nav
                    aria-label="Game navigation"
                    className="flex gap-2 overflow-x-auto pb-2"
                >
                    {games.map((game) => {
                        const isActive = activeGame === game.id;
                        const isAvailable = game.available === true;

                        return (
                            <button
                                key={game.id}
                                type="button"
                                onClick={() => {
                                    if (isAvailable) onSelectGame(game.id);
                                }}
                                disabled={!isAvailable}
                                aria-current={isActive ? "page" : undefined}
                                title={
                                    isAvailable
                                        ? game.name
                                        : `${game.name} — Coming soon`
                                }
                                className={`
                  flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2
                  text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? "border-red-600 bg-red-700 text-white shadow-lg shadow-red-950/30"
                                        : isAvailable
                                            ? "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-800 hover:bg-zinc-800 hover:text-white"
                                            : "cursor-not-allowed border-zinc-900 bg-[#111111] text-zinc-700"
                                    }
                `}
                            >
                                <span
                                    className={`text-xs ${isActive ? "text-red-200" : "text-zinc-600"
                                        }`}
                                >
                                    {String(game.number).padStart(2, "0")}
                                </span>

                                <span>{game.name}</span>

                                {!isAvailable && <Lock size={12} />}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}

export default GameNavbar;