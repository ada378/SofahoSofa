import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../api/axios";

const TABS = [
  { id: "all", label: "All Bestsellers", apiParam: { isBestSeller: true } },
  { id: "sofa", label: "Sofa Sets", apiParam: { isBestSeller: true } },
  { id: "bed", label: "Beds", apiParam: { isBestSeller: true } },
  { id: "recliner", label: "Recliners", apiParam: { isBestSeller: true } },
  { id: "dining-table", label: "Dining Sets", apiParam: { isBestSeller: true } },
  { id: "chair", label: "Chairs", apiParam: { isBestSeller: true } },
];

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

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {
      limit: 8,
      isBestSeller: true,
      ...(activeTab !== "all" && { category: activeTab }),
    };
    api.get("/products", { params })
      .then(({ data }) => {
        const list = data.products || [];
        if (list.length === 0) {
          // Fallback: show featured products if no bestsellers
          return api.get("/products", { params: { limit: 8, isFeatured: true } });
        }
        return { data: { products: list } };
      })
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">Loved by 25,000+ Indian Homes</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">Curated Bestsellers</h2>
          <p className="text-brand-muted text-xs sm:text-sm mt-2">
            Engineered with solid seasoned hardwood frames, multi-density cushioning, and stain-resistant designer fabrics.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-brand-charcoal text-white shadow-subtle" : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length > 0
              ? products.map((product) => <ProductCard key={product._id} product={product} />)
              : (
                <div className="col-span-full text-center py-10 text-brand-muted text-sm">
                  <p>No bestsellers found in this category yet.</p>
                  <Link to="/collections/all" className="text-brand-terracotta font-semibold hover:underline mt-2 inline-block">
                    Browse All Collections →
                  </Link>
                </div>
              )
          }
        </div>

        <div className="text-center mt-10">
          <Link to={activeTab === "all" ? "/collections/all" : `/collections/${activeTab}`}
            className="inline-flex items-center gap-2 bg-brand-porcelain border border-brand-sand hover:border-brand-terracotta hover:text-brand-terracotta text-brand-charcoal px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-subtle group">
            <span>Explore All {TABS.find((t) => t.id === activeTab)?.label}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
