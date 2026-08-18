import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Loader2,
  Paperclip,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Eye,
} from "lucide-react";
import {
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
} from "../../../redux/api/documentApi";
import toast from "react-hot-toast";

const emptyBi = { en: "", mr: "" };

const formatOptions = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WEBP" },
  { value: "application/pdf", label: "PDF" },
];

const defaultForm = {
  internalKey: "",
  name: { ...emptyBi },
  allowedFormats: [],
  maxSizeMb: "",
  defaultInstructions: { ...emptyBi },
  isActive: true,
};

const Section = ({ title, description, icon: Icon, children, action }) => (
  <section className="rounded-xl border border-slate-200 bg-white">
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#041A40]/5 text-[#041A40]">
          <Icon size={16} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {action}
    </div>
    <div className="px-4 py-4">{children}</div>
  </section>
);

export default function AddDocumentModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  const [createDocumentType, { isLoading }] = useCreateDocumentTypeMutation();
  const [updateDocumentType, { isLoading: isUpdating }] =
    useUpdateDocumentTypeMutation();

  const [formData, setFormData] = useState(defaultForm);
  const [sampleImageFile, setSampleImageFile] = useState(null);
  const [sampleImagePreview, setSampleImagePreview] = useState("");
  const [sampleImageCleared, setSampleImageCleared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const blobUrlRef = useRef("");

  useEffect(() => {
    if (!editData) {
      setFormData(defaultForm);
      setSampleImageFile(null);
      setSampleImagePreview("");
      setSampleImageCleared(false);
      return;
    }

    setFormData({
      internalKey: editData.internalKey || "",
      name: {
        en: editData.name?.en || "",
        mr: editData.name?.mr || "",
      },
      allowedFormats: editData.allowedFormats || [],
      maxSizeMb: editData.maxSizeBytes
        ? String(Math.round(editData.maxSizeBytes / (1024 * 1024)))
        : "",
      defaultInstructions: {
        en: editData.defaultInstructions?.en || "",
        mr: editData.defaultInstructions?.mr || "",
      },
      isActive: editData.isActive ?? true,
    });
    setSampleImageFile(null);
    setSampleImagePreview(editData.sampleImageUrl || "");
    setSampleImageCleared(false);
  }, [editData]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const isEditMode = Boolean(editData);
  const isSaving = isLoading || isUpdating;

  const selectedFormats = useMemo(
    () =>
      formatOptions.filter((format) =>
        formData.allowedFormats.includes(format.value),
      ),
    [formData.allowedFormats],
  );

  const toInternalKey = (value = "") =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  useEffect(() => {
    if (isEditMode) return;
    const nextKey = toInternalKey(formData.name.en);
    setFormData((prev) =>
      prev.internalKey === nextKey ? prev : { ...prev, internalKey: nextKey },
    );
  }, [formData.name.en, isEditMode]);

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("name.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        name: { ...prev.name, [key]: value },
      }));
      return;
    }

    if (name.startsWith("defaultInstructions.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        defaultInstructions: { ...prev.defaultInstructions, [key]: value },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleFormat = (value) => {
    setFormData((prev) => ({
      ...prev,
      allowedFormats: prev.allowedFormats.includes(value)
        ? prev.allowedFormats.filter((item) => item !== value)
        : [...prev.allowedFormats, value],
    }));
  };

  const handleSampleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file for the sample preview.");
      return;
    }

    if (blobUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    blobUrlRef.current = previewUrl;
    setSampleImageFile(file);
    setSampleImagePreview(previewUrl);
    setSampleImageCleared(false);
  };

  const clearSampleImage = () => {
    if (blobUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = "";
    setSampleImageFile(null);
    setSampleImagePreview("");
    setSampleImageCleared(Boolean(editData?.sampleImageUrl));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const buildPayload = () => {
    const payload = new FormData();
    const internalKey = isEditMode
      ? formData.internalKey.trim()
      : toInternalKey(formData.name.en);

    if (internalKey) payload.append("internalKey", internalKey);
    payload.append("name", JSON.stringify(formData.name));
    payload.append("allowedFormats", JSON.stringify(formData.allowedFormats));
    if (formData.maxSizeMb !== "") {
      payload.append(
        "maxSizeBytes",
        String(Number(formData.maxSizeMb) * 1024 * 1024),
      );
    }
    payload.append(
      "defaultInstructions",
      JSON.stringify(formData.defaultInstructions),
    );
    payload.append("isActive", String(formData.isActive));

    if (sampleImageFile) {
      payload.append("sampleImage", sampleImageFile);
    } else if (sampleImageCleared) {
      payload.append("sampleImageUrl", "");
    }

    return payload;
  };

  const validate = () => {
    if (!formData.name.en.trim()) {
      toast.error("English document name is required.");
      return false;
    }
    if (!isEditMode && !sampleImageFile) {
      toast.error("Please upload a sample image.");
      return false;
    }
    if (!isEditMode && !toInternalKey(formData.name.en)) {
      toast.error("Document name must produce a valid internal key.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = buildPayload();

      if (isEditMode) {
        await updateDocumentType({ id: editData._id, data: payload }).unwrap();
        toast.success("Document updated successfully.");
      } else {
        await createDocumentType(payload).unwrap();
        toast.success("Document created successfully.");
      }

      navigate("/document");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const summaryFormats = selectedFormats.length
    ? selectedFormats.map((format) => format.label).join(", ")
    : "No formats selected";

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          {/* <p className="text-xs font-semibold uppercase tracking-wide text-[#FF8303]">
            Document Master
          </p> */}
          <h1 className="mt-1 text-2xl font-bold text-[#041A40]">
            {isEditMode ? "Edit Document Type" : "Add Document Type"}
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-slate-600">
            Keep the setup tight. The form is condensed for faster admin entry.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          {isEditMode ? "Updating an existing record" : "Creating a new record"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <Section
            title="Document Labels"
            description="Use concise labels. Key is generated below the English name."
            icon={FileImage}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-1">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  English Name
                </label>
                <input
                  type="text"
                  name="name.en"
                  value={formData.name.en}
                  onChange={handleTextChange}
                  placeholder="Aadhaar Card"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#FF8303] focus:ring-2 focus:ring-[#FF8303]/20"
                />
                <p className="mt-1 text-[10px] font-mono tracking-wide text-slate-400">
                  {formData.internalKey || "Auto-generated from English name"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Marathi Name
                </label>
                <input
                  type="text"
                  name="name.mr"
                  value={formData.name.mr}
                  onChange={handleTextChange}
                  placeholder="आधार कार्ड"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#FF8303] focus:ring-2 focus:ring-[#FF8303]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Max Size
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="maxSizeMb"
                    value={formData.maxSizeMb}
                    onChange={handleTextChange}
                    placeholder="5"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-14 text-sm text-slate-900 outline-none transition focus:border-[#FF8303] focus:ring-2 focus:ring-[#FF8303]/20"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold text-slate-400">
                    MB
                  </span>
                </div>
              </div>
              <div className="xl:col-span-3">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Status
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleTextChange}
                    className="h-4 w-4 rounded border-slate-300 text-[#FF8303] focus:ring-[#FF8303]"
                  />
                  Active and visible in the document library
                </label>
              </div>
            </div>
          </Section>

          <Section
            title="Sample Image"
            description="Upload a reference image instead of pasting a URL."
            icon={ImagePlus}
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
              <label
                className="group flex min-h-32 cursor-pointer flex-col justify-between rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-[#FF8303] hover:bg-[#FF8303]/5"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  handleSampleImageChange({ target: { files: [file] } });
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF8303] shadow-sm">
                    <UploadCloud className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Drop an image here or browse files
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      JPG, PNG or WEBP. Stored directly through MinIO.
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                    Preferred: square or portrait
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FF8303]/10 px-2.5 py-1 text-[10px] font-semibold text-[#FF8303]">
                    <Paperclip className="h-3 w-3" />
                    Select file
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSampleImageChange}
                />
              </label>

              <div className="rounded-lg border border-slate-200 bg-white p-3 flex flex-col justify-center min-h-32">
                {sampleImagePreview ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#041A40]/5 text-[#041A40]">
                        <FileImage size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {sampleImageFile?.name || "Current sample image"}
                        </p>
                        <p className="text-[10px] text-slate-500">Image uploaded</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-600 transition hover:border-[#FF8303] hover:text-[#FF8303]"
                        title="View Sample Image"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearSampleImage}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 text-center">
                    <Paperclip className="h-6 w-6 text-slate-300" />
                    <p className="mt-2 text-xs font-semibold text-slate-700">
                      No image selected
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Add a sample image to make this document type easier to
                      understand.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section
            title="Formats and Instructions"
            description="Set accepted formats and upload guidance."
            icon={AlertCircle}
          >
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-700">
                  Allowed Formats
                </p>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((format) => {
                    const active = formData.allowedFormats.includes(format.value);
                    return (
                      <button
                        key={format.value}
                        type="button"
                        onClick={() => toggleFormat(format.value)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${active
                            ? "border-[#FF8303] bg-[#FF8303]/10 text-[#FF8303]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {format.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500">
                  {summaryFormats}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Instructions - English
                  </label>
                  <textarea
                    rows={2}
                    name="defaultInstructions.en"
                    value={formData.defaultInstructions.en}
                    onChange={handleTextChange}
                    placeholder="Explain how the applicant should upload the document."
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#FF8303] focus:ring-2 focus:ring-[#FF8303]/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Instructions - Marathi
                  </label>
                  <textarea
                    rows={2}
                    name="defaultInstructions.mr"
                    value={formData.defaultInstructions.mr}
                    onChange={handleTextChange}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#FF8303] focus:ring-2 focus:ring-[#FF8303]/20"
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#041A40]/5 text-[#041A40]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Live summary
                </p>
                <p className="text-[11px] text-slate-500">Quick check</p>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] uppercase tracking-wide text-slate-400">
                  Key
                </span>
                <span className="max-w-[140px] truncate text-right font-mono text-[10px] text-slate-500">
                  {formData.internalKey || "Not set"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] text-slate-500">Name</span>
                <span className="max-w-[140px] truncate text-right text-xs font-medium text-slate-800">
                  {formData.name.en || "Not set"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] text-slate-500">Formats</span>
                <span className="max-w-[140px] truncate text-right text-xs font-medium text-slate-800">
                  {selectedFormats.length
                    ? `${selectedFormats.length} selected`
                    : "None"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] text-slate-500">Visibility</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${formData.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                    }`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#041A40] p-4 text-white">
            <p className="text-sm font-semibold">Upload note</p>
            <p className="mt-1.5 text-xs text-slate-200">
              The sample image is uploaded directly through MinIO.
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            {isSaving ? "Saving document type..." : "Ready to save"}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/document")}
              className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF8303] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#e67400] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEditMode ? "Update Document" : "Save Document"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full rounded-xl bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Sample Image Preview
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center items-center overflow-auto max-h-[70vh] rounded-lg border border-slate-100 bg-slate-50">
              <img
                src={sampleImagePreview}
                alt="Sample preview"
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
