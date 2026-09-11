import { useState } from "react";
import { Link } from "react-router-dom";
import { categories, experienceStudios } from "../data/sampleProducts";

export default function Footer({ onOpenSwatchModal, onOpenStoreModal }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-brand-cream text-brand-charcoal border-t border-brand-sand">
      {/* 1. VIP Privilege Newsletter Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand shadow-subtle grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="bg-brand-amberLight text-brand-amber text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Exclusive Privilege
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-2.5 leading-tight">
              Get ₹2,000 Off Your First Sofa + Free Fabric Swatch Box
            </h3>
            <p className="text-brand-muted text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
              Join 50,000+ decor lovers. Receive architectural living room lookbooks, direct factory discount alerts, and early access to new designer collections.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="bg-brand-forestLight text-brand-forest p-4 rounded-2xl text-xs font-bold text-center border border-brand-forest/20">
                🎉 Welcome! Use code <span className="underline font-mono text-sm">WELCOME10</span> at checkout for your special privilege.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  required
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-brand-porcelain border border-brand-sand rounded-full px-4 py-3 text-xs sm:text-sm text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:border-brand-terracotta"
                />
                <button
                  type="submit"
                  className="bg-brand-charcoal hover:bg-brand-terracotta text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-subtle whitespace-nowrap"
                >
                  Claim ₹2,000 Off
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 border-t border-brand-sand/80">
        {/* Col 1 & 2: Brand Profile & Helpline */}
        <div className="col-span-2 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-charcoal text-white rounded-xl flex items-center justify-center font-display font-bold text-lg">
              S
            </div>
            <span className="font-display text-2xl tracking-tight text-brand-charcoal font-bold">
              Sofa Hi Sofa
            </span>
          </Link>

          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed max-w-sm font-normal">
            India's direct-from-factory bespoke furniture brand. Crafting 100% solid Sheesham &amp; Sal hardwood sofas, sectionals, motorized recliners, beds, and dining sets in our 1,00,000 sq.ft facility.
          </p>

          <div className="pt-2 text-xs space-y-2 text-brand-charcoal">
            <p className="flex items-center gap-2">
              <span className="font-bold">📍 Head Office:</span>
              <span className="text-brand-charcoal/80">Plot 42, 100 Ft Rd, Indiranagar, Bengaluru - 560038</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">📞 Customer Helpline:</span>
              <a href="tel:+919876543210" className="text-brand-terracotta font-semibold hover:underline">
                +91 98765 43210 (10 AM - 8 PM IST)
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">✉️ Support Email:</span>
              <a href="mailto:care@sofahisofa.com" className="text-brand-terracotta font-semibold hover:underline">
                care@sofahisofa.com
              </a>
            </p>
          </div>
        </div>

        {/* Col 3: Furniture Collections */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand-charcoal border-b border-brand-sand pb-1.5">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-brand-charcoal/80 font-medium">
            <li>
              <Link to="/collections/all" className="hover:text-brand-terracotta text-brand-terracotta font-bold transition-colors">
                ✨ All Furniture
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/collections/${c.slug}`} className="hover:text-brand-terracotta transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Bespoke Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand-charcoal border-b border-brand-sand pb-1.5">
            Bespoke Services
          </h4>
          <ul className="space-y-2 text-xs text-brand-charcoal/80 font-medium">
            <li>
              <button
                onClick={onOpenSwatchModal}
                className="hover:text-brand-terracotta transition-colors text-left flex items-center gap-1.5 font-semibold text-brand-forest"
              >
                <span>🎨 Free Fabric Swatches</span>
              </button>
            </li>
            <li>
              <button
                onClick={onOpenStoreModal}
                className="hover:text-brand-terracotta transition-colors text-left flex items-center gap-1.5"
              >
                <span>🏬 Book Store Appointment</span>
              </button>
            </li>
            <li>
              <button
                onClick={onOpenStoreModal}
                className="hover:text-brand-terracotta transition-colors text-left flex items-center gap-1.5"
              >
                <span>📹 1-on-1 Video Consultation</span>
              </button>
            </li>
            <li>
              <Link to="/collections/l-shape-sofas" className="hover:text-brand-terracotta transition-colors">
                Custom L-Shape Sectionals
              </Link>
            </li>
            <li>
              <Link to="/collections/recliners" className="hover:text-brand-terracotta transition-colors">
                Motorised Recliners
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 5: Trust Guarantees */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand-charcoal border-b border-brand-sand pb-1.5">
            Our Guarantees
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-charcoal/90 font-medium">
            <li className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <span>10-Year Frame Warranty</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🪵</span>
              <span>100% Solid Sheesham Wood</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🚚</span>
              <span>Free Pan-India Installation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">💳</span>
              <span>0% No-Cost EMI Available</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🔄</span>
              <span>7-Day In-Home Trial</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Flagship Experience Centers Mini Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-brand-sand flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-brand-charcoal font-semibold">
          <span>🏬 Flagship Studios:</span>
          <div className="flex flex-wrap gap-2 text-brand-muted font-normal">
            {experienceStudios.map((s) => (
              <span key={s.city} className="bg-white px-2 py-0.5 rounded-md border border-brand-sand text-brand-charcoal">
                {s.city} ({s.neighborhood})
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenStoreModal}
          className="text-brand-forest hover:text-brand-charcoal font-bold underline whitespace-nowrap"
        >
          Book Studio Visit / Get Directions →
        </button>
      </div>

      {/* 4. Bottom Legal & Secure Payment Bar */}
      <div className="border-t border-brand-sand/80 bg-brand-sand/50 py-5 text-brand-charcoal/70 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Sofa Hi Sofa.Com. All Rights Reserved. Handcrafted with pride in India.</p>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-brand-charcoal">🔒 100% Safe Checkout:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">UPI</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">Credit / Debit Cards</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">NetBanking</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">Cash on Delivery (COD)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
