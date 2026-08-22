import { PiDogThin } from "react-icons/pi";
import { PiVanThin } from "react-icons/pi";

export default function GiftsSection() {
  return (
    <section
      id="gifts"
      className="max-w-2xl pb-5 text-center flex-center-100vh nav-content-offset ">
      <h1 className="pb-5 text-6xl font-dawning ">Gifts </h1>
      <p className="max-w-sm pb-2 ">
        Your love, presence, and generous gifts meant the world to us. Having
        you celebrate with us made our wedding day unforgettable, and we are so
        deeply grateful for your kindness and support as we begin this new
        chapter together. Thank you so much!!
      </p>

      <div className="flex flex-row items-center justify-center gap-10 align-center ">
        <div className="flex flex-row gap-10 text-center">
          <a
            className="flex flex-col items-center"
            href="https://www.thankbox.com/app/thankbox/8I9D7yar"
            target="_blank"
            rel="noopener noreferrer">
            <p>Honeymoon</p>
            <PiVanThin className="transition-transform duration-200 h-15 w-15 hover:scale-110" />
          </a>
          <a
            className="flex flex-col items-center"
            href="https://www.thankbox.com/app/thankbox/Xyn1uiD0"
            target="_blank"
            rel="noopener noreferrer">
            <p>Dog rescue</p>
            <PiDogThin className="transition-transform duration-200 w-15 h-15 hover:scale-110" />
          </a>
        </div>
      </div>
    </section>
  );
}
