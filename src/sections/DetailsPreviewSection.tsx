import { Link } from "react-router-dom";

export default function DetailsPreviewSection() {
  return (
    <section
      id="detailspreview"
      className="max-w-6xl pb-5 flex-center-100vh nav-content-offset">
      <div className="flex flex-row items-center justify-center max-w-2xl gap-10 align-center">
        <div className="flex flex-col gap-2 text-center sm:text-right">
          <h1 className="text-6xl font-dawning ">Details </h1>
          <h2 className="text-2xl ">Dress code:</h2>
          <p>As you wish, not needed anything formal</p>

          <h2 className="text-2xl ">Gifts:</h2>
          <p>As you wish, just be there, all that matters!</p>

          <h2 className="text-2xl ">Accomodation:</h2>
          <p>
            Here are some accommodation ideas for our friends visiting from
            abroad. Click below for more details!
          </p>

          <Link
            to="/details"
            className="px-3 py-2 m-auto text-white rounded-md sm:self-end sm:m-0 max-w-fit bg-stone-500 hover:bg-stone-600 disabled:opacity-50">
            More details
          </Link>
        </div>
        <h2 className="hidden max-w-md text-5xl text-left font-dawning sm:block">
          & How What
        </h2>
      </div>
    </section>
  );
}
