import { HashLink } from "react-router-hash-link";
import Logo from "../assets/images/navlogo.avif";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-10 w-full flex items-center justify-between gap-2 px-2 py-4 text-lg border-b-1 border-stone-300 shadow-xs sm:px-10 md:px-20 bg-[#f5f0e6] ">
      {/* Hash links */}
      <HashLink
        to="/#hero"
        smooth
        className="cursor-pointer justify-self-start">
        <img src={Logo} alt="Logo" className="w-10 sm:w-15 " />
      </HashLink>

      <HashLink to="/#details" smooth className="cursor-pointer">
        Details
      </HashLink>

      <HashLink to="/#gallery" smooth className="cursor-pointer">
        Gallery
      </HashLink>

      <HashLink to="/#guests" smooth className="cursor-pointer">
        Guests
      </HashLink>

      <HashLink to="/#RSVP" smooth className="cursor-pointer">
        RSVP
      </HashLink>
    </nav>
  );
}
