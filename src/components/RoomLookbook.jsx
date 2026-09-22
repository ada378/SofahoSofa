import { Link } from "react-router-dom";
import { useState } from "react";

const rooms = [
  {
    title: "Warm Minimalist Living Room",
    subtitle: "Neutral Bouclé Sofas + Solid Walnut Accents",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789881841/sofa-hi-sofa/sofa/Chair_Lucknow_Sofa_61.png",
    link: "/collections/sofa-sets",
    tag: "Shop Living Room",
  },
  {
    title: "Spacious Family Entertainment Lounge",
    subtitle: "L-Shape Modular Sectionals + Swivel Recliners",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789881848/sofa-hi-sofa/sofa/Chair_Lucknow_Sofa_65.png",
    link: "/collections/l-shape-sofas",
    tag: "Shop Sectionals",
  },
  {
    title: "Sanctuary Master Bedroom",
    subtitle: "Fluted Solid Sheesham King Beds + Storage Benches",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789882024/sofa-hi-sofa/bed/luxury_beds_from_lucknow_Sofahisofa_1.png",
    link: "/collections/beds",
    tag: "Shop Bedroom",
  },
  {
    title: "Contemporary Dining & Hosting",
    subtitle: "6-Seater Solid Teak Tables + Cushioned Spindle Chairs",
    image: "https://res.cloudinary.com/dgoe6emli/image/upload/v1789881861/sofa-hi-sofa/dining-table/Dining_set_with_Chair_Lucknow_Sofahisofa_11.png",
    link: "/collections/dining",
    tag: "Shop Dining",
  },
];

export default function RoomLookbook() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="py-14 sm:py-20 bg-brand-porcelain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
              Design Inspiration
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
              Shop by Living Space
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-semibold text-brand-terracotta hover:text-brand-charcoal transition-colors inline-flex items-center gap-1 group"
          >
            <span>Explore Complete Lookbook</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className="group block relative rounded-3xl overflow-hidden bg-white border border-brand-sand/80 shadow-subtle hover:shadow-cardHover transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={room.image}
                  alt={room.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end">
                  <Link
                    to={room.link}
                    className="text-[10px] uppercase font-bold tracking-widest text-brand-amber hover:underline"
                  >
                    {room.tag}
                  </Link>
                  <h3 className="font-display text-lg font-bold leading-tight mt-1 text-white group-hover:text-brand-amber transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 line-clamp-1">
                    {room.subtitle}
                  </p>
                  <button
                    onClick={() => setSelectedImage(room)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-brand-amber transition-colors"
                  >
                    <span>View Room Style</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-brand-amber transition-colors p-2 bg-black/50 rounded-full"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <div className="max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
