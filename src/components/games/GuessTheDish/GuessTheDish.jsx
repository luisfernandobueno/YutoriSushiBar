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
  Target,
  X,
} from "lucide-react";

import {
  buildGuessTheDishQuestions,
  getDishDescription,
} from "./guessTheDishUtils";

const TOTAL_QUESTIONS = 10;

const LANGUAGES = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
  { id: "it", label: "Italiano" },
  { id: "pt", label: "Português" },
];

function GuessTheDish({ menuData }) {
  const [language, setLanguage] = useState("es");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = useMemo(
    () =>
      buildGuessTheDishQuestions(menuData, TOTAL_QUESTIONS),
    [menuData, round]
  );

  const currentQuestion = questions[currentIndex];

  const isAnswered = selectedAnswer !== null;
  const isFinished =
    questions.length > 0 && currentIndex >= questions.length;

  const progress =
    questions.length > 0
      ? (currentIndex / questions.length) * 100
      : 0;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setScore(0);
    setAnswers([]);
  }, [language, round]);

  const handleAnswer = (dish) => {
    if (isAnswered || !currentQuestion) return;

    const isCorrect =
      dish.id === currentQuestion.correctAnswer.id;

    setSelectedAnswer(dish.id);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    setAnswers((previous) => [
      ...previous,
      {
        dish: currentQuestion.correctAnswer,
        selected: dish,
        correct: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setCurrentIndex((previous) => previous + 1);
    setSelectedAnswer(null);
    setShowHint(false);
  };

  const restartGame = () => {
    setRound((previous) => previous + 1);
  };

  const getOptionStyle = (dish) => {
    if (!isAnswered) {
      return "border-zinc-800 bg-[#151515] hover:border-red-600 hover:bg-red-950/20";
    }

    if (dish.id === currentQuestion.correctAnswer.id) {
      return "border-green-600 bg-green-950/30 text-green-400";
    }

    if (dish.id === selectedAnswer) {
      return "border-red-600 bg-red-950/30 text-red-400";
    }

    return "border-zinc-800 bg-[#111111] opacity-50";
  };

  if (!questions.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Target size={42} className="mb-4 text-red-500" />

        <h2 className="text-2xl font-bold text-white">
          No dishes available
        </h2>

        <p className="mt-2 max-w-md text-sm text-zinc-500">
          We couldn't find enough menu items with image filenames.
          Check your menu JSON and the image folder.
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
            Game completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Great job!
          </h2>

          <p className="mt-3 text-zinc-400">
            You've completed the dish recognition challenge.
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
              Your answers
            </h3>

            {answers.map((answer, index) => (
              <div
                key={`${answer.dish.id}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#171717] p-3"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/menu/${answer.dish.image}`}
                  alt={answer.dish.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {answer.dish.name}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {answer.correct
                      ? "Correct answer"
                      : `Your answer: ${answer.selected.name}`}
                  </p>
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

  const description = getDishDescription(
    currentQuestion.correctAnswer,
    language
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-500">
            <Sparkles size={16} />
            Game 04
          </div>

          <h2 className="text-3xl font-bold text-white">
            Guess the Dish
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Look at the photograph and identify the menu item.
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

      {/* Dish image */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
        <div className="relative flex aspect-[16/10] items-center justify-center bg-[#171717] sm:aspect-[16/9]">
          <img
            key={currentQuestion.id}
            src={`${import.meta.env.BASE_URL}images/menu/${currentQuestion.correctAnswer.image}`}
            alt="Identify this menu item"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
            <Eye size={14} className="mr-2 inline" />
            Identify this dish
          </div>
        </div>

        {/* Hint */}
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
              {description || "No description available for this dish."}
            </p>
          )}
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">
          Which dish is this?
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {currentQuestion.options.map((dish, index) => {
            const isCorrect =
              dish.id === currentQuestion.correctAnswer.id;

            const isSelected = dish.id === selectedAnswer;

            return (
              <button
                key={dish.id}
                disabled={isAnswered}
                onClick={() => handleAnswer(dish)}
                className={`flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left transition ${getOptionStyle(dish)}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/30 text-xs font-bold text-zinc-400">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="flex-1 text-sm font-semibold">
                  {dish.name}
                </span>

                {isAnswered && isCorrect && (
                  <Check size={18} className="shrink-0 text-green-500" />
                )}

                {isAnswered && isSelected && !isCorrect && (
                  <X size={18} className="shrink-0 text-red-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div
          className={`rounded-xl border p-4 ${
            selectedAnswer === currentQuestion.correctAnswer.id
              ? "border-green-800 bg-green-950/20"
              : "border-red-800 bg-red-950/20"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {selectedAnswer === currentQuestion.correctAnswer.id ? (
              <>
                <Check size={18} className="text-green-500" />
                <span className="text-green-400">
                  Correct! Well done.
                </span>
              </>
            ) : (
              <>
                <X size={18} className="text-red-500" />
                <span className="text-red-400">
                  Not quite! Keep learning.
                </span>
              </>
            )}
          </div>

          <p className="mt-2 text-sm text-zinc-300">
            The correct answer is{" "}
            <strong className="text-white">
              {currentQuestion.correctAnswer.name}
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

export default GuessTheDish;