import FlappyGame from "../components/gameComponents/games/FlappyGame";
import MemoryGame from "../components/gameComponents/games/MemoryGame";
import PuzzleGame from "../components/gameComponents/games/PuzzleGame";

export default function GamesPage() {
  return (
    <div className="flex flex-col items-center justify-center max-w-2xl px-2 pt-20 pb-5 mx-auto sm:pb-15 sm:pt-32 gap-15">
      <MemoryGame />
      <FlappyGame />
      <PuzzleGame />
    </div>
  );
}
