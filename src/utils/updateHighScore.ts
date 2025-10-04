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
  if (!playerName || newScore === 0) return; // Basic validation

  // 1. Create a reference to this player's specific game score node
  const scoreRef = ref(rtdb, `highscores/${gameId}/${playerName}`);

  try {
    // 2. READ the current score from the database
    const snapshot = await get(scoreRef);
    const currentData = snapshot.val();

    // Get the current score, defaulting to 0 if no data exists
    const currentScore = currentData ? currentData.score : 0;

    // 3. COMPARE: Check if the new score is higher
    if (newScore > currentScore) {
      // 4. WRITE: Update the database with the new high score
      await set(scoreRef, {
        score: newScore,
        playerName: playerName,
        timestamp: Date.now(),
      });
      console.log(`New high score for ${playerName} in ${gameId}: ${newScore}`);
    } else {
      console.log(
        `Score ${newScore} is not a new high score for ${playerName}. Current high: ${currentScore}`
      );
    }
  } catch (error) {
    console.error("Error updating high score:", error);
  }
}
