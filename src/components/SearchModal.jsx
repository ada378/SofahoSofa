import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sampleProducts } from "../data/sampleProducts";

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return sampleProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug) => {
    onClose();
    setSearchTerm("");
    navigate(`/product/${slug}`);
  };

  const handleQuickTag = (tag) => {
    setSearchTerm(tag);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
        <div className="relative w-full max-w-2xl bg-brand-porcelain rounded-3xl p-6 shadow-card overflow-hidden border border-brand-sand">
          {/* Search Input Bar */}
          <div className="relative flex items-center border-b border-brand-sand pb-4">
            <svg
              className="w-5 h-5 text-brand-muted ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search sofas, recliners, wood beds, bouclé fabric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent pl-3 pr-8 py-1 text-base text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="p-1 text-brand-muted hover:text-brand-charcoal"
              >
                ✕
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-2 text-xs font-semibold text-brand-muted hover:text-brand-charcoal px-2 py-1 rounded-lg hover:bg-brand-sand/60"
            >
              ESC
            </button>
          </div>

          {/* Quick Search Tags */}
          {!searchTerm && (
            <div className="py-4">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "3-Seater Sofa",
                  "L-Shape Sectional",
                  "Electric Recliner",
                  "Sheesham King Bed",
                  "Solid Teak Dining",
                  "Bouclé Chair",
                  "Stain-Resistant Fabric",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickTag(tag)}
                    className="bg-white hover:bg-brand-sand/70 text-brand-charcoal border border-brand-sand px-3 py-1.5 rounded-full text-xs transition-colors"
                  >
                    🔍 {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchTerm && (
            <div className="py-3 max-h-96 overflow-y-auto space-y-2">
              <p className="text-xs text-brand-muted font-medium px-1">
                Found {filteredProducts.length} results for "{searchTerm}"
              </p>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-brand-muted text-sm">
                  No matching furniture found. Try searching for "Sofa", "Recliner", or "Bed".
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white hover:bg-brand-cream/80 border border-brand-sand/60 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.images?.[0]?.url || product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-brand-sand flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-brand-charcoal truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-brand-muted truncate">
                        {product.material} · {product.subCategory}
                      </p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-semibold text-xs text-brand-charcoal">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-brand-muted line-through">
                          ₹{product.marketPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-brand-forest font-medium">
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>
                    <span className="text-brand-terracotta text-xs font-semibold flex-shrink-0 pr-2">
                      View →
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
