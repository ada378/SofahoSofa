import { useState, useCallback, useRef, useEffect } from "react";
import api from "../api/axios";
import BulkPhotoUploader from "./BulkPhotoUploader";

// ─── helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", sku: "", category: "", subCategory: "", shortDescription: "",
  description: "", material: "", price: "", marketPrice: "", stock: "",
  warranty: "3 Year Warranty", isFeatured: false, isNewLaunch: false, isBestSeller: false,
  fabricOptions: "", // comma-separated e.g. "Beige,Charcoal,Olive"
  metaTitle: "", metaDescription: "", metaKeywords: "",
  images: [], // [{ url, alt, publicId }]
};

function Badge({ children, color = "gray" }) {
  const map = { gray: "bg-gray-800 text-gray-300", green: "bg-green-900/50 text-green-400", red: "bg-red-900/50 text-red-400", amber: "bg-amber-900/50 text-amber-400" };
  return <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${map[color]}`}>{children}</span>;
}

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

const inputCls = "w-full bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 transition-colors";
const textareaCls = `${inputCls} resize-none`;

// ─── Image Uploader ────────────────────────────────────────────────────────────
const MAX_IMAGES = 8;
const RECOMMENDED_IMAGES = 4;

function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef();

  const remaining = MAX_IMAGES - images.length;

  const uploadFiles = async (files) => {
    if (!files.length) return;
    if (images.length >= MAX_IMAGES) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      // Limit upload to remaining slots
      Array.from(files).slice(0, remaining).forEach((f) => formData.append("images", f));
      const { data } = await api.post("/upload/product-images", formData);
      onChange([...images, ...data.images]);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Upload failed";
      console.error("Image upload error:", err.response?.data || err.message);
      setUploadError(msg);
      setTimeout(() => setUploadError(""), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  const removeImage = async (idx) => {
    const img = images[idx];
    if (img.publicId) {
      api.delete(`/upload/${encodeURIComponent(img.publicId)}`).catch(() => {});
    }
    onChange(images.filter((_, i) => i !== idx));
  };

  const updateAlt = (idx, val) => {
    const updated = images.map((img, i) => i === idx ? { ...img, alt: val } : img);
    onChange(updated);
  };

  const moveImage = (from, to) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  };

  // Progress color
  const progressPct = Math.round((images.length / RECOMMENDED_IMAGES) * 100);
  const progressColor = images.length === 0 ? "bg-gray-600" : images.length < RECOMMENDED_IMAGES ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="space-y-4">

      {/* Photo count progress */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-300">
            📸 Product Photos
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            images.length === 0 ? "bg-gray-700 text-gray-400"
            : images.length < RECOMMENDED_IMAGES ? "bg-amber-900/50 text-amber-400"
            : "bg-green-900/50 text-green-400"
          }`}>
            {images.length} / {RECOMMENDED_IMAGES} recommended
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1.5">
          {images.length === 0 && "3-4 photos upload karein — front, side, detail aur room-setting"}
          {images.length > 0 && images.length < RECOMMENDED_IMAGES && `${RECOMMENDED_IMAGES - images.length} aur photos add karein for best results`}
          {images.length >= RECOMMENDED_IMAGES && "✓ Great! Product mein enough photos hain"}
        </p>
      </div>

      {/* Slot preview grid — shows empty slots as placeholders */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: Math.max(RECOMMENDED_IMAGES, images.length) }).map((_, idx) => {
          const img = images[idx];
          return img ? (
            // Filled slot
            <div key={idx} className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 aspect-square">
              {idx === 0 && (
                <span className="absolute top-1 left-1 z-10 bg-[#C86A3B] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">MAIN</span>
              )}
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                <div className="flex justify-end gap-1">
                  {idx > 0 && (
                    <button onClick={() => moveImage(idx, idx - 1)}
                      className="bg-gray-700/80 text-white rounded-md p-1 text-[9px] font-bold hover:bg-gray-600">←</button>
                  )}
                  {idx < images.length - 1 && (
                    <button onClick={() => moveImage(idx, idx + 1)}
                      className="bg-gray-700/80 text-white rounded-md p-1 text-[9px] font-bold hover:bg-gray-600">→</button>
                  )}
                  <button onClick={() => removeImage(idx)}
                    className="bg-red-600/80 text-white rounded-md p-1 text-[9px] font-bold hover:bg-red-600">✕</button>
                </div>
                <input
                  value={img.alt}
                  onChange={(e) => updateAlt(idx, e.target.value)}
                  placeholder="Alt text…"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black/60 text-white text-[9px] rounded-md px-1.5 py-1 w-full focus:outline-none placeholder-gray-400 border border-gray-600"
                />
              </div>
            </div>
          ) : (
            // Empty slot placeholder
            <button
              key={idx}
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 hover:border-[#C86A3B] hover:bg-[#C86A3B]/5 transition-colors flex flex-col items-center justify-center gap-1 group"
            >
              <span className="text-gray-600 group-hover:text-[#C86A3B] text-xl transition-colors">+</span>
              <span className="text-gray-600 group-hover:text-[#C86A3B] text-[9px] font-semibold transition-colors">
                {idx === 0 ? "Main Photo" : idx === 1 ? "Side View" : idx === 2 ? "Detail" : "Room View"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Upload zone */}
      {remaining > 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
            dragOver ? "border-[#C86A3B] bg-[#C86A3B]/10" : "border-gray-700 hover:border-[#C86A3B]/60 bg-gray-800/40 hover:bg-gray-800/70"
          } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                uploadFiles(e.target.files);
              }
              e.target.value = "";
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-[#C86A3B] rounded-full animate-spin" />
              <p className="text-gray-400 text-xs font-medium">Cloudinary pe upload ho raha hai…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl">☁️</span>
              <p className="text-gray-300 text-sm font-semibold">3-4 Photos Upload Karein</p>
              <p className="text-gray-500 text-xs">Drag & drop ya click karein · JPG, PNG, WebP · Max 8MB</p>
              <p className="text-gray-600 text-[10px] mt-1">
                💡 Tip: Front view, Side view, Close-up detail, Room setting
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 text-xs rounded-xl px-4 py-2.5 font-medium">
          ⚠️ {uploadError}
        </div>
      )}

      <p className="text-[10px] text-gray-600">
        Pehli photo = main product image (carousel mein sabse pehle dikhti hai). Hover karke reorder ya remove karein.
      </p>
    </div>
  );
}

