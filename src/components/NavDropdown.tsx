import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NavDropdown({ isOpen, onClose }: Props) {
  return (
    <>
      <div
        className={`fixed  bg-[#f5f0e6] inset-0 z-50 flex flex-col items-center pb-10 justify-center top-14  transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}>
        <h1 className="pb-10 text-6xl font-dawning">Sitemap</h1>
        <div className="flex flex-col pl-4 border-l-2 text-stone-700">
          <HashLink
            to="/#eventpreview"
            smooth
            onClick={() => onClose()}
            className="text-3xl cursor-pointer sm: sm:text-2xl nav-circle-dot">
            Event
          </HashLink>
          <Link
            to="/event"
            onClick={() => onClose()}
            className="ml-2 text-xl cursor-pointer sm:text-base">
            Event Page
          </Link>

          <HashLink
            to="/#detailspreview"
            smooth
            onClick={() => onClose()}
            className="mt-4 text-3xl cursor-pointer sm:text-2xl nav-circle-dot">
            Details
          </HashLink>
          <Link
            to="/details"
            onClick={() => onClose()}
            className="ml-2 text-xl cursor-pointer sm:text-base ">
            Details Page
          </Link>
          <HashLink
            to="/#gallerypreview"
            smooth
            onClick={() => onClose()}
            className="mt-4 text-3xl cursor-pointer sm:text-2xl nav-circle-dot">
            Gallery
          </HashLink>
          <Link
            to="/gallery"
            onClick={() => onClose()}
            className="ml-2 text-xl cursor-pointer sm:text-base ">
            Gallery Page
          </Link>
          <HashLink
            to="/#RSVP"
            smooth
            onClick={() => onClose()}
            className="mt-4 text-3xl cursor-pointer sm:text-2xl nav-circle-dot">
            RSVP
          </HashLink>
          <HashLink
            to="/#guests"
            smooth
            onClick={() => onClose()}
            className="mt-4 text-3xl cursor-pointer sm:text-2xl nav-circle-dot">
            Guests
          </HashLink>
          <HashLink
            to="/#gamespreview"
            smooth
            onClick={() => onClose()}
            className="mt-4 text-3xl cursor-pointer sm:text-2xl nav-circle-dot">
            Games
          </HashLink>
          <Link
            to="/games"
            onClick={() => onClose()}
            className="ml-2 text-xl cursor-pointer sm:text-base ">
            Games Page
          </Link>
        </div>
      </div>
    </>
  );
}
