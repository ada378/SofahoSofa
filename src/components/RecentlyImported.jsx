import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../api/axios";
import cache from "../api/cache";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-brand-sand overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-brand-sand" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-brand-sand rounded w-3/4" />
        <div className="h-3 bg-brand-sand rounded w-1/2" />
        <div className="h-4 bg-brand-sand rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

export default function RecentlyImported() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Check cache first
    const cachedProducts = cache.get("recently_imported");
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    api
      .get("/products", {
        params: {
          limit: 8,
          isBestSeller: true,
          sort: "-createdAt", // Newest first
        },
      })
      .then(({ data }) => {
        const list = data.products || [];
        setProducts(list);
        cache.set("recently_imported", list, 10 * 60 * 1000); // 10 min cache
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (products.length === 0 && !loading) {
    return null; // Don't show section if no products
  }

  return (
    <section className="py-12 sm:py-16 bg-brand-porcelain border-b border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">✨ Fresh Arrivals</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">Recently Imported</h2>
          <p className="text-brand-muted text-xs sm:text-sm mt-2">
            Latest handcrafted furniture added to our collection. Premium quality, direct from our manufacturing partners.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length > 0
              ? products.map((product) => <ProductCard key={product._id} product={product} />)
              : null}
        </div>

        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 bg-brand-charcoal hover:bg-brand-terracotta text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-subtle group"
            >
              <span>View All New Arrivals</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
