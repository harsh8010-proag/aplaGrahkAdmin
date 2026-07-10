import { FileText, Clock, CheckCircle, XCircle, Lock } from "lucide-react";
import StatCard from "../../../shared/components/StatCard";
import DailyApplicationsChart from "./DailyApplicationsChart";
import ApplicationStatusChart from "./ApplicationStatusChart";
import { useGetAplicationsQuery } from "../../../redux/api/applicationsApi";

export default function Dashboard() {
  const { data: applicationData } = useGetAplicationsQuery();

  console.log("Application Data in Dashbaord:", applicationData);

  const applications = applicationData?.applications || [];

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (app) => app.status === "Pending",
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "Approved",
  ).length;

  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected",
  ).length;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      iconBgColor: "bg-orange-500",
      trend: "+30%",
      trendText: "Increased than yesterday",
    },
    {
      title: "Pending Verifications",
      value: pendingApplications,
      icon: Clock,
      iconBgColor: "bg-yellow-500",
      trend: "+30%",
      trendText: "Increased than yesterday",
    },
    {
      title: "Approved Applications",
      value: approvedApplications,
      icon: CheckCircle,
      iconBgColor: "bg-blue-400",
      trend: "+30%",
      trendText: "Increased than yesterday",
    },
    {
      title: "Rejected Applications",
      value: rejectedApplications,
      icon: XCircle,
      iconBgColor: "bg-red-500",
      trend: "+30%",
      trendText: "Increased than yesterday",
    },
    {
      title: "Total Revenue",
      value: "0",
      icon: Lock,
      iconBgColor: "bg-[#1E293B]",
      trend: "+30%",
      trendText: "Increased than yesterday",
      isCurrency: true,
    },
  ];

  const last7Days = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);

  const dayName = date.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const dayString = date.toISOString().split("T")[0];

  const submitted = applications.filter((app) => {
    return app.createdAt?.split("T")[0] === dayString;
  }).length;

  const approved = applications.filter((app) => {
    return (
      app.createdAt?.split("T")[0] === dayString &&
      app.status === "Approved"
    );
  }).length;

  last7Days.push({
    name: dayName,
    submitted,
    approved,
  });
}

// console.log(last7Days);

const statusData = [
  {
    name: "Approved",
    value: approvedApplications,
    color: "#10B981",
  },
  {
    name: "Pending",
    value: pendingApplications,
    color: "#F59E0B",
  },
  {
    name: "Rejected",
    value: rejectedApplications,
    color: "#EF4444",
  },
];

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center">
          Welcome back, Rohan <span className="ml-2">👋</span>
        </h1>
        <p className="text-gray-600 font-bold">
          Here's what's happening across AAPL GRAHAK today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
        <DailyApplicationsChart data={last7Days} />
        </div>
        <div className="lg:col-span-1">
         <ApplicationStatusChart data={statusData} />
        </div>
      </div>
    </div>
  );
}
