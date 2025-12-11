import { HashLink } from "react-router-hash-link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NavDropdown({ isOpen, onClose }: Props) {
  return (
    <div
      className={`fixed sm:hidden bg-[#f5f0e6] inset-0 z-50 flex flex-col items-center justify-center top-14 gap-6 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
      <HashLink
        to="/#eventpreview"
        smooth
        onClick={() => onClose()}
        className="text-2xl cursor-pointer">
        Event
      </HashLink>
      <HashLink
        to="/#detailspreview"
        smooth
        onClick={() => onClose()}
        className="text-2xl cursor-pointer">
        Details
      </HashLink>
      <HashLink
        to="/#gallerypreview"
        smooth
        onClick={() => onClose()}
        className="text-2xl cursor-pointer">
        Gallery
      </HashLink>
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
    </div>
  );
}
