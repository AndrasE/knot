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
        className={`fixed  bg-[#f5f0e6] inset-0 z-50 flex flex-col items-center pb-10 justify-center top-14 gap-6 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}>
        <h1 className="pb-10 text-6xl font-dawning">Sitemap</h1>
        <HashLink
          to="/#eventpreview"
          smooth
          onClick={() => onClose()}
          className="text-2xl cursor-pointer">
          Event
        </HashLink>
        <Link
          to="/events"
          onClick={() => onClose()}
          className="text-xl cursor-pointer">
          Event Page
        </Link>

        <HashLink
          to="/#detailspreview"
          smooth
          onClick={() => onClose()}
          className="text-2xl cursor-pointer">
          Details
        </HashLink>
        <Link
          to="/details"
          onClick={() => onClose()}
          className="text-xl cursor-pointer">
          Details Page
        </Link>
        <HashLink
          to="/#gallerypreview"
          smooth
          onClick={() => onClose()}
          className="text-2xl cursor-pointer">
          Gallery
        </HashLink>
        <Link
          to="/details"
          onClick={() => onClose()}
          className="text-xl cursor-pointer">
          Gallery Page
        </Link>
        <HashLink
          to="/#RSVP"
          smooth
          onClick={() => onClose()}
          className="text-2xl cursor-pointer">
          RSVP
        </HashLink>
        <HashLink
          to="/#guests"
          smooth
          onClick={() => onClose()}
          className="text-2xl cursor-pointer">
          Guests
        </HashLink>
        <HashLink
          to="/#gamespreview"
          smooth
          onClick={() => onClose()}
          className="text-2xl cursor-pointer">
          Games
        </HashLink>
        <Link
          to="/games"
          onClick={() => onClose()}
          className="text-xl cursor-pointer">
          Games Page
        </Link>
      </div>
    </>
  );
}
