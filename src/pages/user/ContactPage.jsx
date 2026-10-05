import React, { useState } from "react";
import { Phone, MapPin, Store, Send, CheckCircle2, ExternalLink, MessageSquare } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { shopInfo, getWhatsAppLink } from "../../data/shopInfo";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    const text = `*மாயக்கிருஷ்ணன் கடை தொடர்பு தகவல் (Contact Form)*\n\n*பெயர் (Name):* ${formData.name}\n*தொலைபேசி (Phone):* ${formData.phone}\n*தகவல் (Message):* ${formData.message}`;
    const url = getWhatsAppLink(text);

    setWaUrl(url);
    setSubmitted(true);

    // Redirect to WhatsApp
    window.open(url, "_blank");
  }

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">
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
          {/* Card 1: Phone & WhatsApp */}
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
            <div className="mt-auto flex flex-wrap items-center justify-center gap-2">
              <a
                href={shopInfo.phoneLink}
                className="inline-flex items-center gap-1.5 bg-gold text-bark-900 font-extrabold px-3 py-2 text-xs rounded-none hover:bg-gold-600 transition-all shadow-sm cursor-pointer min-h-[44px]"
              >
                <Phone size={14} /> அழைக்க (Call Now)
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold px-3 py-2 text-xs rounded-none transition-all shadow-sm cursor-pointer min-h-[44px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white shrink-0"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.591-1.048 3.834 3.792-1.026.999.598zm11.383-7.51c-.287-.144-1.701-.84-1.963-.935-.262-.096-.453-.144-.645.144-.192.288-.744.935-.912 1.127-.168.192-.336.216-.623.072-.287-.144-1.215-.448-2.315-1.428-.857-.764-1.435-1.707-1.603-1.995-.168-.288-.018-.444.126-.587.13-.129.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.645-1.585-.883-2.16-.232-.559-.467-.483-.645-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.985-1.008 2.401 0 1.417 1.032 2.784 1.176 2.977.144.192 2.033 3.103 4.925 4.35.688.297 1.225.475 1.644.609.691.22 1.32.189 1.817.115.555-.083 1.701-.696 1.94-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
                </svg>
                WhatsApp
              </a>
            </div>
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
                className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:underline cursor-pointer"
              >
                <span>Google Maps-ல் பார்க்க</span>
                <ExternalLink size={12} />
              </a>
            ) : null}
          </div>

          {/* Card 3: Business Hours */}
          <div className="bg-[#faf6ee] p-6 border border-gold/30 shadow-green flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1d3d29] text-gold flex items-center justify-center shadow-md">
              <Store size={22} />
            </div>
            <h3 className="font-extrabold font-tamil text-bark-900 text-lg">
              கடை நேரம் (Shop Timings)
            </h3>
            <p className="text-sm font-tamil text-bark-800 font-semibold">
              திங்கள் - ஞாயிறு (Mon - Sun)
            </p>
            <p className="text-xs font-lato text-bark-700 font-bold bg-gold-100 border border-gold/40 px-3 py-1 rounded-full">
              காலை 7:30 - இரவு 9:30
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-[#faf6ee] p-6 sm:p-8 border border-gold/30 shadow-green space-y-6">
          <div className="border-b border-gold/30 pb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold font-tamil text-bark-900">
              எங்களுக்குத் தகவல் அனுப்ப (Send Us a Message)
            </h2>
            <p className="text-xs sm:text-sm text-bark-600 font-tamil mt-1">
              உங்கள் கேள்விகள் மற்றும் தேவைகளை கீழே உள்ள படிவத்தில் அனுப்பி நேரடியாக WhatsApp-ல் உரையாடலாம்.
            </p>
          </div>

          {submitted ? (
            <div className="bg-forest-50 border border-forest-300 p-6 text-center space-y-3">
              <CheckCircle2 size={36} className="text-forest-700 mx-auto" />
              <h3 className="text-lg font-bold font-tamil text-forest-800">
                நன்றி! WhatsApp பக்கம் திறக்கப்படுகிறது.
              </h3>
              <p className="text-xs text-bark-600 font-lato">
                If WhatsApp did not open automatically, click the button below:
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-extrabold px-6 py-2.5 text-sm rounded-none hover:bg-[#1ebe5d] transition-all cursor-pointer shadow"
              >
                Open WhatsApp Chat
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-bark-800 mb-1 font-tamil">
                  உங்கள் பெயர் (Your Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="உதாரணம்: கார்த்திக்"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gold/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold text-bark-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bark-800 mb-1 font-tamil">
                  தொலைபேசி எண் (Phone Number) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="63691 42873"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gold/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold text-bark-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bark-800 mb-1 font-tamil">
                  தகவல் (Message / Inquiry) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="உங்களுக்கு என்ன பொருட்கள் தேவை அல்லது என்ன கேள்விகள் உள்ளன?"
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
    </PageTransition>
  );
}
