import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import SEO from "../components/SEO";

export default function CustomerLogin() {
  const { login } = useCustomerAuth();
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
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-porcelain flex items-center justify-center py-12 px-4 sm:px-6 font-body">
      <SEO title="Customer Sign In | Sofa Hi Sofa" description="Log in to your Sofa Hi Sofa account to manage orders, track delivery, and save wishlists." />

      <div className="w-full max-w-md">
        {/* Top Header Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-brand-terracotta transition-colors shadow-md">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-brand-charcoal">Sofa Hi Sofa</span>
          </Link>
          <h1 className="text-xl font-bold text-brand-charcoal mt-2">Welcome Back!</h1>
          <p className="text-xs text-gray-500">Sign in to view your orders & account details</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-brand-sand rounded-3xl p-8 shadow-xl space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full border border-gray-200 focus:border-[#C86A3B] focus:outline-none rounded-2xl px-4 py-3 text-sm bg-brand-porcelain/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 focus:border-[#C86A3B] focus:outline-none rounded-2xl px-4 py-3 text-sm bg-brand-porcelain/50 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-semibold"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C86A3B] hover:bg-[#b85e32] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-[#C86A3B]/20"
            >
              {loading ? "Signing In…" : "Sign In to My Account"}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-[#C86A3B] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 font-semibold">
            ← Return to Sofa Hi Sofa Store
          </Link>
        </div>
      </div>
    </div>
  );
}
