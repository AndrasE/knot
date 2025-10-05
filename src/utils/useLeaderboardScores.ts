import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "../firebase";

type Score = {
  playerName: string;
  score: number;
  timestamp: number;
};

type Sorter = (a: Score, b: Score) => number;

const lowerIsBetter: Sorter = (a, b) => a.score - b.score;
const higherIsBetter: Sorter = (a, b) => b.score - a.score;

const gameSorters: Record<string, Sorter> = {
  puzzle: lowerIsBetter,
  memory: lowerIsBetter,
  flappy: higherIsBetter,
};

// FIX: Define the generic for gameKey and set the limit default
export default function useLeaderboardScores(
  gameKey: "memory" | "flappy" | "puzzle",
  limit = 3
) {
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const scoresRef = ref(rtdb, `highscores/${gameKey}`);

    // ✅ Switch to onValue to set up a continuous listener
    const unsubscribe = onValue(
      scoresRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const scores: Score[] = Object.values(snapshot.val());
          const sorter = gameSorters[gameKey];

          // 1. Sort the scores
          const sortedScores = scores.slice().sort(sorter);

          // 2. Slice the scores using the DYNAMIC 'limit' value
          const finalScores = sortedScores.slice(0, limit);

          // 3. Update state
          setTopScores(finalScores);
          setLoading(false); // Stop loading after the first successful fetch
        } else {
          setTopScores([]);
          setLoading(false);
        }
      },
      (databaseError) => {
        // Handle errors in the listener
        console.error("Firebase Leaderboard Listener Failed:", databaseError);
        setError("Failed to load scores in real-time.");
        setLoading(false);
      }
    );

    // ✅ CLEANUP FUNCTION: This is crucial. It detaches the listener
    // when the component unmounts or the dependencies change.
    return () => unsubscribe();

    // The listener must re-run if the gameKey or the limit changes
  }, [gameKey, limit]);

  return { topScores, loading, error };
}
