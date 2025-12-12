export default function GuestsSection() {
  return (
    <section
      id="guests"
      className="max-w-2xl pb-5 text-center flex-center-100vh nav-content-offset ">
      <h1 className="pb-5 text-6xl font-dawning ">Guests </h1>
      <p className="max-w-sm pb-5 ">
        Our confirmed guests so far. Please use the form above or reach out to
        us directly. Thank you!
      </p>

      <div className="flex flex-row items-center justify-center gap-10 align-center ">
        <ul className="grid w-full grid-cols-2 gap-x-10 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
          <li>Sarah </li>
          <li>Andras </li>
          <li>Mama A</li>
          <li>Pappa A </li>
          <li>Pappa S </li>
          <li>Kari </li>
          <li>Boch </li>
          <li>Dave</li>
          <li>Chrissie</li>
          <li>Simone</li>
          <li>Carla</li>
          <li>Mariann</li>
          <li>Szilvi</li>
          <li>Soraia</li>
          <li>Shreen</li>
        </ul>
      </div>
    </section>
  );
}
