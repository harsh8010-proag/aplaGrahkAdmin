import React from 'react';
import Skeleton from "./Skeleton";
import { AlertTriangle } from "lucide-react";

export function StatCardSkeleton() {
  return (
    <div
      className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
    >
      <div className="space-y-3 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-2 w-28" />
      </div>
      <Skeleton className="w-10 h-10 rounded-full shrink-0 ml-3" />
    </div>
  );
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  trend,
  trendText,
  isCurrency = false,
  alert = false,
  alertText = "",
}) {
  const isNegativeTrend = typeof trend === "string" && trend.trim().startsWith("-");
  const trendBgColor = isNegativeTrend ? "#FFB3B3A8" : "#B3FF92A8";
  const trendTextColor = isNegativeTrend ? "#B91C1C" : "#2D6A18";

  return (
    <div
      className={`bg-white relative rounded-[20px] p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border group ${alert ? "border-red-300 ring-1 ring-red-200" : "border-slate-100 hover:border-[#FF8303]/30"
        }`}
    >
      {alert && (
        <span
          title={alertText}
          className="absolute -top-2 -right-2 flex h-5 w-5"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500">
            <AlertTriangle className="w-3 h-3 text-white" />
          </span>
        </span>
      )}

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-gray-600 font-bold text-xs leading-tight max-w-[120px]">{title}</h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${iconBgColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-gray-900 mb-3">
          {isCurrency && <span className="font-sans mr-1">₹</span>}
          {value}
        </div>

        {trend ? (
          <div className="flex items-center text-xs flex-wrap gap-y-1">
            <span
              className="px-2 py-1 rounded-full font-bold mr-2"
              style={{ backgroundColor: trendBgColor, color: trendTextColor }}
            >
              {trend}
            </span>
            <span className="font-bold" style={{ color: trendTextColor }}>
              {trendText}
            </span>
          </div>
        ) : alertText ? (
          <p className="text-xs font-bold text-red-600">{alertText}</p>
        ) : null}
      </div>
    </div>
  );
}