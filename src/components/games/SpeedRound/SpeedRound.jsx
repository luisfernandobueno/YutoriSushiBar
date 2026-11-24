
import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  ArrowRight,
  Check,
  Flame,
  RotateCcw,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import { LANGUAGES, buildSpeedQuestions } from "./speedRoundUtils";

const GAME_DURATION = 60;

const TEXT = {
  es: {
    title: "Speed Round",
    subtitle: "¡Piensa rápido! ¿Cuánto sabes del menú?",
    language: "Idioma",
    start: "Comenzar desafío",
    time: "Tiempo restante",
    score: "Puntos",
    question: "Pregunta",
    correct: "¡Correcto!",
    incorrect: "¡Incorrecto!",
    next: "Siguiente",
    finished: "¡Tiempo terminado!",
    results: "Resultados",
    restart: "Jugar de nuevo",
    review: "Repaso de respuestas",
    correctAnswer: "Respuesta correcta",
    yourAnswer: "Tu respuesta",
    empty: "No hay suficientes datos del menú para generar el desafío.",
    instructions: "Responde tantas preguntas como puedas en 60 segundos. ¡Cada segundo cuenta!",
    excellent: "¡Velocidad y precisión increíbles!",
    good: "¡Buen trabajo! Sigue practicando.",
    practice: "¡A seguir practicando! La velocidad llega con el conocimiento.",
    questionsAnswered: "Preguntas respondidas",
    accuracy: "Precisión",
    pointsLabel: "puntos",
    outOf: "de",
  },
  en: {
    title: "Speed Round",
    subtitle: "Think fast! How well do you know the menu?",
    language: "Language",
    start: "Start challenge",
    time: "Time remaining",
    score: "Points",
    question: "Question",
    correct: "Correct!",
    incorrect: "Incorrect!",
    next: "Next",
    finished: "Time's up!",
    results: "Results",
    restart: "Play again",
    review: "Answer review",
    correctAnswer: "Correct answer",
    yourAnswer: "Your answer",
    empty: "There isn't enough menu data to generate this challenge.",
    instructions: "Answer as many questions as possible in 60 seconds. Every second counts!",
    excellent: "Incredible speed and accuracy!",
    good: "Great job! Keep practicing.",
    practice: "Keep practicing! Speed comes with knowledge.",
    questionsAnswered: "Questions answered",
    accuracy: "Accuracy",
    pointsLabel: "points",
    outOf: "out of",
  },
  it: {
    title: "Speed Round",
    subtitle: "Pensa velocemente! Quanto conosci il menu?",
    language: "Lingua",
    start: "Inizia la sfida",
    time: "Tempo rimanente",
    score: "Punti",
    question: "Domanda",
    correct: "Corretto!",
    incorrect: "Sbagliato!",
    next: "Avanti",
    finished: "Tempo scaduto!",
    results: "Risultati",
    restart: "Gioca di nuovo",
    review: "Ripasso delle risposte",
    correctAnswer: "Risposta corretta",
    yourAnswer: "La tua risposta",
    empty: "Non ci sono abbastanza dati del menu per questa sfida.",
    instructions: "Rispondi a più domande possibile in 60 secondi!",
    excellent: "Velocità e precisione incredibili!",
    good: "Ottimo lavoro! Continua ad esercitarti.",
    practice: "Continua ad esercitarti!",
    questionsAnswered: "Domande risposte",
    accuracy: "Precisione",
    pointsLabel: "punti",
    outOf: "su",
  },
  pt: {
    title: "Speed Round",
    subtitle: "Pense rápido! Quanto você conhece o menu?",
    language: "Idioma",
    start: "Começar desafio",
    time: "Tempo restante",
    score: "Pontos",
    question: "Pergunta",
    correct: "Correto!",
    incorrect: "Incorreto!",
    next: "Próxima",
    finished: "Tempo esgotado!",
    results: "Resultados",
    restart: "Jogar novamente",
    review: "Revisão das respostas",
    correctAnswer: "Resposta correta",
    yourAnswer: "Sua resposta",
    empty: "Não há dados suficientes do menu para este desafio.",
    instructions: "Responda ao máximo de perguntas possível em 60 segundos!",
    excellent: "Velocidade e precisão incríveis!",
    good: "Muito bem! Continue praticando.",
    practice: "Continue praticando!",
    questionsAnswered: "Perguntas respondidas",
    accuracy: "Precisão",
    pointsLabel: "pontos",
    outOf: "de",
  },
};

