import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "Chair Sofa Premium",
    category: "Sofa",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789881844/sofa-hi-sofa/sofa/Chair_Lucknow_Sofa_62.png",
  },
  {
    id: 2,
    title: "Luxury Bed Collection",
    category: "Bed",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789882027/sofa-hi-sofa/bed/luxury_beds_from_lucknow_Sofahisofa_2.png",
  },
  {
    id: 3,
    title: "Premium Sofa Design",
    category: "Sofa",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789841569/sofa-hi-sofa/sofa/luxury_Sofa_from_Lucknow_Sofahosofa_67.png",
  },
  {
    id: 4,
    title: "Elegant Sofa Collection",
    category: "Sofa",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789841576/sofa-hi-sofa/sofa/luxury_Sofa_from_Lucknow_Sofahosofa_69.png",
  },
  {
    id: 5,
    title: "Premium Bed Design",
    category: "Bed",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789882048/sofa-hi-sofa/bed/luxury_beds_from_lucknow_Sofahisofa_7.png",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-brand-porcelain border-b border-brand-sand/70">
      <div className="relative aspect-[16/9] sm:aspect-[16/7] lg:aspect-[21/8] overflow-hidden shadow-card bg-white group">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute bottom-6 left-6">
            <span className="bg-white/95 backdrop-blur-sm text-brand-charcoal px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {slide.category}
            </span>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 right-6 flex gap-2 bg-black/50 backdrop-blur-md p-2 rounded-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? "bg-white w-8" : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 text-brand-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
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
