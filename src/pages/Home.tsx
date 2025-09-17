import HeroSection from "../sections/HeroSection";
import ContactSection from "../sections/ContactSection";
import GalleryPreviewSection from "../sections/GalleryPreviewSection";
import GuestlistSection from "../sections/GuestlistSection";
import RSVPSection from "../sections/RSVPSection";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <HeroSection />
      <ContactSection />
      <GalleryPreviewSection />
      <GuestlistSection />
      <RSVPSection />
    </div>
  );
}
