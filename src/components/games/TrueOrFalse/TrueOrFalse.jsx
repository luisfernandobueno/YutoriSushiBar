
import { useMemo, useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Trophy,
  Lightbulb,
  ArrowRight,
  CircleHelp,
} from "lucide-react";

import {
  LANGUAGES,
  buildTrueOrFalseQuestions,
} from "./trueOrFalseUtils";

const UI = {
  es: {
    title: "Verdadero o Falso",
    subtitle: "¿Cuánto recuerdas realmente del menú?",
    language: "Idioma",
    question: "¿Verdadero o falso?",
    true: "Verdadero",
    false: "Falso",
    correct: "¡Correcto!",
    incorrect: "No exactamente.",
    explanation: "Dato correcto",
    next: "Siguiente",
    finish: "Ver resultados",
    result: "¡Ronda completada!",
    score: "Tu puntuación",
    restart: "Volver a jugar",
    questionLabel: "Pregunta",
    of: "de",
    empty: "No hay suficientes productos para generar preguntas.",
    description: "Descripción del producto",
    types: {
      price: "PRECIO",
      category: "CATEGORÍA",
      description: "DESCRIPCIÓN",
    },
  },
  en: {
    title: "True or False",
    subtitle: "How much do you really remember about the menu?",
    language: "Language",
    question: "True or false?",
    true: "True",
    false: "False",
    correct: "Correct!",
    incorrect: "Not quite.",
    explanation: "Correct information",
    next: "Next",
    finish: "See results",
    result: "Round completed!",
    score: "Your score",
    restart: "Play again",
    questionLabel: "Question",
    of: "of",
    empty: "There are not enough menu items to create questions.",
    description: "Product description",
    types: {
      price: "PRICE",
      category: "CATEGORY",
      description: "DESCRIPTION",
    },
  },
  it: {
    title: "Vero o Falso",
    subtitle: "Quanto ricordi davvero del menu?",
    language: "Lingua",
    question: "Vero o falso?",
    true: "Vero",
    false: "Falso",
    correct: "Corretto!",
    incorrect: "Non proprio.",
    explanation: "Informazione corretta",
    next: "Avanti",
    finish: "Vedi risultati",
    result: "Round completato!",
    score: "Il tuo punteggio",
    restart: "Gioca ancora",
    questionLabel: "Domanda",
    of: "di",
    empty: "Non ci sono abbastanza prodotti per creare domande.",
    description: "Descrizione del prodotto",
    types: {
      price: "PREZZO",
      category: "CATEGORIA",
      description: "DESCRIZIONE",
    },
  },
  pt: {
    title: "Verdadeiro ou Falso",
    subtitle: "Quanto você realmente lembra do cardápio?",
    language: "Idioma",
    question: "Verdadeiro ou falso?",
    true: "Verdadeiro",
    false: "Falso",
    correct: "Correto!",
    incorrect: "Não exatamente.",
    explanation: "Informação correta",
    next: "Próxima",
    finish: "Ver resultados",
    result: "Rodada concluída!",
    score: "Sua pontuação",
    restart: "Jogar novamente",
    questionLabel: "Pergunta",
    of: "de",
    empty: "Não há produtos suficientes para criar perguntas.",
    description: "Descrição do produto",
    types: {
      price: "PREÇO",
      category: "CATEGORIA",
      description: "DESCRIÇÃO",
    },
  },
};

const TOTAL_QUESTIONS = 10;

export default function TrueOrFalse({ menuData }) {
  const [language, setLanguage] = useState("es");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const t = UI[language];

  const questions = useMemo(
    () =>
      buildTrueOrFalseQuestions(
        menuData,
        language,
        TOTAL_QUESTIONS
      ),
    [menuData, language, round]
  );

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;
  const hasAnswered = selectedAnswer !== null;

  const handleAnswer = (answer) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.isTrue;

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion,
        answer,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setCurrentIndex((previous) => previous + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setRound((previous) => previous + 1);
  };

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-8 text-center">
        <CircleHelp className="mx-auto mb-4 text-red-500" size={36} />
        <p className="text-zinc-300">{t.empty}</p>
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
                    {t.questionLabel} {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-zinc-200">
                    {entry.question.statement}
                  </p>
                  {entry.question.detail && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {entry.question.detail}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-zinc-500">
                    {t.explanation}: {entry.question.explanation}
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

  const progress = ((currentIndex) / questions.length) * 100;
  const imagePath = currentQuestion.item.image
    ? `${import.meta.env.BASE_URL}images/menu/${currentQuestion.item.image}`
    : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Game 06
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{t.language}</span>
          <select
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setScore(0);
              setAnswers([]);
            }}
            className="rounded-lg border border-zinc-700 bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>

      <div className="mb-5 rounded-full bg-zinc-800">
        <div
          className="h-2 rounded-full bg-red-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>
          {t.questionLabel} {currentIndex + 1} {t.of} {questions.length}
        </span>
        <span className="font-semibold text-red-400">
          {score} {t.score.toLowerCase()}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111]">
        {imagePath && (
          <div className="h-52 bg-[#191919] sm:h-64">
            <img
              src={imagePath}
              alt={currentQuestion.item.name}
              className="h-full w-full object-contain p-3"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="p-5 sm:p-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-red-900/70 bg-red-950/50 px-3 py-1 text-xs font-bold tracking-wider text-red-400">
              {t.types[currentQuestion.type]}
            </span>
            <span className="text-xs text-zinc-500">
              {currentQuestion.item.category}
            </span>
          </div>

          <h2 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
            {t.question}
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-zinc-200">
            {currentQuestion.statement}
          </p>

          {currentQuestion.detail && (
            <div className="mt-3 rounded-xl border border-zinc-800 bg-[#191919] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {t.description}
              </p>
              <p className="text-sm leading-relaxed text-zinc-300">
                {currentQuestion.detail}
              </p>
            </div>
          )}

          {!hasAnswered ? (
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-green-900 bg-green-950/40 px-4 py-4 font-bold text-green-400 transition hover:border-green-600 hover:bg-green-950"
              >
                <Check size={20} />
                {t.true}
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-900 bg-red-950/40 px-4 py-4 font-bold text-red-400 transition hover:border-red-600 hover:bg-red-950"
              >
                <X size={20} />
                {t.false}
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <div
                className={`rounded-xl border p-4 ${
                  selectedAnswer === currentQuestion.isTrue
                    ? "border-green-900 bg-green-950/30"
                    : "border-red-900 bg-red-950/30"
                }`}
              >
                <p className="font-bold text-white">
                  {selectedAnswer === currentQuestion.isTrue
                    ? t.correct
                    : t.incorrect}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {t.explanation}: {currentQuestion.explanation}
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
