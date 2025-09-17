import { Link } from "react-router-dom";

export default function GalleryPreviewSection() {
  return (
    <section id="gallery" className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Gallery Preview</h1>
        <Link
          to="/gallery"
          className="inline-block px-6 py-2 mt-8 text-white bg-blue-600 rounded hover:bg-blue-700">
          View Full Gallery
        </Link>
      </div>
    </section>
  );
}
