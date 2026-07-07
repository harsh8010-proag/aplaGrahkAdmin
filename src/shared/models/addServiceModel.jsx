import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  
} from "../../redux/api/servicesApi";
import { useGetAllDocumentTypeQuery } from "../../redux/api/documentApi";

const DynamicInputModal = ({ isOpen, onClose, initialData }) => {
  const [fields, setFields] = useState([""]);
  const [serviceName, setServiceName] = useState("");
  const [fees, setFees] = useState("");

  const { data: docTypesResponse } = useGetAllDocumentTypeQuery(undefined, { skip: !isOpen });
  const docTypes = Array.isArray(docTypesResponse) ? docTypesResponse : docTypesResponse?.data || [];

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setServiceName(initialData.name?.en || initialData.name || "");
        setFees(initialData.priceInPaise ? (initialData.priceInPaise / 100).toString() : "");
        if (initialData.documents && initialData.documents.length > 0) {
          setFields(initialData.documents.map(d => {
            if (typeof d === 'string') return d;
            if (d.documentTypeId && typeof d.documentTypeId === 'object') return d.documentTypeId._id || '';
            return d.documentTypeId || d._id || '';
          }));
        } else {
          setFields([""]);
        }
      } else {
        setServiceName("");
        setFees("");
        setFields([""]);
      }
    }
  }, [isOpen, initialData]);

  // Add new input field
  const addField = () => {
    setFields([...fields, ""]);
  };

  // Handle input change
  const handleChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const handleSaveService = async () => {
    if (!serviceName || !fees) {
      toast.error("Please enter service name and fees");
      return;
    }
    try {
      const payload = {
        name: { en: serviceName },
        description: { en: "Service added via quick add" },
        priceInPaise: Number(fees) * 100,
        isActive: initialData ? initialData.isActive : true,
        documents: fields.filter(f => typeof f === 'string' && f.trim() !== "").map(f => {
          const selectedDocType = docTypes.find(dt => dt._id === f);
          return {
            documentTypeId: f,
            fieldKey: selectedDocType ? selectedDocType.internalKey : f,
            isRequired: true
          };
        }),
      };

      if (initialData) {
        const id = initialData._id || initialData.id;
        await updateService({ id, ...payload }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createService(payload).unwrap();
        toast.success("Service added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || `Failed to ${initialData ? 'update' : 'create'} service`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#222222]/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[500px] rounded-[32px] p-8 md:p-10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-[22px] font-semibold text-[#0B2149] mb-6">
          {initialData ? 'Update Service' : 'Create New Service'}
        </h2>

        {/* Service Name */}
        <div className="mb-5">
          <label className="block text-[15px] font-medium text-gray-800 mb-2">
            Service Name
          </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g Aadhaar Card"
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
          />
        </div>

        {/* Service Type */}
        <div className="mb-5">
          <label className="block text-[15px] font-medium text-gray-800 mb-2">
            Service type
          </label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-no-repeat bg-[position:calc(100%-1rem)_center] text-gray-600"
          >
            <option>New</option>
            <option>Update</option>
            <option>Correction</option>
          </select>
        </div>

        {/* Fees */}
        <div className="mb-5">
          <label className="block text-[15px] font-medium text-gray-800 mb-2">
            Fees
          </label>
          <input
            type="number"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="E.g 100"
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
          />
        </div>

        {/* Required Documents */}
        <div className="mb-8">
          <label className="block text-[15px] font-medium text-gray-800 mb-2">
            Required Documents
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="flex gap-3">
                <select
                  value={field}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-no-repeat bg-[position:calc(100%-1rem)_center]"
                >
                  <option value="" disabled>Select a Document</option>
                  {docTypes.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name?.en || doc.internalKey}
                    </option>
                  ))}
                </select>
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={addField}
                    className="w-[52px] h-[52px] shrink-0 bg-[#38B000] hover:bg-[#2d9200] text-white text-2xl font-light rounded-xl flex items-center justify-center transition"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Service Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleSaveService}
            disabled={isLoading}
            className={`text-white px-8 py-3.5 rounded-full text-[15px] font-medium shadow-md transition flex items-center justify-center gap-2 ${isLoading ? 'bg-orange-400 cursor-not-allowed w-40' : 'bg-[#FF8303] hover:bg-[#e67600]'
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{initialData ? '' : '+'}</span> {initialData ? 'Update Service' : 'Add Service'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicInputModal;