import { Link } from "react-router-dom";

const rooms = [
  {
    title: "Warm Minimalist Living Room",
    subtitle: "Neutral Bouclé Sofas + Solid Walnut Accents",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    link: "/collections/sofa-sets",
    tag: "Shop Living Room",
  },
  {
    title: "Spacious Family Entertainment Lounge",
    subtitle: "L-Shape Modular Sectionals + Swivel Recliners",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    link: "/collections/l-shape-sofas",
    tag: "Shop Sectionals",
  },
  {
    title: "Sanctuary Master Bedroom",
    subtitle: "Fluted Solid Sheesham King Beds + Storage Benches",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    link: "/collections/beds",
    tag: "Shop Bedroom",
  },
  {
    title: "Contemporary Dining & Hosting",
    subtitle: "6-Seater Solid Teak Tables + Cushioned Spindle Chairs",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    link: "/collections/dining",
    tag: "Shop Dining",
  },
];

export default function RoomLookbook() {
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
            <Link
              key={idx}
              to={room.link}
              className="group block relative rounded-3xl overflow-hidden bg-white border border-brand-sand/80 shadow-subtle hover:shadow-cardHover transition-all duration-300"
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
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-amber">
                    {room.tag}
                  </span>
                  <h3 className="font-display text-lg font-bold leading-tight mt-1 text-white group-hover:text-brand-amber transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 line-clamp-1">
                    {room.subtitle}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-brand-amber">
                    <span>View Room Style</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
