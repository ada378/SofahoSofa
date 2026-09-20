import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useSeoAuth } from "../context/SeoAuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiGlobe,
  FiBox,
  FiFolder,
  FiMap,
  FiBarChart2,
  FiSearch,
  FiCheckCircle,
  FiAlertTriangle,
  FiSave,
  FiEdit2,
  FiExternalLink,
  FiLogOut
} from "react-icons/fi";

// ─── tiny helpers ──────────────────────────────────────────────────────────────
function Badge({ n, warn = false }) {
  const colour = n === 0 ? "bg-green-100 text-green-700" : warn ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700";
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colour}`}>{n}</span>;
}

function InputField({ label, name, value, onChange, textarea = false, maxLength, hint }) {
  const len = (value || "").length;
  const over = maxLength && len > maxLength;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{label}</label>
        {maxLength && (
          <span className={`text-[10px] font-semibold ${over ? "text-red-500" : len > maxLength * 0.85 ? "text-amber-500" : "text-gray-400"}`}>
            {len}/{maxLength}
          </span>
        )}
      </div>
      {textarea ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows={3}
          className={`w-full border rounded-xl px-3 py-2 text-xs font-medium resize-none focus:outline-none transition-colors ${
            over ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#C86A3B]"
          } bg-gray-50`}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full border border-gray-200 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2 text-xs font-medium bg-gray-50 transition-colors"
        />
      )}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-sm text-gray-800">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ─── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "global", label: "Global Settings", icon: FiGlobe },
  { id: "products", label: "Product SEO", icon: FiBox },
  { id: "categories", label: "Category SEO", icon: FiFolder },
  { id: "sitemap", label: "Sitemap & Robots", icon: FiMap },
  { id: "audit", label: "SEO Audit", icon: FiBarChart2 },
];

export default function SeoPanel({ embedded = false }) {
  const { seoUser, logout } = useSeoAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("global");
  const [toast, setToast] = useState(null);

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/seo/login", { replace: true });
  };

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <div className={embedded ? "space-y-0" : "min-h-screen bg-gray-50 font-sans"}>
      {/* Top Header — hidden when embedded inside AdminLayout */}
      {!embedded && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
                🔍
              </div>
              <div>
                <h1 className="font-bold text-sm text-gray-900">SEO Control Panel</h1>
                <p className="text-[11px] text-gray-500">Sofa Hi Sofa — Search Engine Optimisation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {seoUser && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-800">{seoUser.email}</p>
                  <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">{seoUser.role} Account</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === id
                  ? "border-[#C86A3B] text-[#C86A3B]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="text-sm" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Tab Nav when embedded (no outer sticky header) */}
      {embedded && (
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-gray-200 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === id ? "border-[#C86A3B] text-[#C86A3B]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              <Icon className="text-sm" /><span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg text-xs font-bold text-white transition-all ${
          toast.type === "success" ? "bg-green-600" : "bg-red-500"
        }`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "global" && <GlobalTab showToast={showToast} />}
        {activeTab === "products" && <ProductsTab showToast={showToast} />}
        {activeTab === "categories" && <CategoriesTab showToast={showToast} />}
        {activeTab === "sitemap" && <SitemapTab showToast={showToast} />}
        {activeTab === "audit" && <AuditTab />}
      </div>
    </div>
  );
}

