import useLeaderboardScores from "../utils/useLeaderboardScores";

// --- Define the structure for all three games (same as before) ---
const gameDefinitions = [
  {
    gameKey: "memory" as const,
    title: "Stunkie Pair",
    unit: "mvs",
    lowerIsBetter: true,
  },
  {
    gameKey: "flappy" as const,
    title: "Stunkie Flaps",
    unit: "pts",
    lowerIsBetter: false,
  },
  {
    gameKey: "puzzle" as const,
    title: "Stunkie Puzzle",
    unit: "s",
    lowerIsBetter: true,
  },
];

// --- Sub-Component to Render a Single Game's Full Leaderboard ---
const FullScoreList = ({
  gameKey,
  title,
  unit,
}: (typeof gameDefinitions)[0]) => {
  // ✅ Pass 10 as the limit to the hook
  const { topScores, loading, error } = useLeaderboardScores(gameKey, 10);

  // Helper function to format the score (same logic as before)
  const formatScore = (score: number) => {
    return unit == "pts"
      ? score.toFixed(0)
      : unit == "mvs"
      ? score.toFixed(0)
      : score.toFixed(1);
  };

  return (
    <div className="w-full p-5 border rounded-lg shadow-md border-stone-500">
      <h3 className="mb-4 text-xl text-center">{title}</h3>

      {loading && (
        <p className="text-sm text-center text-stone-500">Loading top 10...</p>
      )}
      {error && <p className="text-sm text-center text-red-500">{error}</p>}

      {!loading && topScores.length === 0 && (
        <p className="text-sm text-center text-stone-500">
          No scores recorded yet!
        </p>
      )}

      {!loading && topScores.length > 0 && (
        <ol className="w-full max-w-sm mx-auto mb-1 space-y-1 list-decimal list-inside">
          {topScores.map((score, index) => (
            <li
              key={index}
              className="flex justify-between p-2 border-b border-stone-200">
              <span className="truncate">
                {/* ✅ Simple numbered rank display */}
                <span className="mr-1 ">{index + 1}.</span>
                {score.playerName}
              </span>
              <span className="ml-2 whitespace-nowrap">
                {formatScore(score.score)} {unit}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

// --- Main Full Leaderboard Page Component ---
export default function LeaderboardPage() {
  return (
    <div className="p-10 pt-20 flex-center-100vh">
      <h1 className="mb-2 text-2xl font-extrabold text-stone-800">
        Top 10 Leaderboards✨
      </h1>
      <p className="mb-3 text-xl text-gray-600">The best Stunkies!</p>

      {/* Layout for the three leaderboards (side-by-side on large screens) */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        {gameDefinitions.map((game) => (
          <FullScoreList key={game.gameKey} {...game} />
        ))}
      </div>
    </div>
  );
}
