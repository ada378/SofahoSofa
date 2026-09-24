import { useState, useEffect, useCallback, useRef } from "react";
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

// ─── Trim Cloudinary image whitespace (transparent/white padding in PNG files) ─
function trimCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // Add e_trim to remove transparent/white padding, with auto-format and high quality
    return url.replace("/upload/", "/upload/e_trim,f_auto,q_auto/");
  }
  return url;
}

// ─── Image Carousel Component ─────────────────────────────────────────────────
function ImageCarousel({ images, activeIndex, onIndexChange, product, inWish, onToggleWishlist }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const total = images.length;

  const prev = () => onIndexChange((activeIndex - 1 + total) % total);
  const next = () => onIndexChange((activeIndex + 1) % total);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, total]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    
    // Only trigger if horizontal swipe is greater than vertical scroll
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="space-y-3 select-none">
      {/* Main image with arrows — full width on mobile so photo looks big and clear */}
      <div
        className="relative -mx-3 sm:mx-0 w-[calc(100%+1.5rem)] sm:w-full rounded-none sm:rounded-3xl overflow-hidden bg-white border-y sm:border border-brand-sand shadow-subtle min-h-[240px] sm:min-h-0 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Active image — whitespace auto-trimmed via Cloudinary e_trim */}
        <img
          key={`carousel-img-${activeIndex}-${images[activeIndex]?.url}`}
          src={trimCloudinaryUrl(images[activeIndex]?.url)}
          alt={images[activeIndex]?.alt || product.name}
          className="w-full h-auto block transition-opacity duration-300 pointer-events-none max-h-[70vh] sm:max-h-[80vh] object-contain scale-[1.02] sm:scale-100"
        />
        {/* Overlay layer for absolute positioned elements */}
        <div className="absolute inset-0 pointer-events-none" />

        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {product.numReviews > 0 && (
            <span className="bg-brand-amber text-brand-charcoal text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-subtle uppercase tracking-wider">
              ★ {product.rating?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={onToggleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${inWish ? "bg-white text-red-500 shadow-card" : "bg-white/90 text-brand-charcoal hover:bg-white hover:text-red-500 shadow-subtle"}`}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={inWish ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Prev / Next arrows — only if multiple images */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-card text-brand-charcoal hover:bg-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-card text-brand-charcoal hover:bg-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 p-1 bg-black/20 backdrop-blur-sm rounded-full">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onIndexChange(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 p-0.5 ${
                    idx === activeIndex
                      ? "w-6 h-2 bg-brand-terracotta"
                      : "w-2 h-2 bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* Counter badge */}
            <span className="absolute bottom-3 right-4 z-10 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
              {activeIndex + 1} / {total}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onIndexChange(idx)}
              onPointerDown={() => onIndexChange(idx)}
              className={`flex-shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                activeIndex === idx
                  ? "border-brand-terracotta ring-2 ring-brand-terracotta/25 scale-105 shadow-card opacity-100"
                  : "border-brand-sand opacity-60 hover:opacity-100 hover:border-brand-sandDark"
              }`}
            >
              <img
                src={trimCloudinaryUrl(img.url)}
                alt={img.alt || `Photo ${idx + 1}`}
                className="w-full h-full object-contain pointer-events-none select-none"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
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
  const inWish = isInWishlist(product._id);
  const images = product.images?.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", alt: product.name }];

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
      url: `https://www.thesofahisofa.com/product/${product.slug}`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.thesofahisofa.com/" },
      { "@type": "ListItem", position: 2, name: product.category?.name || "Collections", item: `https://www.thesofahisofa.com/collections/${product.category?.slug || "all"}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://www.thesofahisofa.com/product/${product.slug}` },
    ],
  };

  return (
    <div className="bg-brand-porcelain min-h-screen py-4 sm:py-10 pb-36 lg:pb-10 w-full overflow-x-hidden">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`https://www.thesofahisofa.com/product/${product.slug}`}
        image={images[0]?.url}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
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
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Left: Image Carousel */}
          <div className="lg:col-span-7 space-y-4 w-full">
            <ImageCarousel
              images={images}
              activeIndex={activeImageIndex}
              onIndexChange={setActiveImageIndex}
              product={product}
              inWish={inWish}
              onToggleWishlist={() => toggleWishlist(product)}
            />
          </div>

          {/* Right: Product Configurator */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-brand-sand shadow-subtle space-y-4 sm:space-y-6">
              <div>
                <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">{product.subCategory}</span>
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-brand-charcoal font-bold mt-1 leading-tight">{product.name}</h1>
                <p className="text-brand-muted text-xs sm:text-sm mt-2 leading-relaxed">{product.shortDescription}</p>
              </div>

              <div className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-brand-charcoal">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-brand-forest font-semibold mt-1">
                  ✓ Free White-Glove Pan-India Installation · GST Included
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center border border-brand-sand rounded-2xl bg-brand-porcelain p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center text-brand-charcoal hover:bg-white rounded-xl transition-colors font-bold text-lg">−</button>
                    <span className="w-10 text-center font-bold text-sm text-brand-charcoal">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-brand-charcoal hover:bg-white rounded-xl transition-colors font-bold text-lg">+</button>
                  </div>
                  <button onClick={handleAddToCart}
                    className="flex-1 bg-brand-porcelain hover:bg-brand-sand/50 text-brand-charcoal border border-brand-sand hover:border-brand-charcoal py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors shadow-subtle flex items-center justify-center gap-2">
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
              <div className="pt-4 border-t border-brand-sand grid grid-cols-2 gap-2 sm:gap-3 text-[11px] sm:text-xs text-brand-charcoal/80 font-medium">
                <div className="flex items-center gap-1.5 sm:gap-2"><span className="text-base sm:text-lg">🛡️</span><span>10-Year Frame Warranty</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><span className="text-base sm:text-lg">🪵</span><span>Oak, Ash, Pine &amp; Tropical Woods</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><span className="text-base sm:text-lg">🚚</span><span>Free In-Room Placement</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><span className="text-base sm:text-lg">💳</span><span>0% No-Cost EMI Available</span></div>
              </div>
            </div>
          </div>
        </div>



        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-14 md:mt-20">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-brand-charcoal font-bold mb-4 sm:mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-brand-sand p-2.5 px-4 shadow-floating flex items-center justify-between gap-3">
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
