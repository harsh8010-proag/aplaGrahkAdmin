import { FileText, Clock, CheckCircle, XCircle, Lock, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import StatCard, { StatCardSkeleton } from "../../../shared/components/StatCard";
import DailyApplicationsChart, { DailyApplicationsChartSkeleton } from "./DailyApplicationsChart";
import ApplicationStatusChart, { ApplicationStatusChartSkeleton } from "./ApplicationStatusChart";
import { useGetDashbaordQuery } from "../../../redux/api/authApi";

export default function Dashboard() {
  const { data: dashboardData, isLoading, isFetching, refetch } = useGetDashbaordQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const dashData = dashboardData?.data || {};
  const cards = dashData.cards || {};
  const applicationStatus = dashData.applicationStatus || {};
  const apiLast7Days = dashData.last7Days || [];

  const stats = [
    { title: "Total Applications", value: cards.totalApplications || 0, icon: FileText, iconBgColor: "bg-orange-500", trend: "+30%", trendText: "Increased than yesterday" },
    { title: "Pending Verifications", value: cards.pendingApplications || 0, icon: Clock, iconBgColor: "bg-yellow-500", trend: "+30%", trendText: "Increased than yesterday" },
    { title: "Approved Applications", value: cards.approvedApplications || 0, icon: CheckCircle, iconBgColor: "bg-blue-400", trend: "+30%", trendText: "Increased than yesterday" },
    { title: "Rejected Applications", value: cards.rejectedApplications || 0, icon: XCircle, iconBgColor: "bg-red-500", trend: "+30%", trendText: "Increased than yesterday" },
    { title: "Total Revenue", value: cards.totalRevenue || 0, icon: Lock, iconBgColor: "bg-[#1E293B]", trend: "+30%", trendText: "Increased than yesterday", isCurrency: true },
  ];

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayString = date.toISOString().split("T")[0];
    const found = apiLast7Days.find((d) => d._id === dayString);
    last7Days.push({ name: dayName, submitted: found?.submitted || 0, approved: found?.approved || 0 });
  }

  const statusData = [
    { name: "Approved", value: applicationStatus.approved || 0, color: "#10B981" },
    { name: "Pending", value: applicationStatus.pending || 0, color: "#F59E0B" },
    { name: "Rejected", value: applicationStatus.rejected || 0, color: "#EF4444" },
  ];

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header — always static, never skeleton */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center">
            Welcome back, Rohan <span className="ml-2">👋</span>
          </h1>
          <p className="text-gray-600 font-bold">
            Here's what's happening across AAPL GRAHAK today.
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
