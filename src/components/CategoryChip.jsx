import React from "react";
import { Check } from "lucide-react";

/**
 * CategoryChip – fully contained, no layout shift on click/hover.
 *
 * Active  : solid category colour bg, white text, white dot, tick icon.
 * Inactive: white bg, grey border, dark text, coloured dot.
 * Hover   : coloured border + coloured text ONLY — NO transform/scale.
 */
export default function CategoryChip({ category, active, onClick }) {
  const { englishName, tamilName, label, color } = category;

  // Prefer split names; fall back to combined label
  const engLabel = englishName || label;
  const tamLabel = tamilName || null;

  return (
    <button
      onClick={onClick}
      style={
        active
          ? { backgroundColor: color, borderColor: color }
          : { borderColor: "#e5e7eb" }
      }
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.color = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.color = "";
        }
      }}
      className={[
        "w-full flex items-start justify-between gap-2",
        "px-3 py-2 rounded-xl border",
        "text-left text-sm font-medium leading-snug",
        "cursor-pointer transition-colors duration-150",
        "box-border",
        active ? "text-white shadow-sm" : "bg-white text-gray-700",
      ].join(" ")}
    >
      {/* Left: dot + label */}
      <span className="flex items-start gap-2 min-w-0">
        <span
          className="mt-0.5 shrink-0 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: active ? "white" : color }}
        />
        <span className="min-w-0">
          <span className="block font-semibold break-words">{engLabel}</span>
          {tamLabel && (
            <span
              className={[
                "block font-semibold break-words",
                active ? "text-white" : "text-gray-700",
              ].join(" ")}
            >
              {tamLabel}
            </span>
          )}
        </span>
      </span>

      {/* Right: tick when active */}
      {active && (
        <Check
          size={14}
          className="shrink-0 mt-0.5 text-white"
          strokeWidth={3}
        />
      )}
    </button>
  );
}
