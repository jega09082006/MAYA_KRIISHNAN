import React from "react";

export default function StatCard({
  titleEnglish,
  titleTamil,
  title,
  value,
  subtitleEnglish,
  subtitleTamil,
  subtitle,
  icon: Icon,
}) {
  // Parsing fallbacks if single-string title/subtitle props are passed
  let engLabel = titleEnglish;
  let tamLabel = titleTamil;
  if (!engLabel && !tamLabel && title) {
    const match = title.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    if (match) {
      engLabel = match[1]?.trim();
      tamLabel = match[2]?.trim();
    } else {
      engLabel = title;
    }
  }

  let subEng = subtitleEnglish;
  let subTam = subtitleTamil;
  if (!subEng && !subTam && subtitle) {
    subTam = subtitle;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-none p-[14px] lg:p-[20px] flex flex-col h-full shadow-green hover:-translate-y-0.5 transition-all duration-200 min-w-0">
      {/* Icon (40px square, forest background, gold icon) */}
      {Icon && (
        <div className="w-[40px] h-[40px] rounded-none bg-[#1d3d29] text-gold flex items-center justify-center shrink-0 border border-gold/30 mb-3">
          <Icon size={20} />
        </div>
      )}

      {/* Content stacked vertically */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Label block with min-height ~3.2em so values align across cards */}
        <div className="min-h-[3.2em] flex flex-col justify-start min-w-0 mb-1">
          {engLabel && (
            <p className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-wider font-lato min-w-0 [overflow-wrap:anywhere] leading-snug">
              {engLabel}
            </p>
          )}
          {tamLabel && (
            <p className="text-[14px] font-semibold text-gray-700 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-snug mt-0.5">
              {tamLabel}
            </p>
          )}
        </div>

        {/* Big value */}
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-catamaran min-w-0 [overflow-wrap:anywhere] leading-tight mt-auto">
          {value}
        </p>

        {/* Sub-text (13px, muted, wraps freely) */}
        {(subTam || subEng) && (
          <div className="text-[13px] text-gray-500 font-lato mt-1 min-w-0 [overflow-wrap:anywhere] leading-snug">
            {subTam && <p className="min-w-0 [overflow-wrap:anywhere]">{subTam}</p>}
            {subEng && <p className="min-w-0 [overflow-wrap:anywhere]">{subEng}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
