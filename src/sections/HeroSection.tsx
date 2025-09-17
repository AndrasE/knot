import Us from "../assets/us.png";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="flex items-center justify-center h-screen max-w-6xl mx-auto ">
      <div className="flex flex-col items-center justify-center gap-10 align-center sm:flex-row sm:gap-15">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-dawning">
            Sarah{" "}
          </h1>
          <h1 className="text-3xl leading-7 md:text-4xl lg:text-5xl font-dawning">
            &
          </h1>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-dawning">
            Andras
          </h1>
          <p className="pt-2 text-3xl md:text-4xl lg:text-5xl font-dawning">
            We're tying the knot!
          </p>
        </div>
        <img
          src={Us}
          alt="us"
          className="w-3/4 rounded-2xl sm:w-1/3 max-w-[300px]"
        />
      </div>
    </section>
  );
}
