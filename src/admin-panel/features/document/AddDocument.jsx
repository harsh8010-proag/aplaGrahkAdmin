import React, { useState, useEffect } from "react";
import {
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
} from "../../../redux/api/documentApi";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AddDocumentModal = () => {
  // if (!isOpen) return null;

  const [createDocumentType, { isLoading }] = useCreateDocumentTypeMutation();
  const [updateDocumentType, { isLoading: isUpdating }] =
    useUpdateDocumentTypeMutation();

  const location = useLocation();

  const editData = location.state?.editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        internalKey: editData.internalKey || "",
        name: {
          en: editData.name?.en || "",
          hi: editData.name?.hi || "",
          mr: editData.name?.mr || "",
        },
        allowedFormats: editData.allowedFormats || [],
        maxSizeBytes: editData.maxSizeBytes
          ? editData.maxSizeBytes / (1024 * 1024)
          : "",
        sampleImageUrl: editData.sampleImageUrl || "",
        defaultInstructions: {
          en: editData.defaultInstructions?.en || "",
          hi: editData.defaultInstructions?.hi || "",
          mr: editData.defaultInstructions?.mr || "",
        },
        isActive: editData.isActive,
      });
    } else {
      setFormData({
        internalKey: "",
        name: {
          en: "",
          hi: "",
          mr: "",
        },
        allowedFormats: [],
        maxSizeBytes: "",
        sampleImageUrl: "",
        defaultInstructions: {
          en: "",
          hi: "",
          mr: "",
        },
        isActive: true,
      });
    }
  }, [editData]);

  const [formData, setFormData] = useState({
    internalKey: "",
    name: {
      en: "",
      hi: "",
      mr: "",
    },
    allowedFormats: [],
    maxSizeBytes: "",
    sampleImageUrl: "",
    defaultInstructions: {
      en: "",
      hi: "",
      mr: "",
    },
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("name.")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          [key]: value,
        },
      }));
      return;
    }

    if (name.startsWith("defaultInstructions.")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        defaultInstructions: {
          ...prev.defaultInstructions,
          [key]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormatChange = (format) => {
    setFormData((prev) => ({
      ...prev,
      allowedFormats: prev.allowedFormats.includes(format)
        ? prev.allowedFormats.filter((item) => item !== format)
        : [...prev.allowedFormats, format],
    }));
  };

  const handleSubmit = async () => {
    try {
      await createDocumentType({
        ...formData,
        maxSizeBytes: Number(formData.maxSizeBytes) * 1024 * 1024,
      }).unwrap();

      toast.success("Document Created Successfully");
      navigate("/document");

      setFormData({
        internalKey: "",
        name: {
          en: "",
          hi: "",
          mr: "",
        },
        allowedFormats: [],
        maxSizeBytes: "",
        sampleImageUrl: "",
        defaultInstructions: {
          en: "",
          hi: "",
          mr: "",
        },
        isActive: true,
      });
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDocumentType({
        id: editData._id,
        data: {
          ...formData,
          maxSizeBytes: Number(formData.maxSizeBytes) * 1024 * 1024,
        },
      }).unwrap();

      toast.success("Document Updated Successfully");
      navigate("/document");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className=" p-0">
      <div className=" rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto p-0 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#041A40]">
            {editData ? "Edit Document Type" : "Add Document Type"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Internal Key */}
          <div>
            <label className="text-sm font-semibold">Internal Key</label>
            <input
              type="text"
              name="internalKey"
              value={formData.internalKey}
              onChange={handleChange}
              placeholder="aadhaar_card"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* Max Size */}
          <div>
            <label className="text-sm font-semibold">Max Size (MB)</label>
            <input
              type="number"
              name="maxSizeBytes"
              value={formData.maxSizeBytes}
              onChange={handleChange}
              placeholder="5"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* English */}
          <div>
            <label className="text-sm font-semibold">Name (English)</label>
            <input
              type="text"
              name="name.en"
              value={formData.name.en}
              onChange={handleChange}
              placeholder="Aadhaar Card"
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          {/* Hindi */}
          <div>
            <label className="text-sm font-semibold">Name (Hindi)</label>
            <input
              type="text"
              name="name.hi"
              value={formData.name.hi}
              onChange={handleChange}
              placeholder="आधार कार्ड"
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          {/* Marathi */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Name (Marathi)</label>
            <input
              type="text"
              name="name.mr"
              value={formData.name.mr}
              onChange={handleChange}
              placeholder="आधार कार्ड"
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          {/* Sample URL */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Sample Image URL</label>
            <input
              type="text"
              name="sampleImageUrl"
              value={formData.sampleImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/sample.jpg"
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>
        </div>

        {/* Allowed Formats */}
        <div className="mt-6">
          <label className="text-sm font-semibold">Allowed Formats</label>

          <div className="flex flex-wrap gap-5 mt-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowedFormats.includes("image/jpeg")}
                onChange={() => handleFormatChange("image/jpeg")}
              />
              JPEG
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowedFormats.includes("image/png")}
                onChange={() => handleFormatChange("image/png")}
              />
              PNG
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowedFormats.includes("application/pdf")}
                onChange={() => handleFormatChange("application/pdf")}
              />
              PDF
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold">
              Instructions (English)
            </label>
            <textarea
              rows={3}
              name="defaultInstructions.en"
              value={formData.defaultInstructions.en}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Instructions (Hindi)
            </label>
            <textarea
              rows={3}
              name="defaultInstructions.hi"
              value={formData.defaultInstructions.hi}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Instructions (Marathi)
            </label>
            <textarea
              rows={3}
              name="defaultInstructions.mr"
              value={formData.defaultInstructions.mr}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3 resize-none"
            />
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3 mt-6">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span className="font-medium">Active</span>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={editData ? handleUpdate : handleSubmit}
            disabled={editData ? isUpdating : isLoading}
            className="px-6 py-3 bg-[#FF8303] text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
          >
            {editData
              ? isUpdating
                ? "Updating..."
                : "Update Document"
              : isLoading
                ? "Saving..."
                : "Save Document"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;
