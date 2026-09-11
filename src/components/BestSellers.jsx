import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { sampleProducts } from "../data/sampleProducts";

const tabs = [
  { id: "all", label: "All Bestsellers" },
  { id: "sofa-sets", label: "Sofa Sets" },
  { id: "l-shape-sofas", label: "L-Shape Sofas" },
  { id: "recliners", label: "Recliners" },
  { id: "beds", label: "Beds" },
  { id: "dining", label: "Dining Sets" },
];

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts =
    activeTab === "all"
      ? sampleProducts.filter((p) => p.isBestSeller || p.isFeatured).slice(0, 8)
      : sampleProducts.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
            Loved by 25,000+ Indian Homes
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
            Curated Bestsellers
          </h2>
          <p className="text-brand-muted text-xs sm:text-sm mt-2">
            Engineered with solid seasoned hardwood frames, multi-density cushioning, and stain-resistant designer fabrics.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-charcoal text-white shadow-subtle"
                  : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Collection Link */}
        <div className="text-center mt-10">
          <Link
            to={activeTab === "all" ? "/collections/all" : `/collections/${activeTab}`}
            className="inline-flex items-center gap-2 bg-brand-porcelain border border-brand-sand hover:border-brand-terracotta hover:text-brand-terracotta text-brand-charcoal px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-subtle group"
          >
            <span>Explore All {tabs.find((t) => t.id === activeTab)?.label}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
