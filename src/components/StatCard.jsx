import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="bg-white border border-gray-200 rounded-none p-6 flex items-start gap-4 shadow-green hover:-translate-y-0.5 transition-all duration-200">
      {/* Icon */}
      <div className="w-12 h-12 rounded-none bg-[#1d3d29] text-gold flex items-center justify-center flex-shrink-0 border border-gold/30">
        <Icon size={22} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider font-lato">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900 font-catamaran mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 font-lato mt-1 truncate">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={13} className="text-forest-700" />
            <span className="text-xs font-bold text-forest-700 font-lato">
              +{trend}% this month
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
