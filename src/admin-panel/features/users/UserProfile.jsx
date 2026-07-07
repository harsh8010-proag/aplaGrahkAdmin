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

export default function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // Could be used to fetch actual user data

  const [activeTab, setActiveTab] = useState("Personal Info");

  // Mock data based on the design
  const user = {
    id: id || "12345",
    name: "Aarav Sharma",
    joinedOn: "2026-Feb-02",
    phone: "+91 8585858585",
    contactNo: "+91 85858 14141",
    address: "Golden City center, Nashik, Maharashtra 431008",
    status: true,
  };

  const applications = [
    {
      id: "APP-1234567",
      service: "Aadhaar Certificate",
      submitted: "12/05/2026",
      payment: "Pending",
      status: "Pending",
    },
    {
      id: "APP-1234567",
      service: "Aadhaar Certificate",
      submitted: "12/05/2026",
      payment: "Success",
      status: "Approved",
    },
    {
      id: "APP-1234567",
      service: "Aadhaar Certificate",
      submitted: "12/05/2026",
      payment: "Failed",
      status: "Pending",
    },
    {
      id: "APP-1234567",
      service: "Aadhaar Certificate",
      submitted: "12/05/2026",
      payment: "Pending",
      status: "Pending",
    },
  ];

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
              <span>{user.name}</span>
            </h1>
            <p className="text-gray-600 font-bold text-xs md:text-sm uppercase tracking-wide">
              USER-{user.id} <span className="mx-1">|</span> Joined on{" "}
              {user.joinedOn} <span className="mx-1">|</span> {user.phone}
            </p>
          </div>
        </div>

        {/* Right Actions */} 
        <div className="flex items-center space-x-4">
          {/* Status Toggle */}
          <button
            className={`w-12 h-6 shrink-0 rounded-full relative transition-colors duration-200 focus:outline-none border-2 ${user.status ? "bg-[#041A40] border-[#041A40]" : "bg-gray-100 border-gray-300"}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform duration-200 ${user.status ? "bg-white translate-x-6" : "bg-gray-400 translate-x-0"}`}
            ></span>
          </button> 

          {/* WhatsApp Button */}
          <button className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none">
            <img
              src="/Icons/whatsapp icon.svg"
              alt="WhatsApp"
              className="w-10 h-10 object-contain"
            />
          </button>

          {/* Export Button */}
          <button className="flex items-center space-x-2 bg-[#FF8303] hover:bg-[#e67400] text-white px-5 py-2.5 rounded-full font-bold shadow-sm shadow-orange-500/20 transition-all active:scale-95">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value="12"
          icon={FileText}
          iconBgColor="bg-[#FF8303]"
          trend="+30%"
          trendText="Increased than last month"
        />
        <StatCard
          title="Approved Applications"
          value="1200"
          icon={CheckCircle2}
          iconBgColor="bg-[#00A3FF]"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard
          title="Rejected Applications"
          value="1200"
          icon={XCircle}
          iconBgColor="bg-red-500"
          trend="+30%"
          trendText="Increased than yesterday"
        />
        <StatCard
          title="Total Revenue"
          value="₹48.62L"
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
