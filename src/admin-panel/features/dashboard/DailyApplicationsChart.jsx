import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "../../../shared/components/Skeleton";

export function DailyApplicationsChartSkeleton() {
  return (
    <div
      className="rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col"
      style={{ backgroundColor: "#D9D9D938" }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex-1 w-full flex items-end gap-2" style={{ minHeight: 300 }}>
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    </div>
  );
}


export default function DailyApplicationsChart({ data }) {
  return (
    <div
      className="rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col"
      style={{ backgroundColor: "#D9D9D938" }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            Daily Applications
          </h3>
          <p className="text-sm text-gray-500 font-bold">
            Last 7 days · Submitted vs Approved
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm font-bold">
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-gray-600">Submitted</span>
          </div>
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 mr-2"></span>
            <span className="text-gray-600">Approved</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full" style={{ minHeight: 300 }}>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickCount={5}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="natural"
              dataKey="submitted"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSubmitted)"
            />
            <Area
              type="natural"
              dataKey="approved"
              stroke="#FB923C"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorApproved)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
