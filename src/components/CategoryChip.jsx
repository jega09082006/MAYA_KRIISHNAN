import React from "react";
import { Check } from "lucide-react";
import { getCategoryImage, EG_ICON } from "../utils/images";

export default function CategoryChip({ category, active, onClick }) {
  const { englishName, tamilName, label } = category;

  const engLabel = englishName || label;
  const tamLabel = tamilName || null;
  const catImg = getCategoryImage(category);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-full border text-left text-xs sm:text-sm font-medium leading-snug cursor-pointer transition-colors duration-200 box-border ${
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
            alt={engLabel}
            onError={(e) => {
              e.currentTarget.src = EG_ICON;
            }}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <span className="min-w-0">
          {tamLabel && (
            <span
              className={`block font-extrabold font-tamil leading-tight ${
                active ? "text-cream-100" : "text-bark-900"
              }`}
            >
              {tamLabel}
            </span>
          )}
          <span
            className={`block text-xs font-normal font-lato leading-tight ${
              active ? "text-gold-200" : "text-bark-500"
            }`}
          >
            {engLabel}
          </span>
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
