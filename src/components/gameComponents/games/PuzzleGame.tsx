import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameHeader from "../GameHeader";
import GameContainer from "../GameScreenOverlay";
import launchConfetti from "../Confetti";
import {
  PuzzleGameImages,
  PlaceholderImages,
} from "../../../assets/images/game/index";
// Imports the utility function to submit scores to the Firebase RTDB.
import { updateHighScore } from "../../../utils/updateHighScore";

const images = Object.values(PuzzleGameImages);

// --- Props ---
type GameProps = {
  playerName: string;
};

export default function PuzzleGame({ playerName }: GameProps) {
  const rows = 3;
  const cols = 3;
  const total = rows * cols; // 'initial' is the solved board state (0, 1, 2, ... 8).
  const initial = useMemo(
    () => Array.from({ length: total }, (_, i) => i),
    [total]
  );

  const [board, setBoard] = useState<number[]>(initial);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    // Initial image selection. Assumes 'images' is populated immediately.
    images[Math.floor(Math.random() * images.length)]
  );
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Load local high score and shuffle board on mount
  useEffect(() => {
    // 1. Load local high score on mount
    const saved = localStorage.getItem("puzzleHighScore");
    if (saved) setHighScore(parseInt(saved, 10)); // 2. Call shuffleBoard only when the 'initial' array is stable (length > 0)

    // and the game hasn't started yet.
    if (initial.length > 0) {
      shuffleBoard(false, true); // Shuffle board but keep timer inactive
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]); // DEPENDENCY on 'initial' ensures safe access inside shuffleBoard // Timer loop (runs every 10ms when timerActive is true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => setTime((t) => t + 0.01), 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]); // Prevent mobile scroll while dragging

  useEffect(() => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    gameContainer.addEventListener("touchmove", preventScroll, {
      passive: false,
    });
    return () => {
      gameContainer.removeEventListener("touchmove", preventScroll);
    };
  }, []); // Shuffles the board and resets game state

  function shuffleBoard(startTimer = true, changeImage = false) {
    // This line is now safe because the calling useEffect ensures 'initial' is ready.
    const shuffled: number[] = [...initial]; // Fisher-Yates shuffle algorithm

    let currentIndex = shuffled.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    } // Check against the rare case that the shuffle resulted in the solved state

    if (isSolved(shuffled)) {
      shuffleBoard(startTimer, changeImage);
      return;
    }

    setBoard(shuffled);
    setTime(0);
    setSolved(false);

    // Robust check: Only pick a new image if the array is populated.
    if (changeImage && images.length > 0) {
      setImageUrl(images[Math.floor(Math.random() * images.length)]);
    }
    if (startTimer) {
      setTimerActive(true);
      setGameStarted(true);
    } else {
      setTimerActive(false);
      setGameStarted(false);
    }
  } // Checks if the current board configuration is solved

  function isSolved(b: number[] = board) {
    for (let i = 0; i < b.length; i++) if (b[i] !== i) return false;
    return true;
  } // Handles the tile swap action

  function handleSwap(targetIndex: number) {
    if (draggedIndex === null || !gameStarted || draggedIndex === targetIndex)
      return;

    const newBoard = [...board];
    [newBoard[draggedIndex], newBoard[targetIndex]] = [
      newBoard[targetIndex],
      newBoard[draggedIndex],
    ];

    setBoard(newBoard);
    setDraggedIndex(null);

    if (isSolved(newBoard)) {
      setTimerActive(false); // Stop the clock!
      setTimeout(() => {
        setSolved(true); // High Score Logic (Lower time is BETTER)
        if (!highScore || time < highScore) {
          // 1. Update local state and persistence
          setHighScore(time);
          localStorage.setItem("puzzleHighScore", String(time)); // 2. Submit to Firebase RTDB (playerName is guaranteed by props)

          updateHighScore("puzzle", playerName, time);
        }

        launchConfetti();
      }, 1500);
    }
  } // --- Mouse Drag & Drop Handlers ---

  function onDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    e.preventDefault();
    handleSwap(targetIndex);
  } // --- Touch events Handlers (for mobile) ---

  function onTouchStart(_e: React.TouchEvent<HTMLDivElement>, index: number) {
    if (!gameStarted) return;
    setDraggedIndex(index);
  }

  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (draggedIndex === null) return;
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    const puzzlePiece = targetElement?.closest("[data-index]");
    if (puzzlePiece) {
      const targetIndexStr = puzzlePiece.getAttribute("data-index");
      if (targetIndexStr) {
        const targetIndex = parseInt(targetIndexStr, 10);
        handleSwap(targetIndex);
        return;
      }
    }
    setDraggedIndex(null);
  } // Utility to format time display

  function formatTime(seconds: number) {
    return seconds.toFixed(1);
  }

  return (
    <div className="w-full p-2 m-auto mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <GameHeader
        title="Stunkie Puzzle"
        subtitle="Complete 'em!"
        stats={[
          { label: "Time", value: formatTime(time) }, // Display best time if it exists
          ...(highScore !== null
            ? [{ label: "Best", value: formatTime(highScore) }]
            : []),
        ]} // Resets board to shuffled state without starting timer
        onReset={() => shuffleBoard(false, true)}
      />

      <GameContainer
        gameStarted={gameStarted}
        gameOver={solved}
        startGame={() => shuffleBoard(true, false)}
        restartGame={() => shuffleBoard(true, true)}
        score={formatTime(time)}
        highScore={highScore !== null ? formatTime(highScore) : null}
        startText="Help Stunkies to be complete! "
        startImage={PlaceholderImages.puzzle_us}
        gameOverText="They are complete! ♥️">
        <div
          ref={gameContainerRef}
          className="relative flex justify-center w-full mx-auto aspect-square touch-none"
          onDragOver={(e) => e.preventDefault()}
          onTouchEnd={onTouchEnd}>
          <div
            className="grid w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: 2,
            }}>
            <AnimatePresence>
              {board.map((value, idx) => {
                const r = Math.floor(value / cols);
                const c = value % cols;
                const bgPosX = (c / (cols - 1)) * 100 || 0;
                const bgPosY = (r / (rows - 1)) * 100 || 0;
                const isBeingDragged = draggedIndex === idx;

                return (
                  <motion.div
                    key={value}
                    layout
                    data-index={idx}
                    className={`relative ${isBeingDragged ? "opacity-50" : ""}`}
                    style={{ cursor: gameStarted ? "grab" : "default" }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    }}>
                    <div
                      draggable={gameStarted}
                      onDragStart={(e) => onDragStart(e, idx)}
                      onDrop={(e) => onDrop(e, idx)}
                      onTouchStart={(e) => onTouchStart(e, idx)}
                      style={{
                        backgroundImage: `url('${imageUrl}')`,
                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%",
                        borderRadius: "15px",
                      }}
                      aria-hidden
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </GameContainer>
    </div>
  );
}