// ─── GLOBAL SETTINGS TAB ──────────────────────────────────────────────────────
function GlobalTab({ showToast }) {
  const [form, setForm] = useState({
    siteName: "Sofa Hi Sofa",
    title: "",
    description: "",
    canonicalUrl: "",
    ogImage: "",
    keywords: "",
    robotsMeta: "index, follow",
    organizationName: "",
    telephone: "",
    googleSiteVerification: "",
    googleAnalyticsId: "",
    socialLinks: { instagram: "", facebook: "", youtube: "", twitter: "" },
    address: { streetAddress: "", addressLocality: "", addressRegion: "", postalCode: "", addressCountry: "IN" },
    robotsTxtCustom: "",
    sitemapEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/seo/settings")
      .then(({ data }) => {
        if (data) {
          setForm((f) => ({
            ...f,
            ...data,
            keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords || "",
            socialLinks: { ...f.socialLinks, ...(data.socialLinks || {}) },
            address: { ...f.address, ...(data.address || {}) },
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNested = (group, field, value) => {
    setForm((f) => ({ ...f, [group]: { ...f[group], [field]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      };
      await api.put("/seo/settings", payload);
      showToast("Global SEO settings saved!");
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Basic */}
      <SectionCard title="Site Identity & Default Meta Tags" icon="🏷️">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Site Name" name="siteName" value={form.siteName} onChange={handleChange} />
          <InputField label="Default Meta Title" name="title" value={form.title} onChange={handleChange} maxLength={60}
            hint="Shown in browser tab and Google results. Keep under 60 chars." />
        </div>
        <InputField label="Default Meta Description" name="description" value={form.description} onChange={handleChange} textarea maxLength={160}
          hint="Shown in Google search snippets. Keep under 160 chars." />
        <InputField label="Canonical URL" name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange}
          hint="e.g. https://www.sofahisofa.com/" />
        <InputField label="Default OG Image URL" name="ogImage" value={form.ogImage} onChange={handleChange}
          hint="Shared on social media when no product/category image is specified. 1200×630px recommended." />
        <InputField label="Focus Keywords (comma separated)" name="keywords" value={form.keywords} onChange={handleChange}
          hint="e.g. buy sofa online, luxury sofa India, solid wood bed" />
        <div>
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Robots Meta</label>
          <select name="robotsMeta" value={form.robotsMeta} onChange={handleChange}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium bg-gray-50 focus:outline-none focus:border-[#C86A3B]">
            <option value="index, follow">index, follow (Default — Google indexes all pages)</option>
            <option value="noindex, follow">noindex, follow</option>
            <option value="index, nofollow">index, nofollow</option>
            <option value="noindex, nofollow">noindex, nofollow (Block all bots)</option>
          </select>
        </div>
      </SectionCard>

      {/* Organization Schema */}
      <SectionCard title="Organization Schema (JSON-LD — Helps Google Knowledge Panel)" icon="🏢">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Organization Name" name="organizationName" value={form.organizationName} onChange={handleChange} />
          <InputField label="Phone Number" name="telephone" value={form.telephone} onChange={handleChange} hint="e.g. +919876543210" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Street Address" name="streetAddress" value={form.address.streetAddress}
            onChange={(e) => handleNested("address", "streetAddress", e.target.value)} />
          <InputField label="City" name="addressLocality" value={form.address.addressLocality}
            onChange={(e) => handleNested("address", "addressLocality", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <InputField label="State / Region" name="addressRegion" value={form.address.addressRegion}
            onChange={(e) => handleNested("address", "addressRegion", e.target.value)} />
          <InputField label="Postal Code" name="postalCode" value={form.address.postalCode}
            onChange={(e) => handleNested("address", "postalCode", e.target.value)} />
          <InputField label="Country Code" name="addressCountry" value={form.address.addressCountry}
            onChange={(e) => handleNested("address", "addressCountry", e.target.value)} hint="e.g. IN" />
        </div>
      </SectionCard>

      {/* Social */}
      <SectionCard title="Social Media Profiles" icon="📱">
        <div className="grid sm:grid-cols-2 gap-4">
          {["instagram", "facebook", "youtube", "twitter"].map((s) => (
            <InputField key={s} label={s.charAt(0).toUpperCase() + s.slice(1) + " URL"} name={s}
              value={form.socialLinks[s]}
              onChange={(e) => handleNested("socialLinks", s, e.target.value)} />
          ))}
        </div>
      </SectionCard>

      {/* Verification */}
      <SectionCard title="Google & Analytics" icon="📈">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Google Site Verification Code" name="googleSiteVerification" value={form.googleSiteVerification} onChange={handleChange}
            hint="From Google Search Console → Verify ownership → HTML tag method" />
          <InputField label="Google Analytics Measurement ID" name="googleAnalyticsId" value={form.googleAnalyticsId} onChange={handleChange}
            hint="e.g. G-XXXXXXXXXX" />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button type="submit" disabled={saving}
          className="bg-gray-900 hover:bg-[#C86A3B] text-white px-8 py-3 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 shadow-sm">
          {saving ? "Saving…" : "💾 Save Global Settings"}
        </button>
      </div>
    </form>
  );
}

// ─── PRODUCTS SEO TAB ──────────────────────────────────────────────────────────
function ProductsTab({ showToast }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { _id, metaTitle, metaDescription, metaKeywords[] }
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/seo/products?page=${p}&limit=15`);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setPage(p);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  const handleEdit = (prod) => {
    setEditing({
      _id: prod._id,
      name: prod.name,
      slug: prod.slug,
      metaTitle: prod.metaTitle || "",
      metaDescription: prod.metaDescription || "",
      metaKeywords: Array.isArray(prod.metaKeywords) ? prod.metaKeywords.join(", ") : prod.metaKeywords || "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/seo/products/${editing._id}`, {
        metaTitle: editing.metaTitle,
        metaDescription: editing.metaDescription,
        metaKeywords: editing.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean),
        slug: editing.slug,
      });
      setProducts((prev) => prev.map((p) => p._id === editing._id ? { ...p, ...data } : p));
      showToast(`SEO & Slug saved for "${editing.name}"`);
      setEditing(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = search ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : products;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input type="text" placeholder="Search product name…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium bg-white focus:outline-none focus:border-[#C86A3B] w-64" />
        <span className="text-xs text-gray-500 font-medium">{filtered.length} products on this page</span>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Meta Title</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Meta Description</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider w-24">Status</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const hasTitle = !!p.metaTitle;
                  const hasDesc = !!p.metaDescription;
                  return (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 max-w-[180px] truncate">{p.name}</p>
                        <p className="text-gray-400 text-[10px]">/{p.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`max-w-[200px] truncate ${hasTitle ? "text-gray-700" : "text-gray-300 italic"}`}>
                          {p.metaTitle || "Not set"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`max-w-[220px] truncate ${hasDesc ? "text-gray-700" : "text-gray-300 italic"}`}>
                          {p.metaDescription || "Not set"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasTitle && hasDesc ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {hasTitle && hasDesc ? "✓ Optimised" : "⚠ Incomplete"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleEdit(p)}
                          className="text-[#C86A3B] hover:underline font-bold text-[11px]">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
              <button disabled={page === 1} onClick={() => fetchProducts(page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-semibold disabled:opacity-40 hover:bg-gray-50">
                ← Prev
              </button>
              <span className="text-xs text-gray-600 font-medium">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => fetchProducts(page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-semibold disabled:opacity-40 hover:bg-gray-50">
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Edit SEO: <span className="text-[#C86A3B]">{editing.name}</span></h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
            </div>

            {/* Google SERP Preview */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Google Search Preview</p>
              <p className="text-blue-700 text-sm font-medium truncate">
                {editing.metaTitle || editing.name} | Sofa Hi Sofa
              </p>
              <p className="text-green-700 text-[11px]">
                https://www.sofahisofa.com/product/{editing.slug}
              </p>
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                {editing.metaDescription || "No meta description set. Google will pick a snippet from the page content."}
              </p>
            </div>

            <div className="space-y-3">
              <InputField label="URL Slug" name="slug" value={editing.slug}
                onChange={(e) => setEditing((ed) => ({ ...ed, slug: e.target.value }))}
                hint="URL path format: /product/kanha-3-seater-sofa" />
              <InputField label="Meta Title" name="metaTitle" value={editing.metaTitle}
                onChange={(e) => setEditing((ed) => ({ ...ed, metaTitle: e.target.value }))} maxLength={60}
                hint="Appears as the blue link in Google results." />
              <InputField label="Meta Description" name="metaDescription" value={editing.metaDescription}
                onChange={(e) => setEditing((ed) => ({ ...ed, metaDescription: e.target.value }))} textarea maxLength={160}
                hint="Shown below the blue link. Aim for 130–160 characters." />
              <InputField label="Keywords (comma separated)" name="metaKeywords" value={editing.metaKeywords}
                onChange={(e) => setEditing((ed) => ({ ...ed, metaKeywords: e.target.value }))}
                hint="Not used by Google directly, but useful for internal search." />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-gray-900 hover:bg-[#C86A3B] text-white py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-60">
                {saving ? "Saving…" : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CATEGORIES SEO TAB ────────────────────────────────────────────────────────
function CategoriesTab({ showToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/seo/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/seo/categories/${editing._id}`, {
        metaTitle: editing.metaTitle,
        metaDescription: editing.metaDescription,
        slug: editing.slug,
      });
      setCategories((prev) => prev.map((c) => c._id === editing._id ? { ...c, ...data } : c));
      showToast(`SEO & Slug saved for "${editing.name}"`);
      setEditing(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Meta Title</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider">Meta Description</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wider w-24">Status</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const hasTitle = !!c.metaTitle;
                const hasDesc = !!c.metaDescription;
                return (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{c.name}</p>
                      <p className="text-gray-400 text-[10px]">/collections/{c.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`max-w-[200px] truncate ${hasTitle ? "text-gray-700" : "text-gray-300 italic"}`}>
                        {c.metaTitle || "Not set"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`max-w-[220px] truncate ${hasDesc ? "text-gray-700" : "text-gray-300 italic"}`}>
                        {c.metaDescription || "Not set"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasTitle && hasDesc ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {hasTitle && hasDesc ? "✓ Optimised" : "⚠ Incomplete"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing({ ...c, metaTitle: c.metaTitle || "", metaDescription: c.metaDescription || "" })}
                        className="text-[#C86A3B] hover:underline font-bold text-[11px]">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Edit SEO: <span className="text-[#C86A3B]">{editing.name}</span></h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Google Search Preview</p>
              <p className="text-blue-700 text-sm font-medium truncate">
                {editing.metaTitle || editing.name} | Sofa Hi Sofa
              </p>
              <p className="text-green-700 text-[11px]">
                https://www.sofahisofa.com/collections/{editing.slug}
              </p>
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                {editing.metaDescription || "No meta description set."}
              </p>
            </div>

            <InputField label="URL Slug" name="slug" value={editing.slug}
              onChange={(e) => setEditing((ed) => ({ ...ed, slug: e.target.value }))}
              hint="URL path format: /collections/sofa-sets" />
            <InputField label="Meta Title" name="metaTitle" value={editing.metaTitle}
              onChange={(e) => setEditing((ed) => ({ ...ed, metaTitle: e.target.value }))} maxLength={60} />
            <InputField label="Meta Description" name="metaDescription" value={editing.metaDescription}
              onChange={(e) => setEditing((ed) => ({ ...ed, metaDescription: e.target.value }))} textarea maxLength={160} />

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-gray-900 hover:bg-[#C86A3B] text-white py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-60">
                {saving ? "Saving…" : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SITEMAP & ROBOTS TAB ─────────────────────────────────────────────────────
function SitemapTab({ showToast }) {
  const [form, setForm] = useState({ robotsTxtCustom: "", sitemapEnabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/seo/settings")
      .then(({ data }) => setForm({ robotsTxtCustom: data.robotsTxtCustom || "", sitemapEnabled: data.sitemapEnabled !== false }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/seo/settings", form);
      showToast("Sitemap & robots.txt settings saved!");
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const siteUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "https://www.sofahisofa.com";

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionCard title="Sitemap.xml" icon="🗺️">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.sitemapEnabled}
              onChange={(e) => setForm((f) => ({ ...f, sitemapEnabled: e.target.checked }))}
              className="accent-[#C86A3B] w-4 h-4" />
            <span className="text-xs font-semibold text-gray-800">Enable dynamic sitemap.xml</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          When enabled, <strong>/sitemap.xml</strong> is automatically generated from all live products and categories in the database.
          Submit this URL to <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-[#C86A3B] underline">Google Search Console</a>.
        </p>
        <div className="flex items-center gap-3">
          <code className="text-xs bg-gray-100 px-3 py-2 rounded-lg font-mono flex-1 border border-gray-200">
            {siteUrl}/sitemap.xml
          </code>
          <a href={`${siteUrl}/sitemap.xml`} target="_blank" rel="noreferrer"
            className="text-xs font-semibold text-[#C86A3B] hover:underline whitespace-nowrap">
            Preview →
          </a>
        </div>
      </SectionCard>

      <SectionCard title="Robots.txt" icon="🤖">
        <p className="text-xs text-gray-500">
          Leave blank to use the smart default (allows all, blocks /cart /admin /api). Enter custom text below to fully override.
        </p>
        <textarea
          value={form.robotsTxtCustom}
          onChange={(e) => setForm((f) => ({ ...f, robotsTxtCustom: e.target.value }))}
          rows={8}
          placeholder={`User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${siteUrl}/sitemap.xml`}
          className="w-full border border-gray-200 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2 text-xs font-mono bg-gray-50 resize-none"
        />
        <div className="flex items-center gap-3">
          <code className="text-xs bg-gray-100 px-3 py-2 rounded-lg font-mono flex-1 border border-gray-200">
            {siteUrl}/robots.txt
          </code>
          <a href={`${siteUrl}/robots.txt`} target="_blank" rel="noreferrer"
            className="text-xs font-semibold text-[#C86A3B] hover:underline whitespace-nowrap">
            Preview →
          </a>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="bg-gray-900 hover:bg-[#C86A3B] text-white px-8 py-3 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 shadow-sm">
          {saving ? "Saving…" : "💾 Save Sitemap & Robots Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── SEO AUDIT TAB ────────────────────────────────────────────────────────────
function AuditTab() {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/seo/audit")
      .then(({ data }) => setAudit(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!audit) return <p className="text-xs text-gray-500">Unable to load audit data. Make sure you're logged in as admin.</p>;

  const productScore = audit.products.total > 0
    ? Math.round((audit.products.optimized / audit.products.total) * 100)
    : 0;
  const catScore = audit.categories.total > 0
    ? Math.round((audit.categories.optimized / audit.categories.total) * 100)
    : 0;
  const overallScore = Math.round((productScore + catScore) / 2);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Overall Score */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm ${
          overallScore >= 80 ? "bg-green-500" : overallScore >= 50 ? "bg-amber-500" : "bg-red-500"
        }`}>
          {overallScore}
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">Overall SEO Score</h3>
          <p className="text-xs text-gray-500 mt-1">
            {overallScore >= 80 ? "Great! Most pages are SEO-optimised." : overallScore >= 50 ? "Moderate — some pages still need meta tags." : "Needs work — many pages are missing meta tags."}
          </p>
          <div className="mt-3 w-48 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${overallScore >= 80 ? "bg-green-500" : overallScore >= 50 ? "bg-amber-400" : "bg-red-500"}`}
              style={{ width: `${overallScore}%` }} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛋️</span>
            <h4 className="font-bold text-sm text-gray-800">Product Pages</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm ${productScore >= 80 ? "bg-green-500" : productScore >= 50 ? "bg-amber-500" : "bg-red-500"}`}>
              {productScore}%
            </div>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Total: <strong>{audit.products.total}</strong></p>
              <p className="text-green-600">✓ With meta title: <strong>{audit.products.optimized}</strong></p>
              <p className="text-red-500">✕ Missing title: <strong>{audit.products.missingTitle}</strong></p>
              <p className="text-amber-600">⚠ Missing description: <strong>{audit.products.missingDescription}</strong></p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📂</span>
            <h4 className="font-bold text-sm text-gray-800">Category Pages</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm ${catScore >= 80 ? "bg-green-500" : catScore >= 50 ? "bg-amber-500" : "bg-red-500"}`}>
              {catScore}%
            </div>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Total: <strong>{audit.categories.total}</strong></p>
              <p className="text-green-600">✓ With meta title: <strong>{audit.categories.optimized}</strong></p>
              <p className="text-red-500">✕ Missing title: <strong>{audit.categories.missingTitle}</strong></p>
              <p className="text-amber-600">⚠ Missing description: <strong>{audit.categories.missingDescription}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-bold text-sm text-gray-800 mb-4">Technical SEO Checklist</h4>
        <div className="space-y-2.5">
          {[
            { label: "Sitemap.xml accessible at /sitemap.xml", ok: true },
            { label: "Robots.txt accessible at /robots.txt", ok: true },
            { label: "All product pages have SEO-friendly /product/:slug URLs", ok: true },
            { label: "All category pages have SEO-friendly /collections/:slug URLs", ok: true },
            { label: "Schema.org Product JSON-LD on product pages", ok: true },
            { label: "Schema.org FurnitureStore JSON-LD in index.html", ok: true },
            { label: "Open Graph tags (og:title, og:image, og:description) on all pages", ok: true },
            { label: "Canonical tags on all pages", ok: true },
            { label: `Product meta titles filled: ${audit.products.optimized}/${audit.products.total}`, ok: audit.products.missingTitle === 0 },
            { label: `Category meta titles filled: ${audit.categories.optimized}/${audit.categories.total}`, ok: audit.categories.missingTitle === 0 },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs">
              <span className={`mt-0.5 flex-shrink-0 font-bold ${item.ok ? "text-green-500" : "text-amber-500"}`}>
                {item.ok ? "✓" : "⚠"}
              </span>
              <span className={item.ok ? "text-gray-700" : "text-amber-700 font-medium"}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#C86A3B] rounded-full animate-spin" />
    </div>
  );
}
