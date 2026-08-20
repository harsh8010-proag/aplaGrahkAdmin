import { FileText, Clock, CheckCircle, XCircle, Lock, RefreshCw, Loader } from "lucide-react";
import { useEffect } from "react";
import StatCard, { StatCardSkeleton } from "../../../shared/components/StatCard";
import DailyApplicationsChart, { DailyApplicationsChartSkeleton } from "./DailyApplicationsChart";
import ApplicationStatusChart, { ApplicationStatusChartSkeleton } from "./ApplicationStatusChart";
import { useGetDashbaordQuery } from "../../../redux/api/authApi";

// Computes a real trend % from two numeric values.
// Returns { trend: "+12%", trendText: "..." } and handles 0/0 and divide-by-zero safely.
function calculateTrend(current, previous) {
  if (previous === undefined || previous === null) {
    return { trend: null, trendText: "" };
  }
  if (previous === 0) {
    if (current === 0) return { trend: "0%", trendText: "No change from yesterday" };
    return { trend: "+100%", trendText: "Increased than yesterday" };
  }
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  const rounded = Math.round(pct);
  const sign = rounded >= 0 ? "+" : "";
  return {
    trend: `${sign}${rounded}%`,
    trendText: rounded >= 0 ? "Increased than yesterday" : "Decreased than yesterday",
  };
}

export default function Dashboard() {
  const { data: dashboardData, isLoading, isFetching, refetch } = useGetDashbaordQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const dashData = dashboardData?.data || {};
  const cards = dashData.cards || {};
  const applicationStatus = dashData.applicationStatus || {};
  const apiLast7Days = dashData.last7Days || [];

  // Build last7Days first so we can derive "today vs yesterday" trend from it.
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayString = date.toISOString().split("T")[0];
    const found = apiLast7Days.find((d) => d._id === dayString);
    last7Days.push({ name: dayName, submitted: found?.submitted || 0, approved: found?.approved || 0 });
  }

  // today = last entry, yesterday = second-to-last entry
  const todaySubmitted = last7Days[last7Days.length - 1]?.submitted ?? 0;
  const yesterdaySubmitted = last7Days[last7Days.length - 2]?.submitted ?? 0;
  const todayApproved = last7Days[last7Days.length - 1]?.approved ?? 0;
  const yesterdayApproved = last7Days[last7Days.length - 2]?.approved ?? 0;

  const totalTrend = calculateTrend(todaySubmitted, yesterdaySubmitted);
  const approvedTrend = calculateTrend(todayApproved, yesterdayApproved);

  const stats = [
    {
      title: "Total Applications",
      value: cards.totalApplications || 0,
      icon: FileText,
      iconBgColor: "bg-orange-500",
      trend: totalTrend.trend,
      trendText: totalTrend.trendText,
    },
    {
      title: "Pending Verifications",
      value: cards.pendingApplications || 0,
      icon: Clock,
      iconBgColor: "bg-yellow-500",
      // No day-over-day series available for this metric yet.
      trend: null,
      trendText: "",
    },
    {
      title: "In Progress Applications",
      value: cards.inProgressApplications || 0,
      icon: Loader,
      iconBgColor: "bg-purple-500",
      trend: null,
      trendText: "",
    },
    {
      title: "Approved Applications",
      value: cards.approvedApplications || 0,
      icon: CheckCircle,
      iconBgColor: "bg-blue-400",
      trend: approvedTrend.trend,
      trendText: approvedTrend.trendText,
    },
    {
      title: "Rejected Applications",
      value: cards.rejectedApplications || 0,
      icon: XCircle,
      iconBgColor: "bg-red-500",
      trend: null,
      trendText: "",
    },
    {
      title: "Total Revenue",
      value: cards.totalRevenue || 0,
      icon: Lock,
      iconBgColor: "bg-[#1E293B]",
      trend: null,
      trendText: "",
      isCurrency: true,
    },
  ];

  const statusData = [
    { name: "Approved", value: applicationStatus.approved || 0, color: "#10B981" },
    { name: "Pending", value: applicationStatus.pending || 0, color: "#F59E0B" },
    { name: "In Progress", value: applicationStatus.inProgress || 0, color: "#8B5CF6" },
    { name: "Rejected", value: applicationStatus.rejected || 0, color: "#EF4444" },
  ];

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header — always static, never skeleton */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center font-semibold">
            Welcome back,
          </h1>
          <p className="text-gray-600 font-bold">
            Here's what's happening across AAPLA GRAHAK today.
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading || isFetching}
          title="Refresh Dashboard"
          className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading || isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-[280px]">
        <div className="lg:col-span-2">
          {isLoading ? <DailyApplicationsChartSkeleton /> : <DailyApplicationsChart data={last7Days} />}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <ApplicationStatusChartSkeleton /> : <ApplicationStatusChart data={statusData} />}
        </div>
      </div>
    </div>
  );
}