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

        {/* WhatsApp & Call Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://wa.me/917800001198?text=Hi! I'm interested in your furniture collection"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-subtle group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp Us</span>
          </a>
          
          <a
            href="tel:+917800001198"
            className="inline-flex items-center gap-2 bg-brand-charcoal hover:bg-brand-terracotta text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-subtle group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>+91 7800001198</span>
          </a>
        </div>
      </div>
    </section>
  );
}
