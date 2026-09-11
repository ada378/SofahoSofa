import { verifiedReviews } from "../data/sampleProducts";

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-20 bg-white border-y border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest">
            Real Homes · Verified Buyers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
            Hear From 25,000+ Happy Living Rooms
          </h2>
          <p className="text-brand-muted text-xs sm:text-sm mt-2">
            Unfiltered photos and reviews from homeowners across Bengaluru, Mumbai, Delhi, Hyderabad and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {verifiedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-brand-porcelain rounded-3xl p-5 border border-brand-sand shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-brand-sand/60">
                  <img
                    src={rev.homeImage}
                    alt={`Delivered home photo for ${rev.productName}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                  {"★★★★★".slice(0, rev.rating)}
                  <span className="text-[11px] text-brand-forest font-semibold ml-1 bg-brand-forestLight px-1.5 py-0.5 rounded">
                    ✓ Verified Buyer
                  </span>
                </div>

                <p className="text-xs text-brand-charcoal/90 italic leading-relaxed line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-brand-sand/60">
                <p className="font-semibold text-xs text-brand-charcoal">{rev.author}</p>
                <p className="text-[11px] text-brand-muted">{rev.city}</p>
                <p className="text-[10px] text-brand-terracotta font-medium mt-0.5 truncate">
                  Purchased: {rev.productName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
