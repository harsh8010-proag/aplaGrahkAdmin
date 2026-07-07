import { FileText, Clock, CheckCircle, XCircle, Lock } from 'lucide-react';
import StatCard from '../../../shared/components/StatCard';
import DailyApplicationsChart from './DailyApplicationsChart';
import ApplicationStatusChart from './ApplicationStatusChart';

const stats = [
  {
    title: 'Total Applications',
    value: '1200',
    icon: FileText,
    iconBgColor: 'bg-orange-500',
    trend: '+30%',
    trendText: 'Increased than yesterday'
  },
  {
    title: 'Pending Verifications',
    value: '1200',
    icon: Clock,
    iconBgColor: 'bg-yellow-500',
    trend: '+30%',
    trendText: 'Increased than yesterday'
  },
  {
    title: 'Approved Applications',
    value: '1200',
    icon: CheckCircle,
    iconBgColor: 'bg-blue-400',
    trend: '+30%',
    trendText: 'Increased than yesterday'
  },
  {
    title: 'Rejected Applications',
    value: '1200',
    icon: XCircle,
    iconBgColor: 'bg-red-500',
    trend: '+30%',
    trendText: 'Increased than yesterday'
  },
  {
    title: 'Total Revenue',
    value: '48.62L',
    icon: Lock,
    iconBgColor: 'bg-[#1E293B]',
    trend: '+30%',
    trendText: 'Increased than yesterday',
    isCurrency: true
  }
];

export default function Dashboard() {
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
          <DailyApplicationsChart />
        </div>
        <div className="lg:col-span-1">
          <ApplicationStatusChart />
        </div>
      </div>
    </div>
  );
}
