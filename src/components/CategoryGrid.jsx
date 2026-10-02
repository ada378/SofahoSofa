import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import cache from "../api/cache";

const CATEGORY_IMAGES = {
  "sofa":            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80",
  "sofa-sets":       "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80",
  "l-shape-sofas":   "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=150&q=80",
  "bed":             "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=150&q=80",
  "solid-wood-beds": "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=150&q=80",
  "recliner":        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80",
  "recliners":       "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80",
  "dining":          "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=150&q=80",
  "dining-table":    "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=150&q=80",
  "dining-sets":     "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=150&q=80",
  "chair":           "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=150&q=80",
  "accent-chairs":   "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=150&q=80",
  "center-table":    "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=150&q=80",
  "side-table":      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=150&q=80",
  "wall-clock":      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=150&q=80",
  "watches-and-clocks": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=150&q=80",
  "mirror":          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=150&q=80",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-brand-sand animate-pulse flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full bg-brand-sand" />
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
                const imageUrl = c.image?.url || CATEGORY_IMAGES[c.slug] || DEFAULT_IMAGE;
                return (
                  <Link
                    key={c.slug}
                    to={`/collections/${c.slug}`}
                    className="group flex flex-col items-center text-center bg-white rounded-2xl p-3 sm:p-4 border border-brand-sand/80 hover:border-brand-terracotta shadow-subtle hover:shadow-cardHover transition-all duration-300"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-brand-sand/40 mb-2 border border-brand-sand group-hover:border-brand-terracotta transition-colors">
                      <img
                        src={imageUrl}
                        alt={c.image?.alt || c.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
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
