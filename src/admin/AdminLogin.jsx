import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#C86A3B] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
            S
          </div>
          <h1 className="text-white font-bold text-xl mt-3">Sofa Hi Sofa</h1>
          <p className="text-gray-500 text-xs mt-1">Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-white font-bold text-lg">Sign In</h2>
            <p className="text-gray-500 text-xs mt-0.5">Admin access only</p>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-400 text-xs font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sofahisofa.com"
                className="w-full bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs font-medium"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C86A3B] hover:bg-[#b85e32] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In…
              </span>
            ) : (
              "Sign In to Admin Panel"
            )}
          </button>
        </form>

        <p className="text-center text-gray-700 text-xs mt-6">
          Sofa Hi Sofa © {new Date().getFullYear()} · Admin Panel
        </p>
      </div>
    </div>
  );
}
