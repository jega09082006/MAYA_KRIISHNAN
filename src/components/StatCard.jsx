import React from "react";
import { useLang } from "../context/LanguageContext";

/**
 * Admin dashboard stat card.
 * Accepts separate Tamil and English label/subtitle fields.
 * Renders only the active language label — no bilingual display.
 */
export default function StatCard({
  titleEnglish,
  titleTamil,
  value,
  subtitleEnglish,
  subtitleTamil,
  icon: Icon,
}) {
  const { lang } = useLang();

  const label    = lang === "ta" ? (titleTamil    || titleEnglish)    : (titleEnglish    || titleTamil);
  const subtitle = lang === "ta" ? (subtitleTamil || subtitleEnglish) : (subtitleEnglish || subtitleTamil);

  return (
    <div className="bg-white border border-gray-200 rounded-none p-[14px] lg:p-[20px] flex flex-col h-full shadow-green hover:-translate-y-0.5 transition-all duration-200 min-w-0">
      {/* Icon */}
      {Icon && (
        <div className="w-[40px] h-[40px] rounded-none bg-[#1d3d29] text-gold flex items-center justify-center shrink-0 border border-gold/30 mb-3">
          <Icon size={20} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Label */}
        <div className="min-h-[2.4em] flex flex-col justify-start min-w-0 mb-1">
          <p className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-wider font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug">
            {label}
          </p>
        </div>

        {/* Value */}
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-tight mt-auto">
          {value}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[13px] text-gray-500 font-catamaran mt-1 min-w-0 [overflow-wrap:anywhere] leading-snug">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
