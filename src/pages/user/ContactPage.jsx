import React, { useState } from "react";
import { Phone, MapPin, Store, Send, CheckCircle2, ExternalLink, MessageSquare } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { shopInfo } from "../../data/shopInfo";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    // Clean phone number for WhatsApp wa.me link (+916369142873 -> 916369142873)
    const rawNumber = shopInfo.phoneLink.replace(/[^0-9]/g, "");
    const waNumber = rawNumber.startsWith("91") ? rawNumber : `91${rawNumber}`;

    const text = `*மாயக்கிருஷ்ணன் கடை தொடர்பு தகவல் (Contact Form)*\n\n*பெயர் (Name):* ${formData.name}\n*தொலைபேசி (Phone):* ${formData.phone}\n*தகவல் (Message):* ${formData.message}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

    setWaUrl(url);
    setSubmitted(true);

    // Redirect to WhatsApp
    window.open(url, "_blank");
  }

  return (
    <PageTransition className="min-h-screen flex flex-col bg-storefront text-bark-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full font-lato">
        {/* Page Header */}
        <div className="bg-[#12281b] border border-gold/40 p-6 sm:p-8 text-cream-100 flex flex-col items-center text-center space-y-2">
          <GoldLotusOrnament size={28} />
          <h1 className="text-3xl sm:text-4xl font-extrabold font-tamil text-gold-400">
            தொடர்பு கொள்ள (Contact Us)
          </h1>
          <p className="text-sm sm:text-base font-tamil text-cream-200">
            {shopInfo.nameTamil} – {shopInfo.businessTamil}
          </p>
        </div>

        {/* Contact Detail Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Phone */}
          <div className="bg-[#faf6ee] p-6 border border-gold/30 shadow-green flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1d3d29] text-gold flex items-center justify-center shadow-md">
              <Phone size={22} />
            </div>
            <h3 className="font-extrabold font-tamil text-bark-900 text-lg">
              தொலைபேசி (Phone)
            </h3>
            <p className="text-sm font-lato text-bark-700 font-bold">
              {shopInfo.phoneDisplay}
            </p>
            <a
              href={shopInfo.phoneLink}
              className="mt-auto inline-flex items-center gap-2 bg-gold text-bark-900 font-extrabold px-4 py-2 text-xs rounded-none hover:bg-gold-600 transition-all shadow-sm cursor-pointer"
            >
              <Phone size={14} /> அழைக்க (Call Now)
            </a>
          </div>

          {/* Card 2: Address */}
          <div className="bg-[#faf6ee] p-6 border border-gold/30 shadow-green flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1d3d29] text-gold flex items-center justify-center shadow-md">
              <MapPin size={22} />
            </div>
            <h3 className="font-extrabold font-tamil text-bark-900 text-lg">
              முகவரி (Address)
            </h3>
            <p className="text-sm font-tamil text-bark-800 font-medium">
              {shopInfo.addressTamil}
            </p>
            <p className="text-xs font-lato text-bark-600">
              {shopInfo.addressEnglish}
            </p>
            {shopInfo.mapsLink ? (
              <a
                href={shopInfo.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-gold"
              >
                <span>Get Directions</span> <ExternalLink size={13} />
              </a>
            ) : null}
          </div>

          {/* Card 3: Shop Type */}
          <div className="bg-[#faf6ee] p-6 border border-gold/30 shadow-green flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1d3d29] text-gold flex items-center justify-center shadow-md">
              <Store size={22} />
            </div>
            <h3 className="font-extrabold font-tamil text-bark-900 text-lg">
              கடை வகை (Shop Type)
            </h3>
            <p className="text-base font-extrabold font-tamil text-forest-800">
              {shopInfo.businessTamil}
            </p>
            <p className="text-xs font-lato text-bark-600">
              {shopInfo.businessEnglish}
            </p>
          </div>
        </div>

        {/* Map Block (rendered ONLY if mapsLink is present) */}
        {shopInfo.mapsLink ? (
          <div className="bg-[#faf6ee] p-6 border border-gold/30 shadow-green flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin size={28} className="text-forest-700 shrink-0" />
              <div>
                <h4 className="font-bold text-base font-tamil text-bark-900">
                  Google Maps Location
                </h4>
                <p className="text-xs text-bark-600 font-lato">{shopInfo.addressEnglish}</p>
              </div>
            </div>
            <a
              href={shopInfo.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1d3d29] text-white font-bold px-5 py-2 text-xs rounded-none hover:bg-forest-800 transition-colors flex items-center gap-1.5 shrink-0"
            >
              Get Directions <ExternalLink size={13} />
            </a>
          </div>
        ) : null}

        {/* Contact Form -> WhatsApp Redirection */}
        <div className="bg-[#faf6ee] p-6 sm:p-8 border border-gold/30 shadow-green space-y-6">
          <div className="flex items-center gap-3 border-b border-gold/30 pb-4">
            <MessageSquare size={22} className="text-forest-700" />
            <h2 className="text-xl sm:text-2xl font-extrabold font-tamil text-bark-900">
              WhatsApp-ல் தகவல் அனுப்ப (Send Message via WhatsApp)
            </h2>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 text-center space-y-4 animate-fade-in">
              <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-tamil text-emerald-900">
                  WhatsApp-க்கு அனுப்பப்படுகிறது! (Redirecting to WhatsApp...)
                </h3>
                <p className="text-xs sm:text-sm font-lato text-emerald-800 mt-1">
                  உங்கள் விவரங்களுடன் WhatsApp திறக்கும். அங்கு 'Send' கொடுக்கவும்.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 text-white font-extrabold px-6 py-2.5 rounded-none hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
                >
                  <MessageSquare size={16} /> Open WhatsApp Directly
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", phone: "", message: "" });
                  }}
                  className="text-xs font-bold text-forest-700 underline cursor-pointer"
                >
                  மற்றொரு தகவல் அனுப்ப (Send another message)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-lato text-bark-800 mb-1">
                  உங்கள் பெயர் (Your Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா. கார்த்திக்"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gold/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold text-bark-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-lato text-bark-800 mb-1">
                  தொலைபேசி எண் (Phone Number) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="எ.கா. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gold/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold text-bark-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-lato text-bark-800 mb-1">
                  உங்கள் தகவல் (Message) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="உங்களுக்குத் தேவையான பொருட்கள் அல்லது கேள்விகளை எழுதவும்..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gold/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold text-bark-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="bg-gold text-bark-900 font-extrabold px-6 py-3 text-sm sm:text-base rounded-none hover:bg-gold-600 transition-all shadow-green flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <MessageSquare size={18} /> WhatsApp-ல் தகவல் அனுப்புக (Send via WhatsApp)
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}
