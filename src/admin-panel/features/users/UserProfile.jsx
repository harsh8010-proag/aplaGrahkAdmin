import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Briefcase,
  Info,
  CreditCard,
  Download,
} from "lucide-react";
import StatCard from "../../../shared/components/StatCard";
import PersonalInfo from "./components/PersonalInfo";
import Applications from "./components/Applications";
import Payments from "./components/Payments";
import {
  useGetUserByIdQuery,
  useUserBlockMutation,
} from "../../../redux/api/usersApi";
import { exportUserReport } from "../../../utils/exportPDf";

export default function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // Could be used to fetch actual user data

  const { data: userDetails, isLoading } = useGetUserByIdQuery(id);
  const [userBlock, { isLoading: isBlocking }] = useUserBlockMutation();

  const user = userDetails?.user;
  const applications = userDetails?.appilications || [];

  // console.log("User Details:", userDetails);

  const isActive = !user?.isBlock;

  const [activeTab, setActiveTab] = useState("Personal Info");

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleUserBlock = async () => {
    try {
      const res = await userBlock(user._id).unwrap();
      console.log(res);

      // Agar react-hot-toast use kar rahi ho
      // toast.success(res.message);
    } catch (err) {
      console.error(err);
      // toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleWhatsAppClick = () => {
  const adminNumber = "917769914777"; // admin ka WhatsApp number, 91 = India code

  const message = `Hi, sharing details for USER-${user?._id?.slice(-8).toUpperCase()}.
Name: ${user?.name || "N/A"}
Mobile: ${user?.mobileNumber || "N/A"}
Joined: ${formatDate(user?.createdAt)}`;

  const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

  const payments = [
    {
      id: "TXN-1234567",
      service: "Aadhaar card update",
      method: "UPI",
      payment: "Success",
      date: "12/05/2026",
      amount: "₹199",
    },
    {
      id: "TXN-1234567",
      service: "Aadhaar card update",
      method: "UPI",
      payment: "Success",
      date: "12/05/2026",
      amount: "₹199",
    },
    {
      id: "TXN-1234567",
      service: "Aadhaar card update",
      method: "UPI",
      payment: "Success",
      date: "12/05/2026",
      amount: "₹199",
    },
    {
      id: "TXN-1234567",
      service: "Aadhaar card update",
      method: "UPI",
      payment: "Success",
      date: "12/05/2026",
      amount: "₹199",
    },
  ];

  const handleExport = () => {
    exportUserReport(user, applications, payments);
  };

  const totalApplications = applications.length;

  const approvedApplications = applications.filter(
    (app) => app.status === "Approved",
  ).length;

  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected",
  ).length;

  const totalRevenue = payments
    .filter((payment) => payment.payment === "Success")
    .reduce(
      (total, payment) =>
        total + Number(String(payment.amount).replace(/[₹,]/g, "")),
      0,
    );

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-6 h-6 text-[#041A40] stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#041A40] mb-1 flex items-center space-x-3">
              <span>{user?.name || "N/A"}</span>
            </h1>
            <p className="text-gray-600 font-bold text-xs md:text-sm uppercase tracking-wide">
              USER-{user?._id?.slice(-8).toUpperCase()}{" "}
              <span className="mx-1">|</span> Joined on{" "}
              {formatDate(user?.createdAt)} <span className="mx-1">|</span>{" "}
              {user?.mobileNumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Status Toggle */}

          <button
            onClick={handleUserBlock}
            disabled={isBlocking}
            className={`w-12 h-6 shrink-0 rounded-full relative transition-colors duration-200 border-2 ${
              isActive
                ? "bg-[#041A40] border-[#041A40]"
                : "bg-gray-100 border-gray-300"
            } ${isBlocking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform duration-200 ${
                isActive
                  ? "bg-white translate-x-6"
                  : "bg-gray-400 translate-x-0"
              }`}
            />
          </button>
          {/* WhatsApp Button */}
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            disabled={!user?.mobileNumber}
            className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <img
              src="/Icons/whatsapp icon.svg"
              alt="WhatsApp"
              className="w-10 h-10 object-contain"
            />
          </button>
          {/* Export Button */}
          <button
            className="flex items-center space-x-2 bg-[#FF8303] hover:bg-[#e67400] text-white px-5 py-2.5 rounded-full font-bold shadow-sm shadow-orange-500/20 transition-all active:scale-95"
            onClick={handleExport}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={FileText}
          iconBgColor="bg-[#FF8303]"
          trend="+30%"
          trendText="Increased than last month"
        />
        <StatCard
          title="Approved Applications"
          value={approvedApplications}
          icon={CheckCircle2}
          iconBgColor="bg-[#00A3FF]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard
          title="Rejected Applications"
          value={rejectedApplications}
          icon={XCircle}
          iconBgColor="bg-red-500"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          icon={Briefcase}
          iconBgColor="bg-[#041A40]"
          trend="+30%"
          trendText="Increased than yesterday"
          isCurrency={false}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-2 flex items-center space-x-6 overflow-x-auto mb-2 px-6">
        <button
          onClick={() => setActiveTab("Personal Info")}
          className={`flex items-center space-x-2 py-2.5 font-bold text-sm transition-all shrink-0 ${activeTab === "Personal Info" ? "text-[#041A40]" : "text-gray-400 hover:text-gray-600"}`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-serif italic font-bold text-xs ${activeTab === "Personal Info" ? "bg-[#041A40]" : "bg-gray-400"}`}
          >
            i
          </div>
          <span>Personal Info</span>
        </button>

        <button
          onClick={() => setActiveTab("Applications")}
          className={`flex items-center space-x-2 py-2.5 font-bold text-sm transition-all shrink-0 ${activeTab === "Applications" ? "text-[#041A40]" : "text-gray-400 hover:text-gray-600"}`}
        >
          <img
            src="/Icons/application icon.svg"
            alt="Applications"
            className="w-4 h-4 object-contain transition-all"
            style={{
              filter: "brightness(0)",
              opacity: activeTab === "Applications" ? 1 : 0.4,
            }}
          />
          <span>Applications</span>
        </button>

        <button
          onClick={() => setActiveTab("Payments")}
          className={`flex items-center space-x-2 py-2.5 font-bold text-sm transition-all shrink-0 ${activeTab === "Payments" ? "text-[#041A40]" : "text-gray-400 hover:text-gray-600"}`}
        >
          <img
            src="/Icons/payment icon.svg"
            alt="Payments"
            className="w-4 h-4 object-contain transition-all"
            style={{
              filter: "brightness(0)",
              opacity: activeTab === "Payments" ? 1 : 0.4,
            }}
          />
          <span>Payments</span>
        </button>
      </div>

      {/* Form Content Area */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        {activeTab === "Personal Info" && <PersonalInfo user={user} />}
        {activeTab === "Applications" && (
          <Applications applications={applications} />
        )}
        {activeTab === "Payments" && <Payments payments={payments} />}
      </div>
    </div>
  );
}
