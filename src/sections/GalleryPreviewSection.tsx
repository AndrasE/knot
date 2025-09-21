// GalleryPreviewSection.jsx
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";

// Import each image file individually
import img1 from "../assets/images/carousel/1.webp";
import img2 from "../assets/images/carousel/2.webp";
import img3 from "../assets/images/carousel/3.webp";
import img4 from "../assets/images/carousel/4.webp";

// Use the imported variables in your array
const gallerySlides = [
  {
    src: img1,
    alt: "Morden Park House",
  },
  {
    src: img2,
    alt: "Morden Park House",
  },
  {
    src: img3,
    alt: "Gazeebo at the venue",
  },
  {
    src: img4,
    alt: "Gazeebo at the venue",
  },
];

export default function GalleryPreviewSection() {
  return (
    <section
      id="gallerypreview"
      className="flex flex-col items-center justify-center max-w-2xl px-5 m-auto h-screen ">
      <h1 className="pb-8 text-6xl font-dawning">Gallery</h1>
      <div className="flex flex-col items-center justify-center gap-5 sm:gap-10 align-center sm:flex-row ">
        {/* Replace the img with the Carousel component */}
        <Carousel
          slides={gallerySlides}
          className="w-3/4 sm:w-1/3 max-w-[230px] shadow-xl"
        />

        <div className="text-center sm:text-left sm:w-2/3">
          <p className="max-w-md pt-2 pb-5 ">
            Here you will find a gallery of our favorite moments together. We
            can't wait to create more memories with you on our special day! For
            now, we have only shared photos of our venue, as well as a few
            photos of us.
          </p>
          <Link
            to="/gallery"
            className="px-3 py-2 font-bold text-white rounded-md max-w-fit bg-stone-500 hover:bg-stone-600 disabled:opacity-50">
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
