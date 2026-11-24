
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChefHat,
  CircleHelp,
  Clock,
  Heart,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Star,
  Utensils,
  X,
} from "lucide-react";

import {
  LANGUAGES,
  UI_TEXT,
  buildServiceStages,
  getMenuReference,
} from "./waiterSimulationUtils";

const BASE_IMAGE_PATH = `${import.meta.env.BASE_URL}images/menu/`;

function MenuReference({ items, language, text }) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 4);

  if (!items.length) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#171717]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-500/10 p-2 text-red-400">
            <BookOpen size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {text.menuReference}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {text.menuHint}
            </p>
          </div>
        </div>

        <span className="text-sm text-red-400">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 gap-3 border-t border-white/10 p-4 sm:grid-cols-2">
          {visibleItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex min-w-0 items-center gap-3 rounded-xl bg-[#202020] p-2"
            >
              {item.image ? (
                <img
                  src={`${BASE_IMAGE_PATH}${item.image}`}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-500">
                  <Utensils size={22} />
                </div>
              )}

              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold text-white">
                  {item.name}
                </p>

                {item.description?.[language] && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {item.description[language]}
                  </p>
                )}

                {item.price && (
                  <p className="mt-1 text-xs font-semibold text-red-400">
                    ${item.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!expanded && (
        <p className="border-t border-white/10 px-4 py-2 text-xs text-gray-500">
          {items.length} {language === "es" ? "platos disponibles" : language === "it" ? "piatti disponibili" : language === "pt" ? "pratos disponíveis" : "dishes available"}
        </p>
      )}
    </section>
  );
}

function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function WaiterSimulation({ menuData }) {
  const [language, setLanguage] = useState("en");
  const [phase, setPhase] = useState("intro");
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const stages = useMemo(
    () => buildServiceStages(language),
    [language]
  );

  const menuItems = useMemo(
    () => getMenuReference(menuData, 8),
    [menuData]
  );

  const text = UI_TEXT[language] || UI_TEXT.en;
  const stage = stages[currentStage];

  const startSimulation = () => {
    setCurrentStage(0);
    setSelectedAnswer(null);
    setScore(0);
    setHistory([]);
    setPhase("playing");
  };

  const selectAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;

    const isCorrect = answerIndex === stage.correct;

    setSelectedAnswer(answerIndex);

    if (isCorrect) {
      setScore((previous) => previous + 10);
    }

    setHistory((previous) => [
      ...previous,
      {
        stageId: stage.id,
        selected: answerIndex,
        correct: stage.correct,
        isCorrect,
      },
    ]);

    setPhase("feedback");
  };

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage((previous) => previous + 1);
      setSelectedAnswer(null);
      setPhase("playing");
    } else {
      setPhase("results");
    }
  };

  const getPerformance = () => {
    const percentage = (score / (stages.length * 10)) * 100;

    if (percentage >= 90) return text.excellent;
    if (percentage >= 70) return text.good;
    if (percentage >= 50) return text.practice;

    return text.tryAgain;
  };

  const getPerformanceIcon = () => {
    const percentage = (score / (stages.length * 10)) * 100;

    if (percentage >= 90) return <Star size={34} />;
    if (percentage >= 70) return <Heart size={34} />;
    return <Sparkles size={34} />;
  };

  const getOptionStyle = (index) => {
    if (selectedAnswer === null) {
      return "border-white/10 bg-[#202020] hover:border-red-500/60 hover:bg-red-500/5";
    }

    if (index === stage.correct) {
      return "border-green-500/50 bg-green-500/10";
    }

    if (index === selectedAnswer) {
      return "border-red-500/50 bg-red-500/10";
    }

    return "border-white/5 bg-[#202020] opacity-50";
  };

  return (
    <div className="min-h-screen bg-[#101010] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              <ChefHat size={15} />
              Yutori Training
            </div>

            <h1 className="text-2xl font-black sm:text-3xl">
              {text.title}
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-400">
              {text.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  language === code
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-white/10 bg-[#1c1c1c] text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </header>

        {/* Intro */}
        {phase === "intro" && (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#291313] via-[#1b1414] to-[#151515] p-6 sm:p-10">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />

              <div className="relative z-10 max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300">
                  <Sparkles size={14} />
                  FINAL GAME
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                  {language === "es"
                    ? "Tu mesa. Tus clientes. Tu servicio."
                    : language === "it"
                      ? "Il tuo tavolo. I tuoi clienti. Il tuo servizio."
                      : language === "pt"
                        ? "Sua mesa. Seus clientes. Seu atendimento."
                        : "Your table. Your customers. Your service."}
                </h2>

                <p className="mt-4 leading-relaxed text-gray-300">
                  {language === "es"
                    ? "Imagina que estás trabajando en Yutori. Una pareja llega al restaurante y tú serás responsable de acompañarlos durante toda su experiencia."
                    : language === "it"
                      ? "Immagina di lavorare da Yutori. Una coppia arriva al ristorante e sarai tu ad accompagnarla durante tutta l'esperienza."
                      : language === "pt"
                        ? "Imagine que você está trabalhando no Yutori. Um casal chega ao restaurante e você será responsável por acompanhá-los durante toda a experiência."
                        : "Imagine you're working at Yutori. A couple arrives at the restaurant, and you're responsible for looking after them throughout their entire experience."}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      icon: <MessageCircle size={20} />,
                      label: language === "es" ? "Diálogos reales" : language === "it" ? "Dialoghi reali" : language === "pt" ? "Diálogos reais" : "Real dialogue",
                    },
                    {
                      icon: <Utensils size={20} />,
                      label: language === "es" ? "Servicio completo" : language === "it" ? "Servizio completo" : language === "pt" ? "Atendimento completo" : "Full service",
                    },
                    {
                      icon: <Clock size={20} />,
                      label: language === "es" ? "10 etapas" : language === "it" ? "10 fasi" : language === "pt" ? "10 etapas" : "10 stages",
                    },
                    {
                      icon: <Star size={20} />,
                      label: language === "es" ? "Puntuación" : language === "it" ? "Punteggio" : language === "pt" ? "Pontuação" : "Scoring",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="mb-2 text-red-400">
                        {feature.icon}
                      </div>
                      <p className="text-xs font-semibold text-gray-300">
                        {feature.label}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={startSimulation}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 font-bold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500 sm:w-auto"
                >
                  {text.start}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <MenuReference
              items={menuItems}
              language={language}
              text={text}
            />
          </div>
        )}

        {/* Playing and feedback */}
        {(phase === "playing" || phase === "feedback") && stage && (
          <div className="space-y-5">
            {/* Progress */}
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-bold text-gray-300">
                  {text.stage} {currentStage + 1} {text.of} {stages.length}
                </span>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">
                    {text.score}: <strong className="text-red-400">{score}</strong>
                  </span>
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
                    {text.difficulty[stage.difficulty]}
                  </span>
                </div>
              </div>

              <ProgressBar
                current={currentStage + 1}
                total={stages.length}
              />
            </div>

            {/* Stage heading */}
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <Utensils size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                  {stage.category}
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {stage.title}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {stage.situation}
                </p>
              </div>
            </div>

            {/* Customer dialogue */}
            <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <MessageCircle size={15} />
                {text.customer}
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                  👤
                </div>

                <div className="rounded-2xl rounded-tl-sm bg-[#292929] px-4 py-3">
                  <p className="leading-relaxed text-gray-100">
                    “{stage.customer}”
                  </p>
                </div>
              </div>
            </div>

            {/* Answer options */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-300">
                <CircleHelp size={17} className="text-red-400" />
                {text.choose}
              </h3>

              {stage.options.map((option, index) => {
                const isCorrect = index === stage.correct;
                const isSelected = index === selectedAnswer;

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={phase === "feedback"}
                    onClick={() => selectAnswer(index)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${getOptionStyle(index)}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-gray-400">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="flex-1 text-sm leading-relaxed text-gray-200">
                      {option}
                    </span>

                    {phase === "feedback" && isCorrect && (
                      <Check
                        size={20}
                        className="shrink-0 text-green-400"
                      />
                    )}

                    {phase === "feedback" && isSelected && !isCorrect && (
                      <X
                        size={20}
                        className="shrink-0 text-red-400"
                      />
                    )}
                  </button>
                );
              })}
            </section>

            {/* Feedback */}
            {phase === "feedback" && (
              <div
                className={`space-y-4 rounded-2xl border p-5 ${
                  selectedAnswer === stage.correct
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedAnswer === stage.correct ? (
                    <Check className="text-green-400" size={21} />
                  ) : (
                    <X className="text-red-400" size={21} />
                  )}

                  <h3 className="font-bold">
                    {selectedAnswer === stage.correct
                      ? text.correct
                      : text.incorrect}
                  </h3>

                  <span className="ml-auto text-xs font-bold text-gray-400">
                    {selectedAnswer === stage.correct ? "+10" : "0"} {text.points}
                  </span>
                </div>

                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                    {text.explanation}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {stage.explanation}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                    <MessageCircle size={14} />
                    {text.conversation}
                  </div>

                  <p className="text-sm text-gray-400">
                    {text.customer}: “{stage.response}”
                  </p>

                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="mb-1 text-xs font-bold text-gray-500">
                      {text.bestAnswer}
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-white">
                      “{stage.phrase}”
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStage}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-bold text-white transition hover:bg-red-500"
                >
                  {currentStage === stages.length - 1
                    ? text.finish
                    : text.next}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Menu reference */}
            <MenuReference
              items={menuItems}
              language={language}
              text={text}
            />
          </div>
        )}

        {/* Results */}
        {phase === "results" && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#291313] to-[#171717] p-7 text-center sm:p-10">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                {getPerformanceIcon()}
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                Yutori Training
              </p>

              <h2 className="mt-3 text-3xl font-black">
                {text.completed}
              </h2>

              <p className="mt-3 text-gray-300">
                {getPerformance()}
              </p>

              <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  {text.score}
                </p>

                <p className="mt-1 text-5xl font-black text-red-400">
                  {score}
                  <span className="text-xl text-gray-500">
                    /100
                  </span>
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {history.filter((item) => item.isCorrect).length} / {stages.length} {language === "es" ? "respuestas correctas" : language === "it" ? "risposte corrette" : language === "pt" ? "respostas corretas" : "correct answers"}
                </p>
              </div>

              <button
                type="button"
                onClick={startSimulation}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-bold text-white transition hover:bg-red-500"
              >
                <RotateCcw size={18} />
                {text.restart}
              </button>
            </div>

            {/* Answer review */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold">
                {text.performance}
              </h3>

              {stages.map((reviewStage, index) => {
                const result = history[index];

                return (
                  <div
                    key={reviewStage.id}
                    className="rounded-2xl border border-white/10 bg-[#191919] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          result?.isCorrect
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {result?.isCorrect ? (
                          <Check size={18} />
                        ) : (
                          <X size={18} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">
                          {index + 1}. {reviewStage.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {result?.isCorrect ? "+10" : "0"} {text.points}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                      <p className="text-xs text-gray-500">
                        {text.yourAnswer}:{" "}
                        <span className="text-gray-300">
                          {reviewStage.options[result?.selected ?? 0]}
                        </span>
                      </p>

                      {!result?.isCorrect && (
                        <p className="text-xs text-green-400">
                          {text.bestAnswer}:{" "}
                          {reviewStage.options[reviewStage.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            <MenuReference
              items={menuItems}
              language={language}
              text={text}
            />
          </div>
        )}
      </div>
    </div>
  );
}
