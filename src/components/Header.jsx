import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { categories } from "../data/sampleProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Header({ onOpenSearch, onOpenSwatchModal, onOpenStoreModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-sand shadow-subtle transition-all font-nav">
      {/* 1. Top High-Visibility Light Amber Announcement Bar (100% Black Text & Crisp Contrast) */}
      <div className="bg-[#FEF3C7] text-[#1F1A17] text-xs py-2 px-3 sm:px-6 border-b border-[#F59E0B]/30 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left Promo Message */}
          <div className="flex items-center gap-2">
            <span className="bg-[#C86A3B] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 shadow-sm">
              SALE
            </span>
            <div className="text-[#1F1A17] font-bold text-[11px] sm:text-xs">
              <span className="hidden sm:inline">Festival Living Offer: </span>
              <span>Flat 15% Off with Code </span>
              <span className="bg-white text-[#C86A3B] font-mono font-black px-2 py-0.5 rounded border border-[#C86A3B]/40 shadow-sm text-xs">
                SOFALUXE
              </span>
            </div>
          </div>

          {/* Right City Selector & Helpline */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 text-xs">
            {/* City Selector */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full border border-[#D97706]/40 shadow-sm">
              <span className="text-xs">📍</span>
              <span className="text-[#1F1A17] font-bold text-[11px] hidden sm:inline">Deliver to:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-[#1F1A17] font-bold text-[11px] cursor-pointer focus:outline-none"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi-NCR">Delhi-NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="All India">All India (19,000+ Pincodes)</option>
              </select>
            </div>

            {/* Helpline (Always Visible) */}
            <a
              href="tel:+919876543210"
              className="text-[#1F1A17] hover:text-[#C86A3B] font-bold flex items-center gap-1 transition-colors text-[11px] sm:text-xs whitespace-nowrap"
            >
              <span>📞 +91 98765 43210</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-brand-charcoal hover:bg-brand-sand/50 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center font-nav font-bold text-xl group-hover:bg-brand-terracotta transition-colors shadow-subtle flex-shrink-0">
            S
          </div>
          <div>
            <span className="font-nav text-2xl sm:text-3xl tracking-tight text-brand-charcoal font-bold group-hover:text-brand-terracotta transition-colors block leading-none">
              Sofa Hi Sofa
            </span>
            <span className="text-[9px] uppercase tracking-widest text-brand-charcoal font-bold block mt-1">
              Solid Wood · Bespoke Fabrics
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop Center) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-6">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full bg-brand-porcelain hover:bg-brand-sand/40 border border-brand-sand hover:border-brand-sandDark text-brand-charcoal text-left px-4 py-2.5 rounded-full text-xs flex items-center justify-between transition-all shadow-subtle group"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-brand-charcoal group-hover:text-brand-terracotta transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
              <span className="text-brand-charcoal font-medium group-hover:text-brand-terracotta">
                Search sofas, recliners, solid wood beds, fabrics...
              </span>
            </div>
            <kbd className="bg-white text-brand-charcoal text-[10px] font-black px-2 py-0.5 rounded-md border border-brand-sand font-mono shadow-inner">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 text-brand-charcoal hover:bg-brand-sand/50 rounded-xl transition-colors"
            aria-label="Search"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>

          {/* Experience Centers Button */}
          <button
            onClick={onOpenStoreModal}
            className="hidden md:flex items-center gap-1.5 bg-brand-porcelain hover:bg-white border border-brand-sand text-brand-charcoal px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-subtle hover:border-brand-sandDark"
          >
            <span>🏬 Experience Stores</span>
          </button>

          {/* Free Swatches Button */}
          <button
            onClick={onOpenSwatchModal}
            className="hidden sm:flex items-center gap-1.5 bg-brand-forestLight hover:bg-brand-forest text-brand-forest hover:text-white border border-brand-forest/30 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-subtle"
          >
            <span>🎨 Free Swatches (₹0)</span>
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2.5 text-brand-charcoal hover:text-brand-terracotta hover:bg-brand-porcelain rounded-full border border-transparent hover:border-brand-sand transition-all"
            aria-label="Wishlist"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openDrawer}
            className="relative flex items-center gap-2 bg-brand-charcoal hover:bg-brand-terracotta text-white px-3.5 py-2 rounded-full transition-all shadow-subtle font-bold text-xs group"
            aria-label="Shopping Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-brand-terracotta group-hover:bg-brand-charcoal text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Horizontal Category Navigation Strip (Desktop) */}
      <div className="hidden lg:block border-t border-brand-sand bg-brand-porcelain/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-7 py-2.5 text-xs font-semibold tracking-wide">
            <Link
              to="/collections/all"
              className={`transition-colors py-1 ${
                location.pathname === "/collections/all"
                  ? "text-brand-terracotta font-extrabold border-b-2 border-brand-terracotta"
                  : "text-brand-charcoal hover:text-brand-terracotta font-semibold"
              }`}
            >
              ✨ All Collections
            </Link>

            {categories.map((c) => {
              const isActive = location.pathname === `/collections/${c.slug}`;
              return (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  className={`transition-all py-1 ${
                    isActive
                      ? "text-brand-terracotta font-extrabold border-b-2 border-brand-terracotta"
                      : "text-brand-charcoal hover:text-brand-terracotta font-semibold"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 text-xs font-bold text-brand-forest py-2.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-forest animate-pulse" />
              10-Year Solid Hardwood Warranty
            </span>
          </div>
        </div>
      </div>

      {/* 4. Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-sand bg-white px-4 py-5 space-y-4 animate-slide-up shadow-card">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-2.5">
              Furniture Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/collections/all"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-brand-porcelain border border-brand-sand rounded-xl text-xs font-bold text-brand-terracotta flex items-center gap-2"
              >
                <span>✨ All Furniture</span>
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-brand-porcelain border border-brand-sand rounded-xl text-xs font-bold text-brand-charcoal hover:border-brand-terracotta transition-colors flex items-center gap-2"
                >
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-brand-sand pt-4 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSwatchModal();
              }}
              className="w-full text-left p-3 bg-brand-forestLight text-brand-forest rounded-2xl text-xs font-bold flex items-center justify-between border border-brand-forest/20"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎨</span>
                <span>Order Free Fabric Swatches (₹0)</span>
              </div>
              <span>→</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStoreModal();
              }}
              className="w-full text-left p-3 bg-brand-porcelain border border-brand-sand text-brand-charcoal rounded-2xl text-xs font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🏬</span>
                <span>Book Store Visit / Video Consult</span>
              </div>
              <span>→</span>
            </button>

            <a
              href="tel:+919876543210"
              className="w-full p-2.5 text-center text-xs font-bold text-brand-charcoal flex items-center justify-center gap-2 bg-brand-sand/40 rounded-xl"
            >
              <span>📞 Helpline: +91 98765 43210 (10 AM - 8 PM)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
