import React, { useState, useEffect, useCallback, type JSX } from "react";

// --- Import images (fixed set) ---
import img1 from "../assets/images/game/1.webp";
import img2 from "../assets/images/game/2.webp";
import img3 from "../assets/images/game/3.webp";
import img4 from "../assets/images/game/4.webp";
import img5 from "../assets/images/game/5.webp";
import img6 from "../assets/images/game/6.webp";
import img7 from "../assets/images/game/7.webp";
import img8 from "../assets/images/game/8.webp";
import img9 from "../assets/images/game/9.webp";
import img10 from "../assets/images/game/10.webp";

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
  const [highscore, setHighscore] = useState<number | null>(null);

  // Derived state
  const matchedCount: number = cards.filter((c) => c.isMatched).length;
  const isGameWon: boolean = matchedCount === 20;

  // Load highscore from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("memoryHighscore");
    if (stored) setHighscore(Number(stored));
  }, []);

  // Save highscore if new record
  useEffect(() => {
    if (isGameWon) {
      if (highscore === null || moves < highscore) {
        setHighscore(moves);
        localStorage.setItem("memoryHighscore", moves.toString());
      }
    }
  }, [isGameWon, moves, highscore]);

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
    <div className="w-full max-w-xl p-5 border shadow-xl rounded-2xl sm:p-8 border-stone-500">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-bold">Memory Match</h1>
        <p className="mb-4 text-gray-600">Find the 10 matching pairs!</p>

        <div className="flex items-center justify-center space-x-4">
          <div className="px-4 py-2 text-indigo-800 bg-indigo-100 rounded-lg shadow-sm">
            Moves: <span className="font-extrabold">{moves}</span>
          </div>
          <div className="px-4 py-2 text-green-800 bg-green-100 rounded-lg shadow-sm">
            Matches:{" "}
            <span className="font-extrabold">{matchedCount / 2} / 10</span>
          </div>
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
            <h2 className="mb-4 text-3xl font-extrabold animate-bounce">
              🎉 Noice! 🎉
            </h2>
            <p className="mb-3">You matched all pairs in {moves} moves!</p>
            {highscore !== null && (
              <p className="mb-6">
                🏆 Best Score: <strong>{highscore} moves</strong>
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

/*
// ====================================================================
// COMPONENT EXPLANATION: How the Memory Match Game Works
// ====================================================================

// 1. State Management:
// --------------------
// - cards: An array of Card objects (20 total). This is the single source of truth for the
//   entire game board, holding the icon URL, match ID, and the current state (flipped/matched).
// - flippedCards: An array of numbers (Card IDs) currently showing (max 2). This array drives
//   the core match-checking logic.
// - moves: Tracks the total number of pairs of cards flipped.
// - isChecking: A boolean flag set to true when two cards are flipped and the game is waiting
//   the 1.2-second timeout before checking for a match. This prevents the user from clicking more cards.
// - highscore: The lowest number of moves the user has completed the game in, loaded from
//   and saved to localStorage.

// 2. Initialization (createBoard & shuffle):
// ------------------------------------------
// - When the component first mounts or the game is reset, createBoard is called.
// - It takes the 10 unique image URLs from INITIAL_ICONS.
// - Each image is duplicated to create 2 Card objects, both sharing the same 'matchId'
//   (0 through 9). This is the key to matching.
// - The resulting 20 cards are then randomized using the standard Fisher-Yates (Knuth) shuffle algorithm.

// 3. Card Interaction (handleCardClick):
// -------------------------------------
// - This function is called when a card (<div>) is clicked.
// - It contains several guard clauses to block clicks:
//   - If isChecking is true (waiting for match result).
//   - If two cards are already in flippedCards.
//   - If the clicked card is already flipped or matched.
// - If the click is valid, it updates the 'cards' state to set the clicked card's 'isFlipped'
//   property to true (visually revealing the image).
// - It then adds the card's unique 'id' to the 'flippedCards' array.

// 4. Match Checking Logic (useEffect hook with flippedCards dependency):
// ----------------------------------------------------------------------
// - This effect runs *only* when the 'flippedCards' array changes.
// - If flippedCards.length becomes 2, the match process begins:
//   a. isChecking is set to true to block further clicks.
//   b. moves is incremented.
//   c. A 1200ms (1.2 second) setTimeout is initiated.
// - Inside the timeout, the two cards are compared using their 'matchId':
//   - IF they match (matchId is the same): Both cards' 'isMatched' and 'isFlipped' properties
//     are permanently set to true in the 'cards' state.
//   - IF they do NOT match: Both cards' 'isFlipped' property is reset to false, hiding them again.
// - Finally, 'flippedCards' is cleared, and 'isChecking' is set back to false, allowing the next turn.

// 5. Highscore Persistence (useEffect hooks):
// -------------------------------------------
// - The first useEffect loads the 'memoryGameHighscore' from localStorage on mount.
// - The second useEffect runs when isGameWon becomes true:
//   - It checks if the current 'moves' is better than the stored 'highscore' or if no highscore exists.
//   - If so, it updates both the highscore state and the value in localStorage.

// 6. Rendering (renderCard):
// --------------------------
// - This function determines what the card looks like based on its state:
//   - If 'isFlipped' or 'isMatched' is true (isVisible), it displays the <img> tag using card.icon (the URL).
//   - If not visible, it displays the cover '?' symbol.
//   - Tailwind classes are dynamically applied to change the background color (blue for cover,
//     light green for matched) and disable pointer events for matched cards.
*/
