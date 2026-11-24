import { useMemo, useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Trophy,
  ArrowRight,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

import {
  buildCategorySortingQuestions,
} from "./categorySortingUtils";

const UI = {
  es: {
    title: "Clasificación por categorías",
    subtitle: "¿En qué sección del menú encontrarías este plato?",
    language: "Idioma",
    instruction: "Selecciona la categoría correcta.",
    question: "Pregunta",
    of: "de",
    score: "Puntos",
    correct: "¡Correcto! Has ubicado bien el plato.",
    incorrect: "¡No exactamente! Mira dónde pertenece.",
    answer: "Categoría correcta",
    next: "Siguiente",
    finish: "Ver resultados",
    result: "¡Clasificación completada!",
    restart: "Jugar de nuevo",
    empty: "Necesitas al menos cuatro categorías con productos en menu.json para jugar.",
    noImage: "Imagen no disponible",
  },
  en: {
    title: "Category Sorting",
    subtitle: "In which section of the menu would you find this dish?",
    language: "Language",
    instruction: "Select the correct category.",
    question: "Question",
    of: "of",
    score: "Score",
    correct: "Correct! You placed the dish in the right category.",
    incorrect: "Not quite! Here's where it belongs.",
    answer: "Correct category",
    next: "Next",
    finish: "See results",
    result: "Sorting completed!",
    restart: "Play again",
    empty: "You need at least four categories containing products in menu.json to play.",
    noImage: "Image unavailable",
  },
  it: {
    title: "Classificazione per categorie",
    subtitle: "In quale sezione del menu troveresti questo piatto?",
    language: "Lingua",
    instruction: "Seleziona la categoria corretta.",
    question: "Domanda",
    of: "di",
    score: "Punti",
    correct: "Corretto! Hai classificato bene il piatto.",
    incorrect: "Non proprio! Ecco dove appartiene.",
    answer: "Categoria corretta",
    next: "Avanti",
    finish: "Vedi risultati",
    result: "Classificazione completata!",
    restart: "Gioca ancora",
    empty: "Per giocare servono almeno quattro categorie con prodotti in menu.json.",
    noImage: "Immagine non disponibile",
  },
  pt: {
    title: "Classificação por categorias",
    subtitle: "Em qual seção do cardápio você encontraria este prato?",
    language: "Idioma",
    instruction: "Selecione a categoria correta.",
    question: "Pergunta",
    of: "de",
    score: "Pontos",
    correct: "Correto! Você classificou o prato corretamente.",
    incorrect: "Não exatamente! Veja onde ele pertence.",
    answer: "Categoria correta",
    next: "Próxima",
    finish: "Ver resultados",
    result: "Classificação concluída!",
    restart: "Jogar novamente",
    empty: "Você precisa de pelo menos quatro categorias com produtos em menu.json para jogar.",
    noImage: "Imagem indisponível",
  },
};

const TOTAL_QUESTIONS = 10;

export default function CategorySorting({ menuData }) {
  const [language, setLanguage] = useState("es");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const t = UI[language];

  const questions = useMemo(
    () => buildCategorySortingQuestions(menuData, TOTAL_QUESTIONS),
    [menuData, round]
  );

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;
  const hasAnswered = selectedCategory !== null;

  const handleAnswer = (category) => {
    if (hasAnswered || !currentQuestion) return;

    const isCorrect =
      category.id === currentQuestion.correctCategory.id;

    setSelectedCategory(category.id);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion,
        selectedCategoryId: category.id,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setSelectedCategory(null);
    setCurrentIndex((previous) => previous + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedCategory(null);
    setScore(0);
    setAnswers([]);
    setRound((previous) => previous + 1);
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCurrentIndex(0);
    setSelectedCategory(null);
    setScore(0);
    setAnswers([]);
  };

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-[#111] p-8 text-center">
        <Layers className="mx-auto mb-4 text-red-500" size={40} />
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {t.empty}
        </p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-[#111] p-6 text-center sm:p-10">
        <Trophy className="mx-auto mb-4 text-red-500" size={48} />

        <h1 className="text-2xl font-bold text-white">
          {t.result}
        </h1>

        <p className="mt-2 text-zinc-400">{t.score}</p>

        <div className="my-8">
          <p className="text-6xl font-black text-red-500">
            {score}/{questions.length}
          </p>
          <p className="mt-2 text-lg text-zinc-400">
            {percentage}%
          </p>
        </div>

        <div className="mb-8 space-y-3 text-left">
          {answers.map((entry, index) => (
            <div
              key={entry.question.id}
              className="rounded-xl border border-zinc-800 bg-[#171717] p-4"
            >
              <div className="flex items-start gap-3">
                {entry.isCorrect ? (
                  <Check className="mt-1 shrink-0 text-green-500" />
                ) : (
                  <X className="mt-1 shrink-0 text-red-500" />
                )}

                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">
                    {t.question} {index + 1}
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    {entry.question.product.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {t.answer}: {entry.question.correctCategory.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <RotateCcw size={18} />
          {t.restart}
        </button>
      </div>
    );
  }

  const progress = (currentIndex / questions.length) * 100;
  const product = currentQuestion.product;
  const imagePath = product.image
    ? `${import.meta.env.BASE_URL}images/menu/${product.image}`
    : null;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Game 09
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t.title}
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{t.language}</span>

          <select
            value={language}
            onChange={(event) =>
              changeLanguage(event.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-red-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>
          {t.question} {currentIndex + 1} {t.of} {questions.length}
        </span>

        <span className="font-semibold text-red-400">
          {t.score}: {score}
        </span>
      </div>

      {/* Game card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111]">
        {/* Product image */}
        <div className="flex h-60 items-center justify-center bg-[#191919] sm:h-72">
          {imagePath ? (
            <img
              key={product.id}
              src={imagePath}
              alt={product.name}
              className="h-full w-full object-contain p-3"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling.style.display =
                  "flex";
              }}
            />
          ) : null}

          <div
            className={`${
              imagePath ? "hidden" : "flex"
            } h-full w-full flex-col items-center justify-center gap-2 text-zinc-500`}
          >
            <ImageIcon size={36} />
            <span className="text-sm">{t.noImage}</span>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-white">
            {product.name}
          </h2>

          <p className="mb-6 text-sm text-zinc-400">
            {t.instruction}
          </p>

          {/* Category options */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((category, index) => {
              const isCorrect =
                category.id === currentQuestion.correctCategory.id;

              const isSelected =
                selectedCategory === category.id;

              let style =
                "border-zinc-800 bg-[#181818] hover:border-red-700";

              if (hasAnswered && isCorrect) {
                style = "border-green-700 bg-green-950/30";
              } else if (hasAnswered && isSelected && !isCorrect) {
                style = "border-red-700 bg-red-950/30";
              } else if (hasAnswered) {
                style = "border-zinc-800 bg-[#141414] opacity-60";
              }

              return (
                <button
                  key={category.id}
                  onClick={() => handleAnswer(category)}
                  disabled={hasAnswered}
                  className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${style}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-zinc-400">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="text-sm font-semibold text-zinc-100">
                      {category.name}
                    </span>
                  </span>

                  {hasAnswered && isCorrect && (
                    <Check
                      className="shrink-0 text-green-400"
                      size={20}
                    />
                  )}

                  {hasAnswered && isSelected && !isCorrect && (
                    <X
                      className="shrink-0 text-red-400"
                      size={20}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {hasAnswered && (
            <div className="mt-5">
              <div
                className={`rounded-xl border p-4 ${
                  selectedCategory ===
                  currentQuestion.correctCategory.id
                    ? "border-green-900 bg-green-950/30"
                    : "border-red-900 bg-red-950/30"
                }`}
              >
                <p className="font-bold text-white">
                  {selectedCategory ===
                  currentQuestion.correctCategory.id
                    ? t.correct
                    : t.incorrect}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {t.answer}:{" "}
                  <strong>
                    {currentQuestion.correctCategory.name}
                  </strong>
                </p>
              </div>

              <button
                onClick={handleNext}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                {currentIndex === questions.length - 1
                  ? t.finish
                  : t.next}

                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}