export default function SpeedRound({ menuData }) {
  const [language, setLanguage] = useState("en");
  const [round, setRound] = useState(0);
  const [remaining, setRemaining] = useState(GAME_DURATION);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [started, setStarted] = useState(false);

  const t = TEXT[language];

  const questions = useMemo(
    () => buildSpeedQuestions(menuData, language),
    [menuData, language, round]
  );

  const currentQuestion = questions[questionIndex];

  const finished =
    started && (remaining <= 0 || questionIndex >= questions.length);

  const score = answers.filter((answer) => answer.correct).length;

  const accuracy = answers.length
    ? Math.round((score / answers.length) * 100)
    : 0;

  useEffect(() => {
    if (!started || finished || remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, remaining]);

  const handleStart = () => {
    setRemaining(GAME_DURATION);
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setStarted(true);
  };

  const handleAnswer = (option) => {
    if (selectedAnswer !== null || finished || !currentQuestion) return;

    setSelectedAnswer(option);

    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion.prompt,
        selected: option,
        correctAnswer: currentQuestion.answer,
        correct: option === currentQuestion.answer,
      },
    ]);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setSelectedAnswer(null);
    setQuestionIndex((previous) => previous + 1);
  };

  const handleRestart = () => {
    setRound((previous) => previous + 1);
    setRemaining(GAME_DURATION);
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setStarted(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setRound((previous) => previous + 1);
    setRemaining(GAME_DURATION);
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setStarted(false);
  };

  const getResultMessage = () => {
    if (accuracy >= 80) return t.excellent;
    if (accuracy >= 50) return t.good;
    return t.practice;
  };

  const timerPercentage = (remaining / GAME_DURATION) * 100;

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
        <Zap className="mx-auto mb-4 text-red-500" size={42} />
        <h2 className="text-xl font-bold">{t.title}</h2>
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
              <Flame size={22} />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-red-400">
              Game 11
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
            className="rounded-xl border border-zinc-700 bg-[#161616] px-4 py-3 text-sm text-white outline-none focus:border-red-600"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!started ? (
        /* Start screen */
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center sm:p-12">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-950 text-red-400">
            <Zap size={42} />
          </div>

          <h2 className="text-2xl font-bold">{t.title}</h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            {t.instructions}
          </p>

          <div className="my-8 flex justify-center gap-4">
            <div className="rounded-xl border border-zinc-800 bg-[#171717] px-6 py-4">
              <AlarmClock className="mx-auto mb-2 text-red-400" size={25} />
              <p className="text-2xl font-bold">60s</p>
              <p className="text-xs text-zinc-500">{t.time}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#171717] px-6 py-4">
              <Zap className="mx-auto mb-2 text-yellow-400" size={25} />
              <p className="text-2xl font-bold">∞</p>
              <p className="text-xs text-zinc-500">{t.questionsAnswered}</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="mx-auto flex items-center gap-2 rounded-xl bg-red-700 px-8 py-4 font-bold transition hover:bg-red-600"
          >
            <Flame size={20} />
            {t.start}
          </button>
        </div>
      ) : finished ? (
        /* Results screen */
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <Trophy className="mx-auto mb-4 text-yellow-500" size={48} />

            <h2 className="text-2xl font-bold">{t.finished}</h2>
            <p className="mt-2 text-zinc-400">{t.results}</p>

            <p className="mt-6 text-5xl font-black text-red-500">
              {score}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{t.pointsLabel}</p>

            <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#1a1a1a] p-4">
                <p className="text-2xl font-bold">{answers.length}</p>
                <p className="text-xs text-zinc-500">{t.questionsAnswered}</p>
              </div>

              <div className="rounded-xl bg-[#1a1a1a] p-4">
                <p className="text-2xl font-bold">{accuracy}%</p>
                <p className="text-xs text-zinc-500">{t.accuracy}</p>
              </div>
            </div>

            <p className="mt-6 text-zinc-300">{getResultMessage()}</p>

            <button
              onClick={handleRestart}
              className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold transition hover:bg-red-600"
            >
              <RotateCcw size={18} />
              {t.restart}
            </button>
          </div>

          {/* Answer review */}
          {answers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">{t.review}</h3>

              {answers.map((answer, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-800 bg-[#111111] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold">
                      {index + 1}. {answer.question}
                    </p>

                    {answer.correct ? (
                      <Check className="shrink-0 text-green-400" size={20} />
                    ) : (
                      <X className="shrink-0 text-red-400" size={20} />
                    )}
                  </div>

                  {!answer.correct && (
                    <p className="mt-3 text-sm text-zinc-500">
                      {t.yourAnswer}: {answer.selected}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-green-400">
                    {t.correctAnswer}: {answer.correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active game */
        <>
          {/* Timer and score */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <AlarmClock size={16} />
                <span className="text-xs uppercase tracking-wider">
                  {t.time}
                </span>
              </div>

              <p
                className={`mt-1 text-3xl font-black tabular-nums ${
                  remaining <= 10 ? "text-red-500" : "text-white"
                }`}
              >
                00:{String(remaining).padStart(2, "0")}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <Trophy size={16} />
                <span className="text-xs uppercase tracking-wider">
                  {t.score}
                </span>
              </div>

              <p className="mt-1 text-3xl font-black text-red-400">
                {score}
              </p>
            </div>
          </div>

          {/* Timer bar */}
          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                remaining <= 10 ? "bg-red-500" : "bg-red-700"
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          {/* Question */}
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-lg bg-red-950 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                {t.question} {questionIndex + 1}
              </span>

              <span className="text-sm text-zinc-500">
                {answers.length} {t.questionsAnswered.toLowerCase()}
              </span>
            </div>

            <h2 className="text-lg font-bold leading-relaxed sm:text-xl">
              {currentQuestion.prompt}
            </h2>

            {currentQuestion.image && (
              <div className="mt-5 flex max-h-64 justify-center overflow-hidden rounded-xl bg-[#181818]">
                <img
                  src={`${import.meta.env.BASE_URL}images/menu/${currentQuestion.image}`}
                  alt="Menu item"
                  className="max-h-64 w-full object-contain"
                />
              </div>
            )}

            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.answer;

                let style =
                  "border-zinc-800 bg-[#171717] hover:border-red-700 hover:bg-[#201313]";

                if (selectedAnswer !== null && isCorrect) {
                  style = "border-green-600 bg-green-950/30";
                } else if (selectedAnswer !== null && isSelected) {
                  style = "border-red-600 bg-red-950/30";
                } else if (selectedAnswer !== null) {
                  style = "border-zinc-800 bg-[#171717] opacity-50";
                }

                return (
                  <button
                    key={`${index}-${option}`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${style}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="flex-1 text-sm leading-relaxed text-zinc-200">
                      {option}
                    </span>

                    {selectedAnswer !== null && isCorrect && (
                      <Check className="shrink-0 text-green-400" size={20} />
                    )}

                    {selectedAnswer !== null && isSelected && !isCorrect && (
                      <X className="shrink-0 text-red-400" size={20} />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div
                className={`mt-5 rounded-xl border p-4 ${
                  selectedAnswer === currentQuestion.answer
                    ? "border-green-800 bg-green-950/20"
                    : "border-red-800 bg-red-950/20"
                }`}
              >
                <p className="font-bold">
                  {selectedAnswer === currentQuestion.answer
                    ? t.correct
                    : t.incorrect}
                </p>

                {selectedAnswer !== currentQuestion.answer && (
                  <p className="mt-2 text-sm text-zinc-300">
                    {t.correctAnswer}: {currentQuestion.answer}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.next}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
