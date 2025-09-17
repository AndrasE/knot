import { Link as ScrollLink } from "react-scroll";
// import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex gap-4 text-lg font-medium text-red-800">
      {/* Scroll links */}
      <ScrollLink
        to="hero"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        Home
      </ScrollLink>

      <ScrollLink
        to="contact"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        Contact
      </ScrollLink>

      <ScrollLink
        to="gallery"
        smooth={true}
        duration={500}
        className="cursor-pointer">
        gallery
      </ScrollLink>
    </nav>
  );
}
