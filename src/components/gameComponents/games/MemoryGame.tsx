import { useState, useEffect, useCallback, type JSX } from "react";
import GameHeader from "../GameHeader";
import GameScreenOverlay from "../GameScreenOverlay";
import launchConfetti from "../Confetti";
// --- Import images ---
import {
  MemoryGameImageMap,
  PlaceholderImages,
} from "../../../assets/images/game/index";
// Imports the utility function to handle score comparison and submission to Firebase RTDB.
import { updateHighScore } from "../../../utils/updateHighScore";

// --- Types ---
interface Card {
  id: number;
  matchId: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// --- Props ---
type GameProps = {
  playerName: string;
};

// --- Card Assets ---
const INITIAL_ICONS: string[] = Object.values(MemoryGameImageMap);

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
export default function MemoryGame({ playerName }: GameProps) {
  const [cards, setCards] = useState<Card[]>(createBoard);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [memoryHighscore, setMemoryHighscore] = useState<number | null>(() => {
    const saved = localStorage.getItem("memoryHighScore");
    return saved ? parseInt(saved, 10) : null;
  });
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Derived state
  const matchedCount: number = cards.filter((c) => c.isMatched).length;
  const isGameWon: boolean = matchedCount === cards.length && cards.length > 0;

  // New helper function to reset all core game state
  const resetGameState = () => {
    setCards(createBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsChecking(false);
  };

  // --- High Score Submission and Win Effects ---
  useEffect(() => {
    if (isGameWon) {
      if (memoryHighscore === null || moves < memoryHighscore) {
        setMemoryHighscore(moves);
        localStorage.setItem("memoryHighScore", moves.toString());
        updateHighScore("memory", playerName, moves);
      }
      launchConfetti();
    }
  }, [isGameWon, moves, memoryHighscore, playerName]);

  const startGame = () => {
    resetGameState();
    setGameStarted(true);
  };

  // Used by the Header's "Reset" button to go back to the start screen
  const restartGame = useCallback(() => {
    resetGameState();
    setGameStarted(false);
  }, []);

  // --- Card flip logic ---
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

  // --- Click handler ---
  const handleCardClick = (id: number): void => {
    if (isChecking || flippedCards.length >= 2) return;

    const clickedCard = cards.find((c) => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  // --- Render card ---
  const renderCard = (card: Card): JSX.Element => {
    const isVisible = card.isFlipped || card.isMatched;
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
          "❔"
        )}
      </div>
    );
  };

  // --- Render ---
  return (
    <div className="w-full p-2 m-auto mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <GameHeader
        title="Stunkie Pair"
        subtitle="Match 'em!"
        stats={[
          { label: "Moves", value: moves },
          ...(memoryHighscore !== null
            ? [{ label: "Best", value: memoryHighscore }]
            : []),
        ]}
        onReset={restartGame}
      />

      <GameScreenOverlay
        gameStarted={gameStarted}
        gameOver={isGameWon}
        score={moves}
        highScore={memoryHighscore}
        startGame={startGame}
        // ✅ The fix is here: Use startGame to instantly restart the game.
        restartGame={startGame}
        startText="Help Stunkies to match!"
        startImage={PlaceholderImages.memory_us}
        gameOverText="You matched them ♥️!">
        <div className="grid grid-cols-4 gap-1 min-[539px]:grid-cols-5 ">
          {cards.map(renderCard)}
        </div>
      </GameScreenOverlay>
    </div>
  );
}
