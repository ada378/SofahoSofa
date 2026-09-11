import { useState } from "react";
import { experienceStudios } from "../data/sampleProducts";

export default function StoreVisitModal({ isOpen, onClose }) {
  const [selectedStudio, setSelectedStudio] = useState(experienceStudios[0]);
  const [consultType, setConsultType] = useState("store"); // "store" or "video"
  const [visitDate, setVisitDate] = useState("Tomorrow");
  const [timeSlot, setTimeSlot] = useState("4:00 PM - 5:30 PM");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", notes: "" });
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    setFormData({ name: "", phone: "", email: "", notes: "" });
    onClose();
  };

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Sofa Hi Sofa VIP Consultation - ${selectedStudio.city}`
  )}&details=${encodeURIComponent(
    `Consultation type: ${consultType === "store" ? "In-Store VIP Visit" : "1-on-1 Video Consultation"}\nLocation: ${selectedStudio.address}\nPhone: +91 98765 43210`
  )}&location=${encodeURIComponent(selectedStudio.address)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-charcoal/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-card overflow-hidden border border-brand-sand">
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-brand-muted hover:text-brand-charcoal hover:bg-brand-porcelain rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isBooked ? (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-brand-forestLight text-brand-forest rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                ✓
              </div>

              <div>
                <span className="bg-brand-forestLight text-brand-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Booking Confirmed
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-2">
                  {consultType === "store" ? "VIP Studio Appointment Confirmed!" : "Video Consultation Scheduled!"}
                </h3>
                <p className="text-brand-muted text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
                  Thank you, <strong className="text-brand-charcoal">{formData.name}</strong>! A senior interior designer is reserved for you on <strong className="text-brand-charcoal">{visitDate} at {timeSlot}</strong>.
                </p>
              </div>

              {/* Appointment Card */}
              <div className="bg-brand-porcelain p-4 sm:p-5 rounded-2xl border border-brand-sand text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-brand-sand pb-2">
                  <span className="text-brand-muted">Studio</span>
                  <span className="font-bold text-brand-charcoal">{selectedStudio.city} ({selectedStudio.neighborhood})</span>
                </div>
                <div className="flex justify-between border-b border-brand-sand pb-2">
                  <span className="text-brand-muted">Address</span>
                  <span className="font-medium text-brand-charcoal text-right max-w-xs">{selectedStudio.address}</span>
                </div>
                <div className="flex justify-between border-b border-brand-sand pb-2">
                  <span className="text-brand-muted">Timing</span>
                  <span className="font-bold text-brand-forest">{visitDate} · {timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">SMS Confirmation</span>
                  <span className="font-semibold text-brand-charcoal">Sent to {formData.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-brand-forest text-white py-3 rounded-full text-xs font-semibold hover:bg-brand-charcoal transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <span>📅 Add to Google Calendar</span>
                </a>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-brand-charcoal text-white py-3 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <span className="bg-brand-forestLight text-brand-forest text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Touch, Feel &amp; Test 200+ Fabrics
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold mt-2">
                  Book a VIP Experience Visit
                </h3>
                <p className="text-brand-muted text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Meet our furniture architects, test recliner ergonomics, and customize your dream sofa over complimentary coffee.
                </p>
              </div>

              {/* Consultation Type Selector */}
              <div className="grid grid-cols-2 bg-brand-porcelain p-1 rounded-2xl mb-5 border border-brand-sand">
                <button
                  type="button"
                  onClick={() => setConsultType("store")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    consultType === "store"
                      ? "bg-white text-brand-charcoal shadow-subtle"
                      : "text-brand-muted hover:text-brand-charcoal"
                  }`}
                >
                  🏬 Visit Experience Center
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType("video")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    consultType === "video"
                      ? "bg-white text-brand-charcoal shadow-subtle"
                      : "text-brand-muted hover:text-brand-charcoal"
                  }`}
                >
                  📹 1-on-1 Video Consultation
                </button>
              </div>

              {/* Studio Selection */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-brand-charcoal mb-2">
                  Select Experience Studio:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {experienceStudios.map((studio) => (
                    <button
                      key={studio.city}
                      type="button"
                      onClick={() => setSelectedStudio(studio)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedStudio.city === studio.city
                          ? "border-brand-forest bg-brand-forestLight/40 shadow-subtle ring-2 ring-brand-forest/20"
                          : "border-brand-sand bg-white hover:bg-brand-porcelain"
                      }`}
                    >
                      <p className="font-bold text-xs text-brand-charcoal">{studio.city}</p>
                      <p className="text-[10px] text-brand-muted mt-0.5 truncate">{studio.neighborhood}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-brand-charcoal mb-1">
                    Preferred Day
                  </label>
                  <select
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal font-semibold focus:border-brand-forest"
                  >
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>This Saturday</option>
                    <option>This Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-charcoal mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal font-semibold focus:border-brand-forest"
                  >
                    <option>11:30 AM - 1:00 PM</option>
                    <option>2:00 PM - 3:30 PM</option>
                    <option>4:00 PM - 5:30 PM</option>
                    <option>6:30 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* User Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-charcoal mb-1">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-charcoal mb-1">
                      Mobile Number (for SMS confirmation) *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-porcelain border border-brand-sand rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:border-brand-forest"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-forest hover:bg-brand-charcoal text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-subtle flex items-center justify-center gap-2"
                  >
                    <span>Confirm VIP Studio Visit</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <p className="text-center text-[11px] text-brand-muted mt-2">
                    ☕ 100% Free · Includes complimentary coffee &amp; personalized 3D living room layout.
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
