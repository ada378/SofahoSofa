import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { sampleProducts } from "../data/sampleProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetail({ onOpenSwatchModal }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = useMemo(() => {
    return sampleProducts.find((p) => p.slug === slug) || sampleProducts[0];
  }, [slug]);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Customization choices
  const [selectedFabric, setSelectedFabric] = useState(
    product.fabricOptions?.[0] || { name: "Standard", hex: "#D9A441" }
  );
  const [selectedSize, setSelectedSize] = useState(product.seatingCapacity || "Standard");
  const [quantity, setQuantity] = useState(1);

  // Pincode checker
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Active Spec Tab
  const [activeTab, setActiveTab] = useState("specs");

  // Reviews submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [customReviews, setCustomReviews] = useState([]);

  // --- Instant Book Now Modal Flow States ---
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1 = Summary, 2 = Address, 3 = Payment, 4 = Confirmed
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    paymentMethod: "cod",
  });
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const discount = Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100);
  const inWish = isInWishlist(product._id);
  const images = product.images || [{ url: product.image, alt: product.name }];

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeStatus({
        valid: true,
        message: "✓ Free White-Glove Delivery available in 4-6 Days. Cash on Delivery supported.",
      });
    } else {
      setPincodeStatus({ valid: false, message: "Please enter a valid 6-digit Indian pincode." });
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFabric.name, selectedSize);
  };

  // Open Direct Instant Booking Flow Modal
  const handleOpenBookingModal = () => {
    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingStep === 1) {
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!bookingForm.fullName || !bookingForm.phone || !bookingForm.address || !bookingForm.pincode) {
        alert("Please fill in all required delivery fields.");
        return;
      }
      setBookingStep(3);
    } else if (bookingStep === 3) {
      const orderId = `SHS-${Date.now().toString().slice(-6)}`;
      setConfirmedOrderId(orderId);
      setBookingStep(4);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;
    const newRev = {
      author: reviewAuthor,
      comment: reviewComment,
      rating: reviewRating,
      date: "Just now",
      verified: true,
    };
    setCustomReviews([newRev, ...customReviews]);
    setReviewAuthor("");
    setReviewComment("");
    setShowReviewForm(false);
  };

  // Related products
  const relatedProducts = sampleProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images[0]?.url,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Sofa Hi Sofa",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Sofa Hi Sofa.Com",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.numReviews,
    },
  };

  return (
    <div className="bg-brand-porcelain min-h-screen py-6 sm:py-10">
      <SEO
        title={`${product.name} | Sofa Hi Sofa`}
        description={product.shortDescription}
        canonical={`https://www.sofahisofa.com/product/${product.slug}`}
        jsonLd={jsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6">
          <Link to="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/collections/${product.category}`} className="hover:text-brand-charcoal transition-colors capitalize">
            {product.category?.replace(/-/g, " ")}
          </Link>
          <span>/</span>
          <span className="text-brand-charcoal font-semibold truncate">{product.name}</span>
        </nav>

        {/* Product Showcase (2 Columns) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-brand-sand shadow-subtle group">
              <img
                src={images[activeImageIndex]?.url || images[0]?.url}
                alt={images[activeImageIndex]?.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="bg-brand-charcoal text-white text-xs font-bold px-3 py-1 rounded-full shadow-subtle">
                    {discount}% OFF
                  </span>
                )}
                <span className="bg-brand-amber text-brand-charcoal text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-subtle uppercase tracking-wider">
                  ★ {product.rating} ({product.numReviews} reviews)
                </span>
              </div>

              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  inWish
                    ? "bg-white text-red-500 shadow-card"
                    : "bg-white/90 text-brand-charcoal hover:bg-white hover:text-red-500 shadow-subtle"
                }`}
                aria-label="Wishlist"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={inWish ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-brand-terracotta ring-2 ring-brand-terracotta/20 scale-105"
                        : "border-brand-sand hover:border-brand-sandDark opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Free Swatch Box Banner */}
            <div className="p-4 bg-brand-forestLight rounded-2xl border border-brand-forest/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-bold text-xs text-brand-forest">Not sure about the color under home lighting?</p>
                  <p className="text-[11px] text-brand-forest/90">Order a free physical swatch kit delivered in 48 hours.</p>
                </div>
              </div>
              <button
                onClick={onOpenSwatchModal}
                className="bg-brand-forest text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-charcoal transition-colors whitespace-nowrap shadow-subtle"
              >
                Order Swatch Box (₹0)
              </button>
            </div>
          </div>

          {/* Right Column: Product Configurator & Purchasing */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-subtle space-y-6">
              {/* Title & Subtitle */}
              <div>
                <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
                  {product.subCategory}
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-1">
                  {product.name}
                </h1>
                <p className="text-brand-muted text-xs sm:text-sm mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price & Savings Box */}
              <div className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-brand-charcoal">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-base text-brand-muted line-through">
                    ₹{product.marketPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-brand-terracotta text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Save ₹{(product.marketPrice - product.price).toLocaleString("en-IN")} ({discount}%)
                  </span>
                </div>
                <p className="text-[11px] text-brand-forest font-semibold mt-1">
                  ✓ Free White-Glove Pan-India Installation · GST Included
                </p>
              </div>

              {/* Fabric / Color Swatch Picker */}
              {product.fabricOptions && product.fabricOptions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                      Upholstery Color: <span className="text-brand-terracotta font-semibold">{selectedFabric.name}</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.fabricOptions.map((opt, idx) => {
                      const isSelected = selectedFabric.name === opt.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedFabric(opt);
                            setActiveImageIndex(idx % images.length);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? "border-brand-terracotta bg-brand-cream text-brand-charcoal font-bold ring-2 ring-brand-terracotta/20"
                              : "border-brand-sand bg-white text-brand-charcoal/80 hover:border-brand-sandDark"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                            style={{ backgroundColor: opt.hex }}
                          />
                          <span>{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seating / Size Selector */}
              <div>
                <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                  Configuration / Seating:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    product.seatingCapacity || "Standard Size",
                    "3 + 2 Seater Set (+₹18,000)",
                    "Modular Left Chaise",
                    "Modular Right Chaise",
                  ].map((cfg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(cfg)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedSize === cfg
                          ? "bg-brand-charcoal text-white border-brand-charcoal shadow-subtle"
                          : "bg-white border-brand-sand text-brand-charcoal/80 hover:bg-brand-porcelain"
                      }`}
                    >
                      {cfg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-brand-sand rounded-2xl bg-brand-porcelain p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-brand-charcoal hover:bg-white rounded-xl transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-brand-charcoal">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-brand-charcoal hover:bg-white rounded-xl transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-brand-porcelain hover:bg-brand-sand/50 text-brand-charcoal border border-brand-sand hover:border-brand-charcoal py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors shadow-subtle flex items-center justify-center gap-2"
                  >
                    <span>+ Add to Cart</span>
                  </button>
                </div>

                {/* Primary Book Now / Instant Order Button */}
                <button
                  onClick={handleOpenBookingModal}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracottaDark text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-floating flex items-center justify-center gap-2"
                >
                  <span>⚡ Book Now — ₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                  <span className="text-white/70">|</span>
                  <span className="text-xs font-normal">Choose Address &amp; Payment →</span>
                </button>
              </div>

              {/* Pincode Estimator */}
              <div className="pt-4 border-t border-brand-sand">
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-Digit Delivery Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-brand-charcoal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-terracotta transition-colors"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p
                    className={`text-xs mt-2 font-semibold ${
                      pincodeStatus.valid ? "text-brand-forest" : "text-red-500"
                    }`}
                  >
                    {pincodeStatus.message}
                  </p>
                )}
              </div>

              {/* Trust Guarantees */}
              <div className="pt-4 border-t border-brand-sand grid grid-cols-2 gap-3 text-xs text-brand-charcoal/80 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <span>10-Year Frame Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪵</span>
                  <span>100% Solid Sheesham Wood</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚚</span>
                  <span>Free In-Room Placement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔄</span>
                  <span>7-Day In-Home Trial</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Instant Book Now Step-by-Step Checkout Modal --- */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-brand-charcoal/70 backdrop-blur-sm transition-opacity"
              onClick={() => setIsBookingModalOpen(false)}
            />

            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-card overflow-hidden border border-brand-sand">
                {/* Close button */}
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="absolute top-5 right-5 p-2 text-brand-muted hover:text-brand-charcoal hover:bg-brand-porcelain rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 text-xs font-bold border-b border-brand-sand pb-4">
                  <span className={`px-2.5 py-1 rounded-full ${bookingStep >= 1 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>
                    1. Summary
                  </span>
                  <span className="text-brand-sand">→</span>
                  <span className={`px-2.5 py-1 rounded-full ${bookingStep >= 2 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>
                    2. Address
                  </span>
                  <span className="text-brand-sand">→</span>
                  <span className={`px-2.5 py-1 rounded-full ${bookingStep >= 3 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>
                    3. Payment
                  </span>
                </div>

                {/* Step 1: Order Summary */}
                {bookingStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="font-display text-2xl text-brand-charcoal font-bold">Review Your Booking</h3>
                      <p className="text-xs text-brand-muted mt-0.5">Check selected color, configuration and savings</p>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-brand-porcelain border border-brand-sand items-center">
                      <img
                        src={images[0]?.url}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-brand-sand flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-brand-charcoal truncate">{product.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-brand-charcoal">
                          <span className="bg-white px-2 py-0.5 rounded border border-brand-sand font-semibold">
                            Color: {selectedFabric.name}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded border border-brand-sand font-semibold">
                            Size: {selectedSize}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded border border-brand-sand font-semibold">
                            Qty: {quantity}
                          </span>
                        </div>
                        <div className="font-display font-bold text-base text-brand-charcoal mt-2">
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                          <span className="text-xs text-brand-muted line-through font-normal ml-2">
                            ₹{(product.marketPrice * quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-brand-charcoal/80 bg-brand-cream/60 p-4 rounded-2xl border border-brand-sand">
                      <div className="flex justify-between">
                        <span>White-Glove Pan-India Delivery</span>
                        <span className="font-bold text-brand-forest">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Room Installation</span>
                        <span className="font-bold text-brand-forest">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10-Year Solid Hardwood Warranty</span>
                        <span className="font-bold text-brand-forest">Included</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      className="w-full bg-brand-terracotta hover:bg-brand-terracottaDark text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-subtle flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Delivery Address →</span>
                    </button>
                  </div>
                )}

                {/* Step 2: Delivery Address Form */}
                {bookingStep === 2 && (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="font-display text-2xl text-brand-charcoal font-bold">Delivery Destination</h3>
                      <p className="text-xs text-brand-muted mt-0.5">Where should our installation team deliver your sofa?</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Full Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Pooja Krishnamurthy"
                          value={bookingForm.fullName}
                          onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                          className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Mobile Number (for Tracking) *</label>
                        <input
                          required
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. pooja@gmail.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Street Address / House No. *</label>
                      <input
                        required
                        type="text"
                        placeholder="Flat 402, Oakwood Residences, 12th Main"
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-brand-charcoal mb-1">City *</label>
                        <input
                          required
                          type="text"
                          value={bookingForm.city}
                          onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                          className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-brand-charcoal mb-1">State *</label>
                        <input
                          required
                          type="text"
                          value={bookingForm.state}
                          onChange={(e) => setBookingForm({ ...bookingForm, state: e.target.value })}
                          className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Pincode *</label>
                        <input
                          required
                          type="text"
                          maxLength={6}
                          value={bookingForm.pincode}
                          onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })}
                          className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="py-3 px-5 border border-brand-sand rounded-full text-xs font-bold text-brand-charcoal hover:bg-brand-porcelain"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-brand-terracotta hover:bg-brand-terracottaDark text-white py-3 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-subtle"
                      >
                        Proceed to Payment Method →
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Payment Method Selection */}
                {bookingStep === 3 && (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="font-display text-2xl text-brand-charcoal font-bold">Select Payment Option</h3>
                      <p className="text-xs text-brand-muted mt-0.5">Pay after in-home unboxing or choose digital payment</p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          id: "cod",
                          title: "Cash / Card on Delivery (Recommended)",
                          desc: "Pay only after unboxing, inspection, and room setup",
                          badge: "Most Popular",
                        },
                        {
                          id: "upi",
                          title: "UPI / QR Code",
                          desc: "Instant payment via Google Pay, PhonePe, or Paytm",
                          badge: "Instant 5% Cashback",
                        },
                        {
                          id: "card",
                          title: "Credit / Debit Cards",
                          desc: "Visa, Mastercard, Rupay with 256-Bit SSL protection",
                        },
                        {
                          id: "emi",
                          title: "0% No-Cost EMI",
                          desc: `Starting at ₹${Math.round((product.price * quantity) / 12).toLocaleString("en-IN")}/month`,
                        },
                      ].map((pm) => (
                        <label
                          key={pm.id}
                          className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                            bookingForm.paymentMethod === pm.id
                              ? "border-brand-terracotta bg-brand-cream ring-2 ring-brand-terracotta/20"
                              : "border-brand-sand bg-white hover:bg-brand-porcelain"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="bookingPayment"
                              checked={bookingForm.paymentMethod === pm.id}
                              onChange={() => setBookingForm({ ...bookingForm, paymentMethod: pm.id })}
                              className="accent-brand-terracotta"
                            />
                            <div>
                              <p className="font-bold text-xs text-brand-charcoal">{pm.title}</p>
                              <p className="text-[11px] text-brand-muted">{pm.desc}</p>
                            </div>
                          </div>
                          {pm.badge && (
                            <span className="bg-brand-amberLight text-brand-amber text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                              {pm.badge}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>

                    <div className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand flex justify-between items-center text-xs font-bold text-brand-charcoal">
                      <span>Total Amount Payable:</span>
                      <span className="font-display text-lg font-bold text-brand-terracotta">
                        ₹{(product.price * quantity).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setBookingStep(2)}
                        className="py-3 px-5 border border-brand-sand rounded-full text-xs font-bold text-brand-charcoal hover:bg-brand-porcelain"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-brand-forest hover:bg-brand-charcoal text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-floating"
                      >
                        Confirm Booking &amp; Place Order (₹{(product.price * quantity).toLocaleString("en-IN")})
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 4: Order Confirmed Screen */}
                {bookingStep === 4 && (
                  <div className="text-center py-4 space-y-4 animate-fade-in">
                    <div className="w-16 h-16 bg-brand-forestLight text-brand-forest rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                      ✓
                    </div>

                    <div>
                      <span className="bg-brand-forestLight text-brand-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Booking Confirmed
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-2">
                        Your Furniture is Booked!
                      </h3>
                      <p className="text-brand-muted text-xs sm:text-sm mt-1">
                        Order ID: <strong className="text-brand-charcoal font-mono">{confirmedOrderId}</strong>
                      </p>
                    </div>

                    <div className="bg-brand-porcelain p-4 rounded-2xl border border-brand-sand text-left text-xs space-y-2 max-w-md mx-auto">
                      <p><strong>Item:</strong> {product.name} (Qty: {quantity})</p>
                      <p><strong>Custom Fabric:</strong> {selectedFabric.name}</p>
                      <p><strong>Customer:</strong> {bookingForm.fullName} ({bookingForm.phone})</p>
                      <p><strong>Destination:</strong> {bookingForm.address}, {bookingForm.city} - {bookingForm.pincode}</p>
                      <p><strong>Payment:</strong> {bookingForm.paymentMethod === "cod" ? "Pay on Delivery (COD)" : bookingForm.paymentMethod.toUpperCase()}</p>
                      <p><strong>Delivery:</strong> Dispatches within 48 Hours with Free Installation</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsBookingModalOpen(false);
                          navigate("/wishlist");
                        }}
                        className="bg-brand-charcoal text-white px-8 py-3 rounded-full text-xs sm:text-sm font-bold hover:bg-brand-terracotta transition-colors shadow-subtle"
                      >
                        Done &amp; View Saved Items
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tabs Section */}
        <div className="mt-12 sm:mt-16 bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 sm:p-10">
          {/* Tab Navigation */}
          <div className="flex border-b border-brand-sand gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: "specs", label: "Dimensions & Specifications" },
              { id: "features", label: "Key Features & Materials" },
              { id: "warranty", label: "10-Year Warranty & Care" },
              { id: "reviews", label: `Customer Reviews (${product.numReviews + customReviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-brand-terracotta text-brand-terracotta"
                    : "border-transparent text-brand-muted hover:text-brand-charcoal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Dimensions & Specs */}
          {activeTab === "specs" && (
            <div className="py-6 space-y-6 animate-fade-in text-xs sm:text-sm">
              <p className="text-brand-charcoal leading-relaxed max-w-3xl font-medium">
                {product.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-brand-sand">
                <div className="bg-brand-porcelain p-4 rounded-2xl border border-brand-sand">
                  <span className="text-brand-muted text-[11px] block font-semibold">Width</span>
                  <span className="font-bold text-brand-charcoal text-base">
                    {product.dimensions?.width} {product.dimensions?.unit}
                  </span>
                </div>
                <div className="bg-brand-porcelain p-4 rounded-2xl border border-brand-sand">
                  <span className="text-brand-muted text-[11px] block font-semibold">Depth</span>
                  <span className="font-bold text-brand-charcoal text-base">
                    {product.dimensions?.depth} {product.dimensions?.unit}
                  </span>
                </div>
                <div className="bg-brand-porcelain p-4 rounded-2xl border border-brand-sand">
                  <span className="text-brand-muted text-[11px] block font-semibold">Height</span>
                  <span className="font-bold text-brand-charcoal text-base">
                    {product.dimensions?.height} {product.dimensions?.unit}
                  </span>
                </div>
                <div className="bg-brand-porcelain p-4 rounded-2xl border border-brand-sand">
                  <span className="text-brand-muted text-[11px] block font-semibold">Seating Height</span>
                  <span className="font-bold text-brand-charcoal text-base">
                    {product.dimensions?.seatingHeight || "45 cm"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Key Features */}
          {activeTab === "features" && (
            <div className="py-6 space-y-4 animate-fade-in text-xs sm:text-sm">
              <ul className="grid sm:grid-cols-2 gap-3">
                {product.features?.map((feat, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 bg-brand-porcelain rounded-2xl border border-brand-sand flex items-start gap-2.5"
                  >
                    <span className="text-brand-forest font-bold">✓</span>
                    <span className="text-brand-charcoal leading-relaxed font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 3: Warranty & Care */}
          {activeTab === "warranty" && (
            <div className="py-6 space-y-4 animate-fade-in text-xs sm:text-sm text-brand-charcoal/90 leading-relaxed max-w-3xl">
              <div className="p-4 bg-brand-forestLight rounded-2xl border border-brand-forest/20 text-brand-forest font-bold">
                🛡️ {product.warranty}
              </div>
              <p>
                <strong>What's Covered:</strong> Internal kiln-dried solid hardwood frame integrity, anti-sag spring suspension, joint bondings, and lifetime anti-termite wood treatment.
              </p>
              <p>
                <strong>Fabric Care Guide:</strong> Wipe minor spills immediately with a clean, dry micro-fiber cloth. For deep cleaning, spot clean with mild upholstery shampoo.
              </p>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === "reviews" && (
            <div className="py-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg text-brand-charcoal font-bold">Customer Reviews</h3>
                  <p className="text-xs text-brand-muted">Overall rating: ★ {product.rating} / 5.0</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-brand-charcoal text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-terracotta transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-5 bg-brand-porcelain rounded-2xl border border-brand-sand space-y-3">
                  <h4 className="font-bold text-xs text-brand-charcoal">Submit Verified Review</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal"
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal font-semibold"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your experience with the comfort, fabric, and delivery..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal"
                  />
                  <button
                    type="submit"
                    className="bg-brand-forest text-white px-5 py-2 rounded-xl text-xs font-bold"
                  >
                    Post Review
                  </button>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-3">
                {customReviews.map((rev, idx) => (
                  <div key={idx} className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-charcoal">{rev.author}</span>
                      <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}</span>
                    </div>
                    <p className="text-brand-charcoal font-medium">{rev.comment}</p>
                    <span className="text-[10px] text-brand-muted">{rev.date}</span>
                  </div>
                ))}
                <div className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-charcoal">Rohan Verma (Bengaluru)</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-brand-charcoal font-medium">
                    The solid Sheesham frame is incredibly sturdy and heavy. The fabric looks even richer than the photos!
                  </p>
                  <span className="text-[10px] text-brand-muted">2 weeks ago · Verified Purchase</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
