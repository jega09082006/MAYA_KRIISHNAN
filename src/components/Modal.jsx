import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-forest-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-[#faf6ee] rounded-none shadow-green-hover border border-bark-200 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-fade-in text-bark-900`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-bark-200 bg-[#f3ebdb]">
          <h2 className="text-lg font-bold font-tamil text-bark-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none hover:bg-forest-100 transition-colors text-bark-500 hover:text-bark-900 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
