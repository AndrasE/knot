import { rtdb } from "../firebase";
import { ref, get, set } from "firebase/database";

/**
 * Updates the high score for a specific game and player in the Realtime Database.
 * @param gameId - 'flappy', 'memory', or 'puzzle'
 * @param playerName - The unique name of the player.
 * @param newScore - The score achieved in the latest game.
 */
export async function updateHighScore(
  gameId: string,
  playerName: string,
  newScore: number
): Promise<void> {
  // Add a check for null or undefined scores
  if (!playerName || newScore == null) return;

  const scoreRef = ref(rtdb, `highscores/${gameId}/${playerName}`);

  try {
    const snapshot = await get(scoreRef);
    const currentData = snapshot.val();

    // For games where lower is better, we need a high starting number.
    // For games where higher is better, we start at 0.
    const defaultScore =
      gameId === "puzzle" || gameId === "memory" ? Infinity : 0;
    const currentScore = currentData ? currentData.score : defaultScore;

    // ✅ Define what a "high score" means for each game
    let isNewHighScore = false;
    if (gameId === "puzzle" || gameId === "memory") {
      // For puzzle/memory, a LOWER score (faster time) is better
      isNewHighScore = newScore < currentScore;
    } else {
      // For other games (like flappy), a HIGHER score is better
      isNewHighScore = newScore > currentScore;
    }

    // 3. COMPARE: Use the new flexible condition
    if (isNewHighScore) {
      // 4. WRITE: Update the database with the new high score
      await set(scoreRef, {
        score: newScore,
        playerName: playerName,
        timestamp: Date.now(),
      });
      console.log(`New high score for ${playerName} in ${gameId}: ${newScore}`);
    } else {
      console.log(
        `Score ${newScore} is not a new high score for ${playerName}. Current best: ${currentScore}`
      );
    }
  } catch (error) {
    console.error("Error updating high score:", error);
  }
}
