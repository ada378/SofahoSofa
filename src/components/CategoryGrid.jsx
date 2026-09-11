import { Link } from "react-router-dom";
import { categories } from "../data/sampleProducts";

export default function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 bg-brand-porcelain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
              Explore Living Spaces
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-semibold text-brand-terracotta hover:text-brand-charcoal transition-colors inline-flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Category Visual Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              className="group block bg-white rounded-3xl p-3 border border-brand-sand/80 hover:border-brand-sandDark shadow-subtle hover:shadow-cardHover transition-all duration-300 text-center"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-sand/50 mb-3">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              <h3 className="font-semibold text-xs sm:text-sm text-brand-charcoal group-hover:text-brand-terracotta transition-colors leading-tight">
                {c.name}
              </h3>
              <p className="text-[11px] text-brand-muted mt-0.5">
                {c.itemCount}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
