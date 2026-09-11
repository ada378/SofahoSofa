import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    badge: "✨ 100% Solid Wood · Direct Factory Pricing",
    title: "Handcrafted Comfort for Modern Living",
    subtitle:
      "Kiln-dried solid Sheesham hardwood, 200+ bespoke fabric swatches, and a 10-Year Comprehensive Warranty. Made in our 1 Lakh sq.ft factory, delivered straight to your living room.",
    primaryCta: { text: "Shop Sofas & Sectionals", link: "/collections/sofa-sets" },
    secondaryCta: { text: "Explore Recliners", link: "/collections/recliners" },
    featuredProduct: {
      name: "Kanha 3-Seater Sofa",
      specs: "Solid Sheesham · Bouclé Fabric",
      price: "₹28,990",
      marketPrice: "₹45,990",
      discount: "37% OFF",
      slug: "kanha-3-seater-fabric-sofa",
    },
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    badge: "🛋️ Modular Luxury & Reversible Chaise",
    title: "Spacious L-Shape Sectionals for Big Moments",
    subtitle:
      "Deep sink-in pocket spring seating, reversible modular lounger chaise, and stain-resistant velvet chenille fabric designed for everyday Indian family homes.",
    primaryCta: { text: "Explore L-Shape Sofas", link: "/collections/l-shape-sofas" },
    secondaryCta: { text: "View All Collections", link: "/collections/all" },
    featuredProduct: {
      name: "Raahi Modular Sectional",
      specs: "Reversible Chaise · Stain-Shield",
      price: "₹52,990",
      marketPrice: "₹84,990",
      discount: "38% OFF",
      slug: "raahi-l-shape-sectional-sofa",
    },
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    badge: "⚡ German OKIN Motors · Zero-Gravity",
    title: "Motorised Recliners with USB Fast Charging",
    subtitle:
      "Whisper-quiet German power mechanisms with infinite recline angles from 90° to 160°. Supreme ergonomic lumbar comfort for movie nights & deep reading.",
    primaryCta: { text: "Shop Motorised Recliners", link: "/collections/recliners" },
    secondaryCta: { text: "Solid Wood Beds", link: "/collections/beds" },
    featuredProduct: {
      name: "Rangeen Power Recliner",
      specs: "German Motor · Nappa Leatherette",
      price: "₹24,990",
      marketPrice: "₹39,990",
      discount: "38% OFF",
      slug: "rangeen-1-seater-electric-recliner",
    },
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Hero({ onOpenSwatchModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-brand-porcelain pt-4 pb-10 sm:py-12 border-b border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-cream border border-brand-sand px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-charcoal animate-fade-in shadow-subtle">
              {slide.badge}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-charcoal font-bold leading-[1.08] tracking-tight">
              {slide.title}
            </h1>

            <p className="text-brand-charcoal/80 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to={slide.primaryCta.link}
                className="bg-brand-charcoal text-white px-7 py-3.5 rounded-full text-sm font-bold hover:bg-brand-terracotta transition-all shadow-subtle flex items-center gap-2 group"
              >
                <span>{slide.primaryCta.text}</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <button
                onClick={onOpenSwatchModal}
                className="bg-white border border-brand-sand hover:border-brand-terracotta text-brand-charcoal hover:text-brand-terracotta px-6 py-3.5 rounded-full text-sm font-bold transition-all shadow-subtle flex items-center gap-2"
              >
                <span>🎨 Free Swatch Kit (₹0)</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-brand-sand/80 grid grid-cols-3 gap-4">
              <div>
                <p className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold">25,000+</p>
                <p className="text-xs text-brand-charcoal font-semibold mt-0.5">Homes Furnished</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-brand-forest font-bold">10-Year</p>
                <p className="text-xs text-brand-charcoal font-semibold mt-0.5">Wood Warranty</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-brand-amber font-bold">4.9 ★</p>
                <p className="text-xs text-brand-charcoal font-semibold mt-0.5">Verified Rating</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl sm:rounded-4xl overflow-hidden shadow-card border border-brand-sand/90 group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

              {/* Floating Product Tag Card */}
              <Link
                to={`/product/${slide.featuredProduct.slug}`}
                className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-floating border border-brand-sand flex items-center justify-between sm:gap-6 hover:bg-brand-porcelain transition-all"
              >
                <div>
                  <span className="text-[10px] text-brand-terracotta uppercase tracking-wider font-bold">Featured Masterpiece</span>
                  <h3 className="font-bold text-xs sm:text-sm text-brand-charcoal">{slide.featuredProduct.name}</h3>
                  <p className="text-[11px] text-brand-charcoal/70 font-medium">{slide.featuredProduct.specs}</p>
                </div>
                <div className="text-right pl-3">
                  <span className="bg-brand-forestLight text-brand-forest text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {slide.featuredProduct.discount}
                  </span>
                  <div className="font-display font-bold text-sm sm:text-base text-brand-charcoal mt-0.5">
                    {slide.featuredProduct.price}
                  </div>
                </div>
              </Link>

              {/* Slide Indicators */}
              <div className="absolute top-4 right-4 flex gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-full">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentSlide === idx ? "bg-white w-6" : "bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
