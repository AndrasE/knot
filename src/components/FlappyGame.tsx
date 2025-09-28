import { useEffect, useState } from "react";
import flyer from "../assets/images/game/4.webp";
import obstacle from "../assets/images/game/10.webp";

export default function FlappyGame() {
  const [flyerY, setFlyerY] = useState(0); // Set dynamically after height calculation
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<{ x: number; gapY: number }[]>([]);
  const [score, setScore] = useState(0);
  const [flappyHighscore, setflappyHighscore] = useState(() => {
    return parseInt(localStorage.getItem("flappyflappyHighscore") || "0", 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameAreaWidth, setGameAreaWidth] = useState(360); // Initial width
  const [gameAreaHeight, setGameAreaHeight] = useState(420); // Initial height (6:7 ratio)

  const flyerX = 80;
  const flyerSize = 48;
  const obstacleWidth = 48;
  const gapHeight = 144;
  const capHeight = 48;
  const minObstacleSpacing = 200;
  const gravity = 0.4;
  const jumpStrength = -7;

  // Dynamic sizing
  useEffect(() => {
    const updateDimensions = () => {
      const navbarHeight = 60;
      const maxWidth = 360;
      const minWidth = 300;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight - navbarHeight;
      const calculatedWidth = Math.min(
        maxWidth,
        Math.max(minWidth, windowWidth * 0.9)
      );
      const calculatedHeight = calculatedWidth * (7 / 6); // Maintain 6:7 ratio

      // Ensure height fits within available viewport
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

  const restartGame = () => {
    setFlyerY(gameAreaHeight / 2); // Dynamic based on height
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (gameOver) {
      // Update high score when game ends
      if (score > flappyHighscore) {
        setflappyHighscore(score);
        localStorage.setItem("flappyflappyHighscore", score.toString());
      }
      return;
    }

    const handleJump = () => setVelocity(jumpStrength);
    const handleGlobalAction = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
      if (
        e instanceof KeyboardEvent &&
        (e.code === "Space" || e.code === "Enter")
      ) {
        handleJump();
      } else if (e instanceof MouseEvent || e instanceof TouchEvent) {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleGlobalAction);
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
            return [...prev, { x: gameAreaWidth, gapY }];
          }
        }
        return prev;
      });

      // 4. Collision detection & Scoring
      let didCollide = false;
      setObstacles((prev) => {
        prev.forEach((obs) => {
          // Horizontal overlap
          if (flyerX + flyerSize > obs.x && flyerX < obs.x + obstacleWidth) {
            // Vertical collision (top or bottom block)
            if (
              flyerY < obs.gapY ||
              flyerY + flyerSize > obs.gapY + gapHeight
            ) {
              didCollide = true;
            }
          }
          // Scoring
          if (obs.x + 5 === flyerX) {
            setScore((s) => s + 1);
          }
        });

        if (didCollide) setGameOver(true);
        return prev;
      });
    }, 30);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleGlobalAction);
      window.removeEventListener("click", handleGlobalAction);
      window.removeEventListener("touchstart", handleGlobalAction);
    };
  }, [
    flyerY,
    gameOver,
    jumpStrength,
    velocity,
    gameAreaWidth,
    gameAreaHeight,
    score,
    flappyHighscore,
  ]);

  const wingFlap = ""; // Kept as is per request

  return (
    <div className="flex flex-col items-center p-2 mb-20 border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <h1 className="text-2xl">Flappy Stunkie</h1>
      <p className="mb-2 text-gray-600">Smootch em!</p>
      <div
        className="relative mx-auto overflow-hidden border-b-8 border-green-800 rounded-lg shadow-2xl bg-sky-300 max-w-[360px] w-full"
        style={{ width: gameAreaWidth, height: gameAreaHeight }}>
        {/* Flyer */}
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
            className={`absolute -left-3.5 top-3/4 text-2xl transform -translate-y-1/2 -rotate-12 scale-x-[-1] transition-transform ${wingFlap}`}>
            🪽
          </div>
          {/* Right Wing */}
          <div
            className={`absolute -right-3.5 top-3/4 text-2xl transform -translate-y-1/2 rotate-12 transition-transform ${wingFlap}`}>
            🪽
          </div>
        </div>
        {/* Obstacles */}
        {obstacles.map((obs, i) => (
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
        {/* Score & Game Over */}
        <div className="absolute text-xl top-2 left-2">Score: {score}</div>
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-3xl text-white bg-black/70">
            <p className="mb-4 text-3xl">They smooched! ❤️</p>
            <p className="mt-2 text-xl">Final Score: {score}</p>
            <p className="mt-2 text-xl">High Score: {flappyHighscore}</p>
            <button
              onClick={restartGame}
              className="px-6 py-3 mt-6 text-base text-white transition duration-200 shadow-xl bg-stone-400 hover:bg-stone-500 rounded-xl active:scale-95">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
