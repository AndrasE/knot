import React, { useState, useEffect, useCallback, type JSX } from "react";

// --- Import images ---
import img1 from "../assets/images/game/memory/1.webp";
import img2 from "../assets/images/game/memory/2.webp";
import img3 from "../assets/images/game/memory/3.webp";
import img4 from "../assets/images/game/memory/4.webp";
import img5 from "../assets/images/game/memory/5.webp";
import img6 from "../assets/images/game/memory/6.webp";
import img7 from "../assets/images/game/memory/7.webp";
import img8 from "../assets/images/game/memory/8.webp";
import img9 from "../assets/images/game/memory/9.webp";
import img10 from "../assets/images/game/memory/10.webp";
import smooch from "../assets/images/game/flappy/smooch.webp";

// --- Types ---
interface Card {
  id: number;
  matchId: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// --- Card Assets ---
const INITIAL_ICONS: string[] = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
];

// --- Helper Functions ---
const shuffle = (array: Card[]): Card[] => {
  const shuffledArray = [...array];
  let currentIndex = shuffledArray.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }
  return shuffledArray;
};

const createBoard = (): Card[] => {
  const cards: Card[] = INITIAL_ICONS.flatMap((icon, index) => {
    const cardBase = {
      icon,
      matchId: index,
      isFlipped: false,
      isMatched: false,
    };
    return [
      { ...cardBase, id: index * 2 },
      { ...cardBase, id: index * 2 + 1 },
    ];
  });
  return shuffle(cards);
};

// --- Component ---
const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(createBoard);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [memoryHighscore, setMemoryHighscore] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Derived state
  const matchedCount: number = cards.filter((c) => c.isMatched).length;
  const isGameWon: boolean = matchedCount === cards.length && cards.length > 0;

  // Load highscore from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("memoryGameHighscore");
    if (stored) setMemoryHighscore(Number(stored));
  }, []);

  // Save highscore if new record
  useEffect(() => {
    if (isGameWon) {
      if (memoryHighscore === null || moves < memoryHighscore) {
        setMemoryHighscore(moves);
        localStorage.setItem("memoryGameHighscore", moves.toString());
      }
    }
  }, [isGameWon, moves, memoryHighscore]);

  // Function to start the game
  const startGame = () => {
    setCards(createBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsChecking(false);
    setGameStarted(true);
  };

  // Restart (returns to start screen)
  const restartGame = useCallback(() => {
    setGameStarted(false);
  }, []);

  // Check match when two cards are flipped
  useEffect(() => {
    if (flippedCards.length !== 2) return;

    setIsChecking(true);
    setMoves((m) => m + 1);

    const [id1, id2] = flippedCards;

    const timeout = setTimeout(() => {
      setCards((prevCards) => {
        const card1 = prevCards.find((c) => c.id === id1)!;
        const card2 = prevCards.find((c) => c.id === id2)!;

        if (card1.matchId === card2.matchId) {
          return prevCards.map((c) =>
            c.id === id1 || c.id === id2
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          );
        } else {
          return prevCards.map((c) =>
            c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
          );
        }
      });
      setFlippedCards([]);
      setIsChecking(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [flippedCards]);

  // Handle click
  const handleCardClick = (id: number): void => {
    if (isChecking || flippedCards.length >= 2) return;

    const clickedCard = cards.find((c) => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  // Render
  const renderCard = (card: Card): JSX.Element => {
    const isVisible: boolean = card.isFlipped || card.isMatched;
    const cardClassName = isVisible
      ? card.isMatched
        ? "bg-green-200 pointer-events-none opacity-80"
        : "bg-indigo-100"
      : "bg-stone-400 hover:bg-stone-500 transform hover:scale-[1.02] text-white";

    return (
      <div
        key={card.id}
        onClick={() => handleCardClick(card.id)}
        className={`flex items-center justify-center p-1 rounded-xl shadow-lg cursor-pointer transition-all duration-300 aspect-square ${cardClassName} ${
          isChecking ? "pointer-events-none" : ""
        }`}>
        {isVisible ? (
          <img src={card.icon} alt="memory card" className="rounded-md" />
        ) : (
          "?"
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl p-2 mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      {/* Header - Always visible */}
      <header className="mb-5 text-center md:mb-10">
        <h1 className="text-2xl">Stunkie Match</h1>
        <p className="mb-2">Match 'em!</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-2 text-indigo-800 bg-indigo-100 rounded-lg shadow-sm">
            Moves: <span>{moves}</span>
          </div>
          {memoryHighscore !== null && (
            <div className="px-4 py-2 text-yellow-800 bg-yellow-100 rounded-lg shadow-sm">
              Best: <span>{memoryHighscore}</span>
            </div>
          )}
          <button
            onClick={restartGame}
            className="px-4 py-2 text-white transition duration-200 bg-red-400 rounded-lg shadow-sm active:scale-95">
            Reset
          </button>
        </div>
      </header>

      {/* Game Area - Holds either the start screen or the grid */}
      <div className="relative">
        {!gameStarted ? (
          // --- Start Screen ---
          <>
            {/* 1. An invisible grid that sets the correct height for the container */}
            <div className="grid invisible grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
              {cards.map(renderCard)}
            </div>

            {/* 2. Your start screen, positioned absolutely to fill the container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 bg-[#f5f0e6] rounded-lg">
              <p className="mb-2 text-xl text-center">
                Help Stunkies to match! 🥰
              </p>
              <img
                src={smooch}
                alt="smooch"
                className="mb-4 w-60 rounded-2xl"
              />
              <button
                onClick={startGame}
                className="px-4 py-2 text-base text-white transition duration-200 rounded-md shadow-xl bg-stone-400 hover:bg-stone-500 active:scale-95">
                Start Game
              </button>
            </div>
          </>
        ) : (
          // --- Game Grid ---
          // (This part remains unchanged)
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
            {cards.map(renderCard)}
          </div>
        )}
        {/* --- Win Modal (Overlay) --- */}
        {isGameWon && gameStarted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-600/90">
            <div className="p-8 text-center bg-[#f5f0e6] shadow-2xl rounded-xl">
              <h2 className="mt-1 mb-4 text-2xl animate-bounce">
                They all matched! ♥️
              </h2>
              <p className="mb-3">🎯 Moves: {moves}</p>
              {memoryHighscore !== null && (
                <p className="mb-6">🏆 Best: {memoryHighscore}</p>
              )}
              <button
                onClick={restartGame}
                className="px-4 py-2 text-white transition duration-200 shadow-xl bg-stone-500 hover:bg-stone-600 rounded-xl active:scale-95">
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
