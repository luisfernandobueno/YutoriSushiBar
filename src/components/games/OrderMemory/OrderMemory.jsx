
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  EyeOff,
  RotateCcw,
  ShoppingBag,
  Trophy,
  X,
} from "lucide-react";

import {
  LANGUAGES,
  buildOrderMemoryRound,
  formatPrice,
} from "./orderMemoryUtils";

const MEMORIZE_SECONDS = 8;
const ORDER_LENGTH = 4;

const TEXT = {
  es: {
    title: "Order Memory",
    subtitle: "¿Puedes recordar el pedido de tu cliente?",
    memorize: "Memoriza el pedido",
    memorizeDescription:
      "Observa los platos y recuerda el orden en el que fueron solicitados.",
    customerOrder: "Pedido del cliente",
    seconds: "segundos",
    start: "Comenzar desafío",
    remember: "¡Memoriza bien!",
    hidden: "El pedido está oculto",
    hiddenDescription:
      "Ahora reconstruye el pedido seleccionando los platos en el orden correcto.",
    question: "¿Cuál fue el plato número",
    choose: "Selecciona una opción",
    correct: "¡Correcto!",
    incorrect: "No exactamente...",
    correctAnswer: "La respuesta correcta era:",
    next: "Siguiente plato",
    finish: "Ver resultados",
    results: "¡Desafío completado!",
    score: "Respuestas correctas",
    accuracy: "Precisión",
    review: "Pedido original",
    yourAnswer: "Tu respuesta",
    correctLabel: "Respuesta correcta",
    playAgain: "Volver a jugar",
    language: "Idioma",
    noMenu: "No se encontraron suficientes platos en menu.json.",
    price: "Precio",
    position: "Posición",
    outOf: "de",
  },
  en: {
    title: "Order Memory",
    subtitle: "Can you remember your customer's order?",
    memorize: "Memorize the order",
    memorizeDescription:
      "Look at the dishes and remember the exact order in which they were requested.",
    customerOrder: "Customer order",
    seconds: "seconds",
    start: "Start challenge",
    remember: "Remember carefully!",
    hidden: "The order is hidden",
    hiddenDescription:
      "Now reconstruct the order by selecting the dishes in the correct sequence.",
    question: "Which dish was number",
    choose: "Choose an option",
    correct: "Correct!",
    incorrect: "Not quite...",
    correctAnswer: "The correct answer was:",
    next: "Next dish",
    finish: "See results",
    results: "Challenge completed!",
    score: "Correct answers",
    accuracy: "Accuracy",
    review: "Original order",
    yourAnswer: "Your answer",
    correctLabel: "Correct answer",
    playAgain: "Play again",
    language: "Language",
    noMenu: "Not enough dishes were found in menu.json.",
    price: "Price",
    position: "Position",
    outOf: "out of",
  },
  it: {
    title: "Order Memory",
    subtitle: "Riesci a ricordare l'ordine del cliente?",
    memorize: "Memorizza l'ordine",
    memorizeDescription:
      "Osserva i piatti e ricorda l'ordine esatto in cui sono stati richiesti.",
    customerOrder: "Ordine del cliente",
    seconds: "secondi",
    start: "Inizia la sfida",
    remember: "Ricorda attentamente!",
    hidden: "L'ordine è nascosto",
    hiddenDescription:
      "Ora ricostruisci l'ordine scegliendo i piatti nella sequenza corretta.",
    question: "Qual era il piatto numero",
    choose: "Scegli un'opzione",
    correct: "Corretto!",
    incorrect: "Non proprio...",
    correctAnswer: "La risposta corretta era:",
    next: "Piatto successivo",
    finish: "Vedi risultati",
    results: "Sfida completata!",
    score: "Risposte corrette",
    accuracy: "Precisione",
    review: "Ordine originale",
    yourAnswer: "La tua risposta",
    correctLabel: "Risposta corretta",
    playAgain: "Gioca ancora",
    language: "Lingua",
    noMenu: "Non sono stati trovati abbastanza piatti in menu.json.",
    price: "Prezzo",
    position: "Posizione",
    outOf: "su",
  },
  pt: {
    title: "Order Memory",
    subtitle: "Consegue lembrar o pedido do cliente?",
    memorize: "Memorize o pedido",
    memorizeDescription:
      "Observe os pratos e lembre-se da ordem exata em que foram pedidos.",
    customerOrder: "Pedido do cliente",
    seconds: "segundos",
    start: "Começar desafio",
    remember: "Memorize com atenção!",
    hidden: "O pedido está oculto",
    hiddenDescription:
      "Agora reconstrua o pedido selecionando os pratos na sequência correta.",
    question: "Qual era o prato número",
    choose: "Escolha uma opção",
    correct: "Correto!",
    incorrect: "Não exatamente...",
    correctAnswer: "A resposta correta era:",
    next: "Próximo prato",
    finish: "Ver resultados",
    results: "Desafio concluído!",
    score: "Respostas corretas",
    accuracy: "Precisão",
    review: "Pedido original",
    yourAnswer: "Sua resposta",
    correctLabel: "Resposta correta",
    playAgain: "Jogar novamente",
    language: "Idioma",
    noMenu: "Não foram encontrados pratos suficientes em menu.json.",
    price: "Preço",
    position: "Posição",
    outOf: "de",
  },
};

