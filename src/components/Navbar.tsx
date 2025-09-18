import { HashLink } from "react-router-hash-link";
import Logo from "../assets/images/navlogo.avif";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-10 w-full flex items-center justify-between gap-2 px-2 py-3 text-lg border-b-1 border-stone-300  sm:px-10 md:px-20 bg-[#f5f0e6] ">
      {/* Hash links */}
      <HashLink
        to="/#hero"
        smooth
        className="cursor-pointer justify-self-start">
        <img
          src={Logo}
          alt="Logo"
          width="30"
          height="30"
          fetchPriority="high"
          className="w-10 "
        />
      </HashLink>

      <HashLink
        to="/#details"
        smooth
        className="text-sm cursor-pointer sm:text-lg ">
        Details
      </HashLink>

      <HashLink
        to="/#gallery"
        smooth
        className="text-sm cursor-pointer sm:text-lg ">
        Gallery
      </HashLink>

      <HashLink
        to="/#guests"
        smooth
        className="text-sm cursor-pointer sm:text-lg ">
        Guests
      </HashLink>

      <HashLink to="/#RSVP" className="text-sm cursor-pointer sm:text-lg ">
        RSVP
      </HashLink>
    </nav>
  );
}
