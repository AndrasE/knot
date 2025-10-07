import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameScreenOverlayProps {
  children: React.ReactNode;
  gameStarted: boolean;
  gameOver: boolean;
  startGame: () => void;
  restartGame: () => void;
  score?: number | string;
  highScore?: number | string | null;
  startText?: string;
  gameOverText?: string;
  startImage?: string;
  startImageAlt?: string;
}

export default function GameScreenOverlay({
  children,
  gameStarted,
  gameOver,
  startGame,
  restartGame,
  score,
  highScore,
  startText,
  gameOverText,
  startImage,
  startImageAlt = "cute stunkie couple", // playerName is intentionally omitted from destructuring if not used
}: GameScreenOverlayProps) {
  // 1. New state to track if this is the very first render
  const [hasMounted, setHasMounted] = useState(false);

  // 2. Set hasMounted to true after the first render cycle
  useEffect(() => {
    // We don't need the timeout anymore, just mark as mounted immediately.
    setHasMounted(true);
  }, []);

  // Determine the 'initial' prop value dynamically
  // If it's the first mount, initial should be 'false' (Framer Motion syntax for no initial state)
  // If it's a subsequent render (e.g., game restart), initial should be { opacity: 0 }
  const startScreenInitial = hasMounted ? { opacity: 0 } : false;

  return (
    <div className="relative w-full p-2 mx-auto mt-5 overflow-hidden">
      {/* Game grid */}
      {children}
      {/* START SCREEN */}{" "}
      <AnimatePresence>
        {!gameStarted && !gameOver && (
          <motion.div
            key="start-screen"
            // 3. Use the dynamic initial prop here
            initial={startScreenInitial}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 pb-3 bg-[#f5f0e6]">
            {/* The inner elements still need their own animations, but we can simplify the first one */}
            <motion.p
              // If the main container skips the initial animation, the child animation will still run.
              // We can conditionally skip these inner animations too, or rely on the main container's fix.
              // Sticking to the main container fix for simplicity:
              initial={hasMounted ? { opacity: 0, y: 15 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="mb-0 text-xl text-stone-700">
              {startText}{" "}
            </motion.p>
            {startImage && (
              <motion.img
                src={startImage}
                alt={startImageAlt}
                fetchPriority="high"
                initial={hasMounted ? { scale: 0.9, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="object-cover mb-3 shadow-md w-65 h-50 rounded-2xl"
              />
            )}
            <motion.button
              onClick={startGame}
              initial={hasMounted ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="px-5 py-2 text-xl text-green-900 transition duration-200 bg-green-300 rounded-md shadow-lg cursor-pointer hover:bg-green-400 active:scale-95">
              Start Game
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* GAME OVER SCREEN */}{" "}
      <AnimatePresence>
        {gameOver && (
          // We don't need the 'hasMounted' logic for game over,
          // as we always want that animation to run when gameOver changes to true.
          <motion.div
            key="game-over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#f5f0e6]/85">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-8 text-center bg-[#f5f0e6]/95 shadow-2xl rounded-xl">
              <h2 className="mt-1 mb-4 text-2xl font-semibold text-stone-800 animate-bounce">
                {gameOverText}{" "}
              </h2>

              {score !== undefined && (
                <p className="mb-3 text-xl text-stone-700">
                  🎯 Final Score: {score}{" "}
                </p>
              )}

              {highScore !== null && highScore !== undefined && (
                <p className="mb-6 text-xl text-stone-700">
                  🏆 Best Score: {highScore}{" "}
                </p>
              )}

              <motion.button
                onClick={restartGame}
                transition={{ duration: 0.2 }}
                className="px-5 py-2 text-xl text-green-900 transition duration-200 bg-green-300 shadow-xl cursor-pointer rounded-xl hover:bg-green-400 active:scale-95 ">
                Restart Game
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
