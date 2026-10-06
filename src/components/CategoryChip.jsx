import React from "react";
import { Check } from "lucide-react";
import { getCategoryImage, EG_ICON } from "../utils/images";
import { useLang } from "../context/LanguageContext";

export default function CategoryChip({ category, active, onClick }) {
  const { lang } = useLang();
  const { englishName, tamilName, label } = category;

  const displayName = lang === "ta" ? (tamilName || label) : (englishName || label);
  const catImg = getCategoryImage(category);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-full border text-left text-xs sm:text-sm font-medium leading-snug cursor-pointer transition-colors duration-200 box-border min-h-[44px] ${
        active
          ? "bg-forest border-forest text-cream-100 font-bold shadow-sm"
          : "bg-cream-100 text-bark-800 border-bark-200 hover:border-forest-400 hover:text-forest-700"
      }`}
    >
      {/* Left: 28px round thumbnail + label */}
      <span className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-full border border-gold/40 overflow-hidden bg-[#faf6ee] flex items-center justify-center flex-shrink-0 p-0.5 shadow-xs">
          <img
            src={catImg}
            alt={displayName}
            onError={(e) => {
              e.currentTarget.src = EG_ICON;
            }}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <span className="min-w-0 font-extrabold font-catamaran text-sm truncate">
          {displayName}
        </span>
      </span>

      {/* Right: tick when active */}
      {active && (
        <Check
          size={14}
          className="shrink-0 text-gold ml-1"
          strokeWidth={3}
        />
      )}
    </button>
  );
}
