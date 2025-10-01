import FlappyGame from "../components/FlappyGame";
import MemoryGame from "../components/MemoryGame";
import PuzzleGame from "../components/PuzzleGame";

export default function GamesPage() {
  return (
    <div className="flex flex-col items-center justify-center max-w-2xl px-2 pt-20 pb-5 mx-auto gap-15">
      <FlappyGame />
      <MemoryGame />
      {/* <PuzzleGame /> */}
    </div>
  );
}
