import { useEffect, useState } from "react";
import flyer from "../assets/images/game/flappy/1.webp";
import obstacle from "../assets/images/game/flappy/2.webp";
import smooch from "../assets/images/game/flappy/smooch.webp";

export default function FlappyGame() {
  const [flyerY, setFlyerY] = useState(0); // Set dynamically after height calculation
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<
    { x: number; gapY: number; scored?: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0); // Track intended score for animation
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("flappyHighScore") || "0", 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Track if game has started
  const [gameAreaWidth, setGameAreaWidth] = useState(360); // Initial width
  const [gameAreaHeight, setGameAreaHeight] = useState(420); // Initial height (6:7 ratio)
  const [lastJumpTime, setLastJumpTime] = useState(0); // For debouncing touch events
  const [lastScoreTime, setLastScoreTime] = useState(0); // For debouncing scoring

  const flyerX = 80;
  const flyerSize = 48;
  const obstacleWidth = 48;
  const gapHeight = 144;
  const capHeight = 48;
  const minObstacleSpacing = 200;
  const gravity = 0.5;
  const jumpStrength = -7;

  // Dynamic sizing
  useEffect(() => {
    const updateDimensions = () => {
      const navbarHeight = 60;
      const maxGameContentWidth = 360; // Max ideal width of the *game canvas* itself
      const minGameContentWidth = 300;
      const safetyBuffer = 48; // A buffer (e.g., 24px on each side) for parent/child padding and borders
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight - navbarHeight; // 1. Calculate the available width for the content, subtracting the safety margin.
      const availableWidth = Math.max(
        minGameContentWidth,
        windowWidth - safetyBuffer
      ); // 2. Determine the width of the game area, capping it at the ideal maximum.
      const calculatedWidth = Math.min(maxGameContentWidth, availableWidth); // 3. Calculate height based on the chosen width (maintaining 6:7 ratio)
      const calculatedHeight = calculatedWidth * (7 / 6); // 4. Final size adjustments // Ensure height fits within available viewport

      const finalHeight = Math.min(calculatedHeight, windowHeight * 0.9);
      const finalWidth = finalHeight * (6 / 7); // Adjust width to maintain ratio

      setGameAreaWidth(finalWidth);
      setGameAreaHeight(finalHeight);
      setFlyerY(finalHeight / 2); // Center flyer vertically
    };

    updateDimensions(); // Initial calculation
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Score animation effect
  useEffect(() => {
    if (score >= targetScore) return;

    const increment = Math.ceil((targetScore - score) / 10); // Increment ~2 points per step
    const interval = setInterval(() => {
      setScore((prev) => {
        const next = prev + increment;
        if (next >= targetScore) {
          clearInterval(interval);
          return targetScore;
        }
        return next;
      });
    }, 30); // 10 steps over ~300ms

    return () => clearInterval(interval);
  }, [score, targetScore]);

  const startGame = () => {
    setGameStarted(true);
    setFlyerY(gameAreaHeight / 2);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setTargetScore(0);
    setGameOver(false);
    setLastScoreTime(0);
  };

  const restartGame = () => {
    setGameStarted(false); // Return to start screen
    setFlyerY(gameAreaHeight / 2);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setTargetScore(0);
    setGameOver(false);
    setLastScoreTime(0);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) {
      // Update high score when game ends
      if (gameOver && score > highScore) {
        setHighScore(score);
        localStorage.setItem("flappyHighScore", score.toString());
      }
      return;
    }

    const handleJump = () => {
      const now = Date.now();
      if (now - lastJumpTime > 200) {
        // Debounce: 200ms cooldown
        setVelocity(jumpStrength);
        setLastJumpTime(now);
      }
    };

    const handleGlobalAction = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent || e instanceof TouchEvent) {
        handleJump();
      }
    };

    window.addEventListener("click", handleGlobalAction);
    window.addEventListener("touchstart", handleGlobalAction); // For mobile

    const gameLoop = setInterval(() => {
      // 1. Flyer physics
      setFlyerY((prev) => {
        const next = prev + velocity;
        if (next < 0) return 0; // top boundary
        if (next > gameAreaHeight - flyerSize) {
          setGameOver(true); // hit ground
          return gameAreaHeight - flyerSize;
        }
        return next;
      });
      setVelocity((v) => v + gravity);

      // 2. Move & filter obstacles
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, x: obs.x - 5 }))
          .filter((obs) => obs.x + obstacleWidth > 0)
      );

      // 3. Spawn new obstacle
      setObstacles((prev) => {
        const lastObstacle = prev[prev.length - 1];
        if (
          !lastObstacle ||
          lastObstacle.x < gameAreaWidth - minObstacleSpacing
        ) {
          if (Math.random() < 0.1) {
            // GapY determines the bottom edge of the top pipe
            const gapY =
              50 + Math.random() * (gameAreaHeight - gapHeight - 100);
            return [...prev, { x: gameAreaWidth, gapY, scored: false }];
          }
        }
        return prev;
      });

      // 4. Collision detection & Scoring
      let didCollide = false;
      setObstacles((prev) => {
        const now = Date.now();
        const newObstacles = prev.map((obs) => ({ ...obs }));
        newObstacles.forEach((obs) => {
          // Horizontal overlap for collision
          if (flyerX + flyerSize > obs.x && flyerX < obs.x + obstacleWidth) {
            // Vertical collision (top or bottom block)
            if (
              flyerY < obs.gapY ||
              flyerY + flyerSize > obs.gapY + gapHeight
            ) {
              didCollide = true;
            }
          }
          // Scoring: Trigger when obstacle's right edge passes flyer's left edge
          if (
            !obs.scored &&
            obs.x + obstacleWidth >= flyerX - 5 &&
            obs.x + obstacleWidth <= flyerX &&
            now - lastScoreTime > 500 // Debounce scoring: 500ms cooldown
          ) {
            setTargetScore((s) => s + 10);
            obs.scored = true; // Prevent multiple scoring
            setLastScoreTime(now);
          }
        });

        if (didCollide) setGameOver(true);
        return newObstacles;
      });
    }, 30);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("click", handleGlobalAction);
      window.removeEventListener("touchstart", handleGlobalAction);
    };
  }, [
    flyerY,
    gameOver,
    gameStarted,
    jumpStrength,
    velocity,
    gameAreaWidth,
    gameAreaHeight,
    score,
    highScore,
    lastJumpTime,
    lastScoreTime,
  ]);

  return (
    <div className="flex flex-col items-center p-0 mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <header className="mb-4 text-center">
        <h1 className="pt-2 text-2xl">Flappy Stunkie</h1>
        <p className="mb-2 text-gray-600">Smootch 'em!</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-2 text-indigo-800 bg-indigo-100 rounded-lg shadow-sm">
            Score: <span>{score}</span>
          </div>
          <div className="px-4 py-2 text-yellow-800 bg-yellow-100 rounded-lg shadow-sm">
            Best: <span>{highScore}</span>
          </div>
          <button
            onClick={restartGame}
            className="px-4 py-2 text-white transition duration-200 bg-red-400 rounded-lg shadow-sm active:scale-95">
            Reset
          </button>
        </div>
      </header>
      <div
        className="relative mx-auto overflow-hidden border-b-8 border-green-800 rounded-lg shadow-2xl bg-sky-300 max-w-[360px] w-full"
        style={{ width: gameAreaWidth, height: gameAreaHeight }}>
        {/* Flyer */}
        {gameStarted && (
          <div
            className={`absolute transition-transform duration-100 ease-linear ${
              gameOver ? "opacity-50" : ""
            }`}
            style={{
              left: flyerX,
              top: flyerY,
              width: flyerSize,
              height: flyerSize,
              transform: `rotate(${Math.min(90, velocity * 5)}deg)`,
            }}>
            <img
              src={flyer}
              alt="flyer"
              className="object-cover w-full h-full rounded-xl"
            />
            {/* Left Wing */}
            <div
              className={`absolute -left-4 top-3/4 text-2xl transform -translate-y-1/2 -rotate-12 scale-x-[-1] transition-transform `}>
              🪽
            </div>
            {/* Right Wing */}
            <div
              className={`absolute -right-4 top-3/4 text-2xl transform -translate-y-1/2 rotate-12 transition-transform `}>
              🪽
            </div>
          </div>
        )}
        {/* Obstacles */}
        {gameStarted &&
          obstacles.map((obs, i) => (
            <div key={i} className="absolute" style={{ left: obs.x }}>
              {/* Top block (Pipe body) */}
              <div
                className="relative bg-green-500 shadow-inner rounded-b-xl"
                style={{ width: obstacleWidth, height: obs.gapY }}>
                <img
                  src={obstacle}
                  alt="obstacle-head-top"
                  className="absolute bottom-0 object-cover w-full transform rotate-180 rounded-xl"
                  style={{ height: `${capHeight}px` }}
                />
              </div>
              {/* Bottom block (Pipe body) */}
              <div
                className="relative bg-green-500 shadow-inner rounded-t-xl"
                style={{
                  width: obstacleWidth,
                  height: gameAreaHeight - (obs.gapY + gapHeight),
                  marginTop: gapHeight,
                }}>
                <img
                  src={obstacle}
                  alt="obstacle-head-bottom"
                  className="absolute top-0 object-cover w-full rounded-xl"
                  style={{ height: `${capHeight}px` }}
                />
              </div>
            </div>
          ))}
        {/* Start Screen */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-3xl text-white bg-black/50">
            {" "}
            <p className="mb-2 text-xl">Help Stunkies get a smooch! 🥰</p>
            <img src={smooch} alt="smooch" className="mb-4 w-60 rounded-2xl" />
            <button
              onClick={startGame}
              className="px-4 py-2 text-base text-white transition duration-200 rounded-md shadow-xl bg-stone-400 hover:bg-stone-500 active:scale-95">
              Start Game{" "}
            </button>{" "}
          </div>
        )}
        {/* Game Over */}
        {gameStarted && gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-3xl text-white bg-black/70">
            <p className="mb-4 text-2xl">They smooched! ❤️</p>
            <p className="mt-2 text-xl">Final Score: {score}</p>
            <p className="mt-2 text-xl">High Score: {highScore}</p>
            <button
              onClick={startGame}
              className="px-4 py-2 mt-6 text-base text-white transition duration-200 rounded-md shadow-xl bg-stone-400 hover:bg-stone-500 active:scale-95">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
