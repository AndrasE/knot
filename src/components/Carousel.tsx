import type { FC } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Define the types directly in this file
interface ImageSlide {
  src: string;
  alt: string;
  width?: string;
  height?: string;
}

interface CarouselProps {
  slides: ImageSlide[];
  className?: string;
}

// Infer the options type from the hook's parameters
type EmblaOptionsType = Parameters<typeof useEmblaCarousel>[0];

const Carousel: FC<CarouselProps> = ({ slides, className }) => {
  // Let TypeScript infer the type of autoplayOptions
  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const options: EmblaOptionsType = {
    loop: true,
  };

  const [emblaRef] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);

  return (
    <div className={className}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((image, index) => (
            <div className="flex-[0_0_100%] min-w-0" key={index}>
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                fetchPriority="high"
                className="w-full shadow-xl rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
