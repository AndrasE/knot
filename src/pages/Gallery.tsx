import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import {
  Download,
  Zoom,
  Fullscreen,
  Slideshow,
} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import { galleryImages } from "../assets/images/gallery/galleryData";

export default function GalleryPage() {
  const [index, setIndex] = useState(-1);
  // Scroll to top when navigating to this page

  return (
    <div className="max-w-6xl pt-20 mx-auto flex-center-100vh">
      <p className="max-w-2xl pt-4 pb-8 text-center">
        Here are some highlights from our wedding! To view or download the full
        collection in original high quality, please visit this link:{" "}
        <a
          className="underline decoration-stone-500"
          href="https://www.dropbox.com/scl/fo/upg30swv5kkq8ajr8lji4/AOHweNsCmUVfVo8Rtcj2jWA?rlkey=3l1rcjz07x6ebkrun2o8ssc2y&st=0ztoh347&dl=0"
          target="_blank"
          rel="noopener noreferrer">
          dropbox
        </a>{" "}
      </p>
      <div className="grid grid-cols-2 gap-5 pb-5 md:pb-10 sm:grid-cols-3 md:grid-cols-4">
        {galleryImages.map((image, i) => (
          <div
            key={i}
            className="relative w-full h-64 overflow-hidden rounded-lg shadow-xl">
            <img
              src={image.src}
              alt={image.title}
              onClick={() => setIndex(i)}
              className="object-cover w-full h-full transition-opacity duration-300 cursor-pointer hover:opacity-80"
            />
          </div>
        ))}
      </div>

      <Lightbox
        slides={galleryImages}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Download, Zoom, Slideshow, Fullscreen]}
      />
    </div>
  );
}
