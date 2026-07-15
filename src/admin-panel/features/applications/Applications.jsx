import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Check,
  X,
} from "lucide-react";
import { FaFileCircleCheck } from "react-icons/fa6";
import StatCard from "../../../shared/components/StatCard";
import Button from "../../../shared/components/Button";
import SearchInput from "../../../shared/components/SearchInput";
import Table from "../../../shared/components/Table";

import {
  useGetAplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "../../../redux/api/applicationsApi";

const SkeletonRow = ({ idx }) => (
  <tr key={idx} className="border-b border-gray-100 animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-28"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      </div>
    </td>
  </tr>
);

const SkeletonMobileCard = ({ idx }) => (
  <div
    key={idx}
    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4 animate-pulse"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-2.5 bg-gray-200 rounded w-16"></div>
      <div className="h-4 bg-gray-200 rounded w-28"></div>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

const SkeletonStatCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-24"></div>
  </div>
);

export default function Applications() {
  const navigate = useNavigate();

  const columns = [
    "Application ID",
    "User Name",
    "Service",
    "Submitted On",
    "Payment",
    "Status",
    "Actions",
  ];
  const { data: allApplications, isLoading } = useGetAplicationsQuery();
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const [updatingId, setUpdatingId] = useState(null);
  // const [statusFilter, setStatusFilter] = useState("All Status");
  // const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 6;

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateApplicationStatus({ id, status }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Status update failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // console.log("All Applications:", allApplications);

const applications = allApplications?.applications || [];

// Newest application pehle dikhane ke liye
const sortedApplications = [...applications].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
);

  const pendingCount = applications.filter(
    (app) => app.status === "Pending",
  ).length;

  const approvedCount = applications.filter(
    (app) => app.status === "Approved",
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected",
  ).length;
  const completedCound = applications.filter(
    (app) => app.status === "Completed",
  ).length;
  //   const rejectedCount = applications.filter(
  //   (app) => app.status === "Rejected",
  // ).length;
  // const completedCound = applications.filter(
  //   (app) => app.status === "Completed",
  // ).length;
  const inProgressCount = applications.filter(
    (app) => app.status === "In Progress",
  ).length;

  const statusTabs = [
    {
      label: "Pending",
      value: "Pending",
      count: pendingCount,
      color: "#F97316",
      bg: "#FFEDD5",
    },
    {
      label: "In Progress",
      value: "In Progress",
      count: inProgressCount,
      color: "#3B82F6",
      bg: "#DBEAFE",
    },
    {
      label: "Completed",
      value: "Completed",
      count: completedCound,
      color: "#22C55E",
      bg: "#DCFCE7",
    },
    {
      label: "Rejected",
      value: "Rejected",
      count: rejectedCount,
      color: "#EF4444",
      bg: "#FEE2E2",
    },
  ];

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = sortedApplications.filter((app) => {
    const applicantName =
      app.formData?.applicantName ||
      app.formData?.headOfFamily ||
      app.formData?.fullName ||
      "";
    const phone = app.formData?.mobileNumber || app.formData?.phone || "";
    const idStr = app._id || "";

    const matchesStatus =
      statusFilter === "All Status" || app.status === statusFilter;

    const matchesSearch =
      searchTerm.trim() === "" ||
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idStr.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage,
  );
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const paginatedApplications = filteredApplications.slice(
    indexOfFirstApp,
    indexOfLastApp,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleExport = () => {
    if (filteredApplications.length === 0) {
      alert("No applications to export.");
      return;
    }

    const headers = [
      "Application ID",
      "Applicant Name",
      "Mobile Number",
      "Service",
      "Submitted On",
      "Status",
    ];

    const rows = filteredApplications.map((app) => {
      const applicantName =
        app.formData?.applicantName ||
        app.formData?.headOfFamily ||
        app.formData?.fullName ||
        "Unknown";
      const phone = app.formData?.mobileNumber || app.formData?.phone || "N/A";
      const service = app.serviceId?.name?.en || app.serviceId || "N/A";
      const submittedOn = new Date(app.createdAt).toLocaleDateString("en-IN");

      return [
        app._id,
        applicantName,
        phone,
        service,
        submittedOn,
        app.status || "N/A",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `applications_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPaymentBadge = (payment) => {
    switch (payment) {
      case "Pending":
        return (
          <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
            Pending
          </span>
        );
      case "Success":
        return (
          <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
            Success
          </span>
        );
      case "Failed":
        return (
          <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const handleUpdateStatus = () => {};

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
            Rejected
          </span>
        );
      case "Approved":
        return (
          <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-[90px] inline-flex justify-center">
            Approved
          </span>
        );
      case "In Progress":
        return (
          <span className="px-3.5 py-1 bg-[#DBEAFE] text-[#3B82F6] rounded-full text-xs font-bold w-[90px] inline-flex justify-center">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
            {status || "N/A"}
          </span>
        );
    }
  };

  const renderRow = (app, idx) => {
    const applicantName =
      app.formData?.applicantName ||
      app.formData?.headOfFamily ||
      app.formData?.fullName ||
      "Unknown";

    const phone = app.formData?.mobileNumber || app.formData?.phone || "N/A";

    return (
      <tr
        key={app._id || idx}
        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === applications.length - 1 ? "border-none" : ""}`}
      >
        <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
          {app._id?.slice(-8).toUpperCase()}
        </td>
        <td className="px-6 py-4 font-bold flex items-center space-x-3 whitespace-nowrap">
          <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {applicantName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-gray-900">{applicantName}</div>
            <div className="text-gray-400 font-normal text-xs">{phone}</div>
          </div>
        </td>
        <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
          {app.serviceId?.name?.en || app.serviceId || "N/A"}
        </td>
        <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
          {new Date(app.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </td>
        <td className="px-6 py-4">
          {getPaymentBadge(app.payment || "Pending")}
        </td>
        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/requests/${app._id}`)}
              className="text-[#041A40] transition-transform hover:scale-110 focus:outline-none flex items-center justify-center w-6 h-6"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px]"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </button>

            {app.status === "Completed" ? (
              <span className="px-3 py-1 bg-[#2e6943] text-white rounded-full text-xs font-bold whitespace-nowrap">
                Completed
              </span>
            ) : app.status === "Rejected" ? null : app.status ===
              "In Progress" ? (
              // In Progress -> sirf Complete button, X hata diya
              <button
                onClick={() => handleStatusUpdate(app._id, "Completed")}
                disabled={updatingId === app._id}
                className="px-3 py-1 rounded-full bg-[#22C55E] text-white text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Complete
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleStatusUpdate(app._id, "In Progress")}
                  disabled={updatingId === app._id}
                  className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
                <button
                  onClick={() => handleStatusUpdate(app._id, "Rejected")}
                  disabled={updatingId === app._id}
                  className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderMobileCard = (app, idx) => {
    const applicantName =
      app.formData?.applicantName ||
      app.formData?.headOfFamily ||
      app.formData?.fullName ||
      "Unknown";

    const phone = app.formData?.mobileNumber || app.formData?.phone || "N/A";

    return (
      <div
        key={app._id || idx}
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {applicantName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-gray-900 font-bold text-base leading-tight">
                {applicantName}
              </div>
              <div className="text-gray-400 text-xs font-normal mt-0.5">
                {phone}
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-500">
            {app._id?.slice(-8).toUpperCase()}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Service
          </p>
          <div className="text-gray-700 text-sm font-bold">
            {app.serviceId?.name?.en || app.serviceId || "N/A"}
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
              Submitted On
            </p>
            <p className="text-gray-800 text-sm font-bold">
              {new Date(app.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getPaymentBadge(app.payment || "Pending")}
            {getStatusBadge(app.status)}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate(`/requests/${app._id}`)}
            className="text-[#041A40] transition-transform hover:scale-110 focus:outline-none flex flex-col items-center justify-center w-8 h-8"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </button>

          {app.status === "Completed" ? (
            <span className="px-3.5 py-1.5 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold whitespace-nowrap">
              Completed
            </span>
          ) : app.status === "Rejected" ? null : app.status ===
            "In Progress" ? (
            <button
              onClick={() => handleStatusUpdate(app._id, "Completed")}
              disabled={updatingId === app._id}
              className="px-4 py-1.5 rounded-full bg-[#22C55E] text-white text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Complete
            </button>
          ) : (
            <>
              <button
                onClick={() => handleStatusUpdate(app._id, "In Progress")}
                disabled={updatingId === app._id}
                className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </button>
              <button
                onClick={() => handleStatusUpdate(app._id, "Rejected")}
                disabled={updatingId === app._id}
                className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#041A40] mb-1">Applications</h1>
        <p className="text-gray-600 font-bold text-sm">
          Review, verify and process citizen service applications.
        </p>
      </div>

      {/* Stat Cards & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5  gap-2">
        {isLoading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <div className="flex justify-end items-end h-full">
              <div className="h-10 bg-gray-200 rounded-full w-28 animate-pulse"></div>
            </div>
          </>
        ) : (
          <>
            <StatCard
              title="All Applications"
              value={applications.length}
              icon={FileText}
              iconBgColor="bg-[#FF8303]"
              trend="+30%"
              trendText="Increased than yesterday"
            />
            <StatCard
              title="Pending Applications"
              value={pendingCount}
              icon={Clock}
              iconBgColor="bg-[#FACC15]"
              trend="+30%"
              trendText="Increased than yesterday"
            />
            <StatCard
              title="Approved Applications"
              value={approvedCount}
              icon={CheckCircle2}
              iconBgColor="bg-[#22C55E]"
              trend="+30%"
              trendText="Increased than yesterday"
            />
            <StatCard
              title="Rejected Applications"
              value={rejectedCount}
              icon={XCircle}
              iconBgColor="bg-[#EF4444]"
              trend="+30%"
              trendText="Increased than yesterday"
            />
            {/* <StatCard
              title="Completed Applications"
              value={completedCound}
              icon={FaFileCircleCheck}
              iconBgColor="bg-[#FF8303]"
              trend="+30%"
              trendText="Increased than yesterday"
            /> */}
            <div className="flex justify-end items-end h-full">
              <Button icon={Download} onClick={handleExport}>
                Export
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Table Section */}
      <div
        className="rounded-3xl p-6 shadow-sm border border-slate-100"
        style={{ backgroundColor: "#D9D9D938" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl font-bold text-[#041A40]">All Applications</h2>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-no-repeat bg-[position:calc(100%-1rem)_center]"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>In Progress</option>
            </select>

            <SearchInput
              placeholder="Search user"
              showFilter={false}
              className="w-full sm:w-auto"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(isActive ? "All Status" : tab.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all border"
                style={
                  isActive
                    ? {
                        backgroundColor: tab.bg,
                        color: tab.color,
                        borderColor: tab.color,
                      }
                    : {
                        backgroundColor: "white",
                        color: "#6B7280",
                        borderColor: "#E5E7EB",
                      }
                }
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        <div className="[&_thead]:bg-[#D4F4FA]">
          <Table
            columns={columns}
            data={paginatedApplications}
            renderRow={renderRow}
            renderMobileCard={renderMobileCard}
            isLoading={isLoading}
          />
        </div>

        {!isLoading && filteredApplications.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500 font-bold">
              Showing {indexOfFirstApp + 1}-
              {Math.min(indexOfLastApp, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-[#041A40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                      currentPage === page
                        ? "bg-[#FF8303] text-white"
                        : "border border-gray-200 text-[#041A40] hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-[#041A40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
