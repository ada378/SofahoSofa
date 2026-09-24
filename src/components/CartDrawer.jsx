import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
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
    isDrawerOpen,
    closeDrawer,
    updateQty,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyCoupon(inputCode);
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate("/cart");
  };

  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-brand-porcelain shadow-drawer flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-brand-sand flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl text-brand-charcoal">Your Shopping Cart</h2>
              <span className="bg-brand-sand text-brand-charcoal text-xs font-semibold px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-brand-muted hover:text-brand-charcoal hover:bg-brand-porcelain rounded-full transition-colors"
              aria-label="Close cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-brand-cream/80 px-5 py-3 border-b border-brand-sand text-xs">
            {amountToFreeDelivery > 0 ? (
              <p className="text-brand-charcoal font-medium">
                Add <span className="text-brand-terracotta font-bold">₹{amountToFreeDelivery.toLocaleString("en-IN")}</span> more for <span className="font-bold text-brand-forest">FREE White-Glove Delivery</span>
              </p>
            ) : (
              <p className="text-brand-forest font-semibold flex items-center gap-1.5">
                <span>🎉</span> You've unlocked FREE White-Glove Delivery &amp; Assembly!
              </p>
            )}
            <div className="w-full bg-brand-sand h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-brand-terracotta h-full rounded-full transition-all duration-500"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-3xl">
                  🛋️
                </div>
                <h3 className="font-display text-lg text-brand-charcoal">Your cart is empty</h3>
                <p className="text-brand-muted text-sm max-w-xs mx-auto">
                  Looks like you haven't added handcrafted furniture to your space yet.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate("/collections/sofa-sets");
                  }}
                  className="bg-brand-charcoal text-brand-porcelain px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
                >
                  Explore Sofas &amp; Furniture
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white rounded-2xl p-3.5 border border-brand-sand/80 shadow-subtle flex gap-3.5"
                >
                  <img
                    src={item.product.images?.[0]?.url || item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-brand-sand/50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="font-medium text-sm text-brand-charcoal hover:text-brand-terracotta line-clamp-1 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-brand-muted hover:text-red-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-brand-muted">
                        <span className="bg-brand-porcelain px-2 py-0.5 rounded-md border border-brand-sand">
                          {item.selectedFabric}
                        </span>
                        <span className="bg-brand-porcelain px-2 py-0.5 rounded-md border border-brand-sand">
                          {item.selectedSize}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-brand-sand/40">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-sm text-brand-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {item.marketPrice > item.price && (
                          <span className="text-[11px] text-brand-muted line-through">
                            ₹{(item.marketPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-brand-sand rounded-lg bg-brand-porcelain/60">
                        <button
                          onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-brand-charcoal hover:bg-brand-sand rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-brand-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-brand-charcoal hover:bg-brand-sand rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="border-t border-brand-sand bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] space-y-4">
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
                      placeholder="Coupon (e.g. SOFA10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs uppercase focus:border-brand-terracotta transition-colors"
                    />
                    <button
                      type="submit"
                      className="bg-brand-charcoal text-brand-porcelain text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-terracotta transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && couponDiscountPercent === 0 && (
                  <p className="text-[11px] text-red-500 mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-brand-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-brand-charcoal font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-forest font-medium">
                    <span>Coupon Discount ({couponDiscountPercent}%)</span>
                    <span>−₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Delivery &amp; Setup</span>
                  <span className="text-brand-forest font-semibold">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-brand-sand text-sm font-semibold text-brand-charcoal">
                  <span>Estimated Total</span>
                  <span className="text-base text-brand-charcoal">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
                {totalSavings > 0 && (
                  <p className="text-[11px] text-brand-forest font-medium text-center bg-brand-forestLight py-1 rounded-lg">
                    ✨ You are saving ₹{totalSavings.toLocaleString("en-IN")} on this order!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-charcoal text-brand-porcelain py-3.5 rounded-full font-semibold text-sm hover:bg-brand-terracotta transition-colors shadow-floating flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={closeDrawer}
                  className="w-full py-2 text-xs text-brand-muted hover:text-brand-charcoal transition-colors text-center"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
