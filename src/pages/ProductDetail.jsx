import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

// Skeleton loader for the product detail page
function ProductDetailSkeleton() {
  return (
    <div className="bg-brand-porcelain min-h-screen py-6 sm:py-10 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-3 w-48 bg-brand-sand rounded mb-6" />
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] bg-brand-sand rounded-3xl" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="w-20 h-20 bg-brand-sand rounded-2xl flex-shrink-0" />)}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-brand-sand space-y-4">
              <div className="h-3 w-24 bg-brand-sand rounded" />
              <div className="h-7 w-3/4 bg-brand-sand rounded" />
              <div className="h-3 w-full bg-brand-sand rounded" />
              <div className="h-3 w-2/3 bg-brand-sand rounded" />
              <div className="h-16 bg-brand-sand rounded-2xl" />
              <div className="h-12 bg-brand-sand rounded-2xl" />
              <div className="h-12 bg-brand-sand rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // ── API State ────────────────────────────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("specs");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [customReviews, setCustomReviews] = useState([]);

  // ── Fetch Product ─────────────────────────────────────────────────────────────
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActiveImageIndex(0);
    try {
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
      // Set initial fabric/size from fetched data
      setSelectedFabric(
        Array.isArray(data.fabricOptions) && data.fabricOptions.length > 0
          ? (typeof data.fabricOptions[0] === "object" ? data.fabricOptions[0] : { name: data.fabricOptions[0], hex: "#D9A441" })
          : { name: "Standard", hex: "#D9A441" }
      );
      setSelectedSize(data.subCategory || data.seatingCapacity || "Standard");

      // Fetch related products
      if (data.category?.slug || data.category) {
        const catSlug = data.category?.slug || data.category;
        api.get("/products", { params: { category: data.category?._id || data.category, limit: 4 } })
          .then(({ data: rel }) => {
            setRelatedProducts((rel.products || []).filter((p) => p._id !== data._id).slice(0, 4));
          })
          .catch(() => {});
      }
    } catch {
      setError("Product not found. It may have been removed or the URL is incorrect.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeStatus({ valid: true, message: "✓ Free White-Glove Delivery available in 4-6 Days. Cash on Delivery supported." });
    } else {
      setPincodeStatus({ valid: false, message: "Please enter a valid 6-digit Indian pincode." });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedFabric?.name || "Standard", selectedSize || "Standard");
  };

  const handleOpenBookingModal = () => {
    // Redirect to checkout page with product details
    navigate("/checkout", {
      state: {
        product,
        quantity,
        selectedFabric,
        selectedSize,
      },
    });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;
    setCustomReviews([{ author: reviewAuthor, comment: reviewComment, rating: reviewRating, date: "Just now", verified: true }, ...customReviews]);
    setReviewAuthor(""); setReviewComment(""); setShowReviewForm(false);
  };

  // ── Loading / Error states ────────────────────────────────────────────────────
  if (loading) return <ProductDetailSkeleton />;

  if (error) {
    return (
      <div className="bg-brand-porcelain min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-3xl">🔍</div>
          <h2 className="font-display text-2xl text-brand-charcoal">Product Not Found</h2>
          <p className="text-brand-muted text-sm">{error}</p>
          <button onClick={() => navigate("/collections/all")}
            className="bg-brand-charcoal text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors">
            Browse All Collections
          </button>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────────
  const discount = product.marketPrice > product.price
    ? Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100) : 0;
  const inWish = isInWishlist(product._id);
  const images = product.images?.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", alt: product.name }];

  // Normalise fabricOptions — backend stores strings, some seeds store objects
  const fabricOptions = (product.fabricOptions || []).map((f) =>
    typeof f === "object" ? f : { name: f, hex: "#D9A441" }
  );

  // ── SEO — use product's own metaTitle/metaDescription if set, else auto-generate ──
  const seoTitle = product.metaTitle || `${product.name} | Buy Online India | Sofa Hi Sofa`;
  const seoDesc = product.metaDescription || product.shortDescription
    || `Buy ${product.name} online in India. Solid wood frame, ${product.warranty || "3-Year Warranty"}, free pan-India delivery & 200+ fabric choices.`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.map((img) => img.url),
    description: product.description || product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Sofa Hi Sofa" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://www.sofahisofa.com/product/${product.slug}`,
      seller: { "@type": "Organization", name: "Sofa Hi Sofa.Com" },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    ...(product.numReviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating?.toFixed(1) || "4.5",
        reviewCount: product.numReviews,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sofahisofa.com/" },
      { "@type": "ListItem", position: 2, name: product.category?.name || "Collections", item: `https://www.sofahisofa.com/collections/${product.category?.slug || "all"}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://www.sofahisofa.com/product/${product.slug}` },
    ],
  };

  return (
    <div className="bg-brand-porcelain min-h-screen py-6 sm:py-10">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`https://www.sofahisofa.com/product/${product.slug}`}
        image={images[0]?.url}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/collections/${product.category?.slug || "all"}`}
            className="hover:text-brand-charcoal transition-colors capitalize">
            {product.category?.name || "Collections"}
          </Link>
          <span>/</span>
          <span className="text-brand-charcoal font-semibold truncate">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-brand-sand shadow-subtle group">
              <img
                src={images[activeImageIndex]?.url}
                alt={images[activeImageIndex]?.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="bg-brand-charcoal text-white text-xs font-bold px-3 py-1 rounded-full shadow-subtle">
                    {discount}% OFF
                  </span>
                )}
                {product.numReviews > 0 && (
                  <span className="bg-brand-amber text-brand-charcoal text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-subtle uppercase tracking-wider">
                    ★ {product.rating?.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                )}
              </div>
              <button onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${inWish ? "bg-white text-red-500 shadow-card" : "bg-white/90 text-brand-charcoal hover:bg-white hover:text-red-500 shadow-subtle"}`}
                aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={inWish ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} type="button" onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === idx ? "border-brand-terracotta ring-2 ring-brand-terracotta/20 scale-105" : "border-brand-sand hover:border-brand-sandDark opacity-75 hover:opacity-100"}`}>
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Configurator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-subtle space-y-6">
              <div>
                <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">{product.subCategory}</span>
                <h1 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-1">{product.name}</h1>
                <p className="text-brand-muted text-xs sm:text-sm mt-2 leading-relaxed">{product.shortDescription}</p>
              </div>

              <div className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-brand-charcoal">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.marketPrice > product.price && (
                    <>
                      <span className="text-base text-brand-muted line-through">
                        ₹{product.marketPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="bg-brand-terracotta text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Save ₹{(product.marketPrice - product.price).toLocaleString("en-IN")} ({discount}%)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-brand-forest font-semibold mt-1">
                  ✓ Free White-Glove Pan-India Installation · GST Included
                </p>
              </div>

              {/* Fabric Swatches */}
              {fabricOptions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                      Upholstery Color: <span className="text-brand-terracotta font-semibold">{selectedFabric?.name}</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {fabricOptions.map((opt, idx) => {
                      const isSelected = selectedFabric?.name === opt.name;
                      return (
                        <button key={idx} type="button"
                          onClick={() => { setSelectedFabric(opt); setActiveImageIndex(idx % images.length); }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${isSelected ? "border-brand-terracotta bg-brand-cream text-brand-charcoal font-bold ring-2 ring-brand-terracotta/20" : "border-brand-sand bg-white text-brand-charcoal/80 hover:border-brand-sandDark"}`}>
                          <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: opt.hex }} />
                          <span>{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-brand-sand rounded-2xl bg-brand-porcelain p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-brand-charcoal hover:bg-white rounded-xl transition-colors font-bold">−</button>
                    <span className="w-10 text-center font-bold text-sm text-brand-charcoal">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-brand-charcoal hover:bg-white rounded-xl transition-colors font-bold">+</button>
                  </div>
                  <button onClick={handleAddToCart}
                    className="flex-1 bg-brand-porcelain hover:bg-brand-sand/50 text-brand-charcoal border border-brand-sand hover:border-brand-charcoal py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors shadow-subtle flex items-center justify-center gap-2">
                    + Add to Cart
                  </button>
                </div>
                <button onClick={handleOpenBookingModal}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracottaDark text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-floating flex items-center justify-center gap-2">
                  <span>⚡ Book Now — ₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                  <span className="text-white/70">|</span>
                  <span className="text-xs font-normal">Choose Address & Payment →</span>
                </button>
                {/* Book on WhatsApp */}
                <a
                  href={`https://wa.me/919810926762?text=${encodeURIComponent(`Hi! I'm interested in ordering: ${product.name}\nPrice: ₹${product.price.toLocaleString("en-IN")}\nLink: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2.5 rounded-2xl font-bold text-xs transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Book on WhatsApp
                </a>
              </div>

              {/* Pincode */}
              <div className="pt-4 border-t border-brand-sand">
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input type="text" maxLength={6} placeholder="Enter 6-Digit Delivery Pincode"
                    value={pincode} onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-semibold" />
                  <button type="submit"
                    className="bg-brand-charcoal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-terracotta transition-colors">
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className={`text-xs mt-2 font-semibold ${pincodeStatus.valid ? "text-brand-forest" : "text-red-500"}`}>
                    {pincodeStatus.message}
                  </p>
                )}
              </div>

              {/* Trust Grid */}
              <div className="pt-4 border-t border-brand-sand grid grid-cols-2 gap-3 text-xs text-brand-charcoal/80 font-medium">
                <div className="flex items-center gap-2"><span className="text-lg">🛡️</span><span>10-Year Frame Warranty</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🪵</span><span>100% Solid Sheesham Wood</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🚚</span><span>Free In-Room Placement</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🔄</span><span>7-Day In-Home Trial</span></div>
              </div>
            </div>
          </div>
        </div>



        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-[52px] inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-brand-sand p-2.5 px-4 shadow-floating flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-brand-muted block font-semibold leading-none">Special Price</span>
          <span className="font-display font-bold text-base text-brand-charcoal">₹{(product.price * quantity).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAddToCart}
            className="bg-brand-porcelain text-brand-charcoal border border-brand-sand px-3 py-2 rounded-xl text-xs font-bold active:bg-brand-sand transition-colors">
            + Cart
          </button>
          <button onClick={handleOpenBookingModal}
            className="bg-brand-terracotta text-white px-4 py-2 rounded-xl text-xs font-bold shadow-subtle active:bg-brand-terracottaDark transition-colors flex items-center gap-1">
            ⚡ Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
