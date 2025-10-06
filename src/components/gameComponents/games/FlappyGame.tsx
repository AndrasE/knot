import { useEffect, useState } from "react";
import GameHeader from "../GameHeader";
import GameScreenOverlay from "../GameScreenOverlay";
import launchConfetti from "../Confetti";
import {
  FlappyGameImages,
  PlaceholderImages,
} from "../../../assets/images/game/index";
// Imports the utility function to handle score comparison and submission to Firebase RTDB.
import { updateHighScore } from "../../../utils/updateHighScore";

// --- Props ---
type GameProps = {
  // Player name is used as the unique identifier for saving scores in the database.
  playerName: string;
};

export default function FlappyGame({ playerName }: GameProps) {
  const [flyerY, setFlyerY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<
    { x: number; gapY: number; scored?: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0); // Initializes the local high score from the browser's localStorage.
  const [highScore, setHighScore] = useState<number | null>(() => {
    const saved = localStorage.getItem("flappyHighScore");

    if (saved) {
      // If the score exists, return the parsed number.
      // Use parseFloat or Number() if the score might be a decimal (like time).
      return parseInt(saved, 10);
    } // If the score does not exist, return null.

    return null;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAreaWidth, setGameAreaWidth] = useState(450);
  const [gameAreaHeight, setGameAreaHeight] = useState(450);
  const [lastJumpTime, setLastJumpTime] = useState(0);
  const [lastScoreTime, setLastScoreTime] = useState(0);
  const [isFlapping, setIsFlapping] = useState(false);

  const flyerX = 80;
  const flyerSize = 48;
  const obstacleWidth = 48;
  const gapHeight = 144;
  const capHeight = 48;
  const minObstacleSpacing = 200;
  const gravity = 0.5;
  const jumpStrength = -7; // Dynamic sizing

  useEffect(() => {
    const updateDimensions = () => {
      const minGameContentWidth = 300;
      const safetyBuffer = 16;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const maxGameContentSize = windowHeight >= 1024 ? 580 : 440;

      const availableWidth = Math.max(
        minGameContentWidth,
        windowWidth - safetyBuffer
      );

      const calculatedSize = Math.min(maxGameContentSize, availableWidth);

      const finalSize = Math.min(calculatedSize, windowHeight * 0.9);

      setGameAreaWidth(finalSize);
      setGameAreaHeight(finalSize);

      setFlyerY(finalSize / 2);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []); // Score animation

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
  }, [score, targetScore]); // Reset game state for a new start

  const startGame = () => {
    setGameStarted(true);
    setFlyerY(gameAreaHeight / 2);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setTargetScore(0);
    setGameOver(false);
    setLastScoreTime(0);
  }; // Prepare for a new game

  const restartGame = () => {
    setGameStarted(false);
    setFlyerY(gameAreaHeight / 2);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setTargetScore(0);
    setGameOver(false);
    setLastScoreTime(0);
  }; // Main Game Loop, Collision Detection, and High Score Submission

  useEffect(() => {
    // This block runs when the component mounts, or when the game state changes
    if (!gameStarted || gameOver) {
      // This 'if' block executes only once when the 'gameOver' state transitions to true.
      if (gameOver) {
        // 1. RTDB HIGH SCORE SUBMISSION
        // Call the utility function with the game ID, player name, and the final score.
        // The utility function will READ the current RTDB high score and WRITE the new score
        // ONLY if the new score is higher.
        updateHighScore("flappy", playerName, score); // 2. LOCAL HIGH SCORE UPDATE // This updates the score displayed in the UI and stored in localStorage.

        if (score > (highScore ?? -1)) {
          // Use nullish coalescing for safety in comparison
          setHighScore(score);
          localStorage.setItem("flappyHighScore", score.toString());
        }

        launchConfetti(); // Celebrate the end of the game
      }

      return; // Stop the effect if the game isn't running
    } // ... (Game ongoing logic - jump handlers)

    const handleJump = () => {
      const now = Date.now();
      if (now - lastJumpTime > 200) {
        setVelocity(jumpStrength);
        setLastJumpTime(now); // Trigger animation

        setIsFlapping(true);
        setTimeout(() => setIsFlapping(false), 150);
      }
    };

    const handleGlobalAction = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent || e instanceof TouchEvent) {
        handleJump();
      }
    };

    window.addEventListener("click", handleGlobalAction);
    window.addEventListener("touchstart", handleGlobalAction); // Game tick (physics and movement)

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
      setVelocity((v) => v + gravity); // Move & filter obstacles

      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, x: obs.x - 5 }))
          .filter((obs) => obs.x + obstacleWidth > 0)
      ); // Spawn obstacle

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
      }); // Collision + scoring

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
    }, 30); // Cleanup function: clears the interval and removes event listeners when the effect stops

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("click", handleGlobalAction);
      window.removeEventListener("touchstart", handleGlobalAction);
    };
  }, [
    // Dependencies ensure the effect has access to the latest values for calculations and cleanup.
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
    playerName,
  ]);

  return (
    <div className="w-full p-2 m-auto mx-auto border shadow-xl sm:p-3 md:p-4 xl:p-5 rounded-2xl border-stone-500">
      <GameHeader
        title="Stunkie Flaps"
        subtitle="Smootch 'em!"
        stats={[
          { label: "Score", value: score }, // Apply the conditional spread logic here to only include 'Best' if highScore is a number
          ...(highScore !== null ? [{ label: "Best", value: highScore }] : []),
        ]}
        onReset={restartGame}
      />
      <GameScreenOverlay
        gameStarted={gameStarted}
        gameOver={gameOver}
        startGame={startGame}
        restartGame={startGame}
        score={score}
        highScore={highScore}
        startText="Help Stunkies to smooch! "
        gameOverText="They smooched! ♥️"
        startImage={PlaceholderImages.flappy_us}>
        <div className="flex justify-center ">
          <div
            className="relative overflow-hidden rounded-2xl bg-sky-300"
            style={{ width: gameAreaWidth, height: gameAreaHeight }}>
            <div className="absolute bottom-0 w-full h-2 bg-green-600"></div>
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
                  src={FlappyGameImages.flyer}
                  alt="flyer"
                  className="object-cover w-full h-full rounded-xl"
                />
                {/* Wing Animation */}
                <div
                  className={`absolute -left-4 top-3/4 text-2xl -translate-y-1/2 scale-x-[-1] transition-transform duration-150 ${
                    isFlapping ? "-rotate-45" : "-rotate-10"
                  }`}>
                  🪽
                </div>
                <div
                  className={`absolute text-2xl -translate-y-1/2 -right-4 top-3/4 transition-transform duration-150 ${
                    isFlapping ? "rotate-45" : "rotate-10"
                  }`}>
                  🪽
                </div>
              </div>
            )}
            {/* Obstacles */}
            {gameStarted &&
              obstacles.map((obs, i) => (
                <div key={i} className="absolute" style={{ left: obs.x }}>
                  <div
                    className="relative bg-green-500 border-green-600 shadow-inner border-x-3 rounded-b-md"
                    style={{ width: obstacleWidth, height: obs.gapY }}>
                    <img
                      src={FlappyGameImages.obstacle}
                      alt="obstacle-head-top"
                      className="absolute bottom-0 object-cover w-full transform rotate-180 rounded-md"
                      style={{ height: `${capHeight}px` }}
                    />
                  </div>
                  <div
                    className="relative bg-green-500 border-green-600 shadow-inner border-x-3 rounded-t-md"
                    style={{
                      width: obstacleWidth,
                      height: gameAreaHeight - (obs.gapY + gapHeight),
                      marginTop: gapHeight,
                    }}>
                    <img
                      src={FlappyGameImages.obstacle}
                      alt="obstacle-head-bottom"
                      className="absolute top-0 object-cover w-full rounded-md"
                      style={{ height: `${capHeight}px` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </GameScreenOverlay>
    </div>
  );
}
