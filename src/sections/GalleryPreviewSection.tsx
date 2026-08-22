// GalleryPreviewSection.jsx
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";

// Import each image file individually
import img1 from "../assets/images/carousel/1.jpg";
import img2 from "../assets/images/carousel/2.jpg";
import img3 from "../assets/images/carousel/3.jpg";
import img4 from "../assets/images/carousel/4.jpg";
import img5 from "../assets/images/carousel/5.jpg";
import img6 from "../assets/images/carousel/6.jpg";
import img7 from "../assets/images/carousel/7.jpg";
import img8 from "../assets/images/carousel/8.jpg";

// Use the imported variables in your array
const gallerySlides = [
  {
    src: img1,
    alt: "Soon to be wifey",
  },
  {
    src: img2,
    alt: "Witnessing the vows",
  },
  {
    src: img3,
    alt: "Mamas",
  },
  {
    src: img4,
    alt: "Families",
  },
  {
    src: img5,
    alt: "Celebrating",
  },
  {
    src: img6,
    alt: "Witnesses, the bestests!",
  },
  {
    src: img7,
    alt: "Families",
  },
  {
    src: img8,
    alt: "Thank you for coming, lovely humans!",
  },
];

export default function GalleryPreviewSection() {
  return (
    <section
      id="gallerypreview"
      className="max-w-2xl pb-5 flex-center-100vh nav-content-offset ">
      <h1 className="pb-6 text-6xl font-dawning">Gallery</h1>
      <div className="flex flex-col items-center justify-center gap-5 sm:gap-10 align-center sm:flex-row ">
        <Carousel
          slides={gallerySlides}
          className="w-3/4  max-w-[280px] shadow-xl"
        />
        <div className="flex flex-col gap-2 text-center sm:text-left sm:w-2/3">
          <p className="max-w-md pt-2 ">
            Welcome to our gallery! We had an incredible time celebrating our
            special day with everyone. Browse through to see a selection of
            photos from our venue and a few of our favorite moments together.
          </p>
          <Link
            to="/gallery"
            className="px-3 py-2 m-auto text-white rounded-md sm:m-0 max-w-fit bg-stone-500 hover:bg-stone-600 disabled:opacity-50">
            View Gallery
          </Link>
        </div>{" "}
      </div>
    </section>
  );
}
