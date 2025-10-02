import { useEffect, useState } from "react";
import flyer from "../assets/images/game/flappy/1.webp";
import obstacle from "../assets/images/game/flappy/2.webp";
import smooch from "../assets/images/game/flappy/smooch.webp";
import GameHeader from "./GameHeader";
import GameContainer from "./GameScreenOverlay";

export default function FlappyGame() {
  const [flyerY, setFlyerY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<
    { x: number; gapY: number; scored?: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("flappyHighScore") || "0", 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAreaWidth, setGameAreaWidth] = useState(360);
  const [gameAreaHeight, setGameAreaHeight] = useState(420);
  const [lastJumpTime, setLastJumpTime] = useState(0);
  const [lastScoreTime, setLastScoreTime] = useState(0);

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
      const minGameContentWidth = 300;
      const safetyBuffer = 16;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight - navbarHeight;

      const useSquare = windowWidth >= 1024; // lg breakpoint
      const maxGameContentWidth = useSquare ? 580 : 480; // ✅ larger on desktop

      const availableWidth = Math.max(
        minGameContentWidth,
        windowWidth - safetyBuffer
      );
      const calculatedWidth = Math.min(maxGameContentWidth, availableWidth);

      const calculatedHeight = useSquare
        ? calculatedWidth // 1:1 aspect
        : calculatedWidth * (7 / 6); // default aspect

      const finalHeight = Math.min(calculatedHeight, windowHeight * 0.9);
      const finalWidth = useSquare ? finalHeight : finalHeight * (6 / 7);

      setGameAreaWidth(finalWidth);
      setGameAreaHeight(finalHeight);
      setFlyerY(finalHeight / 2);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Score animation
  useEffect(() => {
    if (score >= targetScore) return;

    const increment = Math.ceil((targetScore - score) / 10);
    const interval = setInterval(() => {
      setScore((prev) => {
        const next = prev + increment;
        if (next >= targetScore) {
          clearInterval(interval);
          return targetScore;
        }
        return next;
      });
    }, 30);

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
    setGameStarted(false);
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
      if (gameOver && score > highScore) {
        setHighScore(score);
        localStorage.setItem("flappyHighScore", score.toString());
      }
      return;
    }

    const handleJump = () => {
      const now = Date.now();
      if (now - lastJumpTime > 200) {
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
    window.addEventListener("touchstart", handleGlobalAction);

    const gameLoop = setInterval(() => {
      // Flyer physics
      setFlyerY((prev) => {
        const next = prev + velocity;
        if (next < 0) return 0;
        if (next > gameAreaHeight - flyerSize) {
          setGameOver(true);
          return gameAreaHeight - flyerSize;
        }
        return next;
      });
      setVelocity((v) => v + gravity);

      // Move & filter obstacles
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, x: obs.x - 5 }))
          .filter((obs) => obs.x + obstacleWidth > 0)
      );

      // Spawn obstacle
      setObstacles((prev) => {
        const lastObstacle = prev[prev.length - 1];
        if (
          !lastObstacle ||
          lastObstacle.x < gameAreaWidth - minObstacleSpacing
        ) {
          if (Math.random() < 0.1) {
            const gapY =
              50 + Math.random() * (gameAreaHeight - gapHeight - 100);
            return [...prev, { x: gameAreaWidth, gapY, scored: false }];
          }
        }
        return prev;
      });

      // Collision + scoring
      let didCollide = false;
      setObstacles((prev) => {
        const now = Date.now();
        const newObstacles = prev.map((obs) => ({ ...obs }));
        newObstacles.forEach((obs) => {
          if (flyerX + flyerSize > obs.x && flyerX < obs.x + obstacleWidth) {
            if (
              flyerY < obs.gapY ||
              flyerY + flyerSize > obs.gapY + gapHeight
            ) {
              didCollide = true;
            }
          }
          if (
            !obs.scored &&
            obs.x + obstacleWidth >= flyerX - 5 &&
            obs.x + obstacleWidth <= flyerX &&
            now - lastScoreTime > 500
          ) {
            setTargetScore((s) => s + 10);
            obs.scored = true;
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
    <div className="w-full max-w-xl p-2 m-auto mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      {" "}
      <GameHeader
        title="Flappy Stunkie"
        subtitle="Smootch 'em!"
        stats={[
          { label: "Score", value: score },
          { label: "Best", value: highScore },
        ]}
        onReset={restartGame}
      />
      {/* CORRECTION: The GameContainer is now correctly used as a single wrapper 
        for the game elements.
      */}{" "}
      <GameContainer
        gameStarted={gameStarted}
        gameOver={gameOver}
        startGame={startGame}
        restartGame={restartGame}
        score={score}
        highScore={highScore}
        startText="Help Stunkies to smooch! 🥰"
        gameOverText="They smooched! ♥️"
        startImage={smooch}>
        {" "}
        <div className="flex justify-center mt-5 sm:mt-10 ">
          {" "}
          <div
            className="relative overflow-hidden rounded-2xl bg-sky-300"
            style={{ width: gameAreaWidth, height: gameAreaHeight }}>
            {" "}
            <div className="absolute bottom-0 w-full h-2 bg-green-600"></div>
            {/* Flyer */}{" "}
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
                {" "}
                <img
                  src={flyer}
                  alt="flyer"
                  className="object-cover w-full h-full rounded-xl"
                />
                {/* Wings */}{" "}
                <div className="absolute -left-4 top-3/4 text-2xl -translate-y-1/2 -rotate-12 scale-x-[-1]">
                  🪽{" "}
                </div>{" "}
                <div className="absolute text-2xl -translate-y-1/2 -right-4 top-3/4 rotate-12">
                  🪽{" "}
                </div>{" "}
              </div>
            )}
            {/* Obstacles */}{" "}
            {gameStarted &&
              obstacles.map((obs, i) => (
                <div key={i} className="absolute" style={{ left: obs.x }}>
                  {" "}
                  <div
                    className="relative bg-green-500 border-green-600 shadow-inner border-x-3 rounded-b-xl"
                    style={{ width: obstacleWidth, height: obs.gapY }}>
                    {" "}
                    <img
                      src={obstacle}
                      alt="obstacle-head-top"
                      className="absolute bottom-0 object-cover w-full transform rotate-180 rounded-xl"
                      style={{ height: `${capHeight}px` }}
                    />{" "}
                  </div>{" "}
                  <div
                    className="relative bg-green-500 border-green-600 shadow-inner border-x-3 rounded-t-xl"
                    style={{
                      width: obstacleWidth,
                      height: gameAreaHeight - (obs.gapY + gapHeight),
                      marginTop: gapHeight,
                    }}>
                    {" "}
                    <img
                      src={obstacle}
                      alt="obstacle-head-bottom"
                      className="absolute top-0 object-cover w-full rounded-xl"
                      style={{ height: `${capHeight}px` }}
                    />{" "}
                  </div>{" "}
                </div>
              ))}{" "}
          </div>{" "}
        </div>{" "}
      </GameContainer>{" "}
    </div>
  );
}
