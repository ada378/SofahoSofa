import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["Placed","Confirmed","Dispatched","OutForDelivery","Delivered","Cancelled","Returned"];

const STATUS_COLOR = {
  Placed:         "bg-blue-900/50 text-blue-300 border-blue-800",
  Confirmed:      "bg-yellow-900/50 text-yellow-300 border-yellow-800",
  Dispatched:     "bg-purple-900/50 text-purple-300 border-purple-800",
  OutForDelivery: "bg-orange-900/50 text-orange-300 border-orange-800",
  Delivered:      "bg-green-900/50 text-green-300 border-green-800",
  Cancelled:      "bg-red-900/50 text-red-300 border-red-800",
  Returned:       "bg-gray-700 text-gray-300 border-gray-600",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${STATUS_COLOR[status] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
      {status}
    </span>
  );
}

function OrderDetailModal({ order, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, { status });
      onStatusUpdate(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-white font-bold">Order Details</h2>
            <p className="text-gray-500 text-xs font-mono mt-0.5">{order._id}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Customer */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-1 text-xs">
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-2">Customer</p>
            <p className="text-white font-semibold">{order.user?.name || order.guestInfo?.fullName || "Guest"}</p>
            <p className="text-gray-400">{order.user?.email || order.guestInfo?.email || "—"}</p>
            <p className="text-gray-400">{order.user?.phone || order.guestInfo?.phone || order.shippingAddress?.phone || "—"}</p>
            {!order.user && <span className="inline-block bg-yellow-900/50 text-yellow-300 border border-yellow-800 text-[10px] px-2 py-0.5 rounded-md font-bold">Guest Order</span>}
          </div>

          {/* Items */}
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-2">Order Items</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                  {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.name}</p>
                    {item.fabricChoice && <p className="text-gray-500 text-[10px]">Fabric: {item.fabricChoice}</p>}
                    <p className="text-gray-500 text-[10px]">Qty: {item.qty} × {formatINR(item.price)}</p>
                  </div>
                  <p className="text-white font-semibold text-xs flex-shrink-0">{formatINR(item.qty * item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-400"><span>Items Total</span><span>{formatINR(order.itemsPrice)}</span></div>
            <div className="flex justify-between text-gray-400"><span>Shipping</span><span className="text-green-400">FREE</span></div>
            <div className="flex justify-between text-white font-bold text-sm border-t border-gray-700 pt-2 mt-2">
              <span>Total</span><span>{formatINR(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px]">
              <span>Payment Method</span><span className="uppercase">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-800 rounded-xl p-4 text-xs">
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-2">Delivery Address</p>
            <p className="text-white">{order.shippingAddress?.line1}</p>
            {order.shippingAddress?.line2 && <p className="text-gray-400">{order.shippingAddress.line2}</p>}
            <p className="text-gray-400">{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
            {order.shippingAddress?.phone && <p className="text-gray-400">📞 {order.shippingAddress.phone}</p>}
          </div>

          {/* Status Update */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-3">
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Update Order Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    status === s
                      ? `${STATUS_COLOR[s]} ring-2 ring-offset-1 ring-offset-gray-800 ring-current`
                      : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800">Close</button>
          <button onClick={handleUpdate} disabled={saving || status === order.status}
            className="flex-1 bg-[#C86A3B] hover:bg-[#b85e32] disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold transition-colors">
            {saving ? "Saving…" : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchOrders = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15, ...(filterStatus && { status: filterStatus }) };
      const { data } = await api.get("/orders/admin/all", { params });
      setOrders(data.orders || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(p);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { fetchOrders(1); }, [fetchOrders]);

  const handleStatusUpdate = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => o._id === updatedOrder._id ? { ...o, status: updatedOrder.status } : o));
    showToast(`Status updated to "${updatedOrder.status}"`);
  };

  const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

  return (
    <div className="space-y-5 max-w-6xl">
      {toast && (
        <div className={`fixed top-16 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-bold text-xl">Orders</h1>
          <p className="text-gray-500 text-sm">{total} total orders</p>
        </div>
      </div>

      {/* Filter by status */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterStatus("")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${!filterStatus ? "bg-[#C86A3B]/20 text-[#C86A3B] border-[#C86A3B]/40" : "border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
          All Orders
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${filterStatus === s ? `${STATUS_COLOR[s]}` : "border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left px-4 py-3 font-semibold">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-semibold">Total</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-600">No orders found</td></tr>
                ) : orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-mono text-[10px]">{o._id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-600 text-[10px]">{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-white font-medium">{o.user?.name || o.guestInfo?.fullName || "Guest"}</p>
                      <p className="text-gray-600 text-[10px] truncate max-w-[140px]">{o.user?.email || o.guestInfo?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">{formatINR(o.totalPrice)}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedOrder(o)} className="text-[#C86A3B] hover:text-[#b85e32] font-semibold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
            <button disabled={page === 1} onClick={() => fetchOrders(page - 1)} className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-300 disabled:opacity-40 hover:bg-gray-800">← Prev</button>
            <span className="text-xs text-gray-500">Page {page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => fetchOrders(page + 1)} className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-300 disabled:opacity-40 hover:bg-gray-800">Next →</button>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate} />
      )}
    </div>
  );
}
