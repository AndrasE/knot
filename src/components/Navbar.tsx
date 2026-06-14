import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import NavDropdown from "./NavDropdown";
import Logo from "../assets/images/icons/navlogo.avif";
import { IoIosArrowDropdown } from "react-icons/io";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Prevent background scrolling when dropdown is open
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const preventKey = (e: KeyboardEvent) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (keys.includes(e.key)) e.preventDefault();
    };

    if (dropdownOpen) {
      const options: AddEventListenerOptions = { passive: false };
      window.addEventListener(
        "wheel",
        preventDefault as EventListener,
        options,
      );
      window.addEventListener(
        "touchmove",
        preventDefault as EventListener,
        options,
      );
      window.addEventListener("keydown", preventKey as EventListener);
    }

    return () => {
      window.removeEventListener("wheel", preventDefault as EventListener);
      window.removeEventListener("touchmove", preventDefault as EventListener);
      window.removeEventListener("keydown", preventKey as EventListener);
    };
  }, [dropdownOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 z-999 flex w-full items-center justify-between gap-2  py-3 text-lg border-b border-stone-300 sm:px-10 px-3 bg-[#f5f0e6]">
        {/* Home page HashLink */}
        <HashLink
          onClick={() => dropdownOpen && setDropdownOpen(false)}
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
          {isHomePage && (
            <span className="ml-1 text-xl sm:hidden text-stone-700">knot</span>
          )}
        </HashLink>

        {/* Conditionally render the links based on the route */}
        {isHomePage ? (
          <>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
              to="/#eventpreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Event
            </HashLink>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
              to="/#detailspreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Details
            </HashLink>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
              to="/#gallerypreview"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Gallery
            </HashLink>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
              to="/#RSVP"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              RSVP
            </HashLink>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
              to="/#guests"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Guests
            </HashLink>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
              to="/#gifts"
              smooth
              className="hidden text-base cursor-pointer sm:block sm:text-lg">
              Gifts
            </HashLink>
            <HashLink
              onClick={() => dropdownOpen && setDropdownOpen(false)}
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
