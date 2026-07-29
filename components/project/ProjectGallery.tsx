"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export interface ProjectGalleryProps {
  images?: string[];
  title: string;
}

const GallerySlide: React.FC<{ img: string; title: string; index: number; total: number }> = ({
  img,
  title,
  index,
  total,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const isCustomImage =
    img &&
    !img.includes("preview-") &&
    (img.startsWith("/upload/") || img.startsWith("http") || img.includes(".")) &&
    !imageError;

  return (
    <div className="flex-[0_0_100%] min-w-0 h-[300px] sm:h-[480px] bg-[#f6e0ce]/30 flex flex-col items-center justify-center relative overflow-hidden group">
      {isCustomImage ? (
        <Image
          src={img}
          alt={`${title} screenshot ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
          decoding="async"
          onError={() => setImageError(true)}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border-warm text-primary flex items-center justify-center shadow-xs mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <span className="font-serif font-bold text-lg text-ink">{title}</span>
          <span className="text-xs font-mono text-ink-muted mt-1">
            Screenshot Showcase #{index + 1}
          </span>
        </div>
      )}

      <div className="absolute bottom-4 right-4 px-3 py-1 rounded bg-black/70 text-white text-xs font-mono backdrop-blur-md z-10">
        {index + 1} / {total}
      </div>
    </div>
  );
};

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  images = [],
  title,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const displayImages =
    images.length > 0
      ? images
      : [
          `/projects/preview-1.jpg`,
          `/projects/preview-2.jpg`,
          `/projects/preview-3.jpg`,
        ];

  return (
    <div className="space-y-4">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl border border-border-warm bg-surface shadow-card">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayImages.map((img, idx) => (
              <GallerySlide
                key={idx}
                img={img}
                title={title}
                index={idx}
                total={displayImages.length}
              />
            ))}
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-surface/90 border border-border-warm text-ink hover:bg-white hover:text-primary transition-colors shadow-xs cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-surface/90 border border-border-warm text-ink hover:bg-white hover:text-primary transition-colors shadow-xs cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dot Indicator */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center space-x-1.5">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className="p-2 flex items-center justify-center cursor-pointer group focus:outline-none"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className={`h-2.5 rounded-full transition-all ${
                  idx === selectedIndex ? "w-8 bg-primary" : "w-2.5 bg-border-warm group-hover:bg-ink-muted"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
