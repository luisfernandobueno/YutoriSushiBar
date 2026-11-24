
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";

import {
  LANGUAGES,
  buildScenarioQuestions,
} from "./customerScenariosUtils";

const TEXT = {
  es: {
    subtitle: "Aprende a manejar situaciones reales con clientes.",
    introduction: "¿Qué harías en esta situación?",
    introDescription:
      "Lee cada situación y selecciona la respuesta que consideres más adecuada. Recibirás una explicación después de cada decisión.",
    start: "Comenzar entrenamiento",
    question: "Situación",
    easy: "Fácil",
    medium: "Intermedio",
    hard: "Avanzado",
    choose: "Elige tu respuesta",
    correct: "¡Muy bien!",
    incorrect: "No es la mejor opción",
    explanation: "¿Por qué?",
    next: "Siguiente situación",
    finish: "Ver resultados",
    results: "Entrenamiento completado",
    score: "Respuestas correctas",
    accuracy: "Precisión",
    review: "Repaso de situaciones",
    correctAnswer: "Mejor respuesta",
    playAgain: "Volver a jugar",
    language: "Idioma",
    questionOf: "Situación",
    outOf: "de",
    good: "¡Buen trabajo! Sigue practicando para ganar confianza.",
    improve: "Cada situación es una oportunidad para mejorar. ¡Sigue practicando!",
    level: "Nivel",
    professionalTip: "Consejo profesional",
    tip:
      "Mantén siempre la calma, escucha al cliente y evita prometer algo que no puedes garantizar.",
  },
  en: {
    subtitle: "Learn how to handle real customer situations.",
    introduction: "What would you do in this situation?",
    introDescription:
      "Read each scenario and choose the response you think is most appropriate. You'll receive an explanation after each decision.",
    start: "Start training",
    question: "Scenario",
    easy: "Easy",
    medium: "Intermediate",
    hard: "Advanced",
    choose: "Choose your response",
    correct: "Well done!",
    incorrect: "Not the best choice",
    explanation: "Why?",
    next: "Next scenario",
    finish: "See results",
    results: "Training completed",
    score: "Correct answers",
    accuracy: "Accuracy",
    review: "Scenario review",
    correctAnswer: "Best response",
    playAgain: "Play again",
    language: "Language",
    questionOf: "Scenario",
    outOf: "of",
    good: "Great work! Keep practicing to build confidence.",
    improve: "Every scenario is an opportunity to improve. Keep practicing!",
    level: "Level",
    professionalTip: "Professional tip",
    tip:
      "Always stay calm, listen to the customer, and avoid promising something you cannot guarantee.",
  },
  it: {
    subtitle: "Impara a gestire situazioni reali con i clienti.",
    introduction: "Cosa faresti in questa situazione?",
    introDescription:
      "Leggi ogni situazione e scegli la risposta che ritieni più appropriata. Dopo ogni scelta riceverai una spiegazione.",
    start: "Inizia l'allenamento",
    question: "Situazione",
    easy: "Facile",
    medium: "Intermedio",
    hard: "Avanzato",
    choose: "Scegli la tua risposta",
    correct: "Ben fatto!",
    incorrect: "Non è la scelta migliore",
    explanation: "Perché?",
    next: "Situazione successiva",
    finish: "Vedi i risultati",
    results: "Allenamento completato",
    score: "Risposte corrette",
    accuracy: "Precisione",
    review: "Ripasso delle situazioni",
    correctAnswer: "Risposta migliore",
    playAgain: "Gioca ancora",
    language: "Lingua",
    questionOf: "Situazione",
    outOf: "di",
    good: "Ottimo lavoro! Continua ad allenarti per acquisire sicurezza.",
    improve: "Ogni situazione è un'opportunità per migliorare. Continua a esercitarti!",
    level: "Livello",
    professionalTip: "Consiglio professionale",
    tip:
      "Mantieni sempre la calma, ascolta il cliente ed evita di promettere qualcosa che non puoi garantire.",
  },
  pt: {
    subtitle: "Aprenda a lidar com situações reais com clientes.",
    introduction: "O que você faria nesta situação?",
    introDescription:
      "Leia cada situação e escolha a resposta que considera mais adequada. Você receberá uma explicação depois de cada decisão.",
    start: "Começar treinamento",
    question: "Situação",
    easy: "Fácil",
    medium: "Intermediário",
    hard: "Avançado",
    choose: "Escolha sua resposta",
    correct: "Muito bem!",
    incorrect: "Não é a melhor opção",
    explanation: "Por quê?",
    next: "Próxima situação",
    finish: "Ver resultados",
    results: "Treinamento concluído",
    score: "Respostas corretas",
    accuracy: "Precisão",
    review: "Revisão das situações",
    correctAnswer: "Melhor resposta",
    playAgain: "Jogar novamente",
    language: "Idioma",
    questionOf: "Situação",
    outOf: "de",
    good: "Ótimo trabalho! Continue praticando para ganhar confiança.",
    improve: "Cada situação é uma oportunidade de melhorar. Continue praticando!",
    level: "Nível",
    professionalTip: "Dica profissional",
    tip:
      "Mantenha sempre a calma, escute o cliente e evite prometer algo que não pode garantir.",
  },
};

