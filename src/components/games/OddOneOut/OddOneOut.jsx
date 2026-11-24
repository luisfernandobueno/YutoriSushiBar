import { useMemo, useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Trophy,
  ArrowRight,
  Brain,
  Utensils,
  Leaf,
} from "lucide-react";

import {
  LANGUAGES,
  buildOddOneOutQuestions,
  getOptionName,
} from "./oddOneOutUtils";

const UI = {
  es: {
    title: "El intruso",
    subtitle: "Encuentra el elemento que no pertenece al grupo.",
    language: "Idioma",
    instruction: "¿Cuál de estos cuatro elementos es diferente?",
    menu: "PLATOS DEL MENÚ",
    ingredient: "INGREDIENTES",
    correct: "¡Muy bien! Encontraste el intruso.",
    incorrect: "¡No exactamente! Aquí está la respuesta.",
    next: "Siguiente",
    finish: "Ver resultados",
    result: "¡Ronda completada!",
    score: "Puntuación",
    restart: "Jugar de nuevo",
    question: "Pregunta",
    of: "de",
    explanation: "¿Por qué?",
    empty: "No hay suficientes categorías o ingredientes para generar preguntas. Comprueba menu.json e ingredients.js.",
    menuHint: "Observa a qué categoría pertenece cada plato.",
    ingredientHint: "Piensa en el tipo de ingrediente: pescado, vegetal, carne, salsa, etc.",
  },
  en: {
    title: "Odd One Out",
    subtitle: "Find the item that doesn't belong in the group.",
    language: "Language",
    instruction: "Which of these four items is different?",
    menu: "MENU DISHES",
    ingredient: "INGREDIENTS",
    correct: "Great job! You found the odd one out.",
    incorrect: "Not quite! Here's the correct answer.",
    next: "Next",
    finish: "See results",
    result: "Round completed!",
    score: "Score",
    restart: "Play again",
    question: "Question",
    of: "of",
    explanation: "Why?",
    empty: "There aren't enough categories or ingredients to create questions. Check menu.json and ingredients.js.",
    menuHint: "Think about which menu category each dish belongs to.",
    ingredientHint: "Think about the type of ingredient: fish, vegetable, meat, sauce, etc.",
  },
  it: {
    title: "L'intruso",
    subtitle: "Trova l'elemento che non appartiene al gruppo.",
    language: "Lingua",
    instruction: "Quale di questi quattro elementi è diverso?",
    menu: "PIATTI DEL MENU",
    ingredient: "INGREDIENTI",
    correct: "Ottimo! Hai trovato l'intruso.",
    incorrect: "Non proprio! Ecco la risposta corretta.",
    next: "Avanti",
    finish: "Vedi risultati",
    result: "Round completato!",
    score: "Punteggio",
    restart: "Gioca ancora",
    question: "Domanda",
    of: "di",
    explanation: "Perché?",
    empty: "Non ci sono abbastanza categorie o ingredienti. Controlla menu.json e ingredients.js.",
    menuHint: "Pensa alla categoria a cui appartiene ogni piatto.",
    ingredientHint: "Pensa al tipo di ingrediente: pesce, verdura, carne, salsa, ecc.",
  },
  pt: {
    title: "O intruso",
    subtitle: "Encontre o elemento que não pertence ao grupo.",
    language: "Idioma",
    instruction: "Qual destes quatro elementos é diferente?",
    menu: "PRATOS DO CARDÁPIO",
    ingredient: "INGREDIENTES",
    correct: "Muito bem! Você encontrou o intruso.",
    incorrect: "Não exatamente! Aqui está a resposta correta.",
    next: "Próxima",
    finish: "Ver resultados",
    result: "Rodada concluída!",
    score: "Pontuação",
    restart: "Jogar novamente",
    question: "Pergunta",
    of: "de",
    explanation: "Por quê?",
    empty: "Não há categorias ou ingredientes suficientes. Verifique menu.json e ingredients.js.",
    menuHint: "Pense na categoria à qual cada prato pertence.",
    ingredientHint: "Pense no tipo de ingrediente: peixe, vegetal, carne, molho etc.",
  },
};

const TOTAL_QUESTIONS = 10;

