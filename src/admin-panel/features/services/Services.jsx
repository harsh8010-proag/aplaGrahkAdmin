import React, { useState } from "react";
import { FileText, Edit2, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import Button from "../../../shared/components/Button";
import DynamicInputModal from "../../../shared/models/addServiceModel";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import {
  useGetServicesQuery,
  useToggleServiceStatusMutation,
  useDeleteServiceMutation,
  
} from "../../../redux/api/servicesApi";

export default function Services() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("soft");
  const [activeTab, setActiveTab] = useState("active"); // "active" | "deleted"
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8;

  const { data: servicesResponse, isLoading, isError } = useGetServicesQuery();
  const [toggleStatus] = useToggleServiceStatusMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const navigate = useNavigate();

  const services = Array.isArray(servicesResponse)
    ? [...servicesResponse].reverse()
    : [...(servicesResponse?.data || [])].reverse();

  // Split active and soft deleted services
  const activeTabServices = services.filter((s) => !s.isDeleted);
  const deletedTabServices = services.filter((s) => s.isDeleted);
  
  const servicesToDisplay = activeTab === "active" ? activeTabServices : deletedTabServices;

  // Pagination calculations
  const totalPages = Math.ceil(servicesToDisplay.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const paginatedServices = servicesToDisplay.slice(
    indexOfFirstService,
    indexOfLastService,
  );
  console.log(paginatedServices);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const serviceToDeleteObj = services.find((s) => (s._id || s.id) === serviceToDelete);

  const handleToggle = async (id, currentStatus, isDeleted) => {
    try {
      await toggleStatus({ id, isActive: !currentStatus }).unwrap();
      if (isDeleted && !currentStatus) {
        toast.success("Service restored and activated successfully");
      } else {
        toast.success(
          `Service ${!currentStatus ? "activated" : "deactivated"} successfully`,
        );
      }
    } catch (err) {
      console.error("Toggle failed", err);
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    const isAlreadySoftDeleted = serviceToDeleteObj?.isDeleted;
    const shouldSoftDelete = isAlreadySoftDeleted ? false : (deleteType === "soft");

    try {
      await deleteService({ id: serviceToDelete, soft: shouldSoftDelete }).unwrap();
      toast.success(
        shouldSoftDelete
          ? "Service deactivated successfully (soft delete)"
          : "Service permanently deleted"
      );
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.data?.message || "Failed to delete service");
    } finally {
      setServiceToDelete(null);
      setDeleteType("soft");
    }
  };

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-[32px] font-bold text-[#041A40] mb-1">
            Services
          </h1>
          <p className="text-sm font-bold text-gray-700">
            Configure citizen services, fees, and document requirements.
          </p>
        </div>
        <Button className="px-5" onClick={() => navigate("/add-service")}>
          <div className="flex items-center space-x-1">
            <span className="text-xl leading-none -mt-0.5">+</span>
            <span>Add Service</span>
          </div>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTabChange("active")}
          className={`pb-3 px-6 font-bold text-sm transition-all relative outline-none focus:outline-none cursor-pointer ${
            activeTab === "active"
              ? "text-[#FF8303]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active / Inactive Services ({activeTabServices.length})
          {activeTab === "active" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF8303] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => handleTabChange("deleted")}
          className={`pb-3 px-6 font-bold text-sm transition-all relative outline-none focus:outline-none cursor-pointer ${
            activeTab === "deleted"
              ? "text-[#EF4444]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Deleted Services ({deletedTabServices.length})
          {activeTab === "deleted" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#EF4444] rounded-t-full" />
          )}
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="bg-[#D9D9D938] rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col"
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-gray-200 animate-pulse"></div>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="w-[42px] h-6 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-5"></div>

              {/* Fees and Time */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="border border-gray-200 rounded-xl px-3 py-2 bg-white/50">
                  <div className="h-2 bg-gray-200 rounded animate-pulse w-8 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
                <div className="border border-gray-200 rounded-xl px-3 py-2 bg-white/50">
                  <div className="h-2 bg-gray-200 rounded animate-pulse w-8 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="mt-auto">
                <div className="h-2 bg-gray-200 rounded animate-pulse w-24 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10">
          Failed to load services.
        </div>
      ) : servicesToDisplay.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {activeTab === "deleted" ? (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-300" />
              </div>
              <h3 className="text-base font-bold text-gray-500 mb-1">No deleted services</h3>
              <p className="text-sm text-gray-400">Services you soft-delete will appear here.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-orange-300" />
              </div>
              <h3 className="text-base font-bold text-gray-500 mb-1">No services found</h3>
              <p className="text-sm text-gray-400">Add one to get started.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedServices.map((service) => {
            const id = service._id || service.id;
            const title = service.name?.en || service.name || "Unnamed Service";
            const isActive = service.isActive;
            const isDeleted = service.isDeleted;
            const isInactiveOrDeleted = !isActive || isDeleted;
            const processed = "0 Applications Processed";
            const fees = service.price
              ? `₹${service.price}`
              : "₹0";
            const time = service.processingTime?.en || "Standard";
            const docs = Array.isArray(service.documents)
              ? service.documents
              : [];

            return (
              <div
                key={id}
                className={`bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FF8303]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group relative ${
                  isInactiveOrDeleted ? "opacity-60 bg-gray-50/50" : ""
                }`}
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-orange-50 group-hover:bg-[#FF8303] rounded-full flex items-center justify-center text-[#FF8303] group-hover:text-white shrink-0 shadow-sm transition-colors duration-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    {isDeleted ? (
                      <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded-full text-[10px] font-bold text-red-500 shadow-sm">
                        Soft Deleted
                      </span>
                    ) : !isActive ? (
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 shadow-sm">
                        Inactive
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    {/* Toggle — hidden for soft-deleted services */}
                    {!isDeleted && (
                      <button
                        onClick={() => handleToggle(id, isActive, isDeleted)}
                        className={`w-[42px] h-6 shrink-0 rounded-full relative transition-colors duration-200 focus:outline-none border-2 ${isActive
                          ? "bg-[#041A40] border-[#041A40]"
                          : "bg-white border-[#041A40] cursor-pointer"
                          }`}
                      >
                        <span
                          className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full transition-transform duration-200 ${isActive
                            ? "bg-white translate-x-[18px]"
                            : "bg-[#041A40] translate-x-0"
                            }`}
                        ></span>
                      </button>
                    )}

                    {/* Edit */}
                    {!isDeleted && (
                      <button
                        onClick={() =>
                          navigate("/add-service", {
                            state: { serviceToEdit: service },
                          })
                        }
                        className="text-[#FF8303] hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setServiceToDelete(id);
                        if (isDeleted) {
                          setDeleteType("hard");
                        } else {
                          setDeleteType("soft");
                        }
                      }}
                      className="text-[#EF4444] hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    </button>

                    <button
                      onClick={() => navigate(`/services/${id}`)}
                      className="text-[#041A40] hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                    >
                      <IoEye className="text-[#041A40]" size={22} />
                    </button>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-[#041A40] mb-1">
                  {title}
                </h3>
                <p className="text-xs font-bold text-gray-500 mb-4">
                  {processed}
                </p>

                {/* Fees and Time */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {/* Fees Card */}
                  <div className="border border-[#F6D1A8] group-hover:border-[#FF8303]/50 transition-colors duration-300 rounded-xl px-3 py-2 bg-white">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">
                      Fees
                    </p>
                    <p className="text-sm font-bold text-gray-900">{fees}</p>
                  </div>

                  {/* Time Card */}
                  <div className="border border-[#F6D1A8] group-hover:border-[#FF8303]/50 transition-colors duration-300 rounded-xl px-3 py-2 bg-white">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">
                      Time
                    </p>
                    <p className="text-sm font-bold text-gray-900">{time}</p>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="mt-auto">
                  <p className="text-[11px] text-gray-400 font-bold mb-2">
                    Required Documents
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {docs.length > 0 ? (
                      docs.map((doc, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-50 border border-gray-200 group-hover:border-gray-300 transition-colors duration-300 rounded-full text-[11px] font-bold text-gray-600 shadow-sm"
                        >
                          {doc.fieldKey || `Document ${i + 1}`}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400">
                        No documents required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <DynamicInputModal
        isOpen={isModelOpen}
        initialData={serviceToEdit}
        onClose={() => {
          setIsModelOpen(false);
          setServiceToEdit(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!serviceToDelete}
        title="Delete Service"
        message={
          serviceToDeleteObj?.isDeleted ? (
            <div className="space-y-4">
              <p className="text-gray-700 text-sm">
                This service <span className="font-bold">"{serviceToDeleteObj?.name?.en || serviceToDeleteObj?.name || 'Unnamed'}"</span> is already soft-deleted (deactivated).
              </p>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-red-700 text-sm font-semibold">
                  Are you sure you want to permanently purge this service? This action is irreversible, and any dependent user applications will block this deletion.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete this service? Select the deletion type:
              </p>
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="flex items-start space-x-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="deleteType"
                    value="soft"
                    checked={deleteType === "soft"}
                    onChange={() => setDeleteType("soft")}
                    className="mt-0.5 text-[#FF8303] focus:ring-[#FF8303] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#041A40]">Soft Delete / Deactivate (Default)</span>
                    <p className="text-xs text-gray-500 mt-0.5">Safe for compliance, preserves service details and audit history.</p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 text-sm text-gray-700 cursor-pointer border-t border-gray-200 pt-3">
                  <input
                    type="radio"
                    name="deleteType"
                    value="hard"
                    checked={deleteType === "hard"}
                    onChange={() => setDeleteType("hard")}
                    className="mt-0.5 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-red-600">Hard Delete / Purge</span>
                    <p className="text-xs text-red-400 mt-0.5">Permanently removes this record from the database. Note that linked applications will prevent deletion.</p>
                  </div>
                </label>
              </div>
            </div>
          )
        }
        confirmText={
          serviceToDeleteObj?.isDeleted
            ? "Purge Permanently"
            : deleteType === "soft"
            ? "Deactivate"
            : "Purge Permanently"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setServiceToDelete(null);
          setDeleteType("soft");
        }}
        isLoading={isDeleting}
      />

      {/* Pagination */}
      {!isLoading && !isError && servicesToDisplay.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500 font-bold">
            Showing {indexOfFirstService + 1}-
            {Math.min(indexOfLastService, servicesToDisplay.length)} of {servicesToDisplay.length}{" "}
            {activeTab === "deleted" ? "deleted services" : "services"}
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-[#041A40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${currentPage === page
                  ? "bg-[#FF8303] text-white"
                  : "border border-gray-200 text-[#041A40] hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            ))}

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

      {/* Add/Edit Service Modal */}
      <DynamicInputModal
        isOpen={isModelOpen}
        initialData={serviceToEdit}
        onClose={() => {
          setIsModelOpen(false);
          setServiceToEdit(null);
        }}
      />
    </div>
  );
}
