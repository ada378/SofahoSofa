import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";
import SwatchModal from "./components/SwatchModal";
import StoreVisitModal from "./components/StoreVisitModal";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [swatchOpen, setSwatchOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);

  // Keyboard shortcut ⌘K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-brand-porcelain text-brand-charcoal font-body antialiased">
          {/* Main Navigation Header */}
          <Header
            onOpenSearch={() => setSearchOpen(true)}
            onOpenSwatchModal={() => setSwatchOpen(true)}
            onOpenStoreModal={() => setStoreOpen(true)}
          />

          {/* Page Routing */}
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onOpenSwatchModal={() => setSwatchOpen(true)}
                    onOpenStoreModal={() => setStoreOpen(true)}
                  />
                }
              />
              <Route path="/collections" element={<ProductListing />} />
              <Route path="/collections/:slug" element={<ProductListing />} />
              <Route
                path="/product/:slug"
                element={<ProductDetail onOpenSwatchModal={() => setSwatchOpen(true)} />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route
                path="*"
                element={
                  <Home
                    onOpenSwatchModal={() => setSwatchOpen(true)}
                    onOpenStoreModal={() => setStoreOpen(true)}
                  />
                }
              />
            </Routes>
          </main>

          {/* Global Slide-overs & Modals */}
          <CartDrawer />
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <SwatchModal isOpen={swatchOpen} onClose={() => setSwatchOpen(false)} />
          <StoreVisitModal isOpen={storeOpen} onClose={() => setStoreOpen(false)} />

          {/* Rich Footer */}
          <Footer
            onOpenSwatchModal={() => setSwatchOpen(true)}
            onOpenStoreModal={() => setStoreOpen(true)}
          />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
