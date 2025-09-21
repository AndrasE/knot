import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";
import Logo from "../assets/images/navlogo.avif";

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 z-10 flex w-full items-center justify-between gap-2 px-2 py-3 text-lg border-b border-stone-300 sm:px-10 md:px-20 bg-[#f5f0e6]">
      {/* Home page HashLink */}
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
          className="w-10"
        />
      </HashLink>

      {/* Conditionally render the links based on the route */}
      {isHomePage ? (
        <>
          <HashLink
            to="/#detailspreview"
            smooth
            className="text-base cursor-pointer sm:text-lg">
            Details
          </HashLink>
          <HashLink
            to="/#gallerypreview"
            smooth
            className="text-base cursor-pointer sm:text-lg">
            Gallery
          </HashLink>
          <HashLink
            to="/#guests"
            smooth
            className="text-base cursor-pointer sm:text-lg">
            Guests
          </HashLink>
          <HashLink
            to="/#RSVP"
            smooth
            className="text-base cursor-pointer sm:text-lg">
            RSVP
          </HashLink>
        </>
      ) : (
        <>
          <HashLink
            to="/gallery"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute bottom-0 text-5xl transform -translate-x-1/2 cursor-pointer left-1/2 font-dawning">
            {location.pathname.slice(1).charAt(0).toUpperCase() +
              location.pathname.slice(2)}
          </HashLink>
          <HashLink
            to="/"
            smooth
            className="text-base cursor-pointer sm:text-lg">
            Home
          </HashLink>
        </>
      )}
    </nav>
  );
}
