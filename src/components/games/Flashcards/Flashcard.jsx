
import { useState, useEffect } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

export default function Flashcard({
  card,
  flipped,
  onFlip,
  languageLabel,
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [card?.id]);

  if (!card) return null;

  const imagePath = card.image
    ? card.image.startsWith("/")
      ? card.image
      : `/images/menu/${card.image}`
    : null;

  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={flipped ? "Hide answer" : "Reveal answer"}
      aria-pressed={flipped}
      className="group relative flex min-h-[340px] w-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-[#141414] text-left shadow-2xl shadow-black/30 transition duration-300 hover:border-red-900/70 hover:shadow-red-950/10 focus:outline-none focus:ring-2 focus:ring-red-600/50"
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-600 to-red-950" />

      {/* Card header */}
      <div className="flex w-full items-center justify-between border-b border-zinc-800 px-6 py-4">
        <span className="rounded-full border border-red-900/50 bg-red-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
          {card.type === "ingredient" ? "Ingredient" : "Menu item"}
        </span>

        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
          {flipped ? "Answer" : "Question"}
        </span>
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col items-center justify-center px-7 py-8 text-center">
        {flipped ? (
          <>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/40 bg-red-950/30">
              <Sparkles className="h-6 w-6 text-red-500" />
            </div>

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {languageLabel}
            </p>

            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              {card.back}
            </h2>

            {card.category && (
              <span className="mt-5 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400">
                {card.category}
              </span>
            )}

            {card.price !== undefined && (
              <p className="mt-4 text-sm font-bold text-red-400">
                UYU ${Number(card.price).toLocaleString("es-UY")}
              </p>
            )}
          </>
        ) : (
          <>
            {card.type === "dish" && imagePath && !imageError && (
              <img
                src={imagePath}
                alt={card.front}
                onError={() => setImageError(true)}
                className="mb-6 h-36 w-48 rounded-2xl border border-zinc-800 object-cover shadow-lg"
              />
            )}

            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {card.type === "ingredient"
                ? "How do you say this?"
                : "What can you tell the customer about this dish?"}
            </p>

            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white transition-colors group-hover:text-red-100 sm:text-4xl">
              {card.front}
            </h2>

            {card.category && (
              <p className="mt-4 text-sm text-zinc-600">
                {card.category}
              </p>
            )}
          </>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-center gap-2 border-t border-zinc-800 px-6 py-5 text-sm font-medium text-red-400 transition group-hover:text-red-300">
        <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />

        {flipped
          ? "Click to hide the answer"
          : "Click to reveal the answer"}
      </div>
    </button>
  );
}
