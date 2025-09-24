import { Link } from "react-router-dom";
import BillyIconSvg from "../components/BillyIconSvg";

export default function GameSection() {
  return (
    <Link
      to="/game"
      className="flex flex-col items-center justify-center m-auto transition-all duration-300 transform max-w-fit group text-stone-700 hover:scale-103 active:scale-96">
      <BillyIconSvg />
      <p className="relative text-center transition-all duration-300 transform opacity-80 md:opacity-0 bottom-1 group-hover:scale-105 group-hover:opacity-100">
        Hello, do you want to play a game?
      </p>
    </Link>
  );
}
