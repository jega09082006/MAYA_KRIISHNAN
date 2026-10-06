import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ShoppingBag } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import Logo from "../../components/Logo";
import { GoldLotusOrnament } from "../../components/GoldLotusOrnament";
import { shopInfo } from "../../data/shopInfo";
import { useLang } from "../../context/LanguageContext";
import { PUBLIC_CATEGORIES } from "../../data/mockData";

export default function AboutPage() {
  const { lang, t } = useLang();

  const shopName    = lang === "ta" ? shopInfo.nameTamil    : shopInfo.nameEnglish;
  const shopBiz     = lang === "ta" ? shopInfo.businessTamil : shopInfo.businessEnglish;
  const addressText = lang === "ta" ? shopInfo.addressTamil  : shopInfo.addressEnglish;

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">

        {/* Signboard Header Card */}
        <div className="bg-[#12281b] border-2 border-gold/60 p-6 sm:p-8 rounded-none shadow-xl text-cream-100 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Logo className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-gold/50 shadow-md shrink-0" />
            <div className="space-y-2 flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-catamaran text-gold-400 tracking-tight">
                {shopName}
              </h1>
              <p className="text-xl sm:text-2xl font-bold font-catamaran text-cream-100">
                {shopBiz}
              </p>

              {/* Pills */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2.5 w-full">
                <a
                  href={shopInfo.phoneLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#1d3d29] hover:bg-[#2d5a3d] transition-colors text-white rounded-none text-sm font-medium border border-emerald-600/40 w-full sm:w-auto cursor-pointer"
                >
                  <Phone size={16} className="text-gold-300 shrink-0" />
                  <span>{t("aboutCallBtn")} – {shopInfo.phoneDisplay}</span>
                </a>

                <div className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#1d3d29] border border-emerald-600/40 text-white rounded-none text-sm font-medium shadow-sm w-full sm:w-auto">
                  <MapPin size={16} className="text-gold-300 shrink-0" />
                  <span className="text-center">{addressText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Factual Info Section */}
        <div className="bg-[#faf6ee] p-6 sm:p-8 border border-gold/30 shadow-green space-y-6">
          <div className="flex items-center gap-3 border-b border-gold/30 pb-4">
            <GoldLotusOrnament size={24} />
            <h2 className="text-2xl font-extrabold font-catamaran text-bark-900">
              {t("aboutTitle")}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base font-catamaran text-bark-800 leading-relaxed">
            <p>{t("aboutP1")}</p>
            <p>{t("aboutP2")}</p>
          </div>

          {/* What We Sell */}
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-bold font-catamaran text-bark-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {t("aboutWhatWeSell")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PUBLIC_CATEGORIES.map((cat) => {
                const name = lang === "ta" ? cat.tamilName : cat.englishName;
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 bg-white border border-gold/20 shadow-sm flex items-center justify-between"
                  >
                    <p className="font-extrabold font-catamaran text-bark-900 text-sm">{name}</p>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Address & Contact */}
          <div className="pt-4 border-t border-gold/30 space-y-3">
            <h3 className="text-lg font-bold font-catamaran text-bark-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {t("aboutAddress")}
            </h3>
            <div className="bg-white p-4 border border-gold/20 space-y-2 text-sm font-catamaran text-bark-800">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-forest-700 shrink-0 mt-0.5" />
                <span>
                  <strong>{t("aboutAddressLabel")}:</strong> {addressText}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-forest-700 shrink-0" />
                <span>
                  <strong>{t("aboutPhone")}:</strong>{" "}
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
              <ShoppingBag size={16} /> {t("viewCatalogue")}
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
