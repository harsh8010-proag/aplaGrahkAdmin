import React, { useState, useMemo } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  XCircle,
  Download,
  Check,
  X,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import StatCard from "../../../shared/components/StatCard";
import Button from "../../../shared/components/Button";
import SearchInput from "../../../shared/components/SearchInput";
import Table from "../../../shared/components/Table";
import {
  useGetAplicationsQuery,
  useUpdateApplicationPaymentStatusMutation,
} from "../../../redux/api/applicationsApi";

const ITEMS_PER_PAGE = 6;

// Normalize whatever the API sends into "Success" | "Failed" | "Pending"
const normalizePaymentStatus = (status) => {
  const s = (status || "").toString().trim().toLowerCase();
  if (s === "success" || s === "approved" || s === "completed" || s === "paid")
    return "Success";
  if (s === "failed" || s === "rejected" || s === "declined") return "Failed";
  return "Pending";
};

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
};

const getInitials = (name) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
};

export default function Payments() {
  const navigate = useNavigate();
  const {
    data: allApplication,
    isLoading,
    isError,
    refetch,
  } = useGetAplicationsQuery();
  const [updateApplicationPaymentStatus] =
    useUpdateApplicationPaymentStatusMutation();

  // Local overrides so Approve/Reject reflect instantly in UI while the mutation is in flight.
  const [statusOverrides, setStatusOverrides] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All"); // "All" | "Success" | "Failed"
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns = [
    "Transaction ID",
    "User Name",
    "applicationId",
    "Payment",
    "Date",
    "Amount",
    "Screenshot",
    "Action",
  ];

  // Map raw API application objects into the shape the table needs
  const mappedPayments = useMemo(() => {
    const apps = allApplication?.applications || [];

    return apps.map((app) => {
      const id = app._id
      const userName =
        app.userId?.name ||
        app.formData?.applicantName ||
        app.formData?.headOfFamily ||
        "Unknown";
      const phone = app.userId?.mobileNumber || "-";
      const applicationId = app._id?.slice(-8).toUpperCase() || app.id || "-";
      const amount = app.serviceId?.price || app.formData?.amount || "-";

      // Payment screenshot: primarily the top-level PaymentImage field,
      // fall back to an uploaded document with fieldKey "paymentScreenshot" if present
      const screenshotDoc = app.uploadedDocuments?.find(
        (doc) => doc.fieldKey === "paymentScreenshot",
      );
      const screenshot = app.PaymentImage || screenshotDoc?.fileUrl || null;

      const rawStatus = app.paymentStatus || app.status;
      const payment = statusOverrides[id] || normalizePaymentStatus(rawStatus);

      return {
        id,
        transactionId: id ? `TXN-${id.slice(-7).toUpperCase()}` : "-",
        userName,
        phone,
        applicationId,
        payment,
        date: formatDate(app.createdAt),
        rawDate: app.createdAt, // kept for sorting
        amount: amount !== "-" ? `₹${amount}` : "-",
        screenshot,
      };
    });
  }, [allApplication, statusOverrides]);

  // Newest first — latest added application shows at the top
  const sortedPayments = useMemo(() => {
    return [...mappedPayments].sort(
      (a, b) => new Date(b.rawDate) - new Date(a.rawDate),
    );
  }, [mappedPayments]);

  // Counts for the status tabs (always computed from the full list, not the filtered one)
  const approveCount = mappedPayments.filter(
    (p) => p.payment === "Success",
  ).length;
  const rejectCount = mappedPayments.filter(
    (p) => p.payment === "Failed",
  ).length;

  const statusTabs = [
    {
      key: "All",
      label: "All",
      count: mappedPayments.length,
      color: "#041A40",
      bg: "#E5E7EB",
    },
    {
      key: "Success",
      label: "Approve",
      count: approveCount,
      color: "#22C55E",
      bg: "#DCFCE7",
    },
    {
      key: "Failed",
      label: "Reject",
      count: rejectCount,
      color: "#EF4444",
      bg: "#FEE2E2",
    },
  ];

  // Apply the active tab filter + search
  const filteredPayments = useMemo(() => {
    let result = activeFilter === "All" ? sortedPayments : sortedPayments.filter((p) => p.payment === activeFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((p) =>
        p.userName.toLowerCase().includes(q) ||
        p.transactionId.toLowerCase().includes(q) ||
        p.applicationId.toLowerCase().includes(q)
      );
    }
    return result;
  }, [sortedPayments, activeFilter, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / ITEMS_PER_PAGE),
  );

  // Clamp current page in case data shrinks (e.g. after filtering)
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, safePage]);

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setCurrentPage(1); // reset to first page whenever the filter changes
  };

  const failedCount = rejectCount;

  const getPaymentBadge = (payment) => {
    if (payment === "Success") {
      return (
        <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
          Success
        </span>
      );
    }
    if (payment === "Failed") {
      return (
        <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
          Failed
        </span>
      );
    }
    return (
      <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold w-[80px] inline-flex justify-center">
        {payment}
      </span>
    );
  };

  // Approve / Reject handlers — call the real mutation with the enum values
  // the backend expects ("pending" | "rejected" | "approved") and the current
  // application's _id.
  const handleApprove = async (id) => {
    try {
      setUpdatingId(id);

      await updateApplicationPaymentStatus({
        id,
        status: "approved",
      }).unwrap();

      refetch();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setUpdatingId(id);

      await updateApplicationPaymentStatus({
        id,
        status: "rejected",
      }).unwrap();

      refetch();
    } finally {
      setUpdatingId(null);
    }
  };

  // Screenshot cell — just displays the payment screenshot the user uploaded (image or PDF)
  const renderScreenshotCell = (txn) => {
    if (!txn.screenshot) {
      return (
        <span className="text-xs font-bold text-gray-400">Not uploaded</span>
      );
    }

    const isPdf = txn.screenshot.toLowerCase().endsWith(".pdf");

    return (
      <a
        href={txn.screenshot}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#FF8303] font-bold text-xs hover:underline w-fit"
      >
        {isPdf ? (
          <span className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-gray-500" />
          </span>
        ) : (
          <img
            src={txn.screenshot}
            alt="payment screenshot"
            className="w-9 h-9 rounded-lg object-cover border border-gray-200"
          />
        )}
        <Eye size={14} />

      </a>
    );
  };

  // Action cell (Approve / Reject, or a status label once decided)
  const renderActionCell = (txn) => {
    if (txn.payment === "Success") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#22C55E] rounded-full text-xs font-bold w-fit">
          <Check size={13} strokeWidth={3} />
          Completed
        </span>
      );
    }

    if (txn.payment === "Failed") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-bold w-fit">
          <X size={13} strokeWidth={3} />
          Rejected
        </span>
      );
    }

    // Pending / any other status -> show action buttons
    const isUpdating = updatingId === txn.id;

    if (isUpdating) {
      return (
        <div className="flex items-center gap-1 px-3 py-2">
          <span className="w-2 h-2 bg-[#FF8303] rounded-full animate-bounce"></span>
          <span
            className="w-2 h-2 bg-[#FF8303] rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-2 h-2 bg-[#FF8303] rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleApprove(txn.id)}
          title="Approve"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#DCFCE7] text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors"
        >
          <Check size={16} strokeWidth={3} />
        </button>

        <button
          onClick={() => handleReject(txn.id)}
          title="Reject"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>
    );
  };

  const renderRow = (txn, idx) => (

    <tr
      key={txn.id || idx}
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === paginatedPayments.length - 1 ? "border-none" : ""
        }`}
    >
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.transactionId}
      </td>
      <td className="px-6 py-4 font-bold flex items-center space-x-3 whitespace-nowrap">
        <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
          {getInitials(txn.userName)}
        </div>
        <div>
          <div className="text-gray-900">{txn.userName}</div>
          <div className="text-gray-400 font-normal text-xs">{txn.phone}</div>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        <button
          type="button"
          onClick={() => navigate(`/requests/${txn.id}`)}
          className="text-[#FF8303] hover:text-[#c96500] hover:underline transition-colors"
          title="Open application details"
        >
          {txn.applicationId}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getPaymentBadge(txn.payment)}
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.date}
      </td>
      <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
        {txn.amount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {renderScreenshotCell(txn)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{renderActionCell(txn)}</td>
    </tr>
  );

  const renderMobileCard = (txn, idx) => (
    <div
      key={txn.id || idx}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {getInitials(txn.userName)}
          </div>
          <div>
            <div className="text-gray-900 font-bold text-base leading-tight">
              {txn.userName}
            </div>
            <div className="text-gray-400 text-xs font-normal mt-0.5">
              {txn.phone}
            </div>
          </div>
        </div>
        <div className="text-xs font-bold text-gray-500">
          {txn.transactionId}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/requests/${txn.id}`)}
        className="text-left"
      >
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
          Application ID
        </p>
        <p className="text-[#FF8303] font-bold text-sm hover:underline inline-flex">
          {txn.applicationId}
        </p>
      </button>

      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Date
          </p>
          <p className="text-gray-800 text-sm font-bold">{txn.date}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getPaymentBadge(txn.payment)}
          <p className="text-gray-800 text-sm font-bold mt-1">{txn.amount}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Screenshot
          </p>
          {renderScreenshotCell(txn)}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 text-right">
            Action
          </p>
          {renderActionCell(txn)}
        </div>
      </div>
    </div>
  );

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-xs font-bold text-gray-500">
          Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(safePage * ITEMS_PER_PAGE, filteredPayments.length)} of{" "}
          {filteredPayments.length}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF8303] hover:text-[#FF8303] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${num === safePage
                ? "bg-[#FF8303] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#FF8303] hover:text-[#FF8303]"
                }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF8303] hover:text-[#FF8303] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#041A40] mb-1">Payments</h1>
        <p className="text-gray-600 font-bold text-sm">
          Track every rupee transactions, settlements.
        </p>
      </div>

      {/* Stat Cards & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Applications"
          value={mappedPayments.length}
          icon={CreditCard}
          iconBgColor="bg-[#FF8303]"
          trend=""
          trendText="All time"
        />
        <StatCard
          title="Failed Payments"
          value={String(failedCount).padStart(2, "0")}
          icon={XCircle}
          iconBgColor="bg-[#EF4444]"
          trend=""
          trendText="All time"
        />

        {/* Empty slots for 3rd and 4th column */}
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>

        {/* Export Button in 5th column space */}
        <div className="flex justify-end items-end h-full">
          <Button icon={Download}>Export</Button>
        </div>
      </div>

      {/* Table Section */}
      <div
        className="rounded-3xl p-6 shadow-sm border border-slate-100"
        style={{ backgroundColor: "#D9D9D938" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#041A40]">
              All Payments
            </h2>

            {/* Status filter tabs */}
            <div className="flex flex-wrap items-center gap-3">
              {statusTabs.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() =>
                      handleFilterChange(
                        isActive && tab.key !== "All" ? "All" : tab.key,
                      )
                    }
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
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <select className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-no-repeat bg-[position:calc(100%-1rem)_center]">
              <option>All Status</option>
              <option>Success</option>
              <option>Failed</option>
              <option>Pending</option>
            </select>

            <SearchInput
              placeholder="Search user"
              showFilter={false}
              className="w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <button
              onClick={refetch}
              disabled={isLoading}
              title="Refresh"
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {isLoading && (
          <p className="text-center text-sm font-bold text-gray-500 py-10">
            Loading applications...
          </p>
        )}

        {isError && (
          <p className="text-center text-sm font-bold text-red-500 py-10">
            Failed to load applications.{" "}
            <button onClick={refetch} className="underline">
              Retry
            </button>
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="[&_thead]:bg-[#D4F4FA]">
              <Table
                columns={columns}
                data={paginatedPayments}
                renderRow={renderRow}
                renderMobileCard={renderMobileCard}
              />
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
