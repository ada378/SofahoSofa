import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSeoAuth } from "../context/SeoAuthContext";

export default function SeoLogin() {
  const { login } = useSeoAuth();
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
      navigate("/seo", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "SEO Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto shadow-xl shadow-teal-900/30">
            🔍
          </div>
          <h1 className="text-white font-bold text-xl mt-3">SEO Control Panel</h1>
          <p className="text-slate-400 text-xs mt-1">Sofa Hi Sofa — Search Engine Optimization</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-white font-bold text-lg">SEO Sign In</h2>
            <p className="text-slate-400 text-xs mt-0.5">Enter SEO manager credentials to proceed</p>
          </div>

          {error && (
            <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">SEO Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seo@sofahisofa.com"
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">SEO Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-medium"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-teal-950/50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In…
              </span>
            ) : (
              "Sign In to SEO Panel"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <a href="/admin/login" className="hover:text-slate-300 transition-colors">Admin Login →</a>
          <a href="/" className="hover:text-slate-300 transition-colors">← Return to Store</a>
        </div>
      </div>
    </div>
  );
}
