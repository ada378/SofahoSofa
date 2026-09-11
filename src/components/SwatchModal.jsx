import { useState } from "react";

const availableSwatches = [
  { id: "s1", name: "Warm Mustard Bouclé", category: "Bouclé", color: "#D9A441" },
  { id: "s2", name: "Pine Forest Velvet", category: "Velvet", color: "#2D4A3E" },
  { id: "s3", name: "Oatmeal Textured Linen", category: "Linen", color: "#EAE3D2" },
  { id: "s4", name: "Cognac Tan Nappa Leatherette", category: "Leatherette", color: "#7E4826" },
  { id: "s5", name: "Terracotta Earth Velvet", category: "Velvet", color: "#C86A3B" },
  { id: "s6", name: "Midnight Navy Chenille", category: "Chenille", color: "#1D2A44" },
  { id: "s7", name: "Olive Sage Heavyweight", category: "Linen", color: "#4A5D4E" },
  { id: "s8", name: "Slate Charcoal Suede", category: "Suede", color: "#3B3835" },
];

export default function SwatchModal({ isOpen, onClose }) {
  const [selectedSwatches, setSelectedSwatches] = useState(["s1", "s2"]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleSwatch = (id) => {
    if (selectedSwatches.includes(id)) {
      setSelectedSwatches(selectedSwatches.filter((item) => item !== id));
    } else {
      if (selectedSwatches.length >= 4) {
        alert("You can select up to 4 swatches for free delivery!");
        return;
      }
      setSelectedSwatches([...selectedSwatches, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSwatches.length === 0) {
      alert("Please select at least 1 fabric swatch.");
      return;
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedSwatches(["s1", "s2"]);
    setFormData({ name: "", phone: "", address: "", city: "", pincode: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-brand-porcelain rounded-3xl p-6 sm:p-8 shadow-card overflow-hidden border border-brand-sand">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-brand-muted hover:text-brand-charcoal hover:bg-white rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-brand-forestLight text-brand-forest rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h3 className="font-display text-2xl text-brand-charcoal">Free Swatch Box On Its Way!</h3>
              <p className="text-brand-muted text-sm max-w-md mx-auto">
                Thank you, <strong className="text-brand-charcoal">{formData.name || "Customer"}</strong>! We have dispatched your {selectedSwatches.length} customized fabric swatches to <strong className="text-brand-charcoal">{formData.city || "your address"}</strong>.
              </p>
              <div className="bg-white p-4 rounded-2xl border border-brand-sand text-xs text-brand-muted max-w-sm mx-auto">
                📦 Tracking updates will be sent to <strong>{formData.phone || "+91 XXXXXXXXXX"}</strong> within 24 hours. Expected delivery: 2-3 business days.
              </div>
              <button
                onClick={handleReset}
                className="bg-brand-charcoal text-brand-porcelain px-8 py-3 rounded-full text-sm font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <span className="bg-brand-amberLight text-brand-amber text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  100% Free Pan-India Delivery
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-brand-charcoal mt-2">
                  Order Your Free Swatch Box
                </h3>
                <p className="text-brand-muted text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Touch the textures and match the colors with your living room lighting before you place your sofa order.
                </p>
              </div>

              {/* Swatch Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-semibold text-brand-charcoal">
                    Select up to 4 Fabric Swatches ({selectedSwatches.length}/4 selected):
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableSwatches.map((swatch) => {
                    const isSelected = selectedSwatches.includes(swatch.id);
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => toggleSwatch(swatch.id)}
                        className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? "border-brand-terracotta bg-white shadow-subtle ring-2 ring-brand-terracotta/20"
                            : "border-brand-sand bg-brand-cream/50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: swatch.color }}
                          />
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              isSelected
                                ? "bg-brand-terracotta text-white"
                                : "border border-brand-sand text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-brand-charcoal leading-tight">
                            {swatch.name}
                          </p>
                          <span className="text-[10px] text-brand-muted">{swatch.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                      Phone Number (for SMS Tracking) *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                    Delivery Address *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Flat / House No., Street, Landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                      Pincode *
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 560038"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-terracotta"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-brand-charcoal text-brand-porcelain py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-brand-terracotta transition-colors shadow-subtle flex items-center justify-center gap-2"
                  >
                    <span>Ship My Free Swatches (₹0)</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <p className="text-center text-[11px] text-brand-muted mt-2">
                    🔒 Zero spam. No payment or credit card required.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
