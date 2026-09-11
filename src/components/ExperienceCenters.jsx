import { experienceStudios } from "../data/sampleProducts";

export default function ExperienceCenters({ onOpenStoreModal }) {
  return (
    <section className="py-14 sm:py-20 bg-white border-y border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-brand-forest text-xs font-bold uppercase tracking-widest">
              Touch, Sit &amp; Feel
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
              Visit Our Flagship Experience Centers
            </h2>
            <p className="text-brand-muted text-xs sm:text-sm mt-1 max-w-xl">
              Experience the craftsmanship in person. Test foam firmness, browse 200+ fabric swatches, and speak with our in-house interior architects.
            </p>
          </div>

          <button
            onClick={onOpenStoreModal}
            className="mt-4 sm:mt-0 bg-brand-forest text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-brand-charcoal transition-colors shadow-subtle flex items-center gap-2 self-start sm:self-auto"
          >
            <span>📅 Book Free Store Visit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {experienceStudios.map((studio) => (
            <div
              key={studio.city}
              className="bg-brand-porcelain rounded-3xl p-4 border border-brand-sand shadow-subtle hover:shadow-card hover:border-brand-sandDark transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-3.5 bg-brand-sand/60">
                  <img
                    src={studio.image}
                    alt={`${studio.city} Experience Studio`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-brand-charcoal">
                    {studio.city}
                  </h3>
                  <span className="bg-brand-forestLight text-brand-forest text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Flagship Studio
                  </span>
                </div>

                <p className="font-medium text-xs text-brand-terracotta mt-0.5">
                  {studio.neighborhood}
                </p>

                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  {studio.address}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-sand/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-brand-muted">{studio.hours}</span>
                <button
                  onClick={onOpenStoreModal}
                  className="font-semibold text-brand-forest hover:text-brand-charcoal underline"
                >
                  Book Slot →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
