import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";

import {
  LANGUAGES,
  buildDescriptionQuestions,
} from "./descriptionChallengeUtils";

const TOTAL_QUESTIONS = 10;

const TEXT = {
  es: {
    title: "Description Challenge",
    subtitle: "¿Puedes identificar cada plato por su descripción?",
    language: "Idioma",
    question: "¿Cuál es la descripción correcta de este plato?",
    choose: "Selecciona una respuesta",
    correct: "¡Correcto! ¡Buen trabajo!",
    incorrect: "¡No exactamente! Esta es la descripción correcta:",
    next: "Siguiente pregunta",
    finish: "Ver resultados",
    score: "Puntuación",
    questionLabel: "Pregunta",
    completed: "Desafío completado",
    result: "Tu resultado",
    restart: "Volver a jugar",
    review: "Repaso de respuestas",
    correctAnswer: "Descripción correcta",
    empty: "No hay suficientes platos con descripciones para crear este desafío.",
    noImage: "Imagen no disponible",
    points: "aciertos",
    outOf: "de",
    excellent: "¡Excelente! Conoces muy bien el menú.",
    good: "¡Muy bien! Vas dominando las descripciones.",
    practice: "¡Buen comienzo! Sigue practicando para reconocer los platos.",
  },
  en: {
    title: "Description Challenge",
    subtitle: "Can you identify each dish by its description?",
    language: "Language",
    question: "Which description correctly matches this dish?",
    choose: "Choose your answer",
    correct: "Correct! Great job!",
    incorrect: "Not quite! Here's the correct description:",
    next: "Next question",
    finish: "See results",
    score: "Score",
    questionLabel: "Question",
    completed: "Challenge completed",
    result: "Your result",
    restart: "Play again",
    review: "Answer review",
    correctAnswer: "Correct description",
    empty: "There aren't enough dishes with descriptions to create this challenge.",
    noImage: "Image unavailable",
    points: "correct",
    outOf: "out of",
    excellent: "Excellent! You know the menu very well.",
    good: "Very good! You're getting familiar with the descriptions.",
    practice: "Good start! Keep practicing to recognize the dishes.",
  },
  it: {
    title: "Description Challenge",
    subtitle: "Riesci a riconoscere ogni piatto dalla sua descrizione?",
    language: "Lingua",
    question: "Quale descrizione corrisponde a questo piatto?",
    choose: "Scegli una risposta",
    correct: "Corretto! Ottimo lavoro!",
    incorrect: "Non proprio! Ecco la descrizione corretta:",
    next: "Prossima domanda",
    finish: "Vedi i risultati",
    score: "Punteggio",
    questionLabel: "Domanda",
    completed: "Sfida completata",
    result: "Il tuo risultato",
    restart: "Gioca di nuovo",
    review: "Ripasso delle risposte",
    correctAnswer: "Descrizione corretta",
    empty: "Non ci sono abbastanza piatti con descrizioni per questa sfida.",
    noImage: "Immagine non disponibile",
    points: "corrette",
    outOf: "su",
    excellent: "Eccellente! Conosci molto bene il menu.",
    good: "Molto bene! Stai imparando le descrizioni.",
    practice: "Buon inizio! Continua ad esercitarti.",
  },
  pt: {
    title: "Description Challenge",
    subtitle: "Consegue identificar cada prato pela sua descrição?",
    language: "Idioma",
    question: "Qual descrição corresponde corretamente a este prato?",
    choose: "Escolha uma resposta",
    correct: "Correto! Muito bem!",
    incorrect: "Não exatamente! Esta é a descrição correta:",
    next: "Próxima pergunta",
    finish: "Ver resultados",
    score: "Pontuação",
    questionLabel: "Pergunta",
    completed: "Desafio concluído",
    result: "Seu resultado",
    restart: "Jogar novamente",
    review: "Revisão das respostas",
    correctAnswer: "Descrição correta",
    empty: "Não há pratos suficientes com descrições para este desafio.",
    noImage: "Imagem indisponível",
    points: "corretas",
    outOf: "de",
    excellent: "Excelente! Você conhece muito bem o menu.",
    good: "Muito bem! Você está aprendendo as descrições.",
    practice: "Bom começo! Continue praticando.",
  },
};

