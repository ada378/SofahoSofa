import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    title: "Chair Sofa Premium",
    category: "Sofa",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789881844/sofa-hi-sofa/sofa/Chair_Lucknow_Sofa_62.png",
  },
  {
    id: 2,
    title: "Luxury Beds from thesofahisofa.com",
    category: "Luxury Beds",
    image: "/hero2.jpeg",
  },
  {
    id: 3,
    title: "Premium Furniture Collection",
    category: "Featured",
    image: "/hero.png",
  },
  {
    id: 4,
    title: "Elegant Sofa Collection",
    category: "Sofa",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789841576/sofa-hi-sofa/sofa/luxury_Sofa_from_Lucknow_Sofahosofa_69.png",
  },
  {
    id: 5,
    title: "Luxury Beds from thesofahisofa.com",
    category: "Luxury Beds",
    image: "/hero5.jpeg",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative overflow-hidden bg-brand-porcelain border-b border-brand-sand/70 w-full">
      <div
        className="relative aspect-[4/3] sm:aspect-[16/7] lg:aspect-[21/8] overflow-hidden shadow-card bg-white group select-none w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category & Title Badge */}
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 flex flex-col gap-1 max-w-[70%]">
          <span className="bg-white/95 backdrop-blur-sm text-brand-charcoal px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg w-max">
            {slide.category}
          </span>
          {/* SEO H1 - Hidden visually but readable by screen readers and search engines */}
          {currentSlide === 0 && (
            <h1 className="sr-only">
              Handcrafted Luxury Sofas, Beds and Premium Furniture - Sofa Hi Sofa
            </h1>
          )}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md p-1.5 sm:p-2 rounded-full">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all ${
                currentSlide === idx ? "bg-white w-6 sm:w-8" : "bg-white/50 w-2 sm:w-2.5 hover:bg-white"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows (Desktop) */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 items-center justify-center"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 text-brand-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 items-center justify-center"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 text-brand-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
