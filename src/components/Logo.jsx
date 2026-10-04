import React, { useState } from "react";

export default function Logo({ className = "w-10 h-10" }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-full bg-[#1d3d29] border-2 border-gold/60 shadow-inner overflow-hidden shrink-0 select-none ${className}`}
        title="Maya Krishnan"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-0.5">
          {/* Outer dotted/mandala ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#d99c2b" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="42" fill="#1d3d29" stroke="#d99c2b" strokeWidth="1" />
          
          {/* Small Gold Feather Icon background watermark */}
          <path
            d="M50 15 C62 25, 62 42, 52 54 C50 56, 48 58, 46 60 L46 76 C45 78, 44 78, 44 76 L45 59 C42 55, 38 42, 43 28 C45 22, 48 17, 50 15 Z"
            fill="#d99c2b"
            opacity="0.35"
          />

          {/* Script letters 'mk' */}
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fill="#fefefe"
            fontSize="34"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="bold"
            className="select-none tracking-tighter"
          >
            mk
          </text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src="/photos/logo.png"
      alt="Maya Krishnan Logo"
      className={`rounded-full object-cover shrink-0 ${className}`}
      onError={() => setImgError(true)}
    />
  );
}
