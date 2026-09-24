import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

// WhatsApp number (business number — change if needed)
const WHATSAPP_NUMBER = "919810926762";

function buildWhatsAppMessage(orderId, formData, cartItems, finalTotal) {
  const itemLines = cartItems
    .map(
      (item) =>
        `• ${item.product.name} (${item.selectedFabric}, ${item.selectedSize}) × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`
    )
    .join("\n");

  const message = `🛋️ *New Order Received — Sofa Hi Sofa*

📦 *Order ID:* ${orderId}

👤 *Customer Details:*
Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email}

📍 *Delivery Address:*
${formData.address}
${formData.city}, ${formData.state} – ${formData.pincode}

🛒 *Items Ordered:*
${itemLines}

💰 *Total Amount:* ₹${finalTotal.toLocaleString("en-IN")}
💳 *Payment:* Cash on Delivery (COD)

✅ Please confirm and process this order.`;

  return encodeURIComponent(message);
}

export default function Cart() {
  const {
    cartItems,
    cartCount,
    subtotal,
    discountAmount,
    finalTotal,
    totalSavings,
    couponCode,
    couponDiscountPercent,
    couponMessage,
    freeDeliveryThreshold,
    amountToFreeDelivery,
    updateQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [inputCoupon, setInputCoupon] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    orderNotes: "",
  });

  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setOrderError("");

    try {
      // Build items payload for backend
      const items = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || item.product.image || "",
        fabricChoice: item.selectedFabric || "",
        qty: item.quantity,
        price: item.price,
      }));

      const payload = {
        items,
        shippingAddress: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        paymentMethod: "COD",
        // Guest info — backend uses this when user not logged in
        guestInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
      };

      const { data } = await api.post("/orders", payload);

      const orderId = data._id;
      setConfirmedOrderId(orderId);

      // Open WhatsApp with order details
      const waMsg = buildWhatsAppMessage(orderId, formData, cartItems, finalTotal);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, "_blank");

      clearCart();
      setStep(3);
    } catch (err) {
      setOrderError(
        err.response?.data?.message || "Order place karne mein error aayi. Dobara try karein."
      );
    } finally {
      setPlacing(false);
    }
  };

  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="bg-brand-porcelain min-h-screen py-8 sm:py-12">
      <SEO
        title="Your Shopping Cart & Checkout | Sofa Hi Sofa"
        description="Review your handcrafted furniture order, select customized fabrics, apply coupons, and enjoy free white-glove pan-India delivery."
        canonical="https://www.thesofahisofa.com/cart"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-brand-terracotta" : "text-brand-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>1</span>
            <span>Shopping Cart</span>
          </div>
          <span className="w-8 h-px bg-brand-sand" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-brand-terracotta" : "text-brand-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>2</span>
            <span>Delivery Details</span>
          </div>
          <span className="w-8 h-px bg-brand-sand" />
          <div className={`flex items-center gap-2 ${step === 3 ? "text-brand-forest" : "text-brand-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? "bg-brand-forest text-white" : "bg-brand-sand text-brand-charcoal"}`}>3</span>
            <span>Order Confirmed</span>
          </div>
        </div>

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-brand-sand shadow-card text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-brand-forestLight text-brand-forest rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              ✓
            </div>
            <div>
              <span className="bg-brand-amberLight text-brand-amber text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Order Successfully Placed
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-brand-charcoal mt-3">
                Thank you, {formData.fullName}!
              </h1>
              <p className="text-brand-muted text-xs sm:text-sm mt-2">
                Order ID: <strong className="text-brand-charcoal font-mono">{confirmedOrderId?.slice(-8)?.toUpperCase()}</strong>
              </p>
            </div>

            <div className="bg-brand-porcelain p-5 rounded-2xl border border-brand-sand text-left text-xs space-y-2 max-w-lg mx-auto">
              <p><strong>Customer:</strong> {formData.fullName} ({formData.phone})</p>
              <p><strong>Delivery Address:</strong> {formData.address}, {formData.city}, {formData.state} – {formData.pincode}</p>
              <p><strong>Payment:</strong> Cash on Delivery (COD)</p>
              <p><strong>Estimated Dispatch:</strong> Within 48 Hours with Free Installation</p>
            </div>

            {/* WhatsApp re-send button */}
            <button
              onClick={() => {
                const waMsg = buildWhatsAppMessage(confirmedOrderId, formData, [], finalTotal);
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, "_blank");
              }}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-subtle"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp par Order Details Bhejo
            </button>

            <button
              onClick={() => navigate("/")}
              className="block w-full sm:w-auto sm:inline-block bg-brand-charcoal text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* ── Empty Cart ── */}
        {step !== 3 && cartItems.length === 0 && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 sm:p-14 border border-brand-sand shadow-subtle text-center space-y-5">
            <div className="w-20 h-20 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-4xl">🛋️</div>
            <h2 className="font-display text-2xl text-brand-charcoal">Your cart is currently empty</h2>
            <p className="text-brand-muted text-xs sm:text-sm max-w-sm mx-auto">
              Discover our handcrafted solid wood sofas, modular L-shape sectionals, motorized recliners, and beds.
            </p>
            <Link
              to="/collections/all"
              className="inline-block bg-brand-charcoal text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
            >
              Browse Handcrafted Furniture
            </Link>
          </div>
        )}

        {/* ── Step 1 & 2 ── */}
        {step !== 3 && cartItems.length > 0 && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Bar */}
              <div className="bg-brand-cream rounded-2xl p-4 border border-brand-sand text-xs">
                {amountToFreeDelivery > 0 ? (
                  <p className="text-brand-charcoal font-medium">
                    Add <strong className="text-brand-terracotta">₹{amountToFreeDelivery.toLocaleString("en-IN")}</strong> more to unlock <strong className="text-brand-forest">FREE White-Glove Installation</strong>
                  </p>
                ) : (
                  <p className="text-brand-forest font-semibold flex items-center gap-1.5">
                    <span>🎉</span> You&apos;ve unlocked FREE Pan-India White-Glove Delivery &amp; In-Room Assembly!
                  </p>
                )}
                <div className="w-full bg-brand-sand h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-terracotta h-full rounded-full transition-all duration-500" style={{ width: `${deliveryProgress}%` }} />
                </div>
              </div>

              {/* ── Step 1: Cart Items ── */}
              {step === 1 && (
                <div className="bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                    <h2 className="font-display text-xl text-brand-charcoal">Items in Cart ({cartCount})</h2>
                    <button onClick={clearCart} className="text-xs text-brand-muted hover:text-red-500 transition-colors">
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-brand-porcelain border border-brand-sand/70 justify-between items-start sm:items-center">
                        <div className="flex gap-4 items-center">
                          <img
                            src={item.product.images?.[0]?.url || item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 rounded-2xl object-cover bg-brand-sand flex-shrink-0"
                          />
                          <div>
                            <Link to={`/product/${item.product.slug}`} className="font-semibold text-sm text-brand-charcoal hover:text-brand-terracotta line-clamp-1">
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-brand-muted mt-0.5">{item.product.material}</p>
                            <div className="flex gap-1.5 mt-1 text-[11px] text-brand-muted">
                              <span className="bg-white px-2 py-0.5 rounded-md border border-brand-sand font-medium">Color: {item.selectedFabric}</span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-brand-sand font-medium">Size: {item.selectedSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-sand">
                          <div className="flex items-center border border-brand-sand rounded-xl bg-white">
                            <button onClick={() => updateQty(item.cartItemId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-xs text-brand-charcoal hover:bg-brand-sand rounded-l-xl transition-colors font-bold">−</button>
                            <span className="w-8 text-center text-xs font-bold text-brand-charcoal">{item.quantity}</span>
                            <button onClick={() => updateQty(item.cartItemId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-xs text-brand-charcoal hover:bg-brand-sand rounded-r-xl transition-colors font-bold">+</button>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm text-brand-charcoal">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                            {item.marketPrice > item.price && (
                              <div className="text-[11px] text-brand-muted line-through">₹{(item.marketPrice * item.quantity).toLocaleString("en-IN")}</div>
                            )}
                          </div>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-brand-muted hover:text-red-500 p-1 transition-colors" aria-label="Remove">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2: Delivery Form ── */}
              {step === 2 && (
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                    <h2 className="font-display text-xl text-brand-charcoal">Delivery Address &amp; Details</h2>
                    <button type="button" onClick={() => setStep(1)} className="text-xs text-brand-terracotta hover:underline font-semibold">← Back to Cart</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Full Name *</label>
                      <input required type="text" placeholder="e.g. Rahul Sharma" value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Mobile Number *</label>
                      <input required type="tel" placeholder="e.g. 9876543210" value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">Email Address *</label>
                    <input required type="email" placeholder="e.g. rahul@gmail.com" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">Street Address / House No. *</label>
                    <input required type="text" placeholder="Flat 402, Oakwood Residences, 12th Main" value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">City *</label>
                      <input required type="text" placeholder="e.g. Lucknow" value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">State *</label>
                      <input required type="text" placeholder="e.g. Uttar Pradesh" value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Pincode *</label>
                      <input required type="text" maxLength={6} placeholder="e.g. 226001" value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none" />
                    </div>
                  </div>

                  {/* COD Only — Payment Method */}
                  <div className="pt-4 border-t border-brand-sand">
                    <h3 className="font-display text-base text-brand-charcoal mb-3">Payment Method</h3>
                    <div className="p-4 rounded-2xl border-2 border-brand-terracotta bg-brand-cream/60 flex items-start gap-3">
                      <span className="text-2xl">💵</span>
                      <div>
                        <p className="font-bold text-sm text-brand-charcoal">Cash on Delivery (COD)</p>
                        <p className="text-xs text-brand-muted mt-0.5">Pay cash after unboxing and in-room assembly. No advance payment required.</p>
                      </div>
                      <span className="ml-auto text-brand-forest font-bold text-xs bg-brand-forestLight px-2 py-1 rounded-lg">Selected ✓</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {orderError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 font-medium">
                      ⚠️ {orderError}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* ── Right Column: Order Summary ── */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 space-y-5 sticky top-24">
              <h3 className="font-display text-lg text-brand-charcoal pb-3 border-b border-brand-sand">Order Summary</h3>

              {/* Coupon */}
              <div>
                {couponDiscountPercent > 0 ? (
                  <div className="flex items-center justify-between bg-brand-forestLight border border-brand-forest/20 rounded-xl px-3 py-2 text-xs">
                    <span className="text-brand-forest font-semibold flex items-center gap-1.5">✓ Code {couponCode} ({couponDiscountPercent}% OFF)</span>
                    <button onClick={removeCoupon} className="text-brand-muted hover:text-red-500 underline text-[11px]">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input type="text" placeholder="Coupon (e.g. SOFALUXE)" value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs uppercase focus:border-brand-terracotta focus:outline-none" />
                    <button type="submit" className="bg-brand-charcoal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-terracotta transition-colors">Apply</button>
                  </form>
                )}
                {couponMessage && couponDiscountPercent === 0 && (
                  <p className="text-[11px] text-red-500 mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-brand-muted">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-forest font-medium">
                    <span>Coupon Discount ({couponDiscountPercent}%)</span>
                    <span>−₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Delivery &amp; Installation</span>
                  <span className="text-brand-forest font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>GST &amp; Transit Insurance</span>
                  <span className="text-brand-forest font-semibold">Included</span>
                </div>
                <div className="pt-3 border-t border-brand-sand flex justify-between items-baseline text-sm font-semibold text-brand-charcoal">
                  <span>Total Payable (COD)</span>
                  <span className="font-display text-xl">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="bg-brand-forestLight text-brand-forest p-2.5 rounded-xl text-center text-xs font-semibold">
                    ✨ You are saving ₹{totalSavings.toLocaleString("en-IN")} on this order!
                  </div>
                )}
              </div>

              {/* Action Button */}
              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-brand-charcoal text-white py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-brand-terracotta transition-colors shadow-floating flex items-center justify-center gap-2"
                >
                  Proceed to Delivery Details →
                </button>
              ) : (
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={placing}
                  className="w-full bg-brand-forest text-white py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-brand-charcoal transition-colors shadow-floating flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {placing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>💵 Place Order — ₹{finalTotal.toLocaleString("en-IN")} (COD)</>
                  )}
                </button>
              )}

              <div className="text-[11px] text-brand-muted text-center space-y-1">
                <p>🔒 Secure Checkout · No Advance Payment</p>
                <p>10-Year Solid Wood &amp; Frame Warranty Included</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
