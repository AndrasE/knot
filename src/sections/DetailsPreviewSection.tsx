import { Link } from "react-router-dom";

export default function DetailsPreviewSection() {
  return (
    <section
      id="detailspreview"
      className="flex items-center justify-center max-w-6xl px-5 m-auto nav-height-adjust">
      <div className="flex flex-row items-center justify-center max-w-2xl gap-10 px-5 align-center">
        <h2 className="hidden text-5xl text-right font-dawning sm:block">
          When Where
        </h2>
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-6xl font-dawning ">Details </h1>
          <h2 className="text-2xl ">Ceremony:</h2>
          <p>Morden Park House - The Gazebo</p>
          <p>Friday, 24 July 2026 at 14:00 BST (13:00 UTC)</p>
          <a
            href="https://maps.app.goo.gl/9RzE9R4LqY4A5Y8A9"
            target="_blank"
            rel="noopener noreferrer"
            className="underline">
            Directions
          </a>
          <h2 className="text-2xl ">Celebration:</h2>
          <p>Cherry Tree - Dulwich</p>
          <p>Friday, 24 July 2026 est 16:00 BST (15:00 UTC)</p>
          <a
            href="https://maps.app.goo.gl/7RzE9R4LqY4A5Y8A9"
            target="_blank"
            rel="noopener noreferrer"
            className="underline">
            Directions
          </a>
          <h2 className="text-2xl font-bold ">After?</h2>
          <p>No strict plans — just city adventures and a dash of improv!</p>
          <Link
            to="/details"
            className="px-4 py-2 m-auto mt-4 font-bold text-white rounded-md sm:m-0 max-w-fit bg-stone-500 hover:bg-stone-600 disabled:opacity-50">
            More details
          </Link>
        </div>
      </div>
    </section>
  );
}
