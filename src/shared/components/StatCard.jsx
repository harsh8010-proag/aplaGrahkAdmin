import React from 'react';
import Skeleton from "./Skeleton";

export function StatCardSkeleton() {
  return (
    <div
      className="rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between"
      style={{ backgroundColor: "#D9D9D938" }}
    >
      <div className="space-y-3 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="w-11 h-11 rounded-xl shrink-0 ml-3" />
    </div>
  );
}

export default function StatCard({ title, value, icon: Icon, iconBgColor, trend, trendText, isCurrency = false }) {
  return (
    <div className="rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow" style={{ backgroundColor: '#D9D9D938' }}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-600 font-bold text-sm leading-tight max-w-[120px]">{title}</h3>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 ${iconBgColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div>
        <div className="text-3xl font-bold text-gray-900 mb-4">
          {isCurrency && <span className="font-sans mr-1">₹</span>}
          {value}
        </div>

        <div className="flex items-center text-xs">
          <span className="px-2 py-1 rounded-full font-bold mr-2" style={{ backgroundColor: '#B3FF92A8', color: '#2D6A18' }}>
            {trend}
          </span>
          <span className="font-bold" style={{ color: '#2D6A18' }}>
            {trendText}
          </span>
        </div>
      </div>
    </div>
  );
}
