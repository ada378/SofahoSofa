import { Link } from "react-router-dom";
import { categories } from "../data/sampleProducts";
import { FiMapPin, FiPhoneCall, FiMail, FiShield, FiTruck, FiCreditCard, FiRotateCcw, FiAward } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-brand-cream text-brand-charcoal border-t border-brand-sand">
      {/* Main Footer Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 border-b border-brand-sand/80">
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

          <div className="pt-2 text-xs space-y-2.5 text-brand-charcoal">
            <p className="flex items-start gap-2">
              <FiMapPin className="text-brand-terracotta mt-0.5 text-sm flex-shrink-0" />
              <span className="font-bold flex-shrink-0">Head Office:</span>
              <span className="text-brand-charcoal/80">
                Khasra Number 491 - 492 Kisan path Vill : Churahya, Lucknow, Uttar Pradesh 226501
              </span>
            </p>
            <p className="flex items-start gap-2">
              <FiPhoneCall className="text-brand-terracotta mt-0.5 text-sm flex-shrink-0" />
              <span className="font-bold flex-shrink-0">Helpline:</span>
              <span className="flex flex-wrap gap-x-2 gap-y-1">
                <a href="tel:+919810926762" className="text-brand-terracotta font-semibold hover:underline">
                  +91 9810926762
                </a>
                <span className="text-brand-muted">•</span>
                <a href="tel:+917800001200" className="text-brand-terracotta font-semibold hover:underline">
                  +91 7800001200
                </a>
                <span className="text-brand-muted">•</span>
                <a href="tel:+919984776490" className="text-brand-terracotta font-semibold hover:underline">
                  +91 9984776490
                </a>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <FiMail className="text-brand-terracotta mt-0.5 text-sm flex-shrink-0" />
              <span className="font-bold flex-shrink-0">Support Email:</span>
              <span className="flex flex-wrap gap-x-2 gap-y-1">
                <a href="mailto:info@sofahisofa.com" className="text-brand-terracotta font-semibold hover:underline">
                  info@sofahisofa.com
                </a>
                <span className="text-brand-muted">•</span>
                <a href="mailto:gautam76@mail.ru" className="text-brand-terracotta font-semibold hover:underline">
                  gautam76@mail.ru
                </a>
              </span>
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
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-brand-charcoal/80 font-medium">
            <li>
              <Link to="/collections/l-shape-sofas" className="hover:text-brand-terracotta transition-colors">
                L-Shape Sectionals
              </Link>
            </li>
            <li>
              <Link to="/collections/recliners" className="hover:text-brand-terracotta transition-colors">
                Motorised Recliners
              </Link>
            </li>
            <li>
              <Link to="/collections/beds" className="hover:text-brand-terracotta transition-colors">
                Solid Wood Beds
              </Link>
            </li>
            <li>
              <Link to="/collections/dining-sets" className="hover:text-brand-terracotta transition-colors">
                Dining Sets
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
              <FiShield className="text-brand-terracotta text-sm" />
              <span>10-Year Frame Warranty</span>
            </li>
            <li className="flex items-center gap-2">
              <FiAward className="text-brand-terracotta text-sm" />
              <span>100% Solid Sheesham Wood</span>
            </li>
            <li className="flex items-center gap-2">
              <FiTruck className="text-brand-terracotta text-sm" />
              <span>Free Pan-India Installation</span>
            </li>
            <li className="flex items-center gap-2">
              <FiCreditCard className="text-brand-terracotta text-sm" />
              <span>0% No-Cost EMI Available</span>
            </li>
            <li className="flex items-center gap-2">
              <FiRotateCcw className="text-brand-terracotta text-sm" />
              <span>7-Day In-Home Trial</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Secure Payment Bar */}
      <div className="border-t border-brand-sand/80 bg-brand-sand/50 py-5 text-brand-charcoal/70 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Sofa Hi Sofa.Com. All Rights Reserved | Web Tech Illusion</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <span className="font-semibold text-brand-charcoal text-[11px] w-full sm:w-auto">🔒 100% Safe Checkout:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">UPI</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">Cards</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">NetBanking</span>
            <span className="bg-white px-2 py-0.5 rounded border border-brand-sand text-brand-charcoal font-semibold text-[10px]">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
