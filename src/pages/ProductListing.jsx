import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { categories, sampleProducts } from "../data/sampleProducts";

export default function ProductListing() {
  const { slug } = useParams();

  // Selected Category
  const isAll = !slug || slug === "all";
  const currentCategory = isAll
    ? {
        name: "All Furniture & Living Collections",
        slug: "all",
        tagline: "Explore handcrafted solid wood sofas, recliners, beds, and dining sets.",
      }
    : categories.find((c) => c.slug === slug) || {
        name: slug.replace(/-/g, " ").toUpperCase(),
        slug,
        tagline: "Handcrafted direct from our 1,00,000 sq.ft manufacturing facility.",
      };

  // Filter States
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedSeating, setSelectedSeating] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Available Filter Options
  const materials = ["Sheesham", "Teak", "Sal", "Bouclé", "Velvet", "Leatherette", "Linen"];
  const seatings = ["1-Seater", "2-Seater", "3-Seater", "L-Shape", "King", "Queen", "6-Seater", "4-Seater"];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let list = isAll ? [...sampleProducts] : sampleProducts.filter((p) => p.category === slug);

    // Price Filter
    if (selectedPriceRange === "under-25k") list = list.filter((p) => p.price < 25000);
    else if (selectedPriceRange === "25k-40k") list = list.filter((p) => p.price >= 25000 && p.price <= 40000);
    else if (selectedPriceRange === "40k-60k") list = list.filter((p) => p.price > 40000 && p.price <= 60000);
    else if (selectedPriceRange === "above-60k") list = list.filter((p) => p.price > 60000);

    // Material Filter
    if (selectedMaterial !== "all") {
      list = list.filter((p) => p.material.toLowerCase().includes(selectedMaterial.toLowerCase()));
    }

    // Seating Filter
    if (selectedSeating !== "all") {
      list = list.filter((p) =>
        (p.seatingCapacity && p.seatingCapacity.toLowerCase().includes(selectedSeating.toLowerCase())) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(selectedSeating.toLowerCase()))
      );
    }

    // Sorting
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") list.sort((a, b) => (b.isNewLaunch ? 1 : 0) - (a.isNewLaunch ? 1 : 0));

    return list;
  }, [slug, isAll, selectedPriceRange, selectedMaterial, selectedSeating, sortBy]);

  const clearFilters = () => {
    setSelectedPriceRange("all");
    setSelectedMaterial("all");
    setSelectedSeating("all");
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedPriceRange !== "all" || selectedMaterial !== "all" || selectedSeating !== "all";

  return (
    <div className="bg-brand-porcelain min-h-screen py-6 sm:py-10">
      <SEO
        title={`${currentCategory.name} | Buy Online | Sofa Hi Sofa`}
        description={`Explore our luxury collection of ${currentCategory.name}. Solid wood frame, 200+ bespoke fabric swatches, 10-Year Warranty & Free Pan-India Delivery.`}
        canonical={`https://www.sofahisofa.com/collections/${currentCategory.slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-4">
          <Link to="/" className="hover:text-brand-charcoal transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/collections/all" className="hover:text-brand-charcoal transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-brand-charcoal font-semibold">{currentCategory.name}</span>
        </nav>

        {/* Collection Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand shadow-subtle mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="bg-brand-amberLight text-brand-amber text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              100% Solid Wood · Direct Factory
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-brand-charcoal mt-2">
              {currentCategory.name}
            </h1>
            <p className="text-brand-muted text-xs sm:text-sm mt-2 leading-relaxed">
              {currentCategory.tagline}
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

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-brand-sand shadow-subtle space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                <h3 className="font-display text-base text-brand-charcoal">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-brand-terracotta hover:underline font-semibold"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2.5">
                  Price Range
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-25k", label: "Under ₹25,000" },
                    { id: "25k-40k", label: "₹25,000 - ₹40,000" },
                    { id: "40k-60k", label: "₹40,000 - ₹60,000" },
                    { id: "above-60k", label: "Above ₹60,000" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 cursor-pointer text-brand-charcoal/80 hover:text-brand-charcoal"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === opt.id}
                        onChange={() => setSelectedPriceRange(opt.id)}
                        className="accent-brand-terracotta"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2.5">
                  Material &amp; Wood
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedMaterial("all")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      selectedMaterial === "all"
                        ? "bg-brand-charcoal text-white"
                        : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal border border-brand-sand"
                    }`}
                  >
                    All
                  </button>
                  {materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        selectedMaterial === mat
                          ? "bg-brand-terracotta text-white font-semibold"
                          : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal border border-brand-sand"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating / Size Filter */}
              <div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2.5">
                  Seating / Capacity
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSeating("all")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      selectedSeating === "all"
                        ? "bg-brand-charcoal text-white"
                        : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal border border-brand-sand"
                    }`}
                  >
                    All Sizes
                  </button>
                  {seatings.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => setSelectedSeating(seat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        selectedSeating === seat
                          ? "bg-brand-terracotta text-white font-semibold"
                          : "bg-brand-porcelain text-brand-muted hover:text-brand-charcoal border border-brand-sand"
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar (Count & Sorting) */}
            <div className="bg-white rounded-2xl p-4 border border-brand-sand shadow-subtle flex items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-brand-muted font-medium">
                Showing <strong className="text-brand-charcoal font-semibold">{filteredProducts.length}</strong> handcrafted designs
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="lg:hidden bg-brand-porcelain border border-brand-sand text-brand-charcoal px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>⚡ Filters</span>
                  {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-terracotta" />}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="hidden sm:inline text-xs text-brand-muted font-medium">
                    Sort By:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-1.5 text-xs text-brand-charcoal font-semibold focus:outline-none focus:border-brand-terracotta cursor-pointer"
                  >
                    <option value="featured">Featured &amp; Bestselling</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                    <option value="newest">New Releases</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
              <div className="lg:hidden bg-white p-5 rounded-3xl border border-brand-sand shadow-card space-y-4 animate-slide-up">
                <div className="flex justify-between items-center pb-2 border-b border-brand-sand">
                  <h3 className="font-display text-base text-brand-charcoal">Filter Options</h3>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="text-xs font-semibold text-brand-terracotta"
                  >
                    Close ✕
                  </button>
                </div>

                {/* Price Radio */}
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal uppercase mb-2">Price</h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      { id: "all", label: "All Prices" },
                      { id: "under-25k", label: "Under ₹25k" },
                      { id: "25k-40k", label: "₹25k - ₹40k" },
                      { id: "40k-60k", label: "₹40k - ₹60k" },
                      { id: "above-60k", label: "Above ₹60k" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedPriceRange(opt.id)}
                        className={`p-2 rounded-xl text-left border ${
                          selectedPriceRange === opt.id
                            ? "bg-brand-charcoal text-white border-brand-charcoal"
                            : "bg-brand-porcelain border-brand-sand text-brand-charcoal"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full bg-brand-sand text-brand-charcoal py-2 rounded-xl text-xs font-semibold"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            )}

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-sand shadow-subtle space-y-4">
                <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-3xl">
                  🔍
                </div>
                <h3 className="font-display text-xl text-brand-charcoal">No products match your selected filters</h3>
                <p className="text-brand-muted text-xs sm:text-sm max-w-md mx-auto">
                  Try clearing some filter criteria or browse our other handcrafted collections.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-brand-charcoal text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
