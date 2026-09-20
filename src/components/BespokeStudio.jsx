import { useState } from "react";
import { Link } from "react-router-dom";

export default function BespokeStudio() {
  const [selectedFrame, setSelectedFrame] = useState("3-Seater Classic");
  const [selectedFabric, setSelectedFabric] = useState("Warm Mustard Bouclé");
  const [selectedFirmness, setSelectedFirmness] = useState("Medium Plush (Cloud Sink)");

  return (
    <section className="py-14 sm:py-20 bg-brand-porcelain relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F8F4EC] text-[#1F1A17] rounded-3xl sm:rounded-4xl p-6 sm:p-12 relative overflow-hidden shadow-card border border-brand-sand">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Configuration Flow */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                ✨ Sofa Hi Sofa Bespoke Studio
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1F1A17] font-bold leading-tight">
                Design Your Dream Sofa, <br />
                <span className="text-brand-terracotta">Tailored to Your Living Room</span>
              </h2>

              <p className="text-[#3B302A] text-xs sm:text-sm leading-relaxed max-w-lg font-medium">
                Why settle for standard showroom sizes? Pick your frame silhouette, select your fabric, and customize cushion softness. Delivered direct from our factory in 7-10 days.
              </p>

              {/* 4 Interactive Configurator Steps */}
              <div className="space-y-4 pt-2">
                {/* Step 1: Frame Size */}
                <div>
                  <p className="text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-2">
                    Step 1: Choose Layout &amp; Frame
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["3-Seater Classic", "L-Shape Lounger", "Compact 2-Seater", "Zero-Gravity Recliner"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSelectedFrame(item)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedFrame === item
                              ? "bg-brand-terracotta text-white shadow-subtle ring-2 ring-brand-terracotta/20"
                              : "bg-white text-[#1F1A17] hover:bg-brand-sand/50 border border-brand-sand"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Step 2: Fabric */}
                <div>
                  <p className="text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-2">
                    Step 2: Choose Luxury Fabric ({selectedFabric})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Warm Mustard Bouclé", color: "#D9A441" },
                      { name: "Pine Forest Green", color: "#2D4A3E" },
                      { name: "Oatmeal Linen", color: "#EAE3D2" },
                      { name: "Vintage Tan Leatherette", color: "#7E4826" },
                      { name: "Charcoal Chenille", color: "#383634" },
                    ].map((fab) => (
                      <button
                        key={fab.name}
                        type="button"
                        onClick={() => setSelectedFabric(fab.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedFabric === fab.name
                            ? "bg-brand-terracotta text-white ring-2 ring-brand-terracotta/20 shadow-sm"
                            : "bg-white text-[#1F1A17] hover:bg-brand-sand/50 border border-brand-sand"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm"
                          style={{ backgroundColor: fab.color }}
                        />
                        <span>{fab.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Cushion Firmness */}
                <div>
                  <p className="text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-2">
                    Step 3: Cushion Comfort Profile
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Medium Plush (Cloud Sink)",
                      "Firm Orthopedic Support",
                      "Dual-Layer Pocket Spring",
                    ].map((firmness) => (
                      <button
                        key={firmness}
                        type="button"
                        onClick={() => setSelectedFirmness(firmness)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedFirmness === firmness
                            ? "bg-brand-charcoal text-white shadow-subtle"
                            : "bg-white text-[#1F1A17] hover:bg-brand-sand/50 border border-brand-sand"
                        }`}
                      >
                        {firmness}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  to="/collections/sofa-sets"
                  className="bg-brand-terracotta hover:bg-brand-terracottaDark text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-subtle flex items-center gap-2"
                >
                  <span>Shop Sofas</span>
                </Link>
                <Link
                  to="/collections/all"
                  className="bg-white hover:bg-brand-porcelain text-[#1F1A17] border border-brand-sand px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-subtle"
                >
                  Browse All Collections
                </Link>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-5 border border-brand-sand text-[#1F1A17] space-y-4 shadow-subtle">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-brand-sand/40 relative">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                    alt="Custom Sofa Live Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white text-[#1F1A17] text-xs font-bold px-3 py-1 rounded-md border border-brand-sand shadow-subtle">
                    Live Specification
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-brand-sand">
                    <span className="text-brand-muted font-semibold">Selected Frame</span>
                    <span className="font-bold text-[#1F1A17]">{selectedFrame}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-brand-sand">
                    <span className="text-brand-muted font-semibold">Fabric Option</span>
                    <span className="font-bold text-[#1F1A17]">{selectedFabric}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-brand-sand">
                    <span className="text-brand-muted font-semibold">Cushion Core</span>
                    <span className="font-bold text-[#1F1A17]">{selectedFirmness}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-brand-sand">
                    <span className="text-brand-muted font-semibold">Wood Guarantee</span>
                    <span className="font-bold text-brand-forest">100% Solid Sheesham (10-Yr Warranty)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-brand-muted font-semibold">Estimated Factory Price</span>
                    <span className="font-display text-lg font-bold text-brand-terracotta">₹28,990 - ₹34,990</span>
                  </div>
                </div>

                <p className="text-[11px] text-brand-forest font-bold text-center bg-brand-forestLight py-1.5 rounded-xl border border-brand-forest/20">
                  💡 Free home measurement visit available across Tier-1 cities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
