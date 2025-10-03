import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameHeader from "../GameHeader";
import GameContainer from "../GameScreenOverlay";
import launchConfetti from "../Confetti";
import {
  PuzzleGameImages,
  PlaceholderImages,
} from "../../../assets/images/game/index";

const images = Object.values(PuzzleGameImages);

export default function DragDropPicturePuzzle() {
  const rows = 3;
  const cols = 3;
  const total = rows * cols;
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
    images[Math.floor(Math.random() * images.length)]
  );
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("puzzleHighScore");
    if (saved) setHighScore(parseInt(saved, 10));
    shuffleBoard(false, true); // shuffle but wait for Start Game
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

  // Prevent mobile scroll while dragging
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
  }, []);

  function shuffleBoard(startTimer = true, changeImage = false) {
    const shuffled: number[] = [...initial];

    // Fisher-Yates shuffle algorithm for a better, slightly longer shuffle
    let currentIndex = shuffled.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }

    // Ensure the shuffled board is not already solved
    if (isSolved(shuffled)) {
      // If it is solved, run the shuffle again
      shuffleBoard(startTimer, changeImage);
      return;
    }

    setBoard(shuffled);
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
      setTimerActive(false);
      // Changed timeout from 1000 to 500ms
      setTimeout(() => {
        setSolved(true);
        launchConfetti();
        if (!highScore || time < highScore) {
          setHighScore(time);
          localStorage.setItem("puzzleHighScore", String(time));
        }
      }, 1500);
    }
  }

  // --- Mouse Drag & Drop ---
  function onDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    e.preventDefault();
    handleSwap(targetIndex);
  }

  // --- Touch events ---
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
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="w-full p-2 m-auto mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <GameHeader
        title="Stunkie Puzzle"
        subtitle="Complete 'em!"
        stats={[
          { label: "Time", value: formatTime(time) },
          ...(highScore !== null
            ? [{ label: "Best", value: formatTime(highScore) }]
            : []),
        ]}
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
