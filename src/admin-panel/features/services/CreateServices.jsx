// src/pages/admin/CreateServices.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Settings2,
  ListChecks,
  Layers,
  HelpCircle,
  ImageIcon,
  X,
  AlertCircle,
} from "lucide-react";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetServicesQuery,
} from "../../../redux/api/servicesApi";
import { useGetAllDocumentTypeQuery } from "../../../redux/api/documentApi";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const LANGS = [
  { key: "en", label: "English" },
  { key: "mr", label: "Marathi" },
];
const emptyTri = { en: "", mr: "" };

const INPUT_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select (dropdown)" },
  { value: "radio", label: "Radio buttons" },
  { value: "checkbox", label: "Checkbox" },
];

const OPTION_BASED_TYPES = ["select", "radio"];

const emptyOption = () => ({ value: "", label: { ...emptyTri } });

const normalizeOptionForEdit = (opt) => {
  if (typeof opt === "string") {
    return { value: opt, label: { en: opt, mr: "" } };
  }
  return {
    value: opt.value ?? "",
    label: { en: "", mr: "", ...(opt.label || {}) },
  };
};

// ============ COMPONENTS ============
function SectionCard({ icon: Icon, title, description, action, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#041A40]/5 text-[#041A40]">
              <Icon size={16} />
            </span>
          )}
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function TriLangInput({ label, value, onChange, textarea = false, required, hint, showError = false }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <FieldLabel required={required}>{label}</FieldLabel>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {LANGS.map((l) => {
          const Comp = textarea ? "textarea" : "input";
          const missing = showError && required && l.key === "en" && !value.en?.trim();
          return (
            <div key={l.key} className="relative">
              <span className="pointer-events-none absolute left-2.5 top-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {l.key}
              </span>
              <Comp
                value={value[l.key] || ""}
                onChange={(e) => onChange({ ...value, [l.key]: e.target.value })}
                placeholder={l.label}
                rows={textarea ? 3 : undefined}
                className={`w-full rounded-lg border bg-white pt-6 pb-2 px-2.5 text-sm text-slate-900 placeholder-slate-300 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 resize-none ${missing ? "border-red-300" : "border-slate-300"
                  }`}
              />
            </div>
          );
        })}
      </div>
      {showError && required && !value.en?.trim() && (
        <p className="text-xs text-red-500">English value is required.</p>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", ...rest }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
      {...rest}
    />
  );
}

function OptionsEditor({ options, onChange }) {
  const updateOption = (idx, patch) =>
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));

  const addOption = () => onChange([...options, emptyOption()]);

  const removeOption = (idx) => onChange(options.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <FieldLabel required>Options</FieldLabel>
        <button
          type="button"
          onClick={addOption}
          className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
        >
          <Plus size={12} /> Add option
        </button>
      </div>

      {options.length === 0 ? (
        <p className="text-xs text-slate-400">
          No options yet — add at least one so applicants have something to pick from.
        </p>
      ) : (
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="rounded-lg bg-white p-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <input
                  value={opt.value || ""}
                  onChange={(e) => updateOption(idx, { value: e.target.value })}
                  placeholder="Stored value (e.g. APL)"
                  className="w-40 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="p-1 text-slate-400 transition hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {LANGS.map((l) => (
                  <div key={l.key} className="relative">
                    <span className="pointer-events-none absolute left-2 top-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      {l.key}
                    </span>
                    <input
                      value={opt.label[l.key] || ""}
                      onChange={(e) =>
                        updateOption(idx, { label: { ...opt.label, [l.key]: e.target.value } })
                      }
                      placeholder={l.label}
                      className="w-full rounded-md border border-slate-300 pt-5 pb-1.5 px-2 text-xs text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
      {label}
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function CreateServices() {
  // ============ BASIC STATES ============
  const [name, setName] = useState(emptyTri);
  const [description, setDescription] = useState(emptyTri);
  const [price, setPrice] = useState("");
  const [processingTime, setProcessingTime] = useState(emptyTri);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("1");
  const [whatsappTemplate, setWhatsappTemplate] = useState(emptyTri);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [subService, setSubService] = useState("");

  const [option, setOption] = useState({ name: { ...emptyTri }, description: { ...emptyTri } });
  const [question, setQuestion] = useState({ title: { ...emptyTri }, description: { ...emptyTri } });

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
      options: [],
    },
  ]);

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const editingService = location.state?.serviceToEdit || null;
  const isEditMode = Boolean(editingService);

  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [createService, { isLoading }] = useCreateServiceMutation();
  const { data: getAllDocumentType } = useGetAllDocumentTypeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const { data: getAllSubServices } = useGetServicesQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const isSubmitting = isLoading || isUpdating;

  // ============ LOAD EDITING SERVICE DATA ============
  useEffect(() => {
    if (!editingService) return;
    setName({ ...emptyTri, ...(editingService.name || {}) });
    setDescription({ ...emptyTri, ...(editingService.description || {}) });
    setPrice(String(editingService.price ?? ""));
    setProcessingTime({ ...emptyTri, ...(editingService.processingTime || {}) });
    setIsActive(editingService.isActive ?? true);
    setDisplayOrder(String(editingService.displayOrder ?? "1"));
    setWhatsappTemplate({ ...emptyTri, ...(editingService.whatsappTemplate || {}) });
    setSubService(editingService.subService?._id || editingService.subService || "");

    setOption({
      name: { ...emptyTri, ...(editingService.option?.name || {}) },
      description: { ...emptyTri, ...(editingService.option?.description || {}) },
    });
    setQuestion({
      title: { ...emptyTri, ...(editingService.question?.title || {}) },
      description: { ...emptyTri, ...(editingService.question?.description || {}) },
    });

    if (Array.isArray(editingService.documents) && editingService.documents.length > 0) {
      setDocuments(
        editingService.documents.map((d) => ({
          documentTypeId: d.documentTypeId?._id || d.documentTypeId || "",
          isRequired: d.isRequired ?? true,
          fieldKey: d.fieldKey || "",
        })),
      );
    }

    if (Array.isArray(editingService.formFields) && editingService.formFields.length > 0) {
      setFormFields(
        editingService.formFields.map((f) => ({
          key: f.key || "",
          label: { ...emptyTri, ...(f.label || {}) },
          inputType: f.inputType || "text",
          isRequired: f.isRequired ?? true,
          placeholder: { ...emptyTri, ...(f.placeholder || {}) },
          options: Array.isArray(f.options) ? f.options.map(normalizeOptionForEdit) : [],
        })),
      );
    }

    if (editingService.iconUrl) {
      setIconPreview(editingService.iconUrl);
    }
  }, [editingService]);

  // ============ DOCUMENT FUNCTIONS ============
  const updateDocument = (idx, patch) =>
    setDocuments((docs) => docs.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const addDocument = () =>
    setDocuments((docs) => [...docs, { documentTypeId: "", isRequired: true, fieldKey: "" }]);

  const removeDocument = (idx) => setDocuments((docs) => docs.filter((_, i) => i !== idx));

  // ============ FORM FIELD FUNCTIONS ============
  const updateField = (idx, patch) =>
    setFormFields((fields) => fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const addField = () =>
    setFormFields((fields) => [
      ...fields,
      {
        key: "",
        label: { ...emptyTri },
        inputType: "text",
        isRequired: true,
        placeholder: { ...emptyTri },
        options: [],
      },
    ]);

  const setFieldInputType = (idx, inputType) =>
    updateField(idx, {
      inputType,
      options: OPTION_BASED_TYPES.includes(inputType)
        ? formFields[idx].options.length
          ? formFields[idx].options
          : [emptyOption()]
        : formFields[idx].options,
    });

  const removeField = (idx) => setFormFields((fields) => fields.filter((_, i) => i !== idx));

  // ============ ICON FUNCTIONS ============
  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const clearIcon = () => {
    setIconFile(null);
    setIconPreview(null);
  };

  // ============ VALIDATION ============
  const validationErrors = useMemo(() => {
    const errors = [];
    if (!name.en?.trim()) errors.push("Service name (English) is required.");
    if (!description.en?.trim()) errors.push("Description (English) is required.");
    if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0)
      errors.push("Enter a valid price.");
    formFields.forEach((f, i) => {
      if (!f.key.trim() || !OPTION_BASED_TYPES.includes(f.inputType)) return;
      if (f.options.length === 0) {
        errors.push(`Field #${i + 1} ("${f.key}") is a ${f.inputType} but has no options.`);
        return;
      }
      const incomplete = f.options.some((o) => !o.value?.trim() || !o.label?.en?.trim());
      if (incomplete) {
        errors.push(`Field #${i + 1} ("${f.key}") has an option missing a value or English label.`);
      }
    });
    return errors;
  }, [name, description, price, formFields]);

  // ============ SUBMIT ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const cleanedFormFields = formFields
      .filter((f) => f.key && f.key.trim() !== "")
      .map((f) =>
        OPTION_BASED_TYPES.includes(f.inputType) ? f : { ...f, options: undefined },
      );

    const cleanedDocuments = documents.filter(
      (d) => d.documentTypeId && d.documentTypeId.trim() !== "",
    );

    try {
      const subServiceId = typeof subService === 'object' ? subService?._id : subService;
      const hasSubService = subServiceId &&
        typeof subServiceId === 'string' &&
        subServiceId.trim() !== "";

      const fd = new FormData();

      fd.append("name", JSON.stringify(name));
      fd.append("description", JSON.stringify(description));
      fd.append("price", price);
      fd.append("processingTime", JSON.stringify(processingTime));
      fd.append("documents", JSON.stringify(cleanedDocuments));
      fd.append("formFields", JSON.stringify(cleanedFormFields));
      fd.append("isActive", String(isActive));
      fd.append("displayOrder", displayOrder);
      fd.append("whatsappTemplate", JSON.stringify(whatsappTemplate));

      if (hasSubService) {
        fd.append("subService", subServiceId.trim());
      }

      fd.append("option", JSON.stringify(option));
      fd.append("question", JSON.stringify(question));

      if (iconFile) {
        fd.append("iconFile", iconFile);
      }

      if (isEditMode) {
        await updateService({ id: editingService._id, body: fd }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createService(fd).unwrap();
        toast.success("Service created successfully!");
      }

      navigate("/services");
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      const message = err?.data?.message || err?.error || err?.message || "Something went wrong";
      toast.error(message);
    }
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {isEditMode ? "Edit Service" : "Create Service"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add a government service with multilingual content
              </p>
            </div>

          </div>

        </div>

        {submitAttempted && validationErrors.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <ul className="list-disc space-y-0.5 pl-4">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Basic info */}
        <SectionCard
          icon={FileText}
          title="Basic information"
          description="Core details shown to citizens across English and Marathi."
        >
          <div className="space-y-5">
            <TriLangInput label="Service Name" value={name} onChange={setName} required />
            <TriLangInput
              label="Description"
              value={description}
              onChange={setDescription}
              showError={submitAttempted}
              textarea
              required
            />
            <TriLangInput label="Processing Time" value={processingTime} onChange={setProcessingTime} showError={submitAttempted} />
            <TriLangInput
              label="WhatsApp Template"
              value={whatsappTemplate}
              onChange={setWhatsappTemplate}
              showError={submitAttempted}
              textarea
              hint="Use {{name}} and {{link}} as placeholders"
            />
          </div>
        </SectionCard>

        {/* Pricing & settings */}
        <SectionCard
          icon={Settings2}
          title="Pricing & settings"
          description="Cost, ordering, visibility and category."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel required>Fees</FieldLabel>
              <TextInput
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 200"
              />
            </div>

            <div>
              <FieldLabel>Display Order</FieldLabel>
              <TextInput
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) >= 0) setDisplayOrder(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
              />
            </div>

            <div>
              <FieldLabel>Sub Service (optional)</FieldLabel>
              <select
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
              >
                <option value="">None</option>
                {getAllSubServices?.data?.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name?.en || sub.internalKey}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex h-[38px] items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Active (visible to users)
              </label>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel>Icon</FieldLabel>
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600">
                  <UploadCloud size={16} />
                  <span>{iconFile ? iconFile.name : "Choose file"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
                </label>
                {iconPreview ? (
                  <div className="relative">
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="h-12 w-12 rounded-lg border border-slate-200 object-contain"
                    />
                    <button
                      type="button"
                      onClick={clearIcon}
                      className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 text-slate-400 shadow ring-1 ring-slate-200 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-300">
                    <ImageIcon size={18} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Category */}
        <SectionCard icon={Layers} title="Category" description="Groups this service under a category, shown in-app.">
          <div className="space-y-5">
            <TriLangInput
              label="Category Name"
              value={option.name}
              onChange={(v) => setOption({ ...option, name: v })}
            />
            <TriLangInput
              label="Category Description"
              value={option.description}
              onChange={(v) => setOption({ ...option, description: v })}
              textarea
              showError={submitAttempted}
            />
          </div>
        </SectionCard>

        {/* FAQ */}
        <SectionCard icon={HelpCircle} title="FAQ / Question" description="A single frequently asked question shown with this service.">
          <div className="space-y-5">
            <TriLangInput
              label="Question"
              value={question.title}
              onChange={(v) => setQuestion({ ...question, title: v })}
              showError={submitAttempted}
            />
            <TriLangInput
              label="Answer"
              value={question.description}
              onChange={(v) => setQuestion({ ...question, description: v })}
              textarea
              showError={submitAttempted}
            />
          </div>
        </SectionCard>

        {/* Documents */}
        <SectionCard
          icon={ListChecks}
          title="Required documents"
          description="Documents citizens must upload to apply."
          action={
            <button
              type="button"
              onClick={addDocument}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              <Plus size={14} /> Add document
            </button>
          }
        >
          {documents.length === 0 ? (
            <EmptyState label="No documents added yet." />
          ) : (
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 items-center gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
                >
                  <select
                    value={doc.documentTypeId}
                    onChange={(e) => updateDocument(idx, { documentTypeId: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  >
                    <option value="">Select document type</option>
                    {getAllDocumentType?.data?.map((docType) => (
                      <option key={docType._id} value={docType._id}>
                        {docType.name?.en || docType.internalKey}
                      </option>
                    ))}
                  </select>

                  <TextInput
                    value={doc.fieldKey}
                    onChange={(e) => updateDocument(idx, { fieldKey: e.target.value })}
                    placeholder="fieldKey (e.g. aadhaarCard)"
                  />

                  <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={doc.isRequired}
                      onChange={(e) => updateDocument(idx, { isRequired: e.target.checked })}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() => removeDocument(idx)}
                    className="justify-self-end p-1.5 text-slate-400 transition hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Form fields */}
        <SectionCard
          icon={FileText}
          title="Application form fields"
          description="Custom fields citizens fill in when applying."
          action={
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              <Plus size={14} /> Add field
            </button>
          }
        >
          {formFields.length === 0 ? (
            <EmptyState label="No form fields added yet." />
          ) : (
            <div className="space-y-4">
              {formFields.map((field, idx) => {
                return (
                  <div key={idx} className="space-y-3 rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Field #{idx + 1}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeField(idx)}
                          className="p-1 text-slate-400 transition hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <TextInput
                        value={field.key}
                        onChange={(e) => updateField(idx, { key: e.target.value })}
                        placeholder="Field key (e.g. fatherName)"
                      />
                      <select
                        value={field.inputType}
                        onChange={(e) => setFieldInputType(idx, e.target.value)}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      >
                        {INPUT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={field.isRequired}
                          onChange={(e) => updateField(idx, { isRequired: e.target.checked })}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Required
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FieldLabel>Label</FieldLabel>
                      </div>
                      <TriLangInput
                        value={field.label}
                        onChange={(v) => updateField(idx, { label: v })}
                        showError={submitAttempted}
                      />
                    </div>

                    <TriLangInput
                      label="Placeholder"
                      value={field.placeholder}
                      onChange={(v) => updateField(idx, { placeholder: v })}
                      showError={submitAttempted}
                    />

                    {OPTION_BASED_TYPES.includes(field.inputType) && (
                      <OptionsEditor
                        options={field.options}
                        onChange={(opts) => updateField(idx, { options: opts })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </form>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {submitAttempted && validationErrors.length === 0 && (
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 size={16} /> Ready to submit
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/services")}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#041A40] px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {isEditMode ? "Update Service" : "Create Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

