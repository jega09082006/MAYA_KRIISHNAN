import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, trend }) {
  return (
    <div className="card p-6 flex items-start gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${gradient}`}
      >
        <Icon size={24} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-gray-800 mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={13} className="text-brand-green" />
            <span className="text-xs font-semibold text-brand-green">
              +{trend}% this month
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
