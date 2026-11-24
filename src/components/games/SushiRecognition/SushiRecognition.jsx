import { useMemo, useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Trophy,
  ArrowRight,
  Eye,
  Image as ImageIcon,
} from "lucide-react";

import { buildSushiRecognitionQuestions } from "./sushiRecognitionUtils";

const UI = {
  es: {
    title: "Reconocimiento de Sushi",
    subtitle: "Mira la imagen e identifica el plato.",
    language: "Idioma",
    instruction: "¿Qué plato aparece en la imagen?",
    question: "Pregunta",
    of: "de",
    score: "Puntos",
    correct: "¡Exactamente! Has reconocido el plato.",
    incorrect: "¡No era ese! Vamos a aprenderlo.",
    answer: "Respuesta correcta",
    category: "Categoría",
    next: "Siguiente",
    finish: "Ver resultados",
    result: "¡Ronda completada!",
    restart: "Jugar de nuevo",
    empty: "No hay suficientes platos con imágenes en el menú. Comprueba los campos img de menu.json y las imágenes en public/images/menu/.",
    imageAlt: "Imagen del plato que debes reconocer",
    noImage: "Imagen no disponible",
  },
  en: {
    title: "Sushi Recognition",
    subtitle: "Look at the picture and identify the dish.",
    language: "Language",
    instruction: "Which dish is shown in the picture?",
    question: "Question",
    of: "of",
    score: "Score",
    correct: "Exactly! You recognized the dish.",
    incorrect: "Not quite! Let's learn it.",
    answer: "Correct answer",
    category: "Category",
    next: "Next",
    finish: "See results",
    result: "Round completed!",
    restart: "Play again",
    empty: "There aren't enough pictured menu items. Check the img fields in menu.json and the images in public/images/menu/.",
    imageAlt: "Picture of the dish you need to identify",
    noImage: "Image unavailable",
  },
  it: {
    title: "Riconoscimento del Sushi",
    subtitle: "Guarda l'immagine e identifica il piatto.",
    language: "Lingua",
    instruction: "Quale piatto appare nell'immagine?",
    question: "Domanda",
    of: "di",
    score: "Punti",
    correct: "Esatto! Hai riconosciuto il piatto.",
    incorrect: "Non proprio! Impariamolo.",
    answer: "Risposta corretta",
    category: "Categoria",
    next: "Avanti",
    finish: "Vedi risultati",
    result: "Round completato!",
    restart: "Gioca ancora",
    empty: "Non ci sono abbastanza piatti con immagini. Controlla i campi img di menu.json e le immagini in public/images/menu/.",
    imageAlt: "Immagine del piatto da riconoscere",
    noImage: "Immagine non disponibile",
  },
  pt: {
    title: "Reconhecimento de Sushi",
    subtitle: "Observe a imagem e identifique o prato.",
    language: "Idioma",
    instruction: "Qual prato aparece na imagem?",
    question: "Pergunta",
    of: "de",
    score: "Pontos",
    correct: "Exatamente! Você reconheceu o prato.",
    incorrect: "Não foi esse! Vamos aprender.",
    answer: "Resposta correta",
    category: "Categoria",
    next: "Próxima",
    finish: "Ver resultados",
    result: "Rodada concluída!",
    restart: "Jogar novamente",
    empty: "Não há pratos com imagens suficientes. Verifique os campos img de menu.json e as imagens em public/images/menu/.",
    imageAlt: "Imagem do prato que você deve identificar",
    noImage: "Imagem indisponível",
  },
};

const TOTAL_QUESTIONS = 10;

const getDescription = (dish, language) => {
  const description = dish?.description;

  if (typeof description === "string") return description;

  return (
    description?.[language] ||
    description?.es ||
    description?.en ||
    ""
  );
};

export default function SushiRecognition({ menuData }) {
  const [language, setLanguage] = useState("es");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const t = UI[language];

  const questions = useMemo(
    () => buildSushiRecognitionQuestions(menuData, TOTAL_QUESTIONS),
    [menuData, round]
  );

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;
  const hasAnswered = selectedId !== null;

  const handleAnswer = (option) => {
    if (hasAnswered || !currentQuestion) return;

    const isCorrect = option.id === currentQuestion.answer.id;

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
        <ImageIcon className="mx-auto mb-4 text-red-500" size={40} />
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
                    {entry.question.answer.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {t.category}: {entry.question.answer.category}
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
  const answer = currentQuestion.answer;
  const imagePath = `${import.meta.env.BASE_URL}images/menu/${answer.image}`;
  const description = getDescription(answer, language);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Game 08
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

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111]">
        <div className="relative flex h-64 items-center justify-center bg-[#191919] sm:h-80">
          <img
            key={answer.id}
            src={imagePath}
            alt={t.imageAlt}
            className="h-full w-full object-contain p-3"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />

          <div className="absolute inset-0 hidden flex-col items-center justify-center gap-2 text-zinc-500">
            <ImageIcon size={36} />
            <span className="text-sm">{t.noImage}</span>
          </div>

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white">
            <Eye size={15} />
            {t.instruction}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <h2 className="mb-5 text-lg font-bold text-white sm:text-xl">
            {t.instruction}
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option.id === answer.id;
              const isSelected = selectedId === option.id;

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
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={hasAnswered}
                  className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${style}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-zinc-400">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm font-semibold text-zinc-100">
                      {option.name}
                    </span>
                  </span>

                  {hasAnswered && isCorrect && (
                    <Check className="shrink-0 text-green-400" size={20} />
                  )}

                  {hasAnswered && isSelected && !isCorrect && (
                    <X className="shrink-0 text-red-400" size={20} />
                  )}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="mt-5">
              <div
                className={`rounded-xl border p-4 ${
                  selectedId === answer.id
                    ? "border-green-900 bg-green-950/30"
                    : "border-red-900 bg-red-950/30"
                }`}
              >
                <p className="font-bold text-white">
                  {selectedId === answer.id ? t.correct : t.incorrect}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {t.answer}: <strong>{answer.name}</strong>
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {t.category}: {answer.category}
                </p>

                {description && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {description}
                  </p>
                )}
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
