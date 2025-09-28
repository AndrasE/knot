import React, { useState, useEffect, useCallback, type JSX } from "react";

// --- Import images (fixed set) ---
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

// --- Types ---
interface Card {
  id: number;
  matchId: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// --- Card Assets (10 unique pairs → 20 cards) ---
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
  const [memoryHighscore, setmemoryHighscore] = useState<number | null>(null);

  // Derived state
  const matchedCount: number = cards.filter((c) => c.isMatched).length;
  const isGameWon: boolean = matchedCount === 20;

  // Load memoryHighscore from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("memoryGamememoryHighscore");
    if (stored) setmemoryHighscore(Number(stored));
  }, []);

  // Save memoryHighscore if new record
  useEffect(() => {
    if (isGameWon) {
      if (memoryHighscore === null || moves < memoryHighscore) {
        setmemoryHighscore(moves);
        localStorage.setItem("memoryGamememoryHighscore", moves.toString());
      }
    }
  }, [isGameWon, moves, memoryHighscore]);

  // Restart
  const restartGame = useCallback(() => {
    setCards(createBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsChecking(false);
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
    <div className="w-full max-w-xl p-2 border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="text-2xl ">Stunkie Match</h1>
        <p className="mb-2">Find the 10 matching pairs!</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-2 text-indigo-800 bg-indigo-100 rounded-lg shadow-sm">
            Moves: <span>{moves}</span>
          </div>
          <div className="px-4 py-2 text-green-800 bg-green-100 rounded-lg shadow-sm">
            Matches: <span>{matchedCount / 2} / 10</span>
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

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
        {cards.map(renderCard)}
      </div>

      {/* Win Modal */}
      {isGameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-600/90">
          <div className="p-8 text-center bg-[#f5f0e6] shadow-2xl rounded-xl">
            <h2 className="mb-4 text-3xl animate-bounce">🎉 Noice! 🎉</h2>
            <p className="mb-3">You matched all pairs in {moves} moves!</p>
            {memoryHighscore !== null && (
              <p className="mb-6">
                🏆 Best Score: <strong>{memoryHighscore} moves</strong>
              </p>
            )}
            <button
              onClick={restartGame}
              className="px-6 py-3 text-xl text-white transition duration-200 shadow-xl bg-stone-500 hover:bg-stone-600 rounded-xl active:scale-95">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
