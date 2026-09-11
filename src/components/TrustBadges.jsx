import { trustPillars } from "../data/sampleProducts";

export default function TrustBadges() {
  const getIcon = (type) => {
    switch (type) {
      case "wood":
        return "🪵";
      case "factory":
        return "🏭";
      case "shield":
        return "🛡️";
      case "swatch":
        return "🎨";
      case "truck":
        return "🚚";
      case "refresh":
        return "🔄";
      default:
        return "✨";
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-brand-porcelain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
            The Sofa Hi Sofa Promise
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
            Why Discerning Homeowners Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustPillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-brand-sand/80 shadow-subtle hover:shadow-card hover:border-brand-sandDark transition-all flex gap-4 items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-2xl flex-shrink-0 border border-brand-sand/60">
                {getIcon(p.icon)}
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-brand-charcoal">
                  {p.title}
                </h3>
                <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
