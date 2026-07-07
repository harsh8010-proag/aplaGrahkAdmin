import { useState } from "react";
import {
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useCreateServiceMutation } from "../../../redux/api/servicesApi";
import { useGetAllDocumentTypeQuery } from "../../../redux/api/documentApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateServiceMutation } from "../../../redux/api/servicesApi";

const LANGS = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिंदी" },
  { key: "mr", label: "मराठी" },
];

const emptyTri = { en: "", hi: "", mr: "" };

const INPUT_TYPES = [
  "text",
  "number",
  "date",
  "textarea",
  "select",
  "checkbox",
];

function TriLangInput({ label, value, onChange, textarea = false }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {LANGS.map((l) => {
          const Comp = textarea ? "textarea" : "input";
          return (
            <div key={l.key} className="relative">
              <span className="absolute left-2 top-1.5 text-[10px] font-semibold uppercase tracking-wide text-black">
                {l.key}
              </span>
              <Comp
                value={value[l.key]}
                onChange={(e) =>
                  onChange({ ...value, [l.key]: e.target.value })
                }
                placeholder={l.label}
                rows={textarea ? 3 : undefined}
                className="w-full rounded-lg border border-slate-300 bg-white pt-5 pb-2 px-2 text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateServices() {
  const [name, setName] = useState(emptyTri);
  const [description, setDescription] = useState(emptyTri);
  const [priceInPaise, setPriceInPaise] = useState("");
  const [processingTime, setProcessingTime] = useState(emptyTri);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("1");
  const [whatsappTemplate, setWhatsappTemplate] = useState(emptyTri);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();
  const editingService = location.state?.serviceToEdit || null;
  const isEditMode = Boolean(editingService);

  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const [createService, { isLoading, isError }] = useCreateServiceMutation();
  const { data: getAllDocumentType } = useGetAllDocumentTypeQuery();

  // console.log("All Document Type:", getAllDocumentType);

  useEffect(() => {
    if (!editingService) return;

    setName(editingService.name || emptyTri);
    setDescription(editingService.description || emptyTri);
    setPriceInPaise(String(editingService.priceInPaise ?? ""));
    setProcessingTime(editingService.processingTime || emptyTri);
    setIsActive(editingService.isActive ?? true);
    setDisplayOrder(String(editingService.displayOrder ?? "1"));
    setWhatsappTemplate(editingService.whatsappTemplate || emptyTri);

    if (
      Array.isArray(editingService.documents) &&
      editingService.documents.length > 0
    ) {
      setDocuments(
        editingService.documents.map((d) => ({
          documentTypeId: d.documentTypeId?._id || d.documentTypeId || "",
          isRequired: d.isRequired ?? true,
          fieldKey: d.fieldKey || "",
        })),
      );
    }

    if (
      Array.isArray(editingService.formFields) &&
      editingService.formFields.length > 0
    ) {
      setFormFields(
        editingService.formFields.map((f) => ({
          key: f.key || "",
          label: f.label || { ...emptyTri },
          inputType: f.inputType || "text",
          isRequired: f.isRequired ?? true,
          placeholder: f.placeholder || { ...emptyTri },
        })),
      );
    }

    if (editingService.iconUrl) {
      setIconPreview(editingService.iconUrl);
    }
  }, [editingService]);

  const [documents, setDocuments] = useState([
    { documentTypeId: "", isRequired: true, fieldKey: "" },
  ]);

  const [formFields, setFormFields] = useState([
    {
      key: "",
      label: { ...emptyTri },
      inputType: "text",
      isRequired: true,
      placeholder: { ...emptyTri },
    },
  ]);

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const updateDocument = (idx, patch) => {
    setDocuments((docs) =>
      docs.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    );
  };
  const addDocument = () =>
    setDocuments((docs) => [
      ...docs,
      { documentTypeId: "", isRequired: true, fieldKey: "" },
    ]);
  const removeDocument = (idx) =>
    setDocuments((docs) => docs.filter((_, i) => i !== idx));

  const updateField = (idx, patch) => {
    setFormFields((fields) =>
      fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    );
  };
  const addField = () =>
    setFormFields((fields) => [
      ...fields,
      {
        key: "",
        label: { ...emptyTri },
        inputType: "text",
        isRequired: true,
        placeholder: { ...emptyTri },
      },
    ]);
  const removeField = (idx) =>
    setFormFields((fields) => fields.filter((_, i) => i !== idx));

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Empty formFields (jinka key khali hai) filter kar do
  const cleanedFormFields = formFields.filter(
    (f) => f.key && f.key.trim() !== "",
  );

  // ✅ Empty documents (jinka documentTypeId khali hai) bhi filter kar do
  const cleanedDocuments = documents.filter(
    (d) => d.documentTypeId && d.documentTypeId.trim() !== "",
  );

  try {
    if (isEditMode) {
      // ✅ Update ke time JSON bhejna hai (curl jaisa)
      const jsonPayload = {
        name,
        description,
        priceInPaise: Number(priceInPaise),
        processingTime,
        documents: cleanedDocuments,
        formFields: cleanedFormFields,
        isActive,
        displayOrder: Number(displayOrder),
        whatsappTemplate,
      };

      await updateService({
        id: editingService._id,
        body: jsonPayload,
      }).unwrap();
      toast.success("Service updated successfully!");
    } else {
      // ✅ Create ke time FormData bhejna hai (curl jaisa)
      const fd = new FormData();
      fd.append("name", JSON.stringify(name));
      fd.append("description", JSON.stringify(description));
      fd.append("priceInPaise", priceInPaise);
      fd.append("processingTime", JSON.stringify(processingTime));
      fd.append("documents", JSON.stringify(cleanedDocuments));
      fd.append("formFields", JSON.stringify(cleanedFormFields));
      fd.append("isActive", String(isActive));
      fd.append("displayOrder", displayOrder);
      fd.append("whatsappTemplate", JSON.stringify(whatsappTemplate));
      if (iconFile) fd.append("iconFile", iconFile);

      await createService(fd).unwrap();
      toast.success("Service created successfully!");
    }

    navigate("/services");
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    const message =
      err?.data?.message ||
      err?.error ||
      err?.message ||
      "Something went wrong";
    toast.error(message);
  }
};
  return (
    <div className="min-h-screen text-black">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-8xl rounded-2xl shadow-sm border border-slate-200 text-black"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-semibold text-black">
            {isEditMode ? "Edit Service" : "Create Service"}
          </h1>
          <p className="text-sm text-black mt-1">
            Add a new government service with multilingual content, required
            documents and dynamic form fields.
          </p>
        </div>

        <div className="px-6 py-6 space-y-8 text-black">
          {/* Basic multilingual fields */}
          <section className="space-y-5 text-black">
            <TriLangInput
              label="Service Name"
              value={name}
              onChange={setName}
            />
            <TriLangInput
              label="Description"
              value={description}
              onChange={setDescription}
              textarea
            />
            <TriLangInput
              label="Processing Time"
              value={processingTime}
              onChange={setProcessingTime}
            />
            <TriLangInput
              label="WhatsApp Template"
              value={whatsappTemplate}
              onChange={setWhatsappTemplate}
              textarea
            />
          </section>

          {/* Price / order / active / icon */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
            <div>
              <label className="text-sm font-medium text-black">
                Price (in Paise)
              </label>
              <input
                type="number"
                value={priceInPaise}
                onChange={(e) => setPriceInPaise(e.target.value)}
                placeholder="e.g. 5000"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) >= 0) {
                    setDisplayOrder(val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-black"
              >
                Active (visible to users)
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-black">Icon</label>
              <div className="mt-1 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-black hover:border-indigo-400 hover:text-indigo-600 transition">
                  <UploadCloud size={16} />
                  <span>{iconFile ? iconFile.name : "Choose file"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIconChange}
                  />
                </label>
                {iconPreview && (
                  <img
                    src={iconPreview}
                    alt="icon preview"
                    className="h-12 w-12 rounded-lg object-contain border border-slate-200"
                  />
                )}
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="text-black">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-black">
                Required Documents
              </h2>
              <button
                type="button"
                onClick={addDocument}
                className="flex items-center gap-1 text-sm font-medium text-black hover:text-indigo-700"
              >
                <Plus size={16} /> Add document
              </button>
            </div>
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center rounded-lg border border-slate-200 p-3 text-black"
                >
                  <select
                    value={doc.documentTypeId}
                    onChange={(e) =>
                      updateDocument(idx, { documentTypeId: e.target.value })
                    }
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select document type</option>
                    {getAllDocumentType?.data?.map((docType) => (
                      <option key={docType._id} value={docType._id}>
                        {docType.name?.en || docType.internalKey}
                      </option>
                    ))}
                  </select>

                  <input
                    value={doc.fieldKey}
                    onChange={(e) =>
                      updateDocument(idx, { fieldKey: e.target.value })
                    }
                    placeholder="fieldKey (e.g. aadhaarCard)"
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <label className="flex items-center gap-1.5 text-xs text-black whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={doc.isRequired}
                      onChange={(e) =>
                        updateDocument(idx, { isRequired: e.target.checked })
                      }
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() => removeDocument(idx)}
                    className="p-1.5 text-black hover:text-red-600 transition justify-self-end"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Form Fields */}
          <section className="text-black">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-black">
                Application Form Fields
              </h2>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1 text-sm font-medium text-black hover:text-indigo-700"
              >
                <Plus size={16} /> Add field
              </button>
            </div>
            <div className="space-y-4">
              {formFields.map((field, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 p-4 space-y-3 text-black"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-black">
                      Field #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="p-1 text-black hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      value={field.key}
                      onChange={(e) =>
                        updateField(idx, { key: e.target.value })
                      }
                      placeholder="Enter field key"
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={field.inputType}
                      onChange={(e) =>
                        updateField(idx, { inputType: e.target.value })
                      }
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {INPUT_TYPES.map((t) => (
                        <option key={t} value={t} className="text-black">
                          {t}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-black">
                      <input
                        type="checkbox"
                        checked={field.isRequired}
                        onChange={(e) =>
                          updateField(idx, { isRequired: e.target.checked })
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Required
                    </label>
                  </div>

                  <TriLangInput
                    label="Label"
                    value={field.label}
                    onChange={(v) => updateField(idx, { label: v })}
                  />
                  <TriLangInput
                    label="Placeholder"
                    value={field.placeholder}
                    onChange={(v) => updateField(idx, { placeholder: v })}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between text-black">
          <div className="text-sm">
            {status === "success" && (
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 size={16} /> Service created successfully
              </span>
            )}
            {status === "error" && (
              <span className="flex items-center gap-1.5 text-red-600">
                <XCircle size={16} /> {errorMsg}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || isUpdating}
            className="flex items-center gap-2 rounded-lg bg-[#041A40] px-5 py-2.5 text-sm font-medium text-white cursor-pointer disabled:opacity-60 transition"
          >
            {(isLoading || isUpdating) && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {isEditMode ? "Update Service" : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
