import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import cache from "../api/cache";
import { 
  FiHome, 
  FiSquare, 
  FiBox, 
  FiClock, 
  FiGrid,
  FiLayers,
  FiCircle
} from "react-icons/fi";

const CATEGORY_ICONS = {
  "sofa":            <FiHome />,
  "sofa-sets":       <FiHome />,
  "l-shape-sofas":   <FiLayers />,
  "bed":             <FiSquare />,
  "solid-wood-beds": <FiSquare />,
  "recliner":        <FiBox />,
  "recliners":       <FiBox />,
  "dining-table":    <FiGrid />,
  "dining-sets":     <FiGrid />,
  "chair":           <FiCircle />,
  "accent-chairs":   <FiCircle />,
  "center-table":    <FiGrid />,
  "side-table":      <FiGrid />,
  "wall-clock":      <FiClock />,
  "mirror":          <FiSquare />,
};

const DEFAULT_ICON = <FiHome />;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-brand-sand animate-pulse flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-xl bg-brand-sand" />
      <div className="h-3 bg-brand-sand rounded w-3/4" />
    </div>
  );
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache first
    const cachedCategories = cache.get("categories");
    if (cachedCategories) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }
    
    api.get("/categories")
      .then(({ data }) => {
        setCategories(data);
        cache.set("categories", data, 10 * 60 * 1000);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-brand-porcelain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">Explore Our Range</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">Shop by Category</h2>
          </div>
          <Link to="/collections/all"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-semibold text-brand-terracotta hover:text-brand-charcoal transition-colors inline-flex items-center gap-1 group">
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : categories.map((c) => {
                const icon = CATEGORY_ICONS[c.slug] || DEFAULT_ICON;
                return (
                  <Link
                    key={c.slug}
                    to={`/collections/${c.slug}`}
                    className="group flex flex-col items-center text-center bg-white rounded-2xl p-3 sm:p-4 border border-brand-sand/80 hover:border-brand-terracotta shadow-subtle hover:shadow-cardHover transition-all duration-300"
                  >
                    {c.image?.url ? (
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-brand-sand/40 mb-2">
                        <img
                          src={c.image.url}
                          alt={c.image.alt || c.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-brand-porcelain group-hover:bg-brand-cream flex items-center justify-center mb-2 transition-colors text-brand-terracotta text-3xl sm:text-4xl">
                        {icon}
                      </div>
                    )}
                    <h3 className="font-semibold text-[11px] sm:text-xs text-brand-charcoal group-hover:text-brand-terracotta transition-colors leading-tight">
                      {c.name}
                    </h3>
                  </Link>
                );
              })
          }
        </div>

      </div>
    </section>
  );
}