export default function DescriptionChallenge({ menuData }) {
  const [language, setLanguage] = useState("en");
  const [round, setRound] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const t = TEXT[language];

  const questions = useMemo(
    () => buildDescriptionQuestions(menuData, language, TOTAL_QUESTIONS),
    [menuData, language, round]
  );

  const currentQuestion = questions[currentIndex];

  const score = answers.filter((answer) => answer.correct).length;
  const answered = selectedAnswer !== null;
  const progress = questions.length
    ? ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100
    : 0;

  const handleAnswer = (option) => {
    if (answered || finished) return;

    setSelectedAnswer(option.id);

    setAnswers((previous) => [
      ...previous,
      {
        dish: currentQuestion.dish,
        selected: option.description,
        correctAnswer: currentQuestion.correctAnswer,
        correct: option.correct,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setRound((previous) => previous + 1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setFinished(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setFinished(false);
  };

  const getResultMessage = () => {
    const percentage = questions.length
      ? (score / questions.length) * 100
      : 0;

    if (percentage >= 80) return t.excellent;
    if (percentage >= 50) return t.good;
    return t.practice;
  };

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
        <CircleHelp className="mx-auto mb-4 text-red-500" size={40} />
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <p className="mt-3 text-zinc-400">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-lg bg-red-950 p-2 text-red-400">
              <CircleHelp size={22} />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-red-400">
              Game 10
            </span>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">{t.title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{t.subtitle}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t.language}
          </label>

          <select
            value={language}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className="rounded-xl border border-zinc-700 bg-[#161616] px-4 py-3 text-sm text-white outline-none transition focus:border-red-600"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!finished ? (
        <>
          {/* Score and progress */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                {t.score}
              </p>
              <p className="mt-1 text-2xl font-bold text-red-400">
                {score}
                <span className="ml-1 text-sm font-normal text-zinc-500">
                  / {questions.length}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                {t.questionLabel}
              </p>
              <p className="mt-1 text-2xl font-bold">
                {currentIndex + 1}
                <span className="ml-1 text-sm font-normal text-zinc-500">
                  / {questions.length}
                </span>
              </p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dish card */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
            <div className="relative flex aspect-video max-h-80 items-center justify-center overflow-hidden bg-[#171717]">
              {currentQuestion.dish.image ? (
                <img
                  src={`${import.meta.env.BASE_URL}images/menu/${currentQuestion.dish.image}`}
                  alt={currentQuestion.dish.name}
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <p className="text-sm text-zinc-500">{t.noImage}</p>
              )}

              <span className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-semibold text-zinc-200 backdrop-blur">
                {currentQuestion.dish.category}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <h2 className="text-center text-xl font-bold sm:text-2xl">
                {currentQuestion.dish.name}
              </h2>

              <p className="mt-2 text-center text-sm text-zinc-400">
                {t.question}
              </p>
            </div>
          </div>

          {/* Answer options */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-400">{t.choose}</p>

            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option.id;
              const showCorrect = answered && option.correct;
              const showWrong = answered && isSelected && !option.correct;

              let optionStyle =
                "border-zinc-800 bg-[#111111] hover:border-red-700 hover:bg-[#191111]";

              if (showCorrect) {
                optionStyle = "border-green-600 bg-green-950/30";
              } else if (showWrong) {
                optionStyle = "border-red-600 bg-red-950/30";
              } else if (answered) {
                optionStyle = "border-zinc-800 bg-[#111111] opacity-60";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${optionStyle}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="flex-1 text-sm leading-relaxed text-zinc-200">
                    {option.description}
                  </span>

                  {showCorrect && (
                    <Check className="shrink-0 text-green-400" size={20} />
                  )}

                  {showWrong && (
                    <X className="shrink-0 text-red-400" size={20} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div
              className={`rounded-xl border p-4 ${
                currentQuestion.options.find(
                  (option) => option.id === selectedAnswer
                )?.correct
                  ? "border-green-800 bg-green-950/20"
                  : "border-red-800 bg-red-950/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {currentQuestion.options.find(
                  (option) => option.id === selectedAnswer
                )?.correct ? (
                  <Check className="text-green-400" size={20} />
                ) : (
                  <X className="text-red-400" size={20} />
                )}

                <p className="font-bold">
                  {currentQuestion.options.find(
                    (option) => option.id === selectedAnswer
                  )?.correct
                    ? t.correct
                    : t.incorrect}
                </p>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {currentQuestion.correctAnswer}
              </p>
            </div>
          )}

          {/* Next button */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!answered}
              className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentIndex + 1 === questions.length ? t.finish : t.next}
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      ) : (
        /* Results */
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <Trophy className="mx-auto mb-4 text-yellow-500" size={48} />

            <h2 className="text-2xl font-bold">{t.completed}</h2>
            <p className="mt-2 text-zinc-400">{t.result}</p>

            <p className="mt-5 text-5xl font-black text-red-500">
              {score}/{questions.length}
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              {score} {t.points} {t.outOf} {questions.length}
            </p>

            <p className="mt-5 text-zinc-300">{getResultMessage()}</p>

            <button
              onClick={handleRestart}
              className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold transition hover:bg-red-600"
            >
              <RotateCcw size={18} />
              {t.restart}
            </button>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{t.review}</h3>

            {answers.map((answer, index) => (
              <div
                key={`${answer.dish.id}-${index}`}
                className="rounded-xl border border-zinc-800 bg-[#111111] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{answer.dish.name}</p>

                  {answer.correct ? (
                    <Check className="shrink-0 text-green-400" size={20} />
                  ) : (
                    <X className="shrink-0 text-red-400" size={20} />
                  )}
                </div>

                {!answer.correct && (
                  <p className="mt-3 text-sm text-zinc-500">
                    {answer.selected}
                  </p>
                )}

                <p className="mt-3 text-sm leading-relaxed text-green-400">
                  {t.correctAnswer}: {answer.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}