import { useState } from "react";
import { faqs } from "../data/sampleProducts";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-14 sm:py-20 bg-brand-porcelain">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
            Clear Answers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-muted text-xs sm:text-sm mt-2">
            Everything you need to know about custom sizing, warranties, deliveries, and fabric care.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-sand/80 shadow-subtle overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-brand-charcoal hover:text-brand-terracotta transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full bg-brand-porcelain flex items-center justify-center text-xs flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-brand-terracotta text-white" : "text-brand-charcoal"
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-brand-sand/40 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-10 p-6 bg-brand-cream/80 rounded-3xl border border-brand-sand flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-display text-lg text-brand-charcoal">Have a specific custom request?</h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Talk directly with our furniture architects via WhatsApp or phone.
            </p>
          </div>
          <a
            href="https://wa.me/919810926762"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-forest text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-brand-charcoal transition-colors shadow-subtle flex items-center gap-2 whitespace-nowrap"
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