function OrderImage({ image, name, className = "" }) {
  if (!image) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 text-red-400 ${className}`}
      >
        <ShoppingBag size={28} />
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}images/menu/${image}`}
      alt={name}
      className={`object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function OrderMemory({ menuData }) {
  const [language, setLanguage] = useState("en");
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [remaining, setRemaining] = useState(MEMORIZE_SECONDS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  const t = TEXT[language];

  const game = useMemo(
    () => buildOrderMemoryRound(menuData, ORDER_LENGTH),
    [menuData, round]
  );

  const { order, questions } = game;
  const currentQuestion = questions[questionIndex];

  const score = answers.filter((answer) => answer.correct).length;
  const accuracy = answers.length
    ? Math.round((score / answers.length) * 100)
    : 0;

  useEffect(() => {
    if (phase !== "memorize") return;

    if (remaining <= 0) {
      setPhase("recall");
      return;
    }

    const timer = setTimeout(() => {
      setRemaining((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, remaining]);

  const startGame = () => {
    setRemaining(MEMORIZE_SECONDS);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setPhase("memorize");
  };

  const handleAnswer = (option) => {
    if (phase !== "recall" || !currentQuestion) return;

    const correct = option.id === currentQuestion.correctItem.id;

    setSelectedOption(option);
    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion,
        selected: option,
        correct,
      },
    ]);

    setPhase("feedback");
  };

  const handleNext = () => {
    if (questionIndex + 1 >= questions.length) {
      setPhase("results");
      return;
    }

    setQuestionIndex((previous) => previous + 1);
    setSelectedOption(null);
    setPhase("recall");
  };

  const restartGame = () => {
    setRound((previous) => previous + 1);
    setPhase("intro");
    setRemaining(MEMORIZE_SECONDS);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
  };

  const progress = questions.length
    ? (answers.length / questions.length) * 100
    : 0;

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-[#111] p-8 text-center">
        <ShoppingBag className="mx-auto mb-4 text-red-500" size={38} />
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <p className="mt-3 text-sm text-zinc-400">{t.noMenu}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-500">
            <span className="rounded-md bg-red-950 px-2 py-1">GAME 12</span>
            <span>MEMORY TRAINING</span>
          </div>

          <h1 className="text-3xl font-black text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500">{t.language}</label>
          <select
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setPhase("intro");
              setAnswers([]);
              setQuestionIndex(0);
              setSelectedOption(null);
              setRemaining(MEMORIZE_SECONDS);
            }}
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

      {/* Progress */}
      {phase !== "intro" && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>
              {t.position} {Math.min(answers.length + 1, questions.length)}{" "}
              {t.outOf} {questions.length}
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
              <ShoppingBag size={42} />
            </div>

            <h2 className="text-2xl font-bold text-white">{t.memorize}</h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
              {t.memorizeDescription}
            </p>

            <div className="my-7 grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-[#171717] p-4">
                <Clock className="mx-auto mb-2 text-red-500" size={23} />
                <p className="text-2xl font-black text-white">
                  {MEMORIZE_SECONDS}s
                </p>
                <p className="mt-1 text-xs text-zinc-500">Memorization</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#171717] p-4">
                <ShoppingBag className="mx-auto mb-2 text-red-500" size={23} />
                <p className="text-2xl font-black text-white">
                  {order.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Dishes to remember</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-600"
            >
              <Eye size={18} />
              {t.start}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MEMORIZE */}
      {phase === "memorize" && (
        <div className="space-y-5 rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:p-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <div className="flex items-center gap-2 text-red-500">
                <Eye size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {t.remember}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold text-white">
                {t.customerOrder}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-3">
              <Clock className="text-red-500" size={22} />
              <span className="text-3xl font-black tabular-nums text-white">
                {remaining}
              </span>
              <span className="text-xs text-zinc-400">{t.seconds}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {order.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-[#171717] p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-950 text-sm font-black text-red-400">
                  {index + 1}
                </div>

                <OrderImage
                  image={item.image}
                  name={item.name}
                  className="h-16 w-16 shrink-0 rounded-lg"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.category}</p>
                  {item.price > 0 && (
                    <p className="mt-1 text-xs text-red-400">
                      {formatPrice(item.price, menuData?.currency || "UYU")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-500">
            {t.memorizeDescription}
          </p>
        </div>
      )}

      {/* RECALL */}
      {phase === "recall" && currentQuestion && (
        <div className="space-y-6 rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/40 text-red-500">
              <EyeOff size={28} />
            </div>

            <h2 className="text-xl font-bold text-white">{t.hidden}</h2>
            <p className="mt-2 text-sm text-zinc-400">
              {t.hiddenDescription}
            </p>
          </div>

          <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">
              {t.position} {currentQuestion.position}
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {t.question} {currentQuestion.position}?
            </h3>

            <p className="mt-2 text-sm text-zinc-400">{t.choose}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#171717] p-3 text-left transition hover:border-red-600 hover:bg-red-950/20"
              >
                <OrderImage
                  image={option.image}
                  name={option.name}
                  className="h-16 w-16 shrink-0 rounded-lg"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white transition group-hover:text-red-400">
                    {option.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {option.category}
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="shrink-0 text-zinc-600 group-hover:text-red-500"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FEEDBACK */}
      {phase === "feedback" && currentQuestion && (
        <div className="rounded-2xl border border-zinc-800 bg-[#111] p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                selectedOption?.id === currentQuestion.correctItem.id
                  ? "bg-green-950/40 text-green-400"
                  : "bg-red-950/40 text-red-400"
              }`}
            >
              {selectedOption?.id === currentQuestion.correctItem.id ? (
                <Check size={32} />
              ) : (
                <X size={32} />
              )}
            </div>

            <h2 className="text-2xl font-black text-white">
              {selectedOption?.id === currentQuestion.correctItem.id
                ? t.correct
                : t.incorrect}
            </h2>
          </div>

          <div className="mx-auto max-w-md space-y-3">
            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-4">
              <p className="mb-3 text-xs text-zinc-500">{t.yourAnswer}</p>

              <div className="flex items-center gap-3">
                <OrderImage
                  image={selectedOption?.image}
                  name={selectedOption?.name}
                  className="h-16 w-16 rounded-lg"
                />
                <p className="text-sm font-bold text-white">
                  {selectedOption?.name}
                </p>
              </div>
            </div>

            {selectedOption?.id !== currentQuestion.correctItem.id && (
              <div className="rounded-xl border border-green-900/50 bg-green-950/20 p-4">
                <p className="mb-3 text-xs text-green-400">
                  {t.correctAnswer}
                </p>

                <div className="flex items-center gap-3">
                  <OrderImage
                    image={currentQuestion.correctItem.image}
                    name={currentQuestion.correctItem.name}
                    className="h-16 w-16 rounded-lg"
                  />
                  <p className="text-sm font-bold text-white">
                    {currentQuestion.correctItem.name}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-600"
            >
              {questionIndex + 1 >= questions.length ? t.finish : t.next}
              <ArrowRight size={18} />
            </button>
          </div>
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
              {t.score}: {score}/{questions.length}
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

            <div className="space-y-2">
              {order.map((item, index) => {
                const answer = answers[index];

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#171717] p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-950 text-sm font-bold text-red-400">
                      {index + 1}
                    </span>

                    <OrderImage
                      image={item.image}
                      name={item.name}
                      className="h-12 w-12 shrink-0 rounded-lg"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      {answer && !answer.correct && (
                        <p className="mt-1 text-xs text-red-400">
                          {t.yourAnswer}: {answer.selected.name}
                        </p>
                      )}
                    </div>

                    {answer?.correct ? (
                      <Check className="shrink-0 text-green-400" size={20} />
                    ) : (
                      <X className="shrink-0 text-red-400" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
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

export default OrderMemory;
