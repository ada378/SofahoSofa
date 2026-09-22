import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  FiBarChart2,
  FiBox,
  FiFolder,
  FiPackage,
  FiUsers,
  FiSearch,
  FiLogOut,
  FiExternalLink,
  FiMenu,
  FiX,
  FiUserPlus
} from "react-icons/fi";

const NAV = [
  { to: "/admin/dashboard", icon: FiBarChart2, label: "Dashboard" },
  { to: "/admin/products", icon: FiBox, label: "Products" },
  { to: "/admin/categories", icon: FiFolder, label: "Categories" },
  { to: "/admin/orders", icon: FiPackage, label: "Orders" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
  { to: "/admin/leads", icon: FiUserPlus, label: "Leads" },
  { to: "/admin/seo", icon: FiSearch, label: "SEO Panel" },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      {/* ── Mobile overlay ──────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C86A3B] rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              S
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">Sofa Hi Sofa</p>
              <p className="text-gray-500 text-[10px] truncate">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#C86A3B]/20 text-[#C86A3B] font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <Icon className="text-base flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin user + logout */}
        <div className="px-4 py-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{admin?.name || "Admin"}</p>
              <p className="text-gray-500 text-[10px] truncate">{admin?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            aria-label="Open sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-500 hover:text-[#C86A3B] transition-colors flex items-center gap-1.5"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
            </a>
            <span className="w-px h-4 bg-gray-700" />
            <span className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
