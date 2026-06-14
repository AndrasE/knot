import { PiDogThin } from "react-icons/pi";
import { PiVanThin } from "react-icons/pi";

export default function GiftsSection() {
  return (
    <section
      id="gifts"
      className="max-w-2xl pb-5 text-center flex-center-100vh nav-content-offset ">
      <h1 className="pb-5 text-6xl font-dawning ">Gifts </h1>
      <p className="max-w-sm pb-2 ">
        It is totally optional, but if you would like to give us a gift, we
        would be very grateful.
      </p>
      <p className="max-w-sm pb-5 ">
        You could either support us and our honemoon, or you are more then
        welcome to donate to Mariem's dog rescue charity, which is very close to
        our hearts. Thank you!
      </p>

      <div className="flex flex-row items-center justify-center gap-10 align-center ">
        <div className="flex flex-row gap-8 text-center">
          <a href="https://www.amazon.co.uk/" target="_blank">
            <PiVanThin className="transition-transform duration-200 h-15 w-15 hover:scale-110" />
          </a>
          <a
            href="https://www.amazon.co.uk"
            target="_blank"
            rel="noopener noreferrer">
            <PiDogThin className="transition-transform duration-200 w-15 h-15 hover:scale-110" />
          </a>
        </div>
      </div>
    </section>
  );
}
