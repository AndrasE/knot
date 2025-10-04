import { useEffect, useState } from "react";
import FlappyGame from "../components/gameComponents/games/FlappyGame";
import MemoryGame from "../components/gameComponents/games/MemoryGame";
import PuzzleGame from "../components/gameComponents/games/PuzzleGame";
// Import necessary Firebase RTDB functions
import { ref, get, set } from "firebase/database";
import { rtdb } from "../firebase";

export default function GamesPage() {
  // Stores the player's name once successfully authenticated/set.
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // --- Player Initialization Logic ---
  useEffect(() => {
    const initPlayer = async () => {
      // Check for existing credentials in the browser's localStorage
      const localName = localStorage.getItem("playerName");
      const token = localStorage.getItem("playerToken");

      // If local credentials exist, set the player name and skip the input screen
      if (localName && token) {
        setPlayerName(localName);
        setLoading(false);
        return;
      }

      // If no credentials, stop loading and show the name input screen
      setLoading(false);
    };

    initPlayer();
  }, []);

  // --- Handles form submission and player creation/validation ---
  const handleSubmitName = async () => {
    const name = inputValue.trim();
    if (!name) return;

    // Generate a unique token to identify the player across sessions/devices (optional security layer)
    const token = crypto.randomUUID();

    // 1. CHECK IF NAME ALREADY EXISTS IN RTDB
    // Create a reference to the potential player's profile node (e.g., 'players/JohnDoe')
    const playerRef = ref(rtdb, `players/${name}`);
    // Fetch the data at that location
    const snapshot = await get(playerRef);

    // If data exists, the name is taken.
    if (snapshot.exists()) {
      alert("That name is already taken. Please choose another one.");
      return;
    }

    // 2. SAVE NEW PROFILE TO RTDB
    await set(playerRef, {
      token,
      // Record when the profile was created
      createdAt: Date.now(),
    });

    // 3. Save name and token locally and set state to start the game
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerToken", token);
    setPlayerName(name);
  };

  if (loading) return <p>Loading...</p>;

  // --- Conditional Render: Name Input Screen ---
  if (!playerName) {
    return (
      <div className="flex items-center justify-center h-screen px-5 pt-20 ">
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
            className="px-4 py-2 mt-2 text-xl text-green-800 transition duration-200 bg-green-300 shadow-md rounded-xl active:scale-95">
            Save & Play
          </button>
        </div>
      </div>
    );
  }

  // --- Conditional Render: Game List Screen (Player is identified) ---
  return (
    <div className="flex flex-col items-center justify-center max-w-lg px-2 pt-20 pb-5 mx-auto sm:pb-15 sm:pt-32 gap-15">
      {/* Pass the validated player name to each game component */}
      <MemoryGame playerName={playerName} />
      <FlappyGame playerName={playerName} />
      <PuzzleGame playerName={playerName} />
    </div>
  );
}
