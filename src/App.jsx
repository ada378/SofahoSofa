import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Store pages & components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import SeoPanel from "./pages/SeoPanel";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";
import MobileBottomNav from "./components/MobileBottomNav";
import FloatingContactButtons from "./components/FloatingContactButtons";
import LeadPopup from "./components/LeadPopup";

// Store contexts
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { UnifiedAuthProvider, useAdminAuth, useSeoAuth, useAuth } from "./context/UnifiedAuthContext";

// Customer auth pages
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerAccount from "./pages/CustomerAccount";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ProductManager from "./admin/ProductManager";
import CategoryManager from "./admin/CategoryManager";
import OrderManager from "./admin/OrderManager";
import UserManager from "./admin/UserManager";
import LeadManager from "./admin/LeadManager";

// SEO auth & pages
import SeoLogin from "./pages/SeoLogin";

// ── Scroll to top on route change ──────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ── Admin auth guard ────────────────────────────────────────────────────────────
function RequireAdmin({ children }) {
  const { admin, checking } = useAdminAuth();
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-[#C86A3B] rounded-full animate-spin" />
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

// ── Customer auth guard ─────────────────────────────────────────────────────────
function RequireCustomer({ children }) {
  const { customer, checking } = useAuth();
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#C86A3B] rounded-full animate-spin" />
      </div>
    );
  }
  if (!customer) return <Navigate to="/login" replace />;
  return children;
}

// ── SEO auth guard ──────────────────────────────────────────────────────────────
function RequireSeoAuth({ children }) {
  const { seoUser, checking } = useSeoAuth();
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!seoUser) return <Navigate to="/seo/login" replace />;
  return children;
}

// ── Store Shell ─────────────────────────────────────────────────────────────────
function StoreShell() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-brand-porcelain text-brand-charcoal font-body antialiased pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 w-full overflow-x-hidden">
          <Header
            onOpenSearch={() => setSearchOpen(true)}
          />
          <main className="flex-1 w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<ProductListing />} />
              <Route path="/collections/:slug" element={<ProductListing />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<RequireCustomer><Checkout /></RequireCustomer>} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/register" element={<CustomerRegister />} />
              <Route path="/account" element={<RequireCustomer><CustomerAccount /></RequireCustomer>} />
              <Route path="/my-orders" element={<RequireCustomer><CustomerAccount /></RequireCustomer>} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <CartDrawer />
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <MobileBottomNav onOpenSearch={() => setSearchOpen(true)} />
          <FloatingContactButtons />
          <LeadPopup />
          <Footer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

// ── Root App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <UnifiedAuthProvider>
      <ScrollToTop />
      <Routes>
        {/* SEO Panel standalone login & protected panel */}
        <Route path="/seo/login" element={<SeoLogin />} />
        <Route
          path="/seo"
          element={
            <RequireSeoAuth>
              <SeoPanel />
            </RequireSeoAuth>
          }
        />

        {/* ── Admin routes (dark standalone layout, no store header/footer) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          {/* Default /admin → dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="leads" element={<LeadManager />} />
          {/* SEO panel is embedded inside admin layout for Admin user */}
          <Route path="seo" element={<SeoPanel embedded />} />
        </Route>

        {/* ── Store routes ── */}
        <Route path="*" element={<StoreShell />} />
      </Routes>
    </UnifiedAuthProvider>
  );
}
