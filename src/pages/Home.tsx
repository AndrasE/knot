import { Suspense, lazy } from "react";
import HeroSection from "../sections/HeroSection";

// Lazy load all sections that are not in the initial viewport
const DetailsPreviewSection = lazy(
  () => import("../sections/DetailsPreviewSection")
);
const GalleryPreviewSection = lazy(
  () => import("../sections/GalleryPreviewSection")
);
const EventPreviewSection = lazy(
  () => import("../sections/EventPreviewSection")
);
const GuestsSection = lazy(() => import("../sections/GuestsSection"));
const RSVPSection = lazy(() => import("../sections/RSVPSection"));
const GamePreviewSection = lazy(
  () => import("../sections/GamesPreviewSection")
);

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Load this section immediately as it's at the top */}
      <HeroSection />

      {/* All other sections are wrapped in a Suspense component */}
      <Suspense fallback={<div>Loading...</div>}>
        <EventPreviewSection />
        <DetailsPreviewSection />
        <GalleryPreviewSection />
        <RSVPSection />
        <GuestsSection />
        <GamePreviewSection />
      </Suspense>
    </div>
  );
}
