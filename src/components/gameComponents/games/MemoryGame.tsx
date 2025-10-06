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
  // Stores the high score (lowest moves) for local UI display.
  const [memoryHighscore, setMemoryHighscore] = useState<number | null>(() => {
    const saved = localStorage.getItem("memoryHighscore");
    return saved ? parseInt(saved, 10) : null;
  });
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Derived state
  const matchedCount: number = cards.filter((c) => c.isMatched).length;
  const isGameWon: boolean = matchedCount === cards.length && cards.length > 0;

  // --- High Score Submission and Win Effects ---
  useEffect(() => {
    // Runs whenever the game win status or score changes.
    if (isGameWon) {
      // 1. LOCAL HIGH SCORE CHECK (LOWER MOVES IS BETTER)
      if (memoryHighscore === null || moves < memoryHighscore) {
        // Update local state and localStorage
        setMemoryHighscore(moves);
        localStorage.setItem("memoryGameHighscore", moves.toString());

        // 2. FIREBASE REALTIME DB HIGH SCORE SUBMISSION
        // Call the utility function. Since 'memory' is a 'lower is better' game,
        // we only call this when a new local best (lower moves) is achieved,
        // preventing unnecessary writes.
        updateHighScore("memory", playerName, moves);
      }

      // Trigger confetti regardless of high score status
      launchConfetti();
    }
  }, [isGameWon, moves, memoryHighscore, playerName]);

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
    // Increment move count only when the second card is flipped
    setMoves((m) => m + 1);

    const [id1, id2] = flippedCards;

    const timeout = setTimeout(() => {
      setCards((prevCards) => {
        const card1 = prevCards.find((c) => c.id === id1)!;
        const card2 = prevCards.find((c) => c.id === id2)!;

        if (card1.matchId === card2.matchId) {
          // It's a match: lock cards in matched state
          return prevCards.map((c) =>
            c.id === id1 || c.id === id2
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          );
        } else {
          // Not a match: flip cards back over
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

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    // Add its ID to the flippedCards array
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
          "❔"
        )}
      </div>
    );
  };

  return (
    // This outer div is just for centering the whole component on the page
    <div className="w-full p-2 m-auto mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <GameHeader
        title="Stunkie Pair"
        subtitle="Match 'em!"
        stats={[
          { label: "Moves", value: moves },
          // Only show 'Best' stat if a high score exists
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
        restartGame={restartGame}
        startText="Help Stunkies to match! "
        startImage={PlaceholderImages.memory_us}
        gameOverText="You matched them ♥️!">
        {/* The card grid is passed as a child to the overlay */}
        <div className="grid grid-cols-4 gap-1 min-[539px]:grid-cols-5 ">
          {cards.map(renderCard)}
        </div>
      </GameScreenOverlay>
    </div>
  );
}
