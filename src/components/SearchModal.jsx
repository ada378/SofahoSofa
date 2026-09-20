import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all products once when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (allProducts.length > 0) return; // already loaded
    setLoading(true);
    api
      .get("/products?limit=200")
      .then(({ data }) => {
        // API may return { products: [...] } or plain array
        const list = Array.isArray(data) ? data : data.products ?? [];
        setAllProducts(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [searchTerm, allProducts]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug) => {
    onClose();
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
              className="w-5 h-5 text-brand-muted ml-1 flex-shrink-0"
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
              placeholder="Search sofas, recliners, beds, fabrics..."
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
              className="ml-2 text-xs font-semibold text-brand-muted hover:text-brand-charcoal px-2 py-1 rounded-lg hover:bg-brand-sand/60 flex-shrink-0"
            >
              ESC
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-8 flex items-center justify-center gap-2 text-brand-muted text-sm">
              <span className="w-4 h-4 border-2 border-brand-sand border-t-brand-terracotta rounded-full animate-spin" />
              Loading products...
            </div>
          )}

          {/* Quick Search Tags */}
          {!loading && !searchTerm && (
            <div className="py-4">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sofa",
                  "Recliner",
                  "L-Shape",
                  "King Bed",
                  "Dining Table",
                  "Chair",
                  "Sectional",
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
          {!loading && searchTerm && (
            <div className="py-3 max-h-96 overflow-y-auto space-y-2">
              <p className="text-xs text-brand-muted font-medium px-1">
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for &quot;{searchTerm}&quot;
              </p>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-brand-muted text-sm">
                  No products found. Try "Sofa", "Recliner", or "Bed".
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const imageUrl =
                    product.images?.[0]?.url ||
                    product.images?.[0] ||
                    product.image ||
                    "";
                  const price = product.price ?? product.basePrice ?? 0;
                  const mrp = product.marketPrice ?? product.mrp ?? price;
                  return (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white hover:bg-brand-cream/80 border border-brand-sand/60 cursor-pointer transition-colors"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-brand-sand flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-brand-sand flex-shrink-0 flex items-center justify-center text-xl">
                          🛋️
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-brand-charcoal truncate">
                          {product.name}
                        </h4>
                        {product.material && (
                          <p className="text-[11px] text-brand-muted truncate">
                            {product.material}
                            {product.category ? ` · ${product.category}` : ""}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-semibold text-xs text-brand-charcoal">
                            ₹{Number(price).toLocaleString("en-IN")}
                          </span>
                          {mrp > price && (
                            <span className="text-[10px] text-brand-muted line-through">
                              ₹{Number(mrp).toLocaleString("en-IN")}
                            </span>
                          )}
                          {product.rating && (
                            <span className="text-[10px] text-brand-forest font-medium">
                              ★ {product.rating}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-brand-terracotta text-xs font-semibold flex-shrink-0 pr-2">
                        View →
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
