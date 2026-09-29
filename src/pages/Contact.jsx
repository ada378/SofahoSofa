import { useState } from "react";
import SEO from "../components/SEO";
import api from "../api/axios";
import { FiMapPin, FiPhoneCall, FiMail, FiClock, FiPhone, FiHome, FiUser, FiChevronDown, FiCheckCircle } from "react-icons/fi";

const REQUIREMENTS = [
  "Sofa Set",
  "L-Shape Sofa",
  "Recliner",
  "Solid Wood Bed",
  "Dining Table Set",
  "Accent Chair",
  "Center Table",
  "Other",
];

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number");
    if (!requirement) return setError("Please select your requirement");

    setLoading(true);
    try {
      await api.post("/leads", {
        name: name.trim(),
        phone: phone.trim(),
        requirement,
        source: "contact-form",
      });
      setSuccess(true);
      setName(""); setPhone(""); setRequirement("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Sofa Hi Sofa — Lucknow Furniture Factory"
        description="Visit our factory showroom in Lucknow or contact us via phone, WhatsApp & email. Khasra 491-492, Kisan Path, Churahya, Lucknow, UP 226501."
        canonical="https://www.thesofahisofa.com/contact"
      />

      <div className="bg-brand-porcelain min-h-screen py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Header */}
          <div className="text-center">
            <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">
              Visit · Call · WhatsApp
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-charcoal mt-1">
              Contact Sofa Hi Sofa
            </h1>
            <p className="text-brand-muted text-sm mt-2 max-w-xl mx-auto">
              Factory showroom in Lucknow — visit us, call us, or drop a message. We reply within 30 minutes on WhatsApp.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Left — Contact Info */}
            <div className="space-y-4">

              {/* Address */}
              <div className="bg-white rounded-2xl border border-brand-sand p-5 sm:p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <FiHome className="text-brand-terracotta text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-charcoal text-sm">Factory Showroom — Lucknow</h2>
                  <p className="text-brand-muted text-xs mt-1 leading-relaxed">
                    Khasra Number 491 - 492, Kisan Path<br />
                    Vill: Churahya, Lucknow<br />
                    Uttar Pradesh — 226501
                  </p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Khasra+491+492+Kisan+Path+Churahya+Lucknow+Uttar+Pradesh+226501+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-brand-terracotta hover:underline"
                  >
                    📍 Get Directions on Google Maps →
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl border border-brand-sand p-5 sm:p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <FiPhoneCall className="text-brand-terracotta text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-charcoal text-sm">Call / WhatsApp</h2>
                  <div className="mt-1 space-y-1.5">
                    <a href="tel:+919810926762" className="flex items-center gap-2 text-xs font-semibold text-brand-terracotta hover:underline">
                      <FiPhone className="flex-shrink-0" /> +91 98109 26762
                    </a>
                    <a href="tel:+917800001200" className="flex items-center gap-2 text-xs font-semibold text-brand-terracotta hover:underline">
                      <FiPhone className="flex-shrink-0" /> +91 78000 01200
                    </a>
                    <a href="tel:+917800001198" className="flex items-center gap-2 text-xs font-semibold text-brand-terracotta hover:underline">
                      <FiPhone className="flex-shrink-0" /> +91 78000 01198
                    </a>
                  </div>
                  <a
                    href="https://wa.me/919810926762"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 bg-[#25D366] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1ebe5d] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl border border-brand-sand p-5 sm:p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-brand-terracotta text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-charcoal text-sm">Email Support</h2>
                  <a href="mailto:gautam76@mail.ru" className="block text-xs font-semibold text-brand-terracotta hover:underline mt-1">
                    gautam76@mail.ru
                  </a>
                  <p className="text-brand-muted text-xs mt-1">We reply within 24 hours</p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl border border-brand-sand p-5 sm:p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-brand-terracotta text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-charcoal text-sm">Showroom Hours</h2>
                  <p className="text-brand-muted text-xs mt-1">Open Daily: <span className="font-semibold text-brand-charcoal">10:30 AM – 9:00 PM</span></p>
                  <p className="text-brand-muted text-xs">All days including Sunday</p>
                </div>
              </div>
            </div>

            {/* Right — Enquiry Form + Map */}
            <div className="space-y-4">

              {/* Enquiry Form */}
              <div className="bg-white rounded-2xl border border-brand-sand p-6 sm:p-8 shadow-subtle">
                <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">Send an Enquiry</h2>
                <p className="text-brand-muted text-xs mb-5">Fill the form — we'll call you back within 30 minutes.</p>

                {success ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                    <FiCheckCircle className="text-green-500 text-5xl" />
                    <h3 className="font-display text-xl font-bold text-brand-charcoal">Thank You!</h3>
                    <p className="text-brand-muted text-sm">We've received your enquiry and will contact you shortly.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-2 text-xs font-semibold text-brand-terracotta hover:underline"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-brand-charcoal mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-9 pr-4 py-3 border border-brand-sand rounded-xl text-sm text-brand-charcoal focus:border-brand-terracotta focus:outline-none focus:ring-1 focus:ring-brand-terracotta transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-brand-charcoal mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                          className="w-full pl-9 pr-4 py-3 border border-brand-sand rounded-xl text-sm text-brand-charcoal focus:border-brand-terracotta focus:outline-none focus:ring-1 focus:ring-brand-terracotta transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Requirement Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-brand-charcoal mb-1.5">
                        What are you looking for? <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm pointer-events-none" />
                        <select
                          value={requirement}
                          onChange={(e) => setRequirement(e.target.value)}
                          className="w-full appearance-none px-4 py-3 border border-brand-sand rounded-xl text-sm text-brand-charcoal focus:border-brand-terracotta focus:outline-none focus:ring-1 focus:ring-brand-terracotta transition-all bg-white cursor-pointer"
                          disabled={loading}
                        >
                          <option value="">— Select your requirement —</option>
                          {REQUIREMENTS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-terracotta hover:bg-brand-terracottaDark text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-50 shadow-floating"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : "Send Enquiry →"}
                    </button>

                    <p className="text-[11px] text-center text-brand-muted">
                      By submitting, you agree to receive updates via WhatsApp & SMS
                    </p>
                  </form>
                )}
              </div>

              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden border border-brand-sand shadow-subtle h-[300px]">
                <iframe
                  title="Sofa Hi Sofa Factory Showroom Location Lucknow"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.686801633626!2d81.06504867522065!3d26.812077376707308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be34148721e81%3A0x1e3563abab93adb!2sThe%20Sofa%20hi%20Sofa%20com!5e1!3m2!1sen!2sin!4v1790349717525!5m2!1sen!2sin"
                  width="100%" height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen="" loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-brand-charcoal rounded-3xl p-6 sm:p-10 text-center text-white">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Ready to Order or Have a Question?</h2>
            <p className="text-white/70 text-sm mt-2">WhatsApp is the fastest way to reach us — we respond in minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href="https://wa.me/919810926762?text=Hi! I want to know more about your sofas and furniture."
                target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
              >
                💬 WhatsApp Us Now
              </a>
              <a href="tel:+919810926762"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
              >
                📞 Call +91 98109 26762
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
