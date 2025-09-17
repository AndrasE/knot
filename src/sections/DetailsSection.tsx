export default function DetailsSection() {
  return (
    <section id="contact" className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center pb-10 align-center">
        <h1 className="text-6xl font-dawning ">Details </h1>
        <div className="flex flex-row items-center justify-center max-w-3xl gap-5 p-5 sm:gap-10 align-center ">
          <h2 className="text-4xl font-dawning">When & Where</h2>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Ceremony:</h3>
            <p>Saturday, September 14, 2024</p>
            <h3 className="text-2xl font-bold">Celebration:</h3>
            <p>
              We are so excited to celebrate our special day with you! Here are
              the details you need to know:
            </p>
            <h3 className="text-2xl font-bold">After?</h3>
            <p>
              If we are not drank enough already, we may take on the city!
              Improv!{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