const DIFFICULTY_STYLES = {
  easy: "border-green-900/60 bg-green-950/30 text-green-400",
  medium: "border-yellow-900/60 bg-yellow-950/30 text-yellow-400",
  hard: "border-red-900/60 bg-red-950/30 text-red-400",
};

function CustomerScenarios() {
  const [language, setLanguage] = useState("en");
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  const t = TEXT[language];

  const questions = useMemo(
    () => buildScenarioQuestions(language),
    [language, round]
  );

  const currentQuestion = questions[questionIndex];

  const score = answers.filter((answer) => answer.correct).length;

  const accuracy = answers.length
    ? Math.round((score / answers.length) * 100)
    : 0;

  const progress = questions.length
    ? (answers.length / questions.length) * 100
    : 0;

  const startGame = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setPhase("playing");
  };

  const handleAnswer = (optionIndex) => {
    if (phase !== "playing" || selectedOption !== null) return;

    const correct = optionIndex === currentQuestion.correct;

    setSelectedOption(optionIndex);

    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion,
        selected: optionIndex,
        correct,
      },
    ]);

    setPhase("feedback");
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= questions.length) {
      setPhase("results");
      return;
    }

    setQuestionIndex((previous) => previous + 1);
    setSelectedOption(null);
    setPhase("playing");
  };

  const restartGame = () => {
    setRound((previous) => previous + 1);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setPhase("intro");
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setPhase("intro");
  };

  const difficultyLabel = (difficulty) => {
    if (difficulty === "easy") return t.easy;
    if (difficulty === "medium") return t.medium;
    return t.hard;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-500">
            <span className="rounded-md bg-red-950 px-2 py-1">GAME 13</span>
            <span>CUSTOMER SERVICE TRAINING</span>
          </div>

          <h1 className="text-3xl font-black text-white">
            Customer Scenarios
          </h1>

          <p className="mt-1 text-sm text-zinc-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500">{t.language}</label>

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value)}
            className="rounded-lg border border-zinc-700 bg-[#151515] px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PROGRESS */}
      {(phase === "playing" || phase === "feedback") && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>
              {t.questionOf} {questionIndex + 1} {t.outOf}{" "}
              {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* INTRO */}
      {phase === "intro" && (
        <div className="rounded-2xl border border-zinc-800 bg-[#111] p-6 sm:p-10">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-5 rounded-2xl border border-red-900/50 bg-red-950/30 p-5 text-red-500">
              <ShieldCheck size={42} />
            </div>

            <h2 className="text-2xl font-bold text-white">
              {t.introduction}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {t.introDescription}
            </p>

            <div className="my-7 grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-[#171717] p-4">
                <Trophy className="mx-auto mb-2 text-red-500" size={23} />
                <p className="text-2xl font-black text-white">
                  {questions.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Scenarios</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#171717] p-4">
                <ShieldCheck className="mx-auto mb-2 text-red-500" size={23} />
                <p className="text-2xl font-black text-white">4</p>
                <p className="mt-1 text-xs text-zinc-500">Possible answers</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-600"
            >
              {t.start}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION */}
      {(phase === "playing" || phase === "feedback") &&
        currentQuestion && (
          <div className="space-y-5 rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400">
                {currentQuestion.category}
              </span>

              <span
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  DIFFICULTY_STYLES[currentQuestion.difficulty]
                }`}
              >
                {t.level}: {difficultyLabel(currentQuestion.difficulty)}
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-5 sm:p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">
                {t.question} {questionIndex + 1}
              </p>

              <h2 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
                {currentQuestion.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                {currentQuestion.situation}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-zinc-400">
                {t.choose}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === currentQuestion.correct;

                  let optionStyle =
                    "border-zinc-800 bg-[#171717] hover:border-red-600 hover:bg-red-950/20";

                  if (phase === "feedback" && isCorrect) {
                    optionStyle =
                      "border-green-700 bg-green-950/30 text-green-300";
                  } else if (phase === "feedback" && isSelected && !isCorrect) {
                    optionStyle =
                      "border-red-700 bg-red-950/30 text-red-300";
                  } else if (phase === "feedback") {
                    optionStyle = "border-zinc-800 bg-[#151515] opacity-50";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={phase === "feedback"}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${optionStyle}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black text-zinc-300">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="flex-1 pt-1 text-sm leading-6 text-white">
                        {option}
                      </span>

                      {phase === "feedback" && isCorrect && (
                        <Check
                          className="mt-1 shrink-0 text-green-400"
                          size={20}
                        />
                      )}

                      {phase === "feedback" && isSelected && !isCorrect && (
                        <X
                          className="mt-1 shrink-0 text-red-400"
                          size={20}
                        />
                      )}

                      {phase === "playing" && (
                        <ChevronRight
                          className="mt-1 shrink-0 text-zinc-600"
                          size={18}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEEDBACK */}
            {phase === "feedback" && (
              <div className="space-y-4">
                <div
                  className={`rounded-xl border p-5 ${
                    selectedOption === currentQuestion.correct
                      ? "border-green-900/60 bg-green-950/20"
                      : "border-red-900/60 bg-red-950/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedOption === currentQuestion.correct ? (
                      <Check className="text-green-400" size={22} />
                    ) : (
                      <X className="text-red-400" size={22} />
                    )}

                    <h3 className="font-bold text-white">
                      {selectedOption === currentQuestion.correct
                        ? t.correct
                        : t.incorrect}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-zinc-300">
                    {t.explanation}
                  </p>

                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <button
                  onClick={nextQuestion}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-600"
                >
                  {questionIndex + 1 >= questions.length
                    ? t.finish
                    : t.next}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

      {/* RESULTS */}
      {phase === "results" && (
        <div className="space-y-6 rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/40 text-red-500">
              <Trophy size={34} />
            </div>

            <h2 className="text-2xl font-black text-white">{t.results}</h2>

            <p className="mt-2 text-sm text-zinc-400">
              {accuracy >= 75 ? t.good : t.improve}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-5 text-center">
              <p className="text-3xl font-black text-red-500">
                {score}/{questions.length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{t.score}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-5 text-center">
              <p className="text-3xl font-black text-white">{accuracy}%</p>
              <p className="mt-1 text-xs text-zinc-500">{t.accuracy}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">{t.review}</h3>

            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div
                  key={answer.question.id}
                  className="rounded-xl border border-zinc-800 bg-[#171717] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-zinc-500">
                        {t.question} {index + 1} · {answer.question.category}
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        {answer.question.title}
                      </p>
                    </div>

                    {answer.correct ? (
                      <Check
                        className="shrink-0 text-green-400"
                        size={20}
                      />
                    ) : (
                      <X className="shrink-0 text-red-400" size={20} />
                    )}
                  </div>

                  {!answer.correct && (
                    <div className="mt-3 border-t border-zinc-800 pt-3">
                      <p className="text-xs text-zinc-500">
                        {t.correctAnswer}
                      </p>

                      <p className="mt-1 text-sm text-green-400">
                        {answer.question.options[answer.question.correct]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">
              {t.professionalTip}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{t.tip}</p>
          </div>

          <button
            onClick={restartGame}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-600"
          >
            <RotateCcw size={18} />
            {t.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomerScenarios;
