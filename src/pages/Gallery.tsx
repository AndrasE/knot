import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import {
  Download,
  Zoom,
  Fullscreen,
  Slideshow,
} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";

import image1 from "../assets/images/gallery/1.jpg";
import image2 from "../assets/images/gallery/2.jpeg";
import image3 from "../assets/images/gallery/3.jpg";

const galleryImages = [
  { src: image1, width: 2000, height: 1500, title: "Image 1" },
  { src: image2, width: 1280, height: 853, title: "Image 2" },
  { src: image3, width: 2048, height: 1152, title: "Image 3" },
];

export default function GalleryPage() {
  const [index, setIndex] = useState(-1);

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-6xl px-5 mx-auto">
      <p className="max-w-2xl pt-4 pb-8 text-center">
        We'll share the best photos here after the wedding, and post a link to a
        shared album where you can view and download all of the photos. As for
        now here are a few photos of the venue and us.
      </p>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {galleryImages.map((image, i) => (
          <img
            key={i}
            src={image.src}
            alt={image.title}
            onClick={() => setIndex(i)}
            className="transition-opacity rounded-lg shadow-xl cursor-pointer hover:opacity-80"
          />
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
