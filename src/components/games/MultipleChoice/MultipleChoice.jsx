
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import {
  buildMultipleChoiceQuestions,
  LANGUAGES,
} from "./multipleChoiceUtils";

const TOTAL_QUESTIONS = 10;

export default function MultipleChoice({ menuData = null }) {
  const [fromLanguage, setFromLanguage] = useState("es");
  const [toLanguage, setToLanguage] = useState("en");
  const [menuLanguage, setMenuLanguage] = useState("es");

  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questionPool = useMemo(
    () =>
      buildMultipleChoiceQuestions({
        menuData,
        fromLanguage,
        toLanguage,
        language: menuLanguage,
      }),
    [menuData, fromLanguage, toLanguage, menuLanguage, round]
  );

  const questions = useMemo(
    () => questionPool.slice(0, TOTAL_QUESTIONS),
    [questionPool]
  );

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect =
    isAnswered && selectedAnswer === currentQuestion?.answer;

  const isFinished =
    questions.length > 0 && currentIndex >= questions.length;

  const progress =
    questions.length > 0
      ? (Math.min(currentIndex + (isAnswered ? 1 : 0), questions.length) /
          questions.length) *
        100
      : 0;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
  }, [fromLanguage, toLanguage, menuLanguage]);

  const handleAnswer = (answer) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(answer);

    const correct = answer === currentQuestion.answer;

    if (correct) {
      setScore((previous) => previous + 10);
    }

    setAnswers((previous) => [
      ...previous,
      {
        questionId: currentQuestion.id,
        correct,
        selected: answer,
        answer: currentQuestion.answer,
      },
    ]);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentIndex((previous) => previous + 1);
  };

  const restartGame = () => {
    setRound((previous) => previous + 1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
  };

  const getOptionStyle = (option) => {
    const base =
      "w-full rounded-xl border p-4 text-left transition-all duration-200 flex items-center justify-between gap-3";

    if (!isAnswered) {
      return `${base} border-zinc-800 bg-[#151515] text-zinc-200 hover:border-red-600 hover:bg-red-950/20`;
    }

    if (option === currentQuestion.answer) {
      return `${base} border-green-600 bg-green-950/30 text-green-300`;
    }

    if (option === selectedAnswer) {
      return `${base} border-red-600 bg-red-950/30 text-red-300`;
    }

    return `${base} border-zinc-800 bg-[#111111] text-zinc-600 opacity-60`;
  };

  const getTypeLabel = (type) => {
    const labels = {
      ingredient: "INGREDIENTS",
      dish: "DISH KNOWLEDGE",
      category: "CATEGORIES",
      price: "PRICES",
    };

    return labels[type] || "GENERAL KNOWLEDGE";
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#090909] p-6 text-zinc-100">
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
          <CircleHelp className="mx-auto mb-4 h-10 w-10 text-red-500" />

          <h2 className="text-2xl font-bold">
            No questions available
          </h2>

          <p className="mt-3 text-sm text-zinc-400">
            Check that your ingredients database contains translations
            for the selected languages.
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const correctAnswers = answers.filter((answer) => answer.correct).length;
    const percentage = Math.round(
      (correctAnswers / questions.length) * 100
    );

    return (
      <div className="min-h-screen bg-[#090909] px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-red-700 bg-red-950/40">
              <Trophy className="h-10 w-10 text-red-400" />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
              Round completed
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Well done!
            </h1>

            <p className="mt-2 text-zinc-400">
              You've completed this multiple-choice challenge.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#191919] p-4">
                <Trophy className="mx-auto mb-2 h-5 w-5 text-yellow-500" />
                <p className="text-2xl font-black">{score}</p>
                <p className="mt-1 text-xs text-zinc-500">Points</p>
              </div>

              <div className="rounded-xl bg-[#191919] p-4">
                <Check className="mx-auto mb-2 h-5 w-5 text-green-500" />
                <p className="text-2xl font-black">
                  {correctAnswers}/{questions.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Correct</p>
              </div>

              <div className="rounded-xl bg-[#191919] p-4">
                <Zap className="mx-auto mb-2 h-5 w-5 text-red-500" />
                <p className="text-2xl font-black">{percentage}%</p>
                <p className="mt-1 text-xs text-zinc-500">Accuracy</p>
              </div>
            </div>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-red-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <button
              onClick={restartGame}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-4 font-bold text-white transition hover:bg-red-600"
            >
              <RotateCcw size={18} />
              Play again
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-[#111111] p-5">
            <h2 className="mb-4 font-bold">Answer review</h2>

            <div className="space-y-3">
              {answers.map((answer, index) => {
                const question = questions.find(
                  (item) => item.id === answer.questionId
                );

                return (
                  <div
                    key={`${answer.questionId}-${index}`}
                    className="flex items-start gap-3 rounded-lg bg-[#191919] p-3"
                  >
                    {answer.correct ? (
                      <Check className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {question?.question}
                      </p>

                      {!answer.correct && (
                        <p className="mt-1 text-xs text-zinc-500">
                          Your answer: {answer.selected}
                        </p>
                      )}

                      <p className="mt-1 text-sm text-green-400">
                        Correct answer: {answer.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Game 02
            </p>
            <h1 className="mt-1 text-2xl font-black">
              Multiple Choice
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Choose the correct answer.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#151515] px-4 py-2 text-right">
            <p className="text-xs text-zinc-500">Score</p>
            <p className="text-xl font-black text-red-400">{score}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-zinc-800 bg-[#111111] p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% completed</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <label className="text-xs text-zinc-500">
            Translation from
            <select
              value={fromLanguage}
              onChange={(event) => setFromLanguage(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-[#151515] p-3 text-sm text-zinc-200 outline-none focus:border-red-600"
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs text-zinc-500">
            Translation to
            <select
              value={toLanguage}
              onChange={(event) => setToLanguage(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-[#151515] p-3 text-sm text-zinc-200 outline-none focus:border-red-600"
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mb-6 block text-xs text-zinc-500">
          Menu question language
          <select
            value={menuLanguage}
            onChange={(event) => setMenuLanguage(event.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-800 bg-[#151515] p-3 text-sm text-zinc-200 outline-none focus:border-red-600"
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full border border-red-900 bg-red-950/40 px-3 py-1 text-[10px] font-bold tracking-widest text-red-400">
              {getTypeLabel(currentQuestion.type)}
            </span>

            <span className="text-xs text-zinc-600">
              +10 points for a correct answer
            </span>
          </div>

          <h2 className="whitespace-pre-line text-xl font-bold leading-relaxed sm:text-2xl">
            {currentQuestion.question}
          </h2>

          <div className="mt-7 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={`${currentQuestion.id}-${option}`}
                disabled={isAnswered}
                onClick={() => handleAnswer(option)}
                className={getOptionStyle(option)}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/30 text-xs font-bold text-zinc-500">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm font-medium">{option}</span>
                </span>

                {isAnswered && option === currentQuestion.answer && (
                  <Check className="h-5 w-5 shrink-0 text-green-400" />
                )}

                {isAnswered &&
                  option === selectedAnswer &&
                  !isCorrect && (
                    <X className="h-5 w-5 shrink-0 text-red-400" />
                  )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div
              className={`mt-6 rounded-xl border p-4 ${
                isCorrect
                  ? "border-green-900 bg-green-950/20"
                  : "border-red-900 bg-red-950/20"
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {isCorrect ? (
                  <>
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-green-400">Correct!</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-400" />
                    <span className="text-red-400">Not quite!</span>
                  </>
                )}
              </div>

              <p className="mt-2 text-sm text-zinc-300">
                {currentQuestion.explanation ||
                  `The correct answer is ${currentQuestion.answer}.`}
              </p>
            </div>
          )}

          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-4 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {currentIndex === questions.length - 1
              ? "See results"
              : "Next question"}
            <ChevronRight size={18} />
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-600">
          Learn a little. Remember a lot.
        </p>
      </div>
    </div>
  );
}
