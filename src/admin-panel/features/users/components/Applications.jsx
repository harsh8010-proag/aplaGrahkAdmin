import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getServiceName = (app) =>
  app?.service ||
  app?.serviceId?.name?.en ||
  app?.serviceId?.name?.hi ||
  app?.serviceId?.name?.mr ||
  app?.serviceId?.name ||
  "N/A";

const getPaymentLabel = (paymentStatus) => {
  const value = String(paymentStatus || "pending").toLowerCase();
  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";
  return "Pending";
};

export default function Applications({ applications }) {
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 5;

  const totalPages = Math.max(
    1,
    Math.ceil((applications?.length || 0) / applicationsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [applications]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * applicationsPerPage;
    return (applications || []).slice(startIndex, startIndex + applicationsPerPage);
  }, [applications, currentPage]);

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
        <h3 className="text-lg font-bold text-gray-700">No Applications</h3>
        <p className="text-gray-500 text-sm mt-2">
          This user has not submitted any applications yet.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[#041A40] bg-[#E1F5FE] font-bold">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Application ID</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-xl">Payment Proof</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedApplications.map((app, idx) => (
              <tr
                key={app.id || app._id || idx}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === paginatedApplications.length - 1 ? "border-none" : ""}`}
              >
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {app.applicationId || `#${(app.id || app._id || "").slice(-8).toUpperCase()}` || "N/A"}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                  {getServiceName(app)}
                </td>
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {app.submitted || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-1.5 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                      String(app.paymentStatus || "pending").toLowerCase() === "approved"
                        ? "bg-[#E6F9F0] text-[#00A962]"
                        : String(app.paymentStatus || "pending").toLowerCase() === "pending"
                          ? "bg-[#FFEAD6] text-[#FF8303]"
                          : "bg-[#FEECEB] text-[#D93025]"
                    }`}
                  >
                    {getPaymentLabel(app.paymentStatus)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-1.5 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                      app.status === "Completed"
                        ? "bg-[#E6F9F0] text-[#00A962]"
                        : app.status === "Rejected"
                          ? "bg-[#FEECEB] text-[#D93025]"
                          : "bg-[#FFEAD6] text-[#FF8303]"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-500 whitespace-nowrap">
                  {app.method || app.PaymentImage || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {paginatedApplications.map((app, idx) => (
          <div
            key={app.id || app._id || idx}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">
                {app.applicationId || `#${(app.id || app._id || "").slice(-8).toUpperCase()}` || "N/A"}
              </span>
              <span className="text-sm font-bold text-[#041A40]">
                {app.submitted || "N/A"}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#041A40]">
                {getServiceName(app)}
              </h4>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-gray-50 text-xs">
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Payment
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    String(app.paymentStatus || "pending").toLowerCase() === "approved"
                      ? "bg-[#E6F9F0] text-[#00A962]"
                      : String(app.paymentStatus || "pending").toLowerCase() === "pending"
                        ? "bg-[#FFEAD6] text-[#FF8303]"
                        : "bg-[#FEECEB] text-[#D93025]"
                  }`}
                >
                  {getPaymentLabel(app.paymentStatus)}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    app.status === "Completed"
                      ? "bg-[#E6F9F0] text-[#00A962]"
                      : app.status === "Rejected"
                        ? "bg-[#FEECEB] text-[#D93025]"
                        : "bg-[#FFEAD6] text-[#FF8303]"
                  }`}
                >
                  {app.status || "Pending"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length > applicationsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500 font-bold">
            Showing {(currentPage - 1) * applicationsPerPage + 1}-
            {Math.min(currentPage * applicationsPerPage, applications.length)} of{" "}
            {applications.length} applications
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1,
              )
              .reduce((acc, page, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== page - 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-bold"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-colors border ${
                      currentPage === item
                        ? "bg-[#FF8303] text-white border-[#FF8303] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#FF8303] hover:text-[#FF8303]"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
