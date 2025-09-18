import HeroSection from "../sections/HeroSection";
import GalleryPreviewSection from "../sections/GalleryPreviewSection";
import RSVPSection from "../sections/RSVPSection";
import DetailsSection from "../sections/DetailsSection";
import GuestsSection from "../sections/GuestsSection";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <HeroSection />
      <DetailsSection />
      <GalleryPreviewSection />
      <GuestsSection />
      <RSVPSection />
    </div>
  );
}
