import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import SEO from "../components/SEO";
import api from "../api/axios";

export default function CustomerAccount() {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customer) {
      api.get("/orders/my")
        .then(({ data }) => setOrders(data))
        .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
        .finally(() => setLoadingOrders(false));
    }
  }, [customer]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-brand-porcelain flex items-center justify-center p-6 text-center">
        <div className="bg-white border border-brand-sand rounded-3xl p-8 max-w-sm w-full space-y-4 shadow-lg">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-xl mx-auto">
            👤
          </div>
          <h2 className="text-lg font-bold text-gray-900">Please Sign In</h2>
          <p className="text-xs text-gray-500">You must be logged in to view your profile and order details.</p>
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1 bg-[#C86A3B] text-white py-2.5 rounded-xl text-xs font-bold shadow-md">
              Sign In
            </Link>
            <Link to="/register" className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-porcelain py-10 px-4 sm:px-6 lg:px-8 font-body">
      <SEO title={`${customer.name}'s Account & Orders | Sofa Hi Sofa`} description="Manage your profile, shipping addresses, and track furniture orders." />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-sand rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
              {customer.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">{customer.name}</h1>
              <p className="text-xs text-gray-500 font-medium">{customer.email} • {customer.phone || "No phone set"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all self-start sm:self-auto"
          >
            Logout
          </button>
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-charcoal flex items-center gap-2">
              <span>📦</span> My Furniture Orders ({orders.length})
            </h2>
            <Link to="/collections" className="text-xs font-semibold text-[#C86A3B] hover:underline">
              Browse Store →
            </Link>
          </div>

          {loadingOrders ? (
            <div className="bg-white rounded-3xl border border-brand-sand p-12 text-center animate-pulse">
              <p className="text-xs font-bold text-gray-400">Loading order history…</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 rounded-3xl p-6 text-xs font-semibold border border-red-200">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-brand-sand p-12 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-brand-sand/50 rounded-full flex items-center justify-center text-xl mx-auto text-gray-500">
                🛋️
              </div>
              <h3 className="font-bold text-base text-gray-800">No Orders Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You haven't placed any furniture orders yet. Explore our handcrafted collections today!
              </p>
              <Link
                to="/collections"
                className="inline-block bg-[#C86A3B] text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-[#b85e32] transition-colors mt-2"
              >
                Shop Handcrafted Sofas
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const statusColors = {
                  Placed: "bg-blue-100 text-blue-700 border-blue-200",
                  Confirmed: "bg-amber-100 text-amber-800 border-amber-200",
                  Dispatched: "bg-purple-100 text-purple-800 border-purple-200",
                  Delivered: "bg-green-100 text-green-800 border-green-200",
                  Cancelled: "bg-red-100 text-red-800 border-red-200",
                };

                return (
                  <div key={ord._id} className="bg-white border border-brand-sand rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md">
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Order #{ord._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${statusColors[ord.status] || "bg-gray-100 text-gray-700"}`}>
                          ● {ord.status}
                        </span>
                        <span className="font-bold text-sm text-brand-charcoal">
                          ₹{ord.totalPrice?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-brand-porcelain/60 p-3 rounded-2xl">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80"}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-800 truncate">{item.name}</p>
                            {item.fabric && <p className="text-[10px] text-gray-500">Fabric: {item.fabric}</p>}
                            <p className="text-[11px] font-semibold text-gray-700 mt-1">
                              Qty: {item.qty} × ₹{item.price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <p className="font-bold text-xs text-brand-charcoal flex-shrink-0">
                            ₹{(item.price * item.qty)?.toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer Info */}
                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-wrap justify-between gap-4 text-xs text-gray-600 border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Shipping Address</p>
                        <p className="mt-0.5 font-medium">{ord.shippingAddress?.name || customer.name}, {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Payment Method</p>
                        <p className="mt-0.5 font-medium">{ord.paymentMethod || "COD / Online"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
