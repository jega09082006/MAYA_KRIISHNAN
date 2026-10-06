import React from "react";
import { Phone, MapPin } from "lucide-react";
import { shopInfo } from "../data/shopInfo";
import { useLang } from "../context/LanguageContext";

export default function ShopInfoBar() {
  const { lang, t } = useLang();

  const addressText = lang === "ta" ? shopInfo.addressTamil : shopInfo.addressEnglish;

  const addressPillContent = (
    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#1d3d29] border border-emerald-600/40 text-cream-100 rounded-full text-xs sm:text-sm font-medium shadow-sm shrink-0 min-h-[44px] max-w-full">
      <MapPin size={15} className="text-gold-300 shrink-0" />
      <span className="truncate max-w-[240px] sm:max-w-none">{addressText}</span>
    </div>
  );

  return (
    <div className="bg-[#142e1f] border-b border-gold/20 py-2 px-3 sm:px-6 overflow-hidden">
      {/* Mobile & Tablet: Horizontal scroll row of 44px tall pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 max-w-7xl mx-auto">
        {/* Phone Pill First */}
        <a
          href={shopInfo.phoneLink}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1d3d29] hover:bg-[#2d5a3d] transition-colors text-cream-100 rounded-full text-xs sm:text-sm font-bold shadow-sm border border-emerald-600/40 shrink-0 min-h-[44px] cursor-pointer"
        >
          <Phone size={15} className="text-gold-300 shrink-0" />
          <span>{t("callUs")} – {shopInfo.phoneDisplay}</span>
        </a>

        {/* Address Pill Second */}
        {shopInfo.mapsLink ? (
          <a
            href={shopInfo.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity cursor-pointer shrink-0 max-w-full"
          >
            {addressPillContent}
          </a>
        ) : (
          addressPillContent
        )}
      </div>
    </div>
  );
}