// ─── Product Form Modal ────────────────────────────────────────────────────────
function ProductFormModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product?._id;
  const [form, setForm] = useState(() => {
    if (!product) return EMPTY_FORM;
    return {
      ...EMPTY_FORM,
      ...product,
      category: product.category?._id || product.category || "",
      fabricOptions: Array.isArray(product.fabricOptions)
        ? product.fabricOptions.map((f) => (typeof f === "object" ? f.name : f)).join(", ")
        : "",
      metaKeywords: Array.isArray(product.metaKeywords) ? product.metaKeywords.join(", ") : "",
      images: product.images || [],
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("basic");

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Product name is required");
    if (!form.sku.trim()) return setError("SKU is required");
    if (!form.category) return setError("Category is required");
    if (!form.price || isNaN(Number(form.price))) return setError("Valid price is required");
    if (!form.stock && form.stock !== 0) return setError("Stock is required");

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        marketPrice: Number(form.marketPrice || form.price),
        stock: Number(form.stock),
        fabricOptions: typeof form.fabricOptions === "string" && form.fabricOptions
          ? form.fabricOptions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        metaKeywords: typeof form.metaKeywords === "string" && form.metaKeywords
          ? form.metaKeywords.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (isEdit) {
        const { data } = await api.put(`/products/${product._id}`, payload);
        onSaved(data, "edit");
      } else {
        const { data } = await api.post("/products", payload);
        onSaved(data, "create");
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "basic", label: "Basic Info" },
    { id: "pricing", label: "Pricing & Stock" },
    { id: "images", label: "Images" },
    { id: "seo", label: "SEO" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-base">
            {isEdit ? `Edit: ${product.name}` : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-gray-800 px-6 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id ? "border-[#C86A3B] text-[#C86A3B]" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-400 text-xs px-4 py-2.5 rounded-xl">{error}</div>
            )}

            {/* ── Basic Info ── */}
            {tab === "basic" && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Product Name" required>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Nilkamal Chester 3-Seater Sofa" className={inputCls} />
                  </Field>
                  <Field label="SKU" required hint="Unique product code, e.g. SHS-001">
                    <input name="sku" value={form.sku} onChange={handleChange} placeholder="SHS-001" className={inputCls} />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Category" required>
                    <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                      <option value="">— Select Category —</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Sub Category / Type">
                    <input name="subCategory" value={form.subCategory} onChange={handleChange} placeholder="e.g. 3 Seater Sofa, L-Shape" className={inputCls} />
                  </Field>
                  <Field label="Warranty">
                    <input name="warranty" value={form.warranty} onChange={handleChange} placeholder="e.g. 3 Year Warranty" className={inputCls} />
                  </Field>
                </div>
                <Field label="Short Description" hint="Max 200 characters — shown on product cards">
                  <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} maxLength={200} className={textareaCls} placeholder="Concise product summary…" />
                </Field>
                <Field label="Full Description" required>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={textareaCls} placeholder="Detailed product description with features, care instructions…" />
                </Field>
                {/* Flags */}
                <div className="flex flex-wrap gap-5 pt-1">
                  {[["isFeatured","⭐ Featured"],["isNewLaunch","🆕 New Launch"],["isBestSeller","🔥 Bestseller"]].map(([name, label]) => (
                    <label key={name} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name={name} checked={!!form[name]} onChange={handleChange} className="accent-[#C86A3B] w-4 h-4" />
                      <span className="text-gray-300 text-xs font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── Pricing & Stock ── */}
            {tab === "pricing" && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Selling Price (₹)" required>
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="29999" min="0" className={inputCls} />
                  </Field>
                  <Field label="Stock Quantity" required>
                    <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="50" min="0" className={inputCls} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── Images ── */}
            {tab === "images" && (
              <div className="space-y-4">
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-400">
                  <strong className="text-gray-200">📸 Product Gallery (3-4 Photos Recommended):</strong>
                  {" "}Images Cloudinary CDN pe store hoti hain.
                  <ul className="mt-2 space-y-1 text-[11px] text-gray-500 list-none">
                    <li>📌 <strong className="text-gray-400">Photo 1:</strong> Front view (main image — product listing par dikhti hai)</li>
                    <li>📌 <strong className="text-gray-400">Photo 2:</strong> Side / angle view</li>
                    <li>📌 <strong className="text-gray-400">Photo 3:</strong> Close-up / fabric detail</li>
                    <li>📌 <strong className="text-gray-400">Photo 4:</strong> Room setting / lifestyle shot</li>
                  </ul>
                  <p className="mt-2 text-[10px] text-gray-600">Ye saari photos product detail page par carousel mein dikhengi. ← → arrows se switch hoga.</p>
                </div>
                <ImageUploader images={form.images} onChange={(imgs) => set("images", imgs)} />
              </div>
            )}

            {/* ── SEO ── */}
            {tab === "seo" && (
              <div className="space-y-4">
                <Field label="Meta Title" hint="60 chars max — shown as the blue link in Google">
                  <div className="relative">
                    <input name="metaTitle" value={form.metaTitle} onChange={handleChange} maxLength={60} className={inputCls} placeholder={`${form.name} | Buy Online India | Sofa Hi Sofa`} />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${form.metaTitle.length > 55 ? "text-red-400" : "text-gray-600"}`}>
                      {form.metaTitle.length}/60
                    </span>
                  </div>
                </Field>
                <Field label="Meta Description" hint="160 chars max — shown below the blue link in Google results">
                  <div className="relative">
                    <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} maxLength={160} rows={3} className={textareaCls} placeholder="Buy the finest handcrafted sofa…" />
                    <span className={`absolute right-3 bottom-3 text-[10px] font-bold ${form.metaDescription.length > 150 ? "text-red-400" : "text-gray-600"}`}>
                      {form.metaDescription.length}/160
                    </span>
                  </div>
                </Field>
                <Field label="Keywords (comma separated)" hint="Not directly used by Google but useful for internal search">
                  <input name="metaKeywords" value={form.metaKeywords} onChange={handleChange} placeholder="buy sofa online, luxury sofa india, sheesham wood sofa" className={inputCls} />
                </Field>

                {/* SERP Preview */}
                <div className="bg-white rounded-xl p-4 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Google Search Preview</p>
                  <p className="text-blue-700 text-sm font-medium truncate">
                    {form.metaTitle || form.name || "Product Title"} | Sofa Hi Sofa.Com
                  </p>
                  <p className="text-green-700 text-xs">
                    https://www.sofahisofa.com/product/{form.slug || "product-slug"}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {form.metaDescription || form.shortDescription || "No meta description set."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between gap-3">
            <div className="flex gap-2 text-xs text-gray-500 flex-wrap">
              {tab !== "basic" && <button type="button" onClick={() => setTab(t => { const idx = TABS.findIndex(x=>x.id===t); return TABS[Math.max(0,idx-1)].id; })} className="hover:text-white">← Back</button>}
              {tab !== "seo" && <button type="button" onClick={() => setTab(t => { const idx = TABS.findIndex(x=>x.id===t); return TABS[Math.min(TABS.length-1,idx+1)].id; })} className="text-[#C86A3B] font-semibold hover:underline">Next →</button>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-700 text-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-800">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#C86A3B] hover:bg-[#b85e32] disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors">
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Bulk Import Modal ────────────────────────────────────────────────────────
function BulkImportModal({ categories, onClose, onImported }) {
  const [jsonText, setJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const sampleTemplate = JSON.stringify(
    [
      {
        name: "Velvet 3-Seater Luxury Sofa",
        sku: "SHS-SOFA-001",
        category: categories[0]?._id || "sofa",
        subCategory: "3 Seater Sofa",
        price: 34999,
        stock: 10,
        description: "Handcrafted luxury velvet sofa with 100% solid sheesham wood frame.",
        shortDescription: "Luxury 3-Seater Velvet Sofa",
        material: "Sheesham Wood & Velvet",
        warranty: "10 Year Warranty",
        isBestSeller: true,
        images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc", alt: "Velvet 3 Seater Sofa" }]
      }
    ],
    null,
    2
  );

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      
      // Validate it's an array
      if (!Array.isArray(parsed)) {
        setError("JSON file must contain an array of products");
        return;
      }
      
      setJsonText(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError(`Failed to read file: ${err.message}`);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setError("");
    if (!jsonText.trim()) {
      setError("Please paste or load sample product JSON data.");
      return;
    }

    try {
      let parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      setImporting(true);
      console.log("[BULK IMPORT] Sending request with:", { count: parsed.length, sample: parsed[0]?.name });
      
      const { data } = await api.post("/products/bulk", parsed);
      
      console.log("[BULK IMPORT] Success:", data);
      onImported(data.count || parsed.length);
      onClose();
    } catch (err) {
      console.error("[BULK IMPORT] Error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        error: err.message,
        fullResponse: err.response?.data,
      });
      setError(err.response?.data?.message || err.message || "Failed to parse or import products JSON.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 text-gray-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div>
            <h3 className="font-bold text-lg text-white">📦 Bulk Import Products</h3>
            <p className="text-xs text-gray-400">Import multiple products at once via JSON file or paste data</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 text-xs p-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* File Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300">📥 Upload JSON File</label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-blue-900/40 border border-blue-700 text-blue-300 hover:bg-blue-900/60 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              📁 Choose JSON File
            </button>
            <button
              type="button"
              onClick={() => setJsonText(sampleTemplate)}
              className="text-[11px] text-[#C86A3B] hover:underline font-semibold px-3 py-2.5 bg-gray-800 rounded-xl border border-gray-700"
            >
              Load Sample
            </button>
          </div>
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-xs text-gray-500 font-semibold">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Text Paste Section */}
        <div>
          <label className="text-xs font-bold text-gray-300 block mb-1.5">📝 Paste JSON Data</label>
          <textarea
            rows={10}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`[\n  {\n    "name": "Luxury Sofa",\n    "sku": "SHS-001",\n    "category": "sofa",\n    "price": 25000,\n    "marketPrice": 35000,\n    "stock": 5\n  }\n]`}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs font-mono text-gray-100 focus:outline-none focus:border-[#C86A3B] resize-none"
          />
        </div>

        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/60 text-[11px] text-gray-400 space-y-1">
          <p>💡 <strong>Import Tips:</strong></p>
          <p>• Use category <strong>slug</strong> (e.g., "sofa", "bed", "recliner") or category <strong>ID</strong></p>
          <p>• Products will auto-organize by category after import</p>
          <p>• Required fields: name, sku, category, price, marketPrice, stock</p>
          <p>• Optional: description, material, warranty, images, subCategory</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || !jsonText.trim()}
            className="px-6 py-2 text-xs font-bold bg-[#C86A3B] hover:bg-[#b85e32] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing ? (
              <>
                <span className="animate-spin">⏳</span>
                Importing…
              </>
            ) : (
              <>
                <span>🚀</span>
                Import All Products
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ProductManager ───────────────────────────────────────────────────────
export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modalProduct, setModalProduct] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPhotoBulkModal, setShowPhotoBulkModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15, ...(search && { keyword: search }), ...(filterCat && { category: filterCat }) };
      const { data } = await api.get("/products/admin/all", { params });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(p);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [search, filterCat]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleSaved = (savedProduct, action) => {
    if (action === "create") {
      setProducts((prev) => [savedProduct, ...prev]);
      setTotal((t) => t + 1);
    } else {
      setProducts((prev) => prev.map((p) => p._id === savedProduct._id ? savedProduct : p));
    }
    showToast(action === "create" ? "Product created!" : "Product updated!");
  };

  const handleBulkImported = (count) => {
    // Refresh products list
    fetchProducts(1);
    
    // Show success toast with category tip
    showToast(`✅ Successfully imported ${count} products! Organizing by category...`);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteId}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      setTotal((t) => t - 1);
      showToast("Product deleted");
      setDeleteId(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-16 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-bold text-xl">Products</h1>
          <p className="text-gray-500 text-sm">{total} total products in catalogue</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPhotoBulkModal(true)}
            className="bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
            📸 Bulk Upload Photos
          </button>
          <button onClick={() => setShowBulkModal(true)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
            📦 Bulk Import (JSON)
          </button>
          <button onClick={() => setModalProduct(null)}
            className="bg-[#C86A3B] hover:bg-[#b85e32] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
            ➕ Add Single Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="Search by name or SKU…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 w-56" />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="bg-gray-800 border border-gray-700 focus:border-[#C86A3B] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left px-4 py-3 font-semibold">Product</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-3 font-semibold">Price</th>
                  <th className="text-center px-4 py-3 font-semibold hidden sm:table-cell">Stock</th>
                  <th className="text-center px-4 py-3 font-semibold hidden lg:table-cell">Flags</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-600">No products found</td></tr>
                ) : products.map((p) => (
                  <tr key={p._id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0].url} alt={p.images[0].alt}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-800 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600 text-lg flex-shrink-0">🛋️</div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[160px]">{p.name}</p>
                          <p className="text-gray-600 text-[10px]">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell font-mono">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-white font-semibold">₹{p.price.toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <Badge color={p.stock === 0 ? "red" : p.stock < 5 ? "amber" : "green"}>
                        {p.stock === 0 ? "Out" : p.stock}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {p.isFeatured && <Badge color="amber">★ Featured</Badge>}
                        {p.isBestSeller && <Badge color="green">🔥 Best</Badge>}
                        {p.isNewLaunch && <Badge>🆕 New</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModalProduct(p)}
                          className="text-blue-400 hover:text-blue-300 text-[11px] font-semibold">Edit</button>
                        <button onClick={() => setDeleteId(p._id)}
                          className="text-red-500 hover:text-red-400 text-[11px] font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
            <button disabled={page === 1} onClick={() => fetchProducts(page - 1)}
              className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-300 disabled:opacity-40 hover:bg-gray-800">← Prev</button>
            <span className="text-xs text-gray-500">Page {page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => fetchProducts(page + 1)}
              className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-300 disabled:opacity-40 hover:bg-gray-800">Next →</button>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {modalProduct !== undefined && (
        <ProductFormModal
          product={modalProduct}
          categories={categories}
          onClose={() => setModalProduct(undefined)}
          onSaved={handleSaved}
        />
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <BulkImportModal
          categories={categories}
          onClose={() => setShowBulkModal(false)}
          onImported={handleBulkImported}
        />
      )}

      {/* Bulk Photo Upload Modal */}
      {showPhotoBulkModal && (
        <BulkPhotoUploader
          onClose={() => setShowPhotoBulkModal(false)}
          onComplete={() => {
            showToast("Products created successfully!");
            fetchProducts(1);
          }}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-white font-bold">Delete Product?</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone. The product will be removed from the catalogue permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-bold transition-colors">
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
