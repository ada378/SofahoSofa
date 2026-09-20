import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHome, FiGrid, FiSearch, FiLayers, FiHeart, FiShoppingBag } from "react-icons/fi";

export default function MobileBottomNav({ onOpenSearch }) {
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isCollections = location.pathname.startsWith("/collections");
  const isWishlist = location.pathname === "/wishlist";

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-sand shadow-floating px-1 py-1 flex items-center justify-around text-center select-none font-nav pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
      {/* Home Link */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-xl transition-all ${
          isHome ? "text-brand-terracotta font-bold" : "text-brand-charcoal/70 hover:text-brand-charcoal"
        }`}
      >
        <FiHome className="text-lg leading-none" />
        <span className="text-[10px] mt-0.5 font-semibold leading-tight">Home</span>
      </Link>

      {/* Collections */}
      <Link
        to="/collections/all"
        className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-xl transition-all ${
          isCollections ? "text-brand-terracotta font-bold" : "text-brand-charcoal/70 hover:text-brand-charcoal"
        }`}
      >
        <FiGrid className="text-lg leading-none" />
        <span className="text-[10px] mt-0.5 font-semibold leading-tight">Catalog</span>
      </Link>

      {/* Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-xl text-brand-charcoal/70 hover:text-brand-charcoal transition-all"
        aria-label="Search"
      >
        <FiSearch className="text-lg leading-none" />
        <span className="text-[10px] mt-0.5 font-semibold leading-tight">Search</span>
      </button>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-xl transition-all relative ${
          isWishlist ? "text-brand-terracotta font-bold" : "text-brand-charcoal/70 hover:text-brand-charcoal"
        }`}
      >
        <FiHeart className="text-lg leading-none" />
        <span className="text-[10px] mt-0.5 font-semibold leading-tight">Saved</span>
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 right-1 bg-brand-terracotta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart Drawer */}
      <button
        onClick={openDrawer}
        className="flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-xl text-brand-charcoal/70 hover:text-brand-charcoal transition-all relative"
        aria-label="Shopping Cart"
      >
        <FiShoppingBag className="text-lg leading-none" />
        <span className="text-[10px] mt-0.5 font-semibold leading-tight">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 right-1 bg-brand-terracotta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
}
