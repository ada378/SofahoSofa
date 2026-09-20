export default function Craftsmanship() {
  const layers = [
    {
      step: "01",
      title: "100% Solid Kiln-Dried Hardwood Frame",
      desc: "Seasoned Grade-A Sheesham & Sal timber dried to 8-12% moisture levels to prevent warping, squeaking, and termite damage. Reinforced with corner blocks and double-dowels.",
      tag: "Zero Hollow Boards",
    },
    {
      step: "02",
      title: "Dual Pocket-Spring Suspension Layer",
      desc: "Individually encased tempered carbon-steel pocket springs provide targeted resilience, zero motion transfer between sitters, and lifetime anti-sag performance.",
      tag: "Zero-Sag Core",
    },
    {
      step: "03",
      title: "40-Density High-Resilience (HR) Foam",
      desc: "Plush multi-tier virgin HR foam cushions paired with a 2-inch microfiber wrap for an irresistible cloud-like sink that bounces right back into shape.",
      tag: "5-Year Shape Retention",
    },
    {
      step: "04",
      title: "Stain-Shield Hydrophobic Fabrics",
      desc: "Woven with high-GSM nano-treated fibers. Tea, coffee, water, or wine beads up on the surface for a hassle-free wipe clean with a damp cloth.",
      tag: "Pet & Kid Friendly",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-brand-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-forest text-xs font-bold uppercase tracking-widest">
            Engineering Excellence
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
            Built for Generations, Not Just Seasons
          </h2>
          <p className="text-brand-muted text-xs sm:text-sm mt-2">
            Peek under the upholstery. Here is why our sofas outlive standard showroom furniture by 3X.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Diagram / Lifestyle Photo */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card border border-brand-sand">
              <img
                src="https://res.cloudinary.com/dgoe6emli/image/upload/v1789882027/sofa-hi-sofa/bed/luxury_beds_from_lucknow_Sofahisofa_2.png"
                alt="Sofa Hi Sofa Craftsmanship & Frame Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="bg-brand-amber text-brand-charcoal text-[11px] font-bold px-2.5 py-1 rounded-md w-max uppercase tracking-wider mb-2">
                  In-House Manufacturing
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold">
                  1,00,000 Sq.Ft Factory in India
                </h3>
                <p className="text-xs text-white/80 mt-1 max-w-md">
                  Precision CNC wood shaping, computerized spring tension testing, and master upholstery craftsmen.
                </p>
              </div>
            </div>
          </div>

          {/* Right 4-Layer Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            {layers.map((layer) => (
              <div
                key={layer.step}
                className="p-4 sm:p-5 rounded-2xl bg-brand-porcelain border border-brand-sand hover:border-brand-terracotta hover:bg-white transition-all shadow-subtle flex gap-4 items-start"
              >
                <span className="font-display text-xl font-bold text-brand-terracotta bg-white border border-brand-sand w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {layer.step}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm sm:text-base text-brand-charcoal">
                      {layer.title}
                    </h4>
                    <span className="bg-brand-forestLight text-brand-forest text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {layer.tag}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
