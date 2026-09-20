import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";
import cache from "../api/cache";

// Skeleton loader card
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

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: undefined, max: undefined },
  { id: "under-25k", label: "Under ₹25,000", min: undefined, max: 24999 },
  { id: "25k-40k", label: "₹25,000 – ₹40,000", min: 25000, max: 40000 },
  { id: "40k-60k", label: "₹40,000 – ₹60,000", min: 40001, max: 60000 },
  { id: "above-60k", label: "Above ₹60,000", min: 60001, max: undefined },
];

const MATERIALS = ["Sheesham", "Teak", "Sal", "Bouclé", "Velvet", "Leatherette", "Linen"];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured & Bestselling" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Customer Rating" },
];

export default function ProductListing() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const isAll = !slug || slug === "all";

  // ── State ────────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // Filters (read initial values from URL query params if present)
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get("price") || "all");
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get("material") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const hasActiveFilters = selectedPriceRange !== "all" || selectedMaterial !== "all";

  // ── Fetch category SEO data ───────────────────────────────────────────────────
  useEffect(() => {
    if (isAll) {
      setCurrentCategory({
        name: "All Furniture & Living Collections",
        slug: "all",
        description: "Explore handcrafted solid wood sofas, recliners, beds, and dining sets.",
        metaTitle: "All Furniture Collections | Buy Online | Sofa Hi Sofa",
        metaDescription: "Shop our full range of handcrafted luxury furniture. 10-Year Warranty, 200+ fabrics & Free Pan-India Delivery.",
      });
      return;
    }
    api.get(`/categories/${slug}`)
      .then(({ data }) => setCurrentCategory(data))
      .catch(() => {
        setCurrentCategory({
          name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          slug,
          description: "Handcrafted direct from our 1,00,000 sq.ft manufacturing facility.",
          metaTitle: null,
          metaDescription: null,
        });
      });
  }, [slug, isAll]);

  // ── Fetch recently imported products for this category ───────────────────────
  useEffect(() => {
    setRecentLoading(true);
    
    // Check cache first
    const cacheKey = `recent_${slug || "all"}`;
    const cachedRecent = cache.get(cacheKey);
    if (cachedRecent) {
      setRecentProducts(cachedRecent);
      setRecentLoading(false);
      return;
    }

    const params = {
      limit: 4,
      isBestSeller: true,
      sort: "-createdAt",
      ...(!isAll && slug && { category: slug }),
    };

    api.get("/products", { params })
      .then(({ data }) => {
        const list = data.products || [];
        setRecentProducts(list);
        cache.set(cacheKey, list, 10 * 60 * 1000);
      })
      .catch(() => setRecentProducts([]))
      .finally(() => setRecentLoading(false));
  }, [slug, isAll]);

  // ── Fetch products ────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      const params = {
        page: p,
        limit: 12,
        ...(sortBy !== "featured" && { sort: sortBy }),
        // Only add category filter if a specific category is selected (not "all")
        ...(!isAll && slug && { category: slug }),
        ...(selectedMaterial !== "all" && { material: selectedMaterial }),
        ...(range?.min !== undefined && { minPrice: range.min }),
        ...(range?.max !== undefined && { maxPrice: range.max }),
      };

      const { data } = await api.get("/products", { params });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(p);

      // Sync filters to URL
      const qp = {};
      if (selectedPriceRange !== "all") qp.price = selectedPriceRange;
      if (selectedMaterial !== "all") qp.material = selectedMaterial;
      if (sortBy !== "featured") qp.sort = sortBy;
      setSearchParams(qp, { replace: true });
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug, isAll, selectedPriceRange, selectedMaterial, sortBy, setSearchParams]);

  // Re-fetch whenever filters or slug change (reset to page 1)
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedPriceRange("all");
    setSelectedMaterial("all");
    setSortBy("featured");
  };

  // ── SEO meta ─────────────────────────────────────────────────────────────────
  const seoTitle = currentCategory?.metaTitle
    || `${currentCategory?.name || "Collections"} | Buy Online | Sofa Hi Sofa`;
  const seoDesc = currentCategory?.metaDescription
    || `Explore our luxury collection of ${currentCategory?.name || "furniture"}. Solid wood frame, 200+ bespoke fabric swatches, 10-Year Warranty & Free Pan-India Delivery.`;
  const seoCanonical = `https://www.sofahisofa.com/collections/${isAll ? "all" : slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sofahisofa.com/" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://www.sofahisofa.com/collections/all" },
      ...(currentCategory && !isAll
        ? [{ "@type": "ListItem", position: 3, name: currentCategory.name, item: seoCanonical }]
        : []),
    ],
  };

  return (
    <div className="bg-brand-porcelain min-h-screen py-6 sm:py-10 w-full overflow-x-hidden">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={seoCanonical}
        jsonLd={breadcrumbJsonLd}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/collections/all" className="hover:text-brand-charcoal transition-colors">Collections</Link>
          {currentCategory && !isAll && (
            <>
              <span aria-hidden>/</span>
              <span className="text-brand-charcoal font-semibold">{currentCategory.name}</span>
            </>
          )}
        </nav>

        {/* Collection Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand shadow-subtle mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="bg-brand-amberLight text-brand-amber text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              100% Solid Wood · Direct Factory
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-brand-charcoal mt-2">
              {currentCategory?.name || "Collections"}
            </h1>
            <p className="text-brand-muted text-xs sm:text-sm mt-2 leading-relaxed">
              {currentCategory?.description || "Handcrafted direct from our 1,00,000 sq.ft manufacturing facility."}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-brand-cream/80 p-3 rounded-2xl border border-brand-sand text-xs text-brand-charcoal">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="font-bold">10-Year Warranty</p>
              <p className="text-brand-muted text-[11px]">Free White-Glove Installation</p>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6" aria-label="Filters">
            <div className="bg-white rounded-3xl p-5 border border-brand-sand shadow-subtle space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                <h3 className="font-display text-base text-brand-charcoal">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-brand-terracotta hover:underline font-semibold">
                    Reset All
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2.5">Price Range</h4>
                <div className="space-y-1.5 text-xs">
                  {PRICE_RANGES.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-brand-charcoal/80 hover:text-brand-charcoal">
                      <input type="radio" name="price" checked={selectedPriceRange === opt.id}
                        onChange={() => setSelectedPriceRange(opt.id)} className="accent-brand-terracotta" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2.5">Material & Wood</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setSelectedMaterial("all")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${selectedMaterial === "all" ? "bg-brand-charcoal text-white" : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal border border-brand-sand"}`}>
                    All
                  </button>
                  {MATERIALS.map((mat) => (
                    <button key={mat} onClick={() => setSelectedMaterial(mat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${selectedMaterial === mat ? "bg-brand-terracotta text-white font-semibold" : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal border border-brand-sand"}`}>
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-brand-sand shadow-subtle flex items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-brand-muted font-medium">
                {loading ? "Loading…" : (
                  <>Showing <strong className="text-brand-charcoal font-semibold">{total}</strong> handcrafted designs</>
                )}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="lg:hidden bg-brand-porcelain border border-brand-sand text-brand-charcoal px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <span>⚡ Filters</span>
                  {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-terracotta" />}
                </button>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="hidden sm:inline text-xs text-brand-muted font-medium">Sort By:</label>
                  <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-1.5 text-xs text-brand-charcoal font-semibold focus:outline-none focus:border-brand-terracotta cursor-pointer">
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
              <div className="lg:hidden bg-white p-5 rounded-3xl border border-brand-sand shadow-card space-y-4 animate-slide-up">
                <div className="flex justify-between items-center pb-2 border-b border-brand-sand">
                  <h3 className="font-display text-base text-brand-charcoal">Filter Options</h3>
                  <button onClick={() => setShowMobileFilter(false)} className="text-xs font-semibold text-brand-terracotta">Close ✕</button>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal uppercase mb-2">Price</h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {PRICE_RANGES.map((opt) => (
                      <button key={opt.id} type="button" onClick={() => setSelectedPriceRange(opt.id)}
                        className={`p-2 rounded-xl text-left border ${selectedPriceRange === opt.id ? "bg-brand-charcoal text-white border-brand-charcoal" : "bg-brand-porcelain border-brand-sand text-brand-charcoal"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="w-full bg-brand-sand text-brand-charcoal py-2 rounded-xl text-xs font-semibold">
                    Reset All Filters
                  </button>
                )}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                <p className="text-red-600 text-sm font-semibold">{error}</p>
                <button onClick={() => fetchProducts(page)}
                  className="bg-brand-charcoal text-white px-6 py-2 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors">
                  Try Again
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && !error && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-sand shadow-subtle space-y-4">
                <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-3xl">🔍</div>
                <h3 className="font-display text-xl text-brand-charcoal">No products match your selected filters</h3>
                <p className="text-brand-muted text-xs sm:text-sm max-w-md mx-auto">
                  Try clearing some filter criteria or browse our other handcrafted collections.
                </p>
                <button onClick={clearFilters}
                  className="bg-brand-charcoal text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full overflow-hidden">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button disabled={page === 1} onClick={() => fetchProducts(page - 1)}
                  className="px-4 py-2 border border-brand-sand rounded-xl text-xs font-semibold text-brand-charcoal disabled:opacity-40 hover:bg-brand-sand/50 transition-colors">
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-brand-muted text-xs">…</span>
                      ) : (
                        <button key={item} onClick={() => fetchProducts(item)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === item ? "bg-brand-charcoal text-white" : "border border-brand-sand text-brand-charcoal hover:bg-brand-sand/50"}`}>
                          {item}
                        </button>
                      )
                    )}
                </div>
                <button disabled={page === totalPages} onClick={() => fetchProducts(page + 1)}
                  className="px-4 py-2 border border-brand-sand rounded-xl text-xs font-semibold text-brand-charcoal disabled:opacity-40 hover:bg-brand-sand/50 transition-colors">
                  Next →
                </button>
              </div>
            )}

            {/* Recently Imported in this Category */}
            {!loading && recentProducts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-brand-sand space-y-6">
                <div className="text-center">
                  <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">✨ Fresh Arrivals</span>
                  <h3 className="font-display text-2xl text-brand-charcoal mt-1">Recently Imported</h3>
                  <p className="text-brand-muted text-xs sm:text-sm mt-1">Latest handcrafted furniture added to our collection</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full overflow-hidden">
                  {recentProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
