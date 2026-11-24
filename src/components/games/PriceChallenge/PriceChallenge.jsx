import { useEffect, useMemo, useState } from "react";

import {
  Award,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  RotateCcw,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import {
  buildPriceQuestions,
  formatPrice,
  getPriceDescription,
} from "./priceChallengeUtils";

const TOTAL_QUESTIONS = 10;

const LANGUAGES = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
  { id: "it", label: "Italiano" },
  { id: "pt", label: "Português" },
];

function PriceChallenge({ menuData }) {
  const currency = menuData?.currency || "UYU";

  const [language, setLanguage] = useState("es");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = useMemo(
    () => buildPriceQuestions(menuData, TOTAL_QUESTIONS),
    [menuData, round]
  );

  const currentQuestion = questions[currentIndex];

  const isAnswered = selectedPrice !== null;

  const isFinished =
    questions.length > 0 && currentIndex >= questions.length;

  const progress =
    questions.length > 0
      ? (currentIndex / questions.length) * 100
      : 0;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedPrice(null);
    setShowHint(false);
    setScore(0);
    setAnswers([]);
  }, [round]);

  const handleAnswer = (price) => {
    if (isAnswered || !currentQuestion) return;

    const isCorrect = price === currentQuestion.correctPrice;

    setSelectedPrice(price);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    setAnswers((previous) => [
      ...previous,
      {
        item: currentQuestion.item,
        selectedPrice: price,
        correctPrice: currentQuestion.correctPrice,
        correct: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setCurrentIndex((previous) => previous + 1);
    setSelectedPrice(null);
    setShowHint(false);
  };

  const restartGame = () => {
    setRound((previous) => previous + 1);
  };

  const getOptionStyle = (price) => {
    if (!isAnswered) {
      return "border-zinc-800 bg-[#151515] hover:border-red-600 hover:bg-red-950/20";
    }

    if (price === currentQuestion.correctPrice) {
      return "border-green-600 bg-green-950/30 text-green-400";
    }

    if (price === selectedPrice) {
      return "border-red-600 bg-red-950/30 text-red-400";
    }

    return "border-zinc-800 bg-[#111111] opacity-50";
  };

  if (!questions.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Tag size={42} className="mb-4 text-red-500" />

        <h2 className="text-2xl font-bold text-white">
          Not enough menu data
        </h2>

        <p className="mt-2 max-w-md text-sm text-zinc-500">
          We couldn't generate price questions. Check that your
          menu items have an image filename and a valid numeric price,
          and that at least four different prices are available.
        </p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="mx-auto max-w-3xl py-8">
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 text-center sm:p-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-950">
            <Award size={38} className="text-red-400" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Challenge completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Price Master!
          </h2>

          <p className="mt-3 text-zinc-400">
            You've completed the price challenge.
          </p>

          <div className="my-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-5">
              <p className="text-3xl font-bold text-white">
                {score}/{questions.length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Correct answers
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-5">
              <p className="text-3xl font-bold text-red-500">
                {percentage}%
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Accuracy
              </p>
            </div>
          </div>

          <div className="mb-8 space-y-3 text-left">
            <h3 className="font-semibold text-white">
              Price review
            </h3>

            {answers.map((answer, index) => (
              <div
                key={`${answer.item.id}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#171717] p-3"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/menu/${answer.item.image}`}
                  alt={answer.item.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {answer.item.name}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Your answer:{" "}
                    {formatPrice(answer.selectedPrice, currency)}
                  </p>

                  {!answer.correct && (
                    <p className="text-xs text-green-500">
                      Correct:{" "}
                      {formatPrice(answer.correctPrice, currency)}
                    </p>
                  )}
                </div>

                {answer.correct ? (
                  <Check className="shrink-0 text-green-500" />
                ) : (
                  <X className="shrink-0 text-red-500" />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={restartGame}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            <RotateCcw size={17} />
            Play again
          </button>
        </div>
      </div>
    );
  }

  const description = getPriceDescription(
    currentQuestion.item,
    language
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-500">
            <Sparkles size={16} />
            Game 05
          </div>

          <h2 className="text-3xl font-bold text-white">
            Price Challenge
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Know your menu prices by heart.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#151515] px-4 py-3">
          <Flame size={18} className="text-red-500" />

          <span className="text-sm font-semibold text-white">
            {score} points
          </span>
        </div>
      </div>

      {/* Language selector */}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((item) => (
          <button
            key={item.id}
            onClick={() => setLanguage(item.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              language === item.id
                ? "border-red-700 bg-red-700 text-white"
                : "border-zinc-800 bg-[#151515] text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            Question {currentIndex + 1} of {questions.length}
          </span>

          <span className="font-semibold text-red-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-red-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dish image and name */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
        <div className="relative aspect-[16/10] bg-[#171717] sm:aspect-[16/9]">
          <img
            key={currentQuestion.id}
            src={`${import.meta.env.BASE_URL}images/menu/${currentQuestion.item.image}`}
            alt={currentQuestion.item.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-red-400">
              {currentQuestion.item.category}
            </p>

            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {currentQuestion.item.name}
            </h3>
          </div>
        </div>

        {/* Description hint */}
        <div className="p-4">
          <button
            onClick={() => setShowHint((previous) => !previous)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300"
          >
            {showHint ? <EyeOff size={16} /> : <Eye size={16} />}

            {showHint ? "Hide description" : "Need a hint?"}
          </button>

          {showHint && (
            <p className="mt-3 rounded-lg border border-zinc-800 bg-[#171717] p-4 text-sm leading-relaxed text-zinc-300">
              {description || "No description available for this item."}
            </p>
          )}
        </div>
      </div>

      {/* Price question */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">
          How much does this item cost?
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((price, index) => (
            <button
              key={`${price}-${index}`}
              disabled={isAnswered}
              onClick={() => handleAnswer(price)}
              className={`flex min-h-20 items-center justify-center gap-3 rounded-xl border p-4 transition ${getOptionStyle(price)}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/30 text-xs font-bold text-zinc-400">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="text-lg font-bold sm:text-xl">
                {formatPrice(price, currency)}
              </span>

              {isAnswered &&
                price === currentQuestion.correctPrice && (
                  <Check size={18} className="text-green-500" />
                )}

              {isAnswered &&
                price === selectedPrice &&
                price !== currentQuestion.correctPrice && (
                  <X size={18} className="text-red-500" />
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div
          className={`rounded-xl border p-4 ${
            selectedPrice === currentQuestion.correctPrice
              ? "border-green-800 bg-green-950/20"
              : "border-red-800 bg-red-950/20"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {selectedPrice === currentQuestion.correctPrice ? (
              <>
                <Check size={18} className="text-green-500" />
                <span className="text-green-400">
                  Exactly right!
                </span>
              </>
            ) : (
              <>
                <X size={18} className="text-red-500" />
                <span className="text-red-400">
                  Not quite!
                </span>
              </>
            )}
          </div>

          <p className="mt-2 text-sm text-zinc-300">
            The correct price is{" "}
            <strong className="text-white">
              {formatPrice(currentQuestion.correctPrice, currency)}
            </strong>
            .
          </p>

          <button
            onClick={handleNext}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            {currentIndex === questions.length - 1
              ? "See results"
              : "Next question"}

            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default PriceChallenge;