import { HashLink } from "react-router-hash-link";
import { useLocation, useNavigate } from "react-router-dom";
import NavDropdown from "./NavDropdown";
import Logo from "../assets/images/icons/navlogo.avif";
import { IoIosArrowDropdown } from "react-icons/io";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 z-999 flex w-full items-center justify-between gap-2  py-3 text-lg border-b border-stone-300 sm:px-10 px-3 bg-[#f5f0e6]">
        {/* Home page HashLink */}
        <HashLink
          to="/#hero"
          smooth
          className="flex items-center cursor-pointer">
          <img
            src={Logo}
            alt="Logo"
            width="30"
            height="30"
            fetchPriority="high"
            className="w-10"
          />
          <span className="ml-1 text-xl sm:hidden text-stone-700">knot</span>
        </HashLink>

        {/* Conditionally render the links based on the route */}
        {isHomePage ? (
          <>
            <HashLink
              to="/#eventpreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Event
            </HashLink>
            <HashLink
              to="/#detailspreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Details
            </HashLink>
            <HashLink
              to="/#gallerypreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Gallery
            </HashLink>
            <HashLink
              to="/#RSVP"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              RSVP
            </HashLink>
            <HashLink
              to="/#guests"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Guests
            </HashLink>
            <HashLink
              to="/#gamespreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Games
            </HashLink>
            <IoIosArrowDropdown
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`
      text-3xl transition duration-300 ease-in-out transform cursor-pointer
      hover:text-stone-700 text-stone-600 
      ${dropdownOpen ? "rotate-180" : "rotate-0"}
      `}
            />
          </>
        ) : (
          <>
            <HashLink
              to={location.pathname}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="absolute bottom-0 text-5xl transform -translate-x-1/2 cursor-pointer left-1/2 font-dawning">
              {location.pathname.slice(1).charAt(0).toUpperCase() +
                location.pathname.slice(2)}
            </HashLink>
            <button
              onClick={() => navigate(-1)} // This is the key change
              className="text-base cursor-pointer sm:block sm:text-lg">
              Back
            </button>
          </>
        )}
      </nav>
      <NavDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
      />
    </>
  );
}
