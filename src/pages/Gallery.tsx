import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";

// Import all your images here

import img2 from "../assets/images/gallery/2.png";
import img3 from "../assets/images/gallery/3.png";
import img4 from "../assets/images/gallery/4.png";
import img5 from "../assets/images/gallery/sky.jpeg";

const galleryImages = [
  { src: img2, width: 1200, height: 800, title: "Image 2" },
  { src: img3, width: 1000, height: 1500, title: "Image 3" },
  { src: img4, width: 1200, height: 900, title: "Image 4" },
  { src: img5, width: 1920, height: 1080, title: "Image 5" },
];

export default function GalleryPage() {
  const [index, setIndex] = useState(-1);

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl min-h-screen p-5 pt-20 mx-auto">
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
        plugins={[Zoom, Download]}
      />
    </div>
  );
}
