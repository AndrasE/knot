import HeroSection from "../sections/HeroSection";
import ContactSection from "../sections/DetailsSection";
import GalleryPreviewSection from "../sections/GalleryPreviewSection";
import GuestlistSection from "../sections/GuestlistSection";
import RSVPSection from "../sections/RSVPSection";
import DetailsSection from "../sections/DetailsSection";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <HeroSection />
      <ContactSection />
      <GalleryPreviewSection />
      <DetailsSection />
      <GuestlistSection />
      <RSVPSection />
    </div>
  );
}
