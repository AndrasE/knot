import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import FlappyGame from "../components/gameComponents/games/FlappyGame";
import MemoryGame from "../components/gameComponents/games/MemoryGame";
import PuzzleGame from "../components/gameComponents/games/PuzzleGame";
import GameLeaderboardPreview from "../components/gameComponents/GameLeaderboardPreview";
import { useToast, Toast } from "../utils/useToast";

export default function GamesPage() {
  const { showToast, toastProps } = useToast();

  const [playerName, setPlayerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // --- All your logic remains the same ---
  useEffect(() => {
    const initPlayer = async () => {
      const localName = localStorage.getItem("playerName");
      const token = localStorage.getItem("playerToken");
      if (localName && token) {
        setPlayerName(localName);
        showToast(`Welcome, ${localName}! Have fun!`, "success");
      }
      setLoading(false);
    };
    initPlayer();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitName = async () => {
    const name = inputValue.trim();
    if (!name || name.length < 3) {
      showToast("Please enter a name of minimum 3 characters.", "error");
      return;
    }

    const token = crypto.randomUUID();
    const playerRef = ref(rtdb, `players/${name}`);
    const snapshot = await get(playerRef);

    if (snapshot.exists()) {
      showToast(
        "That name is already taken. Please choose another one.",
        "error"
      );
      return;
    }

    await set(playerRef, { token, createdAt: Date.now() });
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerToken", token);
    setPlayerName(name);
    showToast(`Welcome, ${name}! Have fun!`, "success");
  };

  if (loading) return <p>Loading...</p>;

  // --- This is where the magic happens ---
  return (
    // Wrap everything in a single parent element (like a fragment)
    <>
      {/* ✅ 2. Render the Toast component here */}
      <Toast {...toastProps} />

      {/* --- Conditional Render: Name Input Screen --- */}
      {!playerName ? (
        <div className="flex items-center justify-center h-screen px-5">
          <div className="flex flex-col items-center justify-center gap-5 px-5 py-8 my-5 border-2 shadow-xl rounded-xl border-stone-300">
            <h2 className="text-2xl ">Enter your name to play!🧸</h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="px-3 py-2 border-2 rounded-md border-stone-300 active:outline-stone-500 focus:outline-stone-500"
              placeholder="Your name"
            />
            <button
              onClick={handleSubmitName}
              className="px-4 py-2 mt-2 text-xl text-green-900 transition duration-200 bg-green-300 shadow-md rounded-xl active:scale-95">
              Save & Play
            </button>
          </div>
        </div>
      ) : (
        /* --- Conditional Render: Game List Screen --- */
        <div className="flex flex-col items-center justify-center max-w-lg px-2 pt-20 pb-5 mx-auto sm:pb-15 sm:pt-32 gap-15">
          <MemoryGame playerName={playerName} />
          <FlappyGame playerName={playerName} />
          <PuzzleGame playerName={playerName} />
          <GameLeaderboardPreview />
        </div>
      )}
    </>
  );
}