export default function OddOneOut({ menuData }) {
  const [language, setLanguage] = useState("es");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const t = UI[language];

  const questions = useMemo(
    () =>
      buildOddOneOutQuestions(
        menuData,
        language,
        TOTAL_QUESTIONS
      ),
    [menuData, language, round]
  );

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;
  const hasAnswered = selectedId !== null;

  const handleAnswer = (option) => {
    if (hasAnswered || !currentQuestion) return;

    const isCorrect = option.id === currentQuestion.oddItemId;

    setSelectedId(option.id);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion,
        selectedId: option.id,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setSelectedId(null);
    setCurrentIndex((previous) => previous + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedId(null);
    setScore(0);
    setAnswers([]);
    setRound((previous) => previous + 1);
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCurrentIndex(0);
    setSelectedId(null);
    setScore(0);
    setAnswers([]);
  };

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-[#111] p-8 text-center">
        <Brain className="mx-auto mb-4 text-red-500" size={40} />
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
          {answers.map((entry, index) => {
            const oddOption = entry.question.options.find(
              (option) => option.id === entry.question.oddItemId
            );

            return (
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
                      {getOptionName(
                        oddOption,
                        entry.question.type,
                        language
                      )}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {entry.question.explanation[language]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Game 07
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
            onChange={(event) => changeLanguage(event.target.value)}
            className="rounded-lg border border-zinc-700 bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>

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

      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-red-950/60 p-3 text-red-400">
            {currentQuestion.type === "menu" ? (
              <Utensils size={22} />
            ) : (
              <Leaf size={22} />
            )}
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest text-red-400">
              {currentQuestion.type === "menu"
                ? t.menu
                : t.ingredient}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {currentQuestion.type === "menu"
                ? t.menuHint
                : t.ingredientHint}
            </p>
          </div>
        </div>

        <h2 className="mb-5 text-xl font-bold text-white">
          {t.instruction}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option, index) => {
            const isOdd = option.id === currentQuestion.oddItemId;
            const isSelected = selectedId === option.id;

            let optionStyle =
              "border-zinc-800 bg-[#181818] hover:border-red-700";

            if (hasAnswered && isOdd) {
              optionStyle = "border-green-700 bg-green-950/30";
            } else if (hasAnswered && isSelected && !isOdd) {
              optionStyle = "border-red-700 bg-red-950/30";
            } else if (hasAnswered) {
              optionStyle = "border-zinc-800 bg-[#141414] opacity-60";
            }

            const imagePath =
              currentQuestion.type === "menu" && option.image
                ? `${import.meta.env.BASE_URL}images/menu/${option.image}`
                : null;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={hasAnswered}
                className={`relative overflow-hidden rounded-xl border text-left transition ${optionStyle} ${
                  hasAnswered ? "cursor-default" : "cursor-pointer"
                }`}
              >
                {imagePath && (
                  <div className="h-28 bg-[#202020] sm:h-36">
                    <img
                      src={imagePath}
                      alt={option.name}
                      className="h-full w-full object-contain p-2"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex min-h-16 items-center justify-between gap-2 p-3">
                  <span className="text-sm font-semibold leading-snug text-zinc-100">
                    {getOptionName(
                      option,
                      currentQuestion.type,
                      language
                    )}
                  </span>

                  {hasAnswered && isOdd && (
                    <Check
                      className="shrink-0 text-green-400"
                      size={19}
                    />
                  )}

                  {hasAnswered && isSelected && !isOdd && (
                    <X
                      className="shrink-0 text-red-400"
                      size={19}
                    />
                  )}
                </div>

                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-xs font-bold text-white">
                  {String.fromCharCode(65 + index)}
                </span>
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="mt-5">
            <div
              className={`rounded-xl border p-4 ${
                selectedId === currentQuestion.oddItemId
                  ? "border-green-900 bg-green-950/30"
                  : "border-red-900 bg-red-950/30"
              }`}
            >
              <p className="font-bold text-white">
                {selectedId === currentQuestion.oddItemId
                  ? t.correct
                  : t.incorrect}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {t.explanation}{" "}
                {currentQuestion.explanation[language]}
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
  );
}