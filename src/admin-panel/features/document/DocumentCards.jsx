import React, { useState } from "react";
import { FileText, Edit2, Trash2 } from "lucide-react";
// import AddDocumentModal from "./AddDocument";
import { useNavigate } from "react-router-dom";
import {
  useGetAllDocumentTypeQuery,
  useToggleDocumentTypeStatusMutation,
  useDeleteDocumentTypeMutation,
} from "../../../redux/api/documentApi";
import toast from "react-hot-toast";

const DocumentCards = () => {
  // const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteDocumentType] = useDeleteDocumentTypeMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 8;

  const navigate = useNavigate();

  const {
    data: getAllDocumentType,
    isLoading,
    isError,
  } = useGetAllDocumentTypeQuery();

  const allDocuments = getAllDocumentType?.data || [];

  // Newest document pehle dikhane ke liye
  const sortedDocuments = [...allDocuments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedDocuments.length / documentsPerPage);
  const indexOfLastDoc = currentPage * documentsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
  const paginatedDocuments = sortedDocuments.slice(
    indexOfFirstDoc,
    indexOfLastDoc,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const [toggleDocumentTypeStatus] = useToggleDocumentTypeStatusMutation();

  const handleToggle = async (document) => {
    try {
      await toggleDocumentTypeStatus({
        id: document._id,
        isActive: !document.isActive,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocumentType(id).unwrap();
      toast.success("Document Deleted Successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#041A40] mb-1">
            Documents
          </h1>
          <p className="text-sm font-bold text-gray-700">
            Configure citizen services, fees, and document requirements.
          </p>
        </div>

        <button
          className="bg-[#FF8303] text-white px-5 py-2 rounded-xl font-semibold"
          onClick={() => {
            navigate("/document/add");
          }}
        >
          + Add Document
        </button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="bg-[#D9D9D938] rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-gray-200 animate-pulse"></div>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-6 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-5"></div>

              {/* Fee & Time */}
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

              {/* Allowed Formats */}
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
          Failed to load documents.
        </div>
      ) : allDocuments?.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No documents found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedDocuments?.map((document) => (
            <div
              key={document.id}
              className="bg-[#D9D9D938] rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#FF8303] rounded-full flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle UI */}
                  <div
                    onClick={() => handleToggle(document)}
                    className={`w-[42px] h-6 rounded-full border-2 relative cursor-pointer ${
                      document.isActive
                        ? "bg-[#041A40] border-[#041A40]"
                        : "bg-white border-[#041A40]"
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform ${
                        document.isActive
                          ? "bg-white translate-x-[18px]"
                          : "bg-[#041A40]"
                      }`}
                    ></span>
                  </div>

                  <button
                    className="text-[#FF8303]"
                    onClick={() => {
                      navigate("/document/add", {
                        state: {
                          editData: document,
                        },
                      });
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(document._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#041A40]">
                {document.title}
              </h3>

              <p className="text-xs font-bold text-gray-500 mb-5">
                {document.internalKey}
              </p>

              {/* Fee & Time */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="border border-[#F6D1A8] rounded-xl px-3 py-2 bg-white">
                  <p className="text-[11px] text-gray-400">Fees</p>
                  <p className="text-sm font-bold">{document.fees}</p>
                </div>

                <div className="border border-[#F6D1A8] rounded-xl px-3 py-2 bg-white">
                  <p className="text-[11px] text-gray-400">Time</p>
                  <p className="text-sm font-bold">{document.time}</p>
                </div>
              </div>

              {/* Documents */}
              <div className="mt-auto">
                <p className="text-[11px] text-gray-400 font-bold mb-2">
                  Required Documents
                </p>

                <div className="flex flex-wrap gap-2">
                  {document.allowedFormats.map((doc, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-bold text-gray-600"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && sortedDocuments.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500 font-bold">
            Showing {indexOfFirstDoc + 1}-
            {Math.min(indexOfLastDoc, sortedDocuments.length)} of{" "}
            {sortedDocuments.length} documents
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
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                  currentPage === page
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
    </div>
  );
};

export default DocumentCards;
