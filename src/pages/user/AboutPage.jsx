import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ShoppingBag } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import Logo from "../../components/Logo";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { shopInfo } from "../../data/shopInfo";
import { PUBLIC_CATEGORIES } from "../../data/mockData";

export default function AboutPage() {
  const addressPill = (
    <div className="flex items-center gap-2 px-3.5 py-1 bg-[#1d3d29] border border-emerald-600/40 text-white rounded-full text-xs sm:text-sm font-medium shadow-sm shrink-0">
      <MapPin size={14} className="text-gold-300 shrink-0" />
      <span>{shopInfo.addressTamil}</span>
    </div>
  );

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        {/* Signboard Header Card */}
        <div className="bg-[#12281b] border-2 border-gold/60 p-6 sm:p-8 rounded-none shadow-xl text-cream-100 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Logo */}
            <Logo className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-gold/50 shadow-md shrink-0" />

            <div className="space-y-2 flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-tamil text-gold-400 tracking-tight">
                {shopInfo.nameTamil}
              </h1>
              <p className="text-xl sm:text-2xl font-bold font-tamil text-cream-100">
                {shopInfo.businessTamil}
              </p>
              <p className="text-xs sm:text-sm font-bold font-lato text-gold-200">
                {shopInfo.nameEnglish} – {shopInfo.businessEnglish}
              </p>

              {/* Pills */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2.5 w-full">
                <a
                  href={shopInfo.phoneLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#1d3d29] hover:bg-[#2d5a3d] transition-colors text-white rounded-none text-sm font-medium border border-emerald-600/40 w-full sm:w-auto cursor-pointer"
                >
                  <Phone size={16} className="text-gold-300 shrink-0" />
                  <span>அழைக்க – {shopInfo.phoneDisplay}</span>
                </a>

                {shopInfo.mapsLink ? (
                  <a
                    href={shopInfo.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90 transition-opacity cursor-pointer w-full sm:w-auto"
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#1d3d29] border border-emerald-600/40 text-white rounded-none text-sm font-medium shadow-sm w-full sm:w-auto">
                      <MapPin size={16} className="text-gold-300 shrink-0" />
                      <span className="text-center">{shopInfo.addressTamil}</span>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#1d3d29] border border-emerald-600/40 text-white rounded-none text-sm font-medium shadow-sm w-full sm:w-auto">
                    <MapPin size={16} className="text-gold-300 shrink-0" />
                    <span className="text-center">{shopInfo.addressTamil}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Factual Information Sections */}
        <div className="bg-[#faf6ee] p-6 sm:p-8 border border-gold/30 shadow-green space-y-6">
          <div className="flex items-center gap-3 border-b border-gold/30 pb-4">
            <GoldLotusOrnament size={24} />
            <h2 className="text-2xl font-extrabold font-tamil text-bark-900">
              எங்களை பற்றி (About Us)
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base font-lato text-bark-800 leading-relaxed">
            <p>
              <strong className="font-tamil text-forest-800">{shopInfo.nameTamil}</strong> ({shopInfo.nameEnglish}) என்பது அருப்புக்கோட்டை பெரிய கடை பஜாரில் அமைந்துள்ள ஒரு <strong className="font-tamil text-forest-800">{shopInfo.businessTamil}</strong> ஆகும்.
            </p>
            <p>
              எங்கள் கடையில் அன்றாட சமையலுக்குத் தேவையான தூய பலசரக்கு பொருட்கள் மற்றும் ஆரோக்கியத்திற்கான பாரம்பரிய தமிழ்மருந்து பொருட்கள் கிடைக்கின்றன.
            </p>
          </div>

          {/* Categories We Sell */}
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-bold font-playfair text-bark-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              விற்பனை செய்யப்படும் பொருட்கள் (What We Sell):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PUBLIC_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3.5 bg-white border border-gold/20 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-extrabold font-tamil text-bark-900 text-sm">
                      {cat.tamilName}
                    </p>
                    <p className="text-xs font-lato text-bark-600">{cat.englishName}</p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Location & Contact Details */}
          <div className="pt-4 border-t border-gold/30 space-y-3">
            <h3 className="text-lg font-bold font-playfair text-bark-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              கடை முகவரி & தொடர்பு விவரங்கள்:
            </h3>

            <div className="bg-white p-4 border border-gold/20 space-y-2 text-sm font-lato text-bark-800">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-forest-700 shrink-0 mt-0.5" />
                <span>
                  <strong>முகவரி:</strong> {shopInfo.addressTamil} ({shopInfo.addressEnglish})
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-forest-700 shrink-0" />
                <span>
                  <strong>தொலைபேசி எண்:</strong>{" "}
                  <a href={shopInfo.phoneLink} className="text-forest-700 font-bold hover:underline">
                    {shopInfo.phoneDisplay}
                  </a>
                </span>
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              to="/shop"
              className="bg-gold text-bark-900 font-extrabold px-6 py-2.5 rounded-none hover:bg-gold-600 transition-all shadow-green flex items-center gap-2 text-sm"
            >
              <ShoppingBag size={16} /> பொருட்கள் பார்க்க (View Shop Catalogue)
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
