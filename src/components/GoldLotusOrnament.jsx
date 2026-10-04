import React from "react";

export function GoldLotusOrnament({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block text-gold ${className}`}
    >
      <path
        d="M12 3C10 7.5 8 9.5 4 12C8 14.5 10 16.5 12 21C14 16.5 16 14.5 20 12C16 9.5 14 7.5 12 3Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 6C11 9 9.5 10.5 6.5 12C9.5 13.5 11 15 12 18C13 15 14.5 13.5 17.5 12C14.5 10.5 13 9 12 6Z"
        fill="#faf6ee"
        opacity="0.7"
      />
      <circle cx="12" cy="12" r="1.5" fill="#d99c2b" />
    </svg>
  );
}

export default GoldLotusOrnament;
