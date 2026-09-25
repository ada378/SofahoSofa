import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import api from "../api/axios";
import cache from "../api/cache";
import { FiPhoneCall } from "react-icons/fi";

export default function Header({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { customer } = useCustomerAuth();
  const location = useLocation();

  useEffect(() => {
    // Check cache first
    const cachedCategories = cache.get("categories");
    if (cachedCategories) {
      setCategories(cachedCategories);
      return;
    }
    
    api.get("/categories")
      .then(({ data }) => {
        setCategories(data);
        // Cache for 10 minutes
        cache.set("categories", data, 10 * 60 * 1000);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-sand shadow-subtle transition-all font-nav">
      {/* 1. Top Information Bar - Custom Content */}
      <div className="bg-[#FEF3C7] text-[#1F1A17] text-[10px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-6 border-b border-[#F59E0B]/30 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left Info Message */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
            <span className="bg-brand-forest text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 shadow-sm">
              🚚 Free Delivery in All Over India
            </span>
            <div className="text-[#1F1A17] font-bold text-[10px] sm:text-xs">
              <span className="hidden sm:inline">100% Solid Wood • </span>
              <span>10-Year Frame Warranty</span>
            </div>
          </div>

          {/* Helpline */}
          <div className="flex items-center justify-end flex-shrink-0 text-[10px] sm:text-xs">
            <a
              href="tel:+917800001198"
              className="text-[#1F1A17] hover:text-brand-terracotta font-bold flex items-center gap-1 transition-colors text-[10px] sm:text-xs whitespace-nowrap"
            >
              <span>📞 +91 7800001198</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-20 overflow-hidden">
        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-1 lg:hidden flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-1 text-brand-charcoal hover:bg-brand-sand/50 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center group flex-shrink-0">
          <img
            src="/logo-2.png"
            alt="Sofa Hi Sofa"
            className="h-16 sm:h-20 w-auto max-w-[140px] sm:max-w-[260px] object-contain transition-opacity group-hover:opacity-80"
          />
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
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 -mr-1 sm:mr-0">
          {/* Mobile Search Icon */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 text-brand-charcoal hover:bg-brand-sand/50 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-brand-charcoal hover:text-brand-terracotta hover:bg-brand-porcelain rounded-full transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-terracotta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Account Link */}
          {customer ? (
            <Link
              to="/account"
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 bg-brand-porcelain hover:bg-brand-sand/50 text-brand-charcoal rounded-full border border-brand-sand transition-all text-xs font-bold"
              title={`Account: ${customer.name}`}
            >
              <div className="w-6 h-6 bg-brand-charcoal text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {customer.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden md:inline truncate max-w-[90px]">{customer.name?.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="p-2 text-brand-charcoal hover:text-brand-terracotta hover:bg-brand-porcelain rounded-full transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Account Login"
              title="Sign In / Register"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={openDrawer}
            className="relative flex items-center gap-1.5 bg-brand-charcoal hover:bg-brand-terracotta text-white px-2.5 sm:px-3 py-2 rounded-full transition-all shadow-subtle font-bold text-xs group"
            aria-label="Shopping Cart"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-brand-terracotta group-hover:bg-brand-charcoal text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Quick Category Scroll Strip */}
      <div className="lg:hidden border-t border-brand-sand bg-brand-porcelain/90 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-semibold">
        <Link
          to="/collections/all"
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            location.pathname === "/collections/all"
              ? "bg-brand-terracotta text-white font-bold"
              : "bg-white text-brand-charcoal border border-brand-sand"
          }`}
        >
          ✨ All
        </Link>
        {categories.map((c) => {
          const isActive = location.pathname === `/collections/${c.slug}`;
          return (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-brand-terracotta text-white font-bold"
                  : "bg-white text-brand-charcoal border border-brand-sand"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>


      {/* 3. Horizontal Category Navigation Strip (Desktop) */}
      <div className="hidden lg:block border-t border-brand-sand bg-brand-porcelain/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-7 py-2 text-xs font-semibold tracking-wide">
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

          <div className="flex items-center gap-4 text-xs font-bold text-brand-forest py-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-forest animate-pulse" />
              10-Year Solid Hardwood Warranty
            </span>
            <Link to="/contact" className="text-brand-terracotta hover:underline font-bold text-xs flex items-center gap-1">
              <FiPhoneCall className="text-sm" /> Contact Us
            </Link>
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
            <a
              href="tel:+917800001198"
              className="w-full p-2.5 text-center text-xs font-bold text-brand-charcoal flex items-center justify-center gap-2 bg-brand-sand/40 rounded-xl"
            >
              <span>📞 Helpline: +91 7800001198</span>
            </a>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 text-center text-xs font-bold text-brand-terracotta flex items-center justify-center gap-2 bg-brand-terracotta/10 rounded-xl border border-brand-terracotta/20"
            >
              <span>📍 Contact Us & Showroom</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
