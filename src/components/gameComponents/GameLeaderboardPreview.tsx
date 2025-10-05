import React from "react";
// Assuming your useLeaderboardScores is in this relative path
import useLeaderboardScores from "../../utils/useLeaderboardScores";
import { Link } from "react-router-dom"; // Needed for the 'View Full' button

// --- Define the structure for all three games ---
const gameDefinitions = [
  {
    gameKey: "memory" as const,
    title: "Stunkie Pair",
    unit: "s",
    lowerIsBetter: true,
  },
  {
    gameKey: "flappy" as const,
    title: "Stunkie Flaps ",
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

// --- Sub-Component to Render a Single Game's Preview ---
const SingleGamePreview = ({
  gameKey,
  title,
  unit,
}: (typeof gameDefinitions)[0]) => {
  // Destructure state from the hook
  const { topScores, loading, error } = useLeaderboardScores(gameKey);

  // Define rank emojis once
  const rankEmojis = ["🥇", "🥈", "🥉"];

  // This function is now the primary content renderer for scores
  const renderScores = () => (
    <ol className="max-w-xs mx-auto space-y-1 list-inside">
      {topScores.map((score, index) => (
        <li key={index} className="flex justify-between rounded">
          <span className="flex items-center truncate">
            {/* INLINE: EMOJI Rank Display */}
            <span className="mr-1 text-xl leading-none">
              {rankEmojis[index] || `${index + 1}.`}
            </span>
            {score.playerName}
          </span>

          <span className="ml-2 text-right whitespace-nowrap">
            {/* INLINE: Score Formatting */}
            {unit === "pts"
              ? score.score.toFixed(0)
              : score.score.toFixed(1)}{" "}
            {unit}
          </span>
        </li>
      ))}
    </ol>
  );

  // Main return render
  return (
    <div className="w-full py-1">
      <h3 className="max-w-xs mx-auto mb-2 text-xl ">{title}</h3>

      {loading && (
        <p className="text-sm text-center text-stone-500">Loading scores...</p>
      )}

      {error && <p className="text-sm text-center text-red-500">{error}</p>}

      {!loading && topScores.length === 0 && (
        <p className="text-sm text-center ">No scores yet!</p>
      )}

      {/* Conditional render of scores list */}
      {!loading && topScores.length > 0 && renderScores()}
    </div>
  );
};

// --- Main Preview Component (prop-less) ---
export default function GameLeaderboardPreview() {
  return (
    <div className="w-full p-5 m-auto mx-auto border shadow-xl rounded-2xl border-stone-500">
      <h2 className="text-2xl font-semibold text-center ">Leaderboards🏆</h2>
      <p className="mb-4 text-center text-gray-600">Beat 'em!</p>

      <div className="flex flex-col items-center justify-center gap-4">
        {/* Map over the defined games and render a preview for each */}
        {gameDefinitions.map((game) => (
          <React.Fragment key={game.gameKey}>
            <SingleGamePreview {...game} />
            {/* Add a separator between games, but not after the last one */}
            {game.gameKey !==
              gameDefinitions[gameDefinitions.length - 1].gameKey && (
              <hr className="w-4/5 border-stone-200" />
            )}
          </React.Fragment>
        ))}

        <Link
          to="/leaderboard" // Ensure this is the correct route for your full leaderboard page
          className="px-4 py-2 my-3 text-xl text-green-800 transition duration-200 bg-green-300 shadow-md rounded-xl active:scale-95">
          View top 10
        </Link>
      </div>
    </div>
  );
}
