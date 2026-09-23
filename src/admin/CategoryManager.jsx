import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const EMPTY = { name: "", description: "", order: 0, metaTitle: "", metaDescription: "", image: { url: "", alt: "" } };
const inputCls = "w-full bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 transition-colors";

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}

// Single image uploader for categories
function CategoryImageUploader({ image, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await api.post("/upload/category-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange({ url: data.url, alt: data.alt });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Check Cloudinary credentials.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {image?.url ? (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-700">
          <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange({ url: "", alt: "" })}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700"
          >✕</button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`w-32 h-32 rounded-2xl border-2 border-dashed border-gray-700 hover:border-gray-500 cursor-pointer flex flex-col items-center justify-center gap-1 bg-gray-800/50 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-[#C86A3B] rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-2xl">📷</span>
              <span className="text-gray-500 text-[10px] text-center px-2">Upload Image</span>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => upload(e.target.files[0])} />
      {image?.url && (
        <input value={image.alt} onChange={(e) => onChange({ ...image, alt: e.target.value })}
          placeholder="Alt text (for SEO)…"
          className="bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2 text-xs text-white w-full" />
      )}
    </div>
  );
}

function CategoryModal({ category, onClose, onSaved }) {
  const isEdit = !!category?._id;
  const [form, setForm] = useState(isEdit ? { ...EMPTY, ...category } : { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Category name is required");
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const { data } = await api.put(`/categories/${category._id}`, form);
        onSaved(data, "edit");
      } else {
        const { data } = await api.post("/categories", form);
        onSaved(data, "create");
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold">{isEdit ? `Edit: ${category.name}` : "Add Category"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-900/40 border border-red-700 text-red-400 text-xs px-4 py-2.5 rounded-xl">{error}</div>}

          <div className="flex gap-5 items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Category Image</p>
              <CategoryImageUploader
                image={form.image}
                onChange={(img) => setForm((f) => ({ ...f, image: img }))}
              />
            </div>
            <div className="flex-1 space-y-3">
              <Field label="Category Name" required>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sofa Sets" className={inputCls} />
              </Field>
              <Field label="Display Order" hint="Lower numbers appear first in menu">
                <input type="number" name="order" value={form.order} onChange={handleChange} min="0" className={inputCls} />
              </Field>
            </div>
          </div>

          <Field label="Description">
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="Short description of this category…"
              className="w-full bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 resize-none" />
          </Field>

          <div className="border-t border-gray-800 pt-4 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO</p>
            <Field label="Meta Title" hint="60 chars max">
              <div className="relative">
                <input name="metaTitle" value={form.metaTitle} onChange={handleChange} maxLength={60} className={inputCls}
                  placeholder={`${form.name || "Category"} | Buy Online | Sofa Hi Sofa`} />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${form.metaTitle?.length > 55 ? "text-red-400" : "text-gray-600"}`}>
                  {form.metaTitle?.length || 0}/60
                </span>
              </div>
            </Field>
            <Field label="Meta Description" hint="160 chars max">
              <div className="relative">
                <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} maxLength={160} rows={2}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 resize-none"
                  placeholder="Explore our luxury collection of…" />
                <span className={`absolute right-3 bottom-3 text-[10px] font-bold ${form.metaDescription?.length > 150 ? "text-red-400" : "text-gray-600"}`}>
                  {form.metaDescription?.length || 0}/160
                </span>
              </div>
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#C86A3B] hover:bg-[#b85e32] disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-bold transition-colors">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(undefined); // undefined=closed null=new obj=edit
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // For viewing products in category
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productCounts, setProductCounts] = useState({}); // { catId: count }

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch product counts for all categories
  useEffect(() => {
    if (categories.length === 0) return;
    const fetchCounts = async () => {
      const counts = {};
      for (const cat of categories) {
        try {
          const { data } = await api.get("/products/admin/all", { params: { category: cat._id, limit: 1 } });
          counts[cat._id] = data.total || 0;
        } catch {
          counts[cat._id] = 0;
        }
      }
      setProductCounts(counts);
    };
    fetchCounts();
  }, [categories]);

  // Fetch products for selected category
  const viewCategoryProducts = async (category) => {
    setSelectedCategory(category);
    setProductsLoading(true);
    try {
      const { data } = await api.get("/products/admin/all", { params: { category: category._id, limit: 100 } });
      setCategoryProducts(data.products || []);
    } catch (err) {
      showToast("Failed to load products", "error");
      setCategoryProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSaved = (cat, action) => {
    if (action === "create") setCategories((prev) => [...prev, cat].sort((a, b) => a.order - b.order));
    else setCategories((prev) => prev.map((c) => c._id === cat._id ? cat : c));
    showToast(action === "create" ? "Category created!" : "Category updated!");
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteId}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteId));
      showToast("Category deleted");
      setDeleteId(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {toast && (
        <div className={`fixed top-16 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white font-bold text-xl">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => setModal(null)} className="bg-[#C86A3B] hover:bg-[#b85e32] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors">
          ➕ Add Category
        </button>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-gray-800 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left px-4 py-3 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Slug</th>
                  <th className="text-center px-4 py-3 font-semibold">Order</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Meta Title</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-600">No categories yet. Add one to get started.</td></tr>
                ) : categories.map((c) => (
                  <tr key={c._id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.image?.url ? (
                          <img src={c.image.url} alt={c.image.alt} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-600 text-lg flex-shrink-0">📂</div>
                        )}
                        <div>
                          <p className="text-white font-medium">{c.name}</p>
                          {c.description && <p className="text-gray-600 text-[10px] max-w-[200px] truncate">{c.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono hidden sm:table-cell">{c.slug}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{c.order}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className={`max-w-[180px] truncate ${c.metaTitle ? "text-gray-300" : "text-gray-700 italic"}`}>
                        {c.metaTitle || "Not set"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => viewCategoryProducts(c)} className="text-green-400 hover:text-green-300 font-semibold text-xs">
                          {productCounts[c._id] || 0} Products
                        </button>
                        <button onClick={() => setModal(c)} className="text-blue-400 hover:text-blue-300 font-semibold">Edit</button>
                        <button onClick={() => setDeleteId(c._id)} className="text-red-500 hover:text-red-400 font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== undefined && (
        <CategoryModal category={modal} onClose={() => setModal(undefined)} onSaved={handleSaved} />
      )}

      {/* Category Products Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-white font-bold">{selectedCategory.name} — Products</h2>
                <p className="text-gray-500 text-xs">{categoryProducts.length} products in this category</p>
              </div>
              <button onClick={() => { setSelectedCategory(null); setCategoryProducts([]); }} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {productsLoading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />)}</div>
              ) : categoryProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No products in this category yet.</p>
                  <p className="text-xs mt-1">Add products via the Product Manager and assign them to this category.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categoryProducts.map((p) => (
                    <div key={p._id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                      {p.images?.[0] ? (
                        <img src={p.images[0].url} alt={p.images[0].alt} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-600 flex-shrink-0">🛋️</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{p.name}</p>
                        <p className="text-gray-600 text-xs">SKU: {p.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-semibold text-sm">₹{p.price.toLocaleString("en-IN")}</p>
                        <p className={`text-xs font-bold ${p.stock === 0 ? "text-red-400" : p.stock < 5 ? "text-yellow-400" : "text-green-400"}`}>
                          {p.stock === 0 ? "Out of Stock" : `${p.stock} in stock`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-white font-bold">Delete Category?</h3>
            <p className="text-gray-400 text-sm">Products in this category will lose their category reference. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-bold">
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
