import { Link as ScrollLink } from "react-scroll";
import Logo from "../assets/navlogo.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-10 w-full flex items-center justify-between gap-4 px-5 py-4 text-lg  shadow-sm sm:text-2xl md:px-20 bg-[#f5f0e6] ">
      {/* Scroll links */}
      <ScrollLink
        to="hero"
        smooth={true}
        duration={500}
        className="cursor-pointer justify-self-start">
        <img src={Logo} alt="Logo" className="w-10 sm:w-15 " />
      </ScrollLink>

      <ScrollLink
        to="details"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        Details
      </ScrollLink>

      <ScrollLink
        to="gallery"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        Gallery
      </ScrollLink>

      <ScrollLink
        to="guests"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        Guests
      </ScrollLink>

      <ScrollLink
        to="RSVP"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        RSVP
      </ScrollLink>
    </nav>
  );
}
