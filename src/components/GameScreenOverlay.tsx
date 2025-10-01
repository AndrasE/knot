interface GameOverlayProps {
  gameStarted: boolean;
  gameOver: boolean;
  startGame: () => void;
  restartGame: () => void;
  score?: number;
  highScore?: number | null;
  startText?: string;
  gameOverText?: string;
  startImage?: string;
  startImageAlt?: string;
}

export default function GameOverlay({
  gameStarted,
  gameOver,
  startGame,
  restartGame,
  score,
  highScore,
  startText = "Help Stunkies to smooch! 🥰",
  gameOverText = "They smooched! ♥️",
  startImage,
  startImageAlt = "game-start",
}: GameOverlayProps) {
  return (
    <>
      {/* Start Screen */}
      {!gameStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f5f0e6]">
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
      )}

      {/* Game Over */}
      {gameStarted && gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-600/90">
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
  );
}
