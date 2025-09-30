import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const images = [
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1600&auto=format&fit=crop",
];

export default function DragDropPicturePuzzle() {
  const rows = 3;
  const cols = 3;
  const total = rows * cols;
  const initial = useMemo(
    () => Array.from({ length: total }, (_, i) => i),
    [total]
  );
  const [board, setBoard] = useState<number[]>(initial);
  const [moves, setMoves] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    images[Math.floor(Math.random() * images.length)]
  );

  useEffect(() => {
    const saved = localStorage.getItem("puzzleHighScore");
    if (saved) setHighScore(parseInt(saved, 10));
    shuffleBoard(false, true); // shuffle but wait for Start Game, pick new image only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  function shuffleBoard(startTimer = true, changeImage = false) {
    let shuffled: number[] = [];
    do {
      shuffled = [...initial].sort(() => Math.random() - 0.5);
    } while (isSolved(shuffled)); // ensure it's not already solved

    setBoard(shuffled);
    setMoves(0);
    setTime(0);
    setSolved(false);

    if (changeImage) {
      setImageUrl(images[Math.floor(Math.random() * images.length)]);
    }
    if (startTimer) {
      setTimerActive(true);
      setGameStarted(true);
    } else {
      setTimerActive(false);
      setGameStarted(false);
    }
  }

  function isSolved(b: number[] = board) {
    for (let i = 0; i < b.length; i++) if (b[i] !== i) return false;
    return true;
  }

  const containerSize = 480;
  const tileWidth = containerSize / cols;
  const tileHeight = containerSize / rows;

  // Shared logic for swapping pieces, used by both mouse drag-drop and touch events
  function handleSwap(targetIndex: number) {
    if (draggedIndex === null || !gameStarted || draggedIndex === targetIndex)
      return;

    const newBoard = [...board];
    [newBoard[draggedIndex], newBoard[targetIndex]] = [
      newBoard[targetIndex],
      newBoard[draggedIndex],
    ];

    setBoard(newBoard);
    setMoves((m) => m + 1);
    setDraggedIndex(null); // Reset after swap

    if (isSolved(newBoard)) {
      setTimerActive(false);
      setTimeout(() => {
        setSolved(true);
        launchConfetti();
        if (!highScore || time < highScore) {
          setHighScore(time);
          localStorage.setItem("puzzleHighScore", String(time));
        }
      }, 300);
    }
  }

  // --- Mouse Drag-and-Drop Handlers ---
  function onDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    e.preventDefault();
    handleSwap(targetIndex);
  }

  // --- Mobile Touch Handlers ---
  function onTouchStart(_e: React.TouchEvent<HTMLDivElement>, index: number) {
    if (!gameStarted) return;
    setDraggedIndex(index);
  }

  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (draggedIndex === null) return;

    // Find the element where the touch ended
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    // Find the closest parent element that is a puzzle piece (has a data-index)
    const puzzlePiece = targetElement?.closest("[data-index]");
    if (puzzlePiece) {
      const targetIndexStr = puzzlePiece.getAttribute("data-index");
      if (targetIndexStr) {
        const targetIndex = parseInt(targetIndexStr, 10);
        handleSwap(targetIndex);
        return;
      }
    }

    // If the touch ends outside a valid piece, just reset the dragged state
    setDraggedIndex(null);
  }

  function launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-semibold">Drag & Drop Puzzle (3x3)</h2>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          className="px-3 py-1 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
          onClick={() => shuffleBoard(false, true)}>
          Reset
        </button>
        <div className="min-w-[80px]">
          Moves: <strong>{moves}</strong>
        </div>
        <div className="min-w-[80px]">
          Time: <strong>{formatTime(time)}</strong>
        </div>
        {highScore !== null && (
          <div className="min-w-[90px]">
            Best: <strong>{formatTime(highScore)}</strong>
          </div>
        )}
      </div>

      <div
        className="relative mt-4"
        style={{ width: containerSize, height: containerSize }}
        onDragOver={(e) => e.preventDefault()}
        onTouchEnd={onTouchEnd}
        onTouchMove={(e) => e.preventDefault()} // Prevents scrolling on mobile
      >
        <div
          style={{
            width: containerSize,
            height: containerSize,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: 2,
            filter: gameStarted ? "none" : "blur(6px)",
            pointerEvents: gameStarted ? "auto" : "none",
            backgroundColor: "#334155",
            borderRadius: "8px",
            padding: "2px",
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
                  data-index={idx} // Added data-index to identify pieces for touch events
                  className={`relative rounded-md ${
                    isBeingDragged ? "opacity-50" : ""
                  }`}
                  style={{
                    width: tileWidth,
                    height: tileHeight,
                    cursor: gameStarted ? "grab" : "default",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                  <div
                    draggable={gameStarted}
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDrop={(e) => onDrop(e, idx)}
                    onTouchStart={(e) => onTouchStart(e, idx)}
                    style={{
                      backgroundImage: `url('${imageUrl}')`,
                      backgroundSize: `${cols * 100}% ${rows * 100}%`,
                      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                      width: "100%",
                      height: "100%",
                      borderRadius: "6px",
                    }}
                    aria-hidden
                  />
                  <span className="absolute px-1 py-0.5 text-xs rounded-sm bottom-1 right-1 text-white/90 bg-black/40 drop-shadow-sm">
                    {value + 1}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="px-6 py-3 text-lg font-bold text-white transition-transform transform bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:scale-105"
              onClick={() => {
                setGameStarted(true);
                setTimerActive(true);
              }}>
              Start Game
            </button>
          </div>
        )}

        {solved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="p-6 text-center bg-white rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold">🎉 Puzzle Solved!</h3>
              <p className="mt-2">
                Moves: <strong>{moves}</strong>
              </p>
              <p>
                Time: <strong>{formatTime(time)}</strong>
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                  onClick={() => shuffleBoard(true, true)}>
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
