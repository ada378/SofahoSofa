import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    cartCount,
    subtotal,
    marketTotal,
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

  // Checkout Step
  const [step, setStep] = useState(1); // 1 = Cart, 2 = Checkout Form, 3 = Confirmation
  const [inputCoupon, setInputCoupon] = useState("");

  // Customer Delivery Info
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    paymentMethod: "cod", // "cod", "upi", "card", "emi"
    orderNotes: "",
  });

  // Generated Order Confirmation ID
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderId = `SHS-${Date.now().toString().slice(-6)}`;
    setConfirmedOrderId(orderId);
    setStep(3);
    clearCart();
  };

  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="bg-brand-porcelain min-h-screen py-8 sm:py-12">
      <SEO
        title="Your Shopping Cart & Checkout | Sofa Hi Sofa"
        description="Review your handcrafted furniture order, select customized fabrics, apply coupons, and enjoy free white-glove pan-India delivery."
        canonical="https://www.sofahisofa.com/cart"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-brand-terracotta" : "text-brand-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>
              1
            </span>
            <span>Shopping Cart</span>
          </div>
          <span className="w-8 h-px bg-brand-sand" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-brand-terracotta" : "text-brand-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? "bg-brand-terracotta text-white" : "bg-brand-sand text-brand-charcoal"}`}>
              2
            </span>
            <span>Delivery &amp; Payment</span>
          </div>
          <span className="w-8 h-px bg-brand-sand" />
          <div className={`flex items-center gap-2 ${step === 3 ? "text-brand-forest" : "text-brand-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? "bg-brand-forest text-white" : "bg-brand-sand text-brand-charcoal"}`}>
              3
            </span>
            <span>Order Confirmed</span>
          </div>
        </div>

        {/* Step 3: Order Confirmation */}
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
                Thank you for your order!
              </h1>
              <p className="text-brand-muted text-xs sm:text-sm mt-2">
                Order ID: <strong className="text-brand-charcoal font-mono">{confirmedOrderId}</strong>
              </p>
            </div>

            <div className="bg-brand-porcelain p-5 rounded-2xl border border-brand-sand text-left text-xs space-y-2 max-w-lg mx-auto">
              <p><strong>Customer:</strong> {formData.fullName || "Customer"} ({formData.phone || "+91 XXXXXXXXXX"})</p>
              <p><strong>Delivery Destination:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
              <p><strong>Payment Method:</strong> {formData.paymentMethod === "cod" ? "Cash / Card on Delivery" : formData.paymentMethod.toUpperCase()}</p>
              <p><strong>Estimated Dispatch:</strong> Within 48 Hours with Free Installation</p>
            </div>

            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Our factory master craftsmen have received your custom order specifications. We will send live WhatsApp and SMS tracking updates to <strong>{formData.phone}</strong>.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-brand-charcoal text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Empty Cart View */}
        {step !== 3 && cartItems.length === 0 && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 sm:p-14 border border-brand-sand shadow-subtle text-center space-y-5">
            <div className="w-20 h-20 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-4xl">
              🛋️
            </div>
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

        {/* Step 1 & 2 Main Content Grid */}
        {step !== 3 && cartItems.length > 0 && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items or Delivery Form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Alert */}
              <div className="bg-brand-cream rounded-2xl p-4 border border-brand-sand text-xs">
                {amountToFreeDelivery > 0 ? (
                  <p className="text-brand-charcoal font-medium">
                    Add <strong className="text-brand-terracotta">₹{amountToFreeDelivery.toLocaleString("en-IN")}</strong> more to unlock <strong className="text-brand-forest">FREE White-Glove Installation</strong>
                  </p>
                ) : (
                  <p className="text-brand-forest font-semibold flex items-center gap-1.5">
                    <span>🎉</span> You've unlocked FREE Pan-India White-Glove Delivery &amp; In-Room Assembly!
                  </p>
                )}
                <div className="w-full bg-brand-sand h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-brand-terracotta h-full rounded-full transition-all duration-500"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>

              {step === 1 ? (
                /* Step 1: Cart Items List */
                <div className="bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                    <h2 className="font-display text-xl text-brand-charcoal">Items in Cart ({cartCount})</h2>
                    <button
                      onClick={clearCart}
                      className="text-xs text-brand-muted hover:text-red-500 transition-colors"
                    >
                      Clear All Items
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-brand-porcelain border border-brand-sand/70 justify-between items-start sm:items-center"
                      >
                        <div className="flex gap-4 items-center">
                          <img
                            src={item.product.images?.[0]?.url || item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 rounded-2xl object-cover bg-brand-sand flex-shrink-0"
                          />
                          <div>
                            <Link
                              to={`/product/${item.product.slug}`}
                              className="font-semibold text-sm text-brand-charcoal hover:text-brand-terracotta line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-brand-muted mt-0.5">{item.product.material}</p>
                            <div className="flex gap-1.5 mt-1 text-[11px] text-brand-muted">
                              <span className="bg-white px-2 py-0.5 rounded-md border border-brand-sand font-medium">
                                Color: {item.selectedFabric}
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-brand-sand font-medium">
                                Size: {item.selectedSize}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-sand">
                          {/* Quantity */}
                          <div className="flex items-center border border-brand-sand rounded-xl bg-white">
                            <button
                              onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-xs text-brand-charcoal hover:bg-brand-sand rounded-l-xl transition-colors font-bold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-brand-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-xs text-brand-charcoal hover:bg-brand-sand rounded-r-xl transition-colors font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-semibold text-sm text-brand-charcoal">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </div>
                            {item.marketPrice > item.price && (
                              <div className="text-[11px] text-brand-muted line-through">
                                ₹{(item.marketPrice * item.quantity).toLocaleString("en-IN")}
                              </div>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-brand-muted hover:text-red-500 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Step 2: Shipping & Payment Form */
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                    <h2 className="font-display text-xl text-brand-charcoal">Delivery Address &amp; Details</h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-brand-terracotta hover:underline font-semibold"
                    >
                      ← Back to Cart
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Pooja Krishnamurthy"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Mobile Number (for Delivery SMS) *</label>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. pooja@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">Street Address / House No. *</label>
                    <input
                      required
                      type="text"
                      placeholder="Flat 402, Oakwood Residences, 12th Main"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">City *</label>
                      <input
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">State *</label>
                      <input
                        required
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Pincode *</label>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:border-brand-terracotta"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-4 border-t border-brand-sand">
                    <h3 className="font-display text-base text-brand-charcoal mb-3">Select Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "cod", title: "Cash on Delivery (COD)", desc: "Pay after unboxing and assembly" },
                        { id: "upi", title: "UPI / QR Code", desc: "Google Pay, PhonePe, Paytm" },
                        { id: "card", title: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay (Safe 256-Bit SSL)" },
                        { id: "emi", title: "0% No-Cost EMI", desc: "Starting at ₹2,415/month" },
                      ].map((pm) => (
                        <label
                          key={pm.id}
                          className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                            formData.paymentMethod === pm.id
                              ? "border-brand-terracotta bg-brand-cream/60 ring-2 ring-brand-terracotta/20"
                              : "border-brand-sand bg-brand-porcelain hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={formData.paymentMethod === pm.id}
                            onChange={() => setFormData({ ...formData, paymentMethod: pm.id })}
                            className="mt-0.5 accent-brand-terracotta"
                          />
                          <div>
                            <p className="font-semibold text-xs text-brand-charcoal">{pm.title}</p>
                            <p className="text-[11px] text-brand-muted mt-0.5">{pm.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Order Summary & Action */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-sand shadow-subtle p-6 space-y-5 sticky top-24">
              <h3 className="font-display text-lg text-brand-charcoal pb-3 border-b border-brand-sand">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div>
                {couponDiscountPercent > 0 ? (
                  <div className="flex items-center justify-between bg-brand-forestLight border border-brand-forest/20 rounded-xl px-3 py-2 text-xs">
                    <span className="text-brand-forest font-semibold flex items-center gap-1.5">
                      ✓ Code {couponCode} ({couponDiscountPercent}% OFF)
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-brand-muted hover:text-red-500 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SOFALUXE)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs uppercase focus:border-brand-terracotta"
                    />
                    <button
                      type="submit"
                      className="bg-brand-charcoal text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-terracotta transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && couponDiscountPercent === 0 && (
                  <p className="text-[11px] text-red-500 mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-brand-muted">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-forest font-medium">
                    <span>Privilege Coupon Discount ({couponDiscountPercent}%)</span>
                    <span>−₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India White-Glove Installation</span>
                  <span className="text-brand-forest font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>GST &amp; Transit Insurance</span>
                  <span className="text-brand-forest font-semibold">Included</span>
                </div>

                <div className="pt-3 border-t border-brand-sand flex justify-between items-baseline text-sm font-semibold text-brand-charcoal">
                  <span>Final Payable Total</span>
                  <span className="font-display text-xl text-brand-charcoal">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
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
                  <span>Proceed to Delivery &amp; Payment →</span>
                </button>
              ) : (
                <button
                  form="checkout-form"
                  type="submit"
                  className="w-full bg-brand-forest text-white py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-brand-charcoal transition-colors shadow-floating flex items-center justify-center gap-2"
                >
                  <span>Place Order (₹{finalTotal.toLocaleString("en-IN")})</span>
                </button>
              )}

              <div className="text-[11px] text-brand-muted text-center space-y-1">
                <p>🔒 256-Bit SSL Encrypted Safe Checkout</p>
                <p>10-Year Comprehensive Wood &amp; Frame Warranty Included</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
