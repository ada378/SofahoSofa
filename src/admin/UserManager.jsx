import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 20, ...(search && { keyword: search }) };
      const { data } = await api.get("/users/admin/all", { params });
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(p);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!confirm(`Change ${user.name}'s role to "${newRole}"?`)) return;
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, role: newRole } : u));
      showToast(`${user.name} is now a ${newRole}`);
    } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Permanently delete ${user.name}?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setTotal((t) => t - 1);
      showToast("User deleted");
    } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className={`fixed top-16 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-bold text-xl">Users</h1>
          <p className="text-gray-500 text-sm">{total} registered users</p>
        </div>
        <input type="text" placeholder="Search by name or email…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 w-56" />
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left px-4 py-3 font-semibold">User</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Phone</th>
                  <th className="text-center px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-600">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.name}</p>
                          <p className="text-gray-500 text-[10px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${u.role === "admin" ? "bg-[#C86A3B]/20 text-[#C86A3B]" : "bg-gray-800 text-gray-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleRole(u)}
                          className="text-blue-400 hover:text-blue-300 font-semibold">
                          {u.role === "admin" ? "Make Customer" : "Make Admin"}
                        </button>
                        <button onClick={() => deleteUser(u)}
                          className="text-red-500 hover:text-red-400 font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
            <button disabled={page === 1} onClick={() => fetchUsers(page - 1)} className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-300 disabled:opacity-40 hover:bg-gray-800">← Prev</button>
            <span className="text-xs text-gray-500">Page {page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => fetchUsers(page + 1)} className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-300 disabled:opacity-40 hover:bg-gray-800">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
