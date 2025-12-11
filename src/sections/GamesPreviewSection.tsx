import { Link } from "react-router-dom";
import BillyIconSvg from "../components/BillyIconSvg";

export default function GamePreviewSection() {
  return (
    <section
      id="gamespreview"
      className="max-w-2xl text-center flex-center-100vh nav-content-offset ">
      <h1 className="text-6xl pb-15 font-dawning ">Games </h1>
      <Link
        id="gamespreview"
        to="/games"
        className="flex flex-col items-center justify-center transition-all duration-300 transform group text-stone-700 hover:scale-103 active:scale-96">
        <BillyIconSvg />
        <p className="relative mt-2 text-center transition-all duration-300 transform opacity-80 md:opacity-0 bottom-1 group-hover:scale-105 group-hover:opacity-100">
          Hello, do you want to play a game?
        </p>
      </Link>
    </section>
  );
}
