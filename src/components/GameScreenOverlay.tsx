import React from "react";

// The props are mostly the same, but we add `children`
interface GameScreenOverlayProps {
  children: React.ReactNode; // To accept the actual game component
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
  children, // The game grid/area will be passed here
  gameStarted,
  gameOver,
  startGame,
  restartGame,
  score,
  highScore,
  startText,
  gameOverText,
  startImage,
  startImageAlt = "game-start",
}: GameScreenOverlayProps) {
  return (
    // This is the main wrapper with all the container styling
    <div className="relative w-full max-w-xl p-2 mx-auto mt-5 overflow-hidden ">
      {/* Conditionally render the content */}
      {!gameStarted ? (
        // --- Start Screen ---
        <div className="flex flex-col items-center justify-center gap-3 bg-[#f5f0e6]">
          <p className="mb-2 text-xl">{startText}</p>
          {startImage && (
            <img
              src={startImage}
              alt={startImageAlt}
              className="mb-5 w-60 rounded-2xl"
            />
          )}
          <button
            onClick={startGame}
            className="px-4 py-2 text-xl text-white transition duration-200 rounded-md shadow-md bg-stone-400 hover:bg-stone-500 active:scale-95">
            Start Game
          </button>
        </div>
      ) : (
        // --- Game Content and Game Over Screen ---
        <>
          {/* Render the actual game that was passed in as children */}
          {children}

          {/* The Game Over screen can remain an absolute overlay, as it appears on top of the finished game */}
          {gameOver && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#f5f0e6]/75">
              <div className="p-8 text-center bg-[#f5f0e6] shadow-2xl rounded-xl">
                <h2 className="mt-1 mb-4 text-2xl animate-bounce">
                  {gameOverText}
                </h2>
                {score !== undefined && (
                  <p className="mb-3 text-xl">🎯 Final Score: {score}</p>
                )}
                {highScore !== null && highScore !== undefined && (
                  <p className="mb-6 text-xl">🏆 Best Score: {highScore}</p>
                )}
                <button
                  onClick={restartGame}
                  className="px-4 py-2 text-xl text-white transition duration-200 shadow-xl bg-stone-500 hover:bg-stone-600 rounded-xl active:scale-95">
                  Restart Game
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
