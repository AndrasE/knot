import { Link as ScrollLink } from "react-scroll";
import Logo from "../assets/navlogo.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 text-lg shadow-sm sm:text-2xl sm:px-20 bg-[#f5f0e6] ">
      {/* Scroll links */}
      <ScrollLink
        to="hero"
        smooth={true}
        duration={500}
        className="cursor-pointer justify-self-start">
        <img src={Logo} alt="Logo" className="w-15 " />
      </ScrollLink>

      <ScrollLink
        to="contact"
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
        to="guestlist"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        Guestlist
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
