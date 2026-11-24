
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import Flashcard from "./Flashcard";
import {
  LANGUAGES,
  buildFlashcardDeck,
  shuffleArray,
} from "./flashcardUtils";

import useFlashcardProgress from "../../../hooks/useFlashcardProgress";

export default function Flashcards({ menuData = null }) {
  const [mode, setMode] = useState("ingredients");
  const [fromLanguage, setFromLanguage] = useState("es");
  const [toLanguage, setToLanguage] = useState("en");

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffleVersion, setShuffleVersion] = useState(0);

  const {
    markKnown,
    markForReview,
    isKnown,
    getStats,
    resetProgress,
  } = useFlashcardProgress();

  const baseDeck = useMemo(
    () =>
      buildFlashcardDeck({
        mode,
        menuData,
        fromLanguage,
        toLanguage,
      }),
    [mode, menuData, fromLanguage, toLanguage]
  );

  const deck = useMemo(
    () => shuffleArray(baseDeck),
    [baseDeck, shuffleVersion]
  );

  useEffect(() => {
    setCardIndex(0);
    setFlipped(false);
  }, [mode, fromLanguage, toLanguage, shuffleVersion]);

  const currentCard = deck[cardIndex];
  const stats = getStats(deck);

  const nextCard = () => {
    setCardIndex((previous) =>
      previous >= deck.length - 1 ? 0 : previous + 1
    );
    setFlipped(false);
  };

  const previousCard = () => {
    setCardIndex((previous) =>
      previous <= 0 ? deck.length - 1 : previous - 1
    );
    setFlipped(false);
  };

  const handleKnown = () => {
    if (!currentCard) return;
    markKnown(currentCard.id);
    nextCard();
  };

  const handleReview = () => {
    if (!currentCard) return;
    markForReview(currentCard.id);
    nextCard();
  };

  const handleShuffle = () => {
    setShuffleVersion((previous) => previous + 1);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the progress of this deck?"
    );

    if (confirmed) {
      resetProgress(deck.map((card) => card.id));
      setCardIndex(0);
      setFlipped(false);
    }
  };

  const switchLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  const progressWidth = `${stats.percentage}%`;

  const buttonBase =
    "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-200";

  const inactiveButton =
    "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-800 hover:bg-zinc-800 hover:text-white";

  const selectClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm font-medium text-zinc-100 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20";

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-8 text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            <Sparkles className="h-4 w-4" />
            Yutori Learning
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Flashcards
            <span className="ml-3 text-red-600">.</span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            Learn the menu, recognize ingredients and build your
            confidence one card at a time.
          </p>
        </header>

        {/* Game mode */}
        <section className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("ingredients")}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-semibold transition duration-200 ${
              mode === "ingredients"
                ? "border-red-700 bg-red-700 text-white shadow-lg shadow-red-950/40"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-800 hover:text-white"
            }`}
          >
            <Target className="h-5 w-5" />
            Ingredients
          </button>

          <button
            type="button"
            onClick={() => setMode("dishes")}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-semibold transition duration-200 ${
              mode === "dishes"
                ? "border-red-700 bg-red-700 text-white shadow-lg shadow-red-950/40"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-800 hover:text-white"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            Dishes
          </button>
        </section>

        {/* Language settings */}
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-[#111111] p-5 shadow-lg shadow-black/20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-white">
                Language settings
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Customize your learning experience
              </p>
            </div>

            <span className="rounded-full border border-red-900/50 bg-red-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
              {mode === "ingredients" ? "Translation mode" : "Description mode"}
            </span>
          </div>

          {mode === "ingredients" ? (
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label className="min-w-0">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Show in
                </span>

                <select
                  value={fromLanguage}
                  onChange={(event) => setFromLanguage(event.target.value)}
                  className={selectClass}
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={switchLanguages}
                title="Switch languages"
                className="mb-1 rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-red-500 transition hover:border-red-700 hover:bg-red-950/40"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>

              <label className="min-w-0">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Learn in
                </span>

                <select
                  value={toLanguage}
                  onChange={(event) => setToLanguage(event.target.value)}
                  className={selectClass}
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Show dish descriptions in
              </span>

              <select
                value={toLanguage}
                onChange={(event) => setToLanguage(event.target.value)}
                className={selectClass}
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            {mode === "ingredients"
              ? "Example: Salmón → Salmon. Reverse the direction whenever you want."
              : "The original Spanish dish name appears first. Recall its description in your selected language."}
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500">
              TOTAL CARDS
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500">
              MASTERED
            </p>
            <p className="mt-2 text-2xl font-bold text-red-500">
              {stats.known}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500">
              TO REVIEW
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-300">
              {stats.remaining}
            </p>
          </div>
        </section>

        {/* Progress bar */}
        <section className="mb-7">
          <div className="mb-2 flex justify-between text-xs font-semibold">
            <span className="text-zinc-500">Deck mastery</span>
            <span className="text-red-400">{stats.percentage}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-900 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-500"
              style={{ width: progressWidth }}
            />
          </div>
        </section>

        {/* Card area */}
        {deck.length > 0 && currentCard ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-400">
                Card{" "}
                <span className="text-white">{cardIndex + 1}</span>
                {" "}of {deck.length}
              </span>

              {isKnown(currentCard.id) && (
                <span className="rounded-full border border-red-900/50 bg-red-950/40 px-3 py-1 text-xs font-semibold text-red-400">
                  <Check className="mr-1 inline h-3 w-3" />
                  Already mastered
                </span>
              )}
            </div>

            <Flashcard
              card={currentCard}
              flipped={flipped}
              onFlip={() => setFlipped((previous) => !previous)}
              languageLabel={
                mode === "ingredients"
                  ? LANGUAGES[toLanguage]
                  : `Description in ${LANGUAGES[toLanguage]}`
              }
            />

            {/* Answer buttons */}
            {flipped && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleReview}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold text-zinc-300 transition hover:border-red-800 hover:bg-red-950/30 hover:text-white"
                >
                  <X className="h-5 w-5" />
                  Need to review
                </button>

                <button
                  type="button"
                  onClick={handleKnown}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-4 py-4 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600"
                >
                  <Check className="h-5 w-5" />
                  I know this!
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={previousCard}
                className={`${buttonBase} ${inactiveButton}`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                className={`${buttonBase} ${inactiveButton}`}
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </button>

              <button
                type="button"
                onClick={nextCard}
                className={`${buttonBase} ${inactiveButton}`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-700 bg-[#111111] px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h2 className="text-xl font-bold text-white">
              {mode === "dishes"
                ? "Your menu deck is waiting"
                : "No flashcards available"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
              {mode === "dishes"
                ? "Once we connect your menu.json database, your restaurant dishes will automatically become flashcards."
                : "Check that your ingredients.js file contains the expected multilingual ingredient data."}
            </p>

            {mode === "dishes" && (
              <button
                type="button"
                onClick={() => setMode("ingredients")}
                className="mt-5 rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Practice ingredients instead
              </button>
            )}
          </div>
        )}

        {/* Reset */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-zinc-600 transition hover:text-red-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset this deck's progress
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-zinc-800 pt-5 text-center text-xs text-zinc-600">
          Yutori Learning <span className="mx-1 text-red-700">•</span>
          Consistency beats memorization.
        </footer>
      </div>
    </main>
  );
}
