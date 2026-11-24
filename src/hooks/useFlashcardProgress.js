
import { useEffect, useState } from "react";

const STORAGE_KEY = "yutori-flashcards-progress";

const getSavedProgress = () => {
  try {
    if (typeof window === "undefined") return {};

    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export default function useFlashcardProgress() {
  const [progress, setProgress] = useState(getSavedProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Could not save flashcard progress:", error);
    }
  }, [progress]);

  const markKnown = (cardId) => {
    setProgress((previous) => ({
      ...previous,
      [cardId]: {
        known: true,
        attempts: (previous[cardId]?.attempts || 0) + 1,
        correct: (previous[cardId]?.correct || 0) + 1,
        lastReviewed: new Date().toISOString(),
      },
    }));
  };

  const markForReview = (cardId) => {
    setProgress((previous) => ({
      ...previous,
      [cardId]: {
        known: false,
        attempts: (previous[cardId]?.attempts || 0) + 1,
        correct: previous[cardId]?.correct || 0,
        lastReviewed: new Date().toISOString(),
      },
    }));
  };

  const isKnown = (cardId) => Boolean(progress[cardId]?.known);

  const getCardProgress = (cardId) => progress[cardId] || null;

  const resetProgress = (cardIds = null) => {
    if (!cardIds) {
      setProgress({});
      return;
    }

    setProgress((previous) => {
      const updated = { ...previous };
      cardIds.forEach((id) => delete updated[id]);
      return updated;
    });
  };

  const getStats = (cards = []) => {
    const known = cards.filter((card) => progress[card.id]?.known).length;
    const reviewed = cards.filter((card) => progress[card.id]?.attempts > 0).length;

    return {
      total: cards.length,
      known,
      reviewed,
      remaining: cards.length - known,
      percentage: cards.length
        ? Math.round((known / cards.length) * 100)
        : 0,
    };
  };

  return {
    progress,
    markKnown,
    markForReview,
    isKnown,
    getCardProgress,
    resetProgress,
    getStats,
  };
}
