import Section from "../components/Section";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Section id="hero" title="Hero " />
      <Section id="contact" title="Contact" />
      <Section id="gallery" title="Gallery Preview">
        <Link
          to="/gallery"
          className="inline-block px-6 py-2 mt-8 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          View Full Gallery
        </Link>
      </Section>
    </div>
  );
}
