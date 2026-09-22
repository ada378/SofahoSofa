import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity, selectedFabric, selectedSize } = location.state || {};

  const [step, setStep] = useState(1); // 1: Summary, 2: Address, 3: Payment, 4: Confirmed
  const [loading, setLoading] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    paymentMethod: "cod",
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-porcelain flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="font-display text-2xl text-brand-charcoal">No Product Selected</h2>
          <p className="text-brand-muted text-sm">Please select a product first.</p>
          <button
            onClick={() => navigate("/collections/all")}
            className="bg-brand-charcoal text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const total = (product.price || 0) * (quantity || 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
        alert("Please fill in all required delivery fields.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Place order
      try {
        setLoading(true);
        const payload = {
          items: [
            {
              product: product._id,
              name: product.name,
              image: product.images?.[0]?.url || "",
              fabricChoice: selectedFabric?.name || selectedFabric || "Standard",
              qty: quantity || 1,
              price: product.price,
            },
          ],
          shippingAddress: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
          paymentMethod: formData.paymentMethod === "cod" ? "COD" : "ONLINE",
          guestInfo: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
          },
        };

        const { data } = await api.post("/orders", payload);
        const orderId = data._id;
        setConfirmedOrderId(orderId);

        // Send WhatsApp message
        const waMsg = encodeURIComponent(
          `🛋️ *New Order — Sofa Hi Sofa*\n\n` +
            `📦 *Order ID:* ${orderId}\n\n` +
            `👤 *Customer:*\nName: ${formData.fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email || "—"}\n\n` +
            `🛒 *Item:*\n• ${product.name} (${selectedFabric?.name || selectedFabric || "Standard"}, ${selectedSize || "Standard"}) × ${quantity || 1} = ₹${total.toLocaleString("en-IN")}\n\n` +
            `📍 *Delivery:*\n${formData.address}, ${formData.city}, ${formData.state} – ${formData.pincode}\n\n` +
            `💰 *Total:* ₹${total.toLocaleString("en-IN")}\n💳 *Payment:* ${formData.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online"}\n\n✅ Please confirm this order.`
        );
        window.open(`https://wa.me/919810926762?text=${waMsg}`, "_blank");

        setStep(4);
      } catch (err) {
        alert(err.response?.data?.message || "Order placement failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-porcelain py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {[
            { num: 1, label: "Summary" },
            { num: 2, label: "Address" },
            { num: 3, label: "Payment" },
            { num: 4, label: "Confirmed" },
          ].map((s, idx, arr) => (
            <div key={s.num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s.num
                    ? "bg-brand-terracotta text-white"
                    : "bg-brand-sand text-brand-charcoal"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="text-xs font-semibold text-brand-charcoal ml-2">{s.label}</span>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${step > s.num ? "bg-brand-terracotta" : "bg-brand-sand"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Summary */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-subtle space-y-5 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-brand-charcoal font-bold">Review Your Order</h2>
                  <p className="text-brand-muted text-sm mt-1">Check selected color, configuration and savings</p>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-brand-porcelain border border-brand-sand items-start">
                  <img
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"}
                    alt={product.name}
                    className="w-24 h-24 rounded-xl object-cover bg-brand-sand flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-brand-charcoal">{product.name}</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] text-brand-charcoal">
                      {selectedFabric && (
                        <span className="bg-white px-2 py-0.5 rounded border border-brand-sand font-semibold">
                          Color: {selectedFabric.name || selectedFabric}
                        </span>
                      )}
                      {selectedSize && (
                        <span className="bg-white px-2 py-0.5 rounded border border-brand-sand font-semibold">
                          Size: {selectedSize}
                        </span>
                      )}
                      {quantity && (
                        <span className="bg-white px-2 py-0.5 rounded border border-brand-sand font-semibold">
                          Qty: {quantity}
                        </span>
                      )}
                    </div>
                    <div className="font-display font-bold text-base text-brand-charcoal mt-2">
                      ₹{total.toLocaleString("en-IN")}
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
                  onClick={handleSubmit}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracottaDark text-white py-3.5 rounded-full font-bold text-sm transition-colors shadow-subtle"
                >
                  Proceed to Address →
                </button>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-subtle space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-brand-charcoal font-bold">Delivery Destination</h2>
                  <p className="text-brand-muted text-sm mt-1">Where should our installation team deliver?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      placeholder="e.g. Pooja Krishnamurthy"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. pooja@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-charcoal mb-1">Street Address *</label>
                  <input
                    required
                    type="text"
                    name="address"
                    placeholder="Flat 402, Oakwood Residences, 12th Main"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[["City", "city"], ["State", "state"], ["Pincode", "pincode"]].map(([label, field]) => (
                    <div key={field}>
                      <label className="block text-[11px] font-bold text-brand-charcoal mb-1">{label} *</label>
                      <input
                        required
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta focus:outline-none font-medium"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-5 border border-brand-sand rounded-full text-xs font-bold text-brand-charcoal hover:bg-brand-porcelain"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-terracotta hover:bg-brand-terracottaDark text-white py-3 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-subtle"
                  >
                    Proceed to Payment →
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-subtle space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-brand-charcoal font-bold">Payment Method</h2>
                  <p className="text-brand-muted text-sm mt-1">Pay after in-home unboxing and room setup</p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-brand-terracotta bg-brand-cream/60 flex items-start gap-3">
                  <span className="text-2xl">💵</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-brand-charcoal">Cash on Delivery (COD)</p>
                    <p className="text-xs text-brand-muted mt-0.5">Pay cash after unboxing and in-room assembly. No advance required.</p>
                  </div>
                  <span className="text-brand-forest font-bold text-xs bg-brand-forestLight px-2 py-1 rounded-lg">Selected ✓</span>
                </div>

                <div className="p-4 bg-brand-porcelain rounded-2xl border border-brand-sand flex justify-between items-center text-xs font-bold text-brand-charcoal">
                  <span>Total Payable (COD):</span>
                  <span className="font-display text-lg font-bold text-brand-terracotta">₹{total.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-5 border border-brand-sand rounded-full text-xs font-bold text-brand-charcoal hover:bg-brand-porcelain"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-forest hover:bg-brand-charcoal text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-floating disabled:opacity-50"
                  >
                    {loading ? "Processing…" : `💵 Confirm COD Order — ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Confirmed */}
            {step === 4 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-subtle text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-brand-forestLight text-brand-forest rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                  ✓
                </div>
                <div>
                  <span className="bg-brand-forestLight text-brand-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Booking Confirmed
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-2">Your Furniture is Booked!</h3>
                  <p className="text-brand-muted text-xs sm:text-sm mt-1">
                    Order ID: <strong className="text-brand-charcoal font-mono">{confirmedOrderId}</strong>
                  </p>
                </div>

                <div className="bg-brand-porcelain p-4 rounded-2xl border border-brand-sand text-left text-xs space-y-2 max-w-md mx-auto">
                  <p>
                    <strong>Item:</strong> {product.name} (Qty: {quantity})
                  </p>
                  <p>
                    <strong>Custom Fabric:</strong> {selectedFabric?.name || selectedFabric || "Standard"}
                  </p>
                  <p>
                    <strong>Customer:</strong> {formData.fullName} ({formData.phone})
                  </p>
                  <p>
                    <strong>Destination:</strong> {formData.address}, {formData.city} - {formData.pincode}
                  </p>
                  <p>
                    <strong>Payment:</strong> Cash on Delivery (COD)
                  </p>
                  <p>
                    <strong>Delivery:</strong> Dispatches within 48 Hours with Free Installation
                  </p>
                </div>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="bg-brand-charcoal text-white px-8 py-3 rounded-full text-xs sm:text-sm font-bold hover:bg-brand-terracotta transition-colors shadow-subtle"
                >
                  Done & View Saved Items
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-5 border border-brand-sand text-brand-charcoal space-y-4 shadow-subtle sticky top-20">
              <h4 className="font-bold text-sm">Order Summary</h4>

              <div className="space-y-3 py-3 border-y border-brand-sand text-xs">
                <div className="flex justify-between">
                  <span className="text-brand-charcoal/70">Product Price</span>
                  <span className="font-bold">₹{(product.price || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-charcoal/70">Quantity</span>
                  <span className="font-bold">× {quantity || 1}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-bold text-brand-charcoal">
                <span>Total:</span>
                <span className="font-display text-lg text-brand-terracotta">₹{total.toLocaleString("en-IN")}</span>
              </div>

              <div className="bg-brand-forestLight p-3 rounded-xl border border-brand-forest/20 text-[11px] text-brand-forest font-bold text-center">
                ✓ Professional Installation Included
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
