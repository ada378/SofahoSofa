import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function StatCard({ icon, label, value, sub, color = "bg-gray-800", loading }) {
  return (
    <div className={`${color} rounded-2xl p-5 border border-gray-800`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
          {loading ? (
            <div className="h-7 w-20 bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-white font-bold text-2xl">{value}</p>
          )}
          {sub && <p className="text-gray-500 text-[11px] mt-1">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

const STATUS_COLOR = {
  Placed: "bg-blue-900/50 text-blue-300",
  Confirmed: "bg-yellow-900/50 text-yellow-300",
  Dispatched: "bg-purple-900/50 text-purple-300",
  OutForDelivery: "bg-orange-900/50 text-orange-300",
  Delivered: "bg-green-900/50 text-green-300",
  Cancelled: "bg-red-900/50 text-red-300",
  Returned: "bg-gray-700 text-gray-300",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/admin/stats"),
      api.get("/orders/admin/stats"),
      api.get("/users/admin/stats"),
    ])
      .then(([prod, ord, usr]) => {
        setStats({ products: prod.data, orders: ord.data, users: usr.data });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page title */}
      <div>
        <h1 className="text-white font-bold text-xl">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🛋️" label="Total Products" value={stats?.products.total ?? "—"} sub={`${stats?.products.outOfStock ?? 0} out of stock`} loading={loading} />
        <StatCard icon="📦" label="Total Orders" value={stats?.orders.total ?? "—"} sub={`${stats?.orders.placed ?? 0} new pending`} loading={loading} />
        <StatCard icon="💰" label="Revenue (Delivered)" value={stats ? formatINR(stats.orders.revenue) : "—"} sub={`${stats?.orders.delivered ?? 0} delivered orders`} loading={loading} />
        <StatCard icon="👥" label="Customers" value={stats?.users.customers ?? "—"} sub={`${stats?.users.admins ?? 0} admins`} loading={loading} />
      </div>

      {/* Order Status Breakdown + Quick Links */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Order Status */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Order Status Breakdown</h3>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[
                ["Placed", stats?.orders.placed],
                ["Confirmed", stats?.orders.confirmed],
                ["Dispatched", stats?.orders.dispatched],
                ["Delivered", stats?.orders.delivered],
                ["Cancelled", stats?.orders.cancelled],
              ].map(([status, count]) => {
                const pct = stats?.orders.total > 0 ? Math.round((count / stats.orders.total) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md w-28 text-center flex-shrink-0 ${STATUS_COLOR[status]}`}>
                      {status}
                    </span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-[#C86A3B] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs font-semibold w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
          {[
            { to: "/admin/products?action=new", label: "➕ Add New Product", color: "bg-[#C86A3B]/20 text-[#C86A3B] border-[#C86A3B]/30" },
            { to: "/admin/categories?action=new", label: "📁 Add Category", color: "bg-blue-900/30 text-blue-300 border-blue-700/30" },
            { to: "/admin/orders?status=Placed", label: "📬 View New Orders", color: "bg-yellow-900/30 text-yellow-300 border-yellow-700/30" },
            { to: "/admin/products?filter=outofstock", label: "⚠️ Out of Stock", color: "bg-red-900/30 text-red-300 border-red-700/30" },
            { to: "/admin/seo", label: "🔍 SEO Panel", color: "bg-green-900/30 text-green-300 border-green-700/30" },
          ].map(({ to, label, color }) => (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-3 rounded-xl border text-xs font-semibold transition-opacity hover:opacity-80 ${color}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent daily orders chart (simple bar) */}
      {!loading && stats?.orders.recentOrders?.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold text-sm mb-5">Orders — Last 7 Days</h3>
          <div className="flex items-end gap-2 h-24">
            {stats.orders.recentOrders.map((d) => {
              const maxCount = Math.max(...stats.orders.recentOrders.map((r) => r.count));
              const heightPct = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
              return (
                <div key={d._id} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-gray-500 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {d.count}
                  </span>
                  <div className="w-full rounded-t-md bg-[#C86A3B]/70 hover:bg-[#C86A3B] transition-colors"
                    style={{ height: `${Math.max(heightPct, 4)}%` }} />
                  <span className="text-gray-600 text-[9px]">
                    {new Date(d._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product health */}
      {!loading && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "In Stock", value: stats.products.inStock, icon: "✅" },
            { label: "Out of Stock", value: stats.products.outOfStock, icon: "❌" },
            { label: "Bestsellers", value: stats.products.bestSeller, icon: "⭐" },
            { label: "New Launches", value: stats.products.newLaunch, icon: "🆕" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-gray-500 text-[11px]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
