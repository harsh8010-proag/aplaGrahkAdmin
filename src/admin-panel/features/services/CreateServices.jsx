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
  ChevronDown,
  ChevronUp,
  GripVertical,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
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

function toCamelCase(str = "") {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

// ============ STEP DEFINITIONS ============
const STEPS = [
  { key: "basic", label: "Basic Info", icon: FileText },
  { key: "pricing", label: "Pricing & Settings", icon: Settings2 },
  { key: "category", label: "Category", icon: Layers },
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "documents", label: "Documents", icon: ListChecks },
  { key: "fields", label: "Form Fields", icon: FileText },
];

// ============ COMPONENTS ============
function SectionCard({ icon: Icon, title, description, action, children, badge, defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300">
      <div
        className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#041A40]/5 text-[#041A40]">
              <Icon size={16} />
            </span>
          )}
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
              {description && (
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
              )}
            </div>
            {badge !== undefined && badge !== null && (
              <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 min-w-[22px]">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100">
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </span>
        </div>
      </div>
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          maxHeight: collapsed ? "0px" : "5000px",
          opacity: collapsed ? 0 : 1,
          overflow: collapsed ? "hidden" : "visible",
        }}
      >
        <div className="px-5 py-5">{children}</div>
      </div>
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
        {label && <FieldLabel required={required}>{label}</FieldLabel>}
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
                <div className="text-xs text-slate-500">
                  Generated value: <span className="font-medium text-slate-700">{opt.value || "(from English label)"}</span>
                </div>
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
                      onChange={(e) => {
                        const updatedLabel = { ...opt.label, [l.key]: e.target.value };
                        updateOption(idx, {
                          label: updatedLabel,
                          ...(l.key === "en" ? { value: toCamelCase(e.target.value) } : {}),
                        });
                      }}
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

// ============ INLINE DELETE CONFIRMATION ============
function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);

  const startConfirm = () => {
    setConfirming(true);
    timerRef.current = setTimeout(() => setConfirming(false), 3000);
  };

  const handleConfirm = () => {
    clearTimeout(timerRef.current);
    setConfirming(false);
    onConfirm();
  };

  const handleCancel = () => {
    clearTimeout(timerRef.current);
    setConfirming(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (confirming) {
    return (
      <div className="flex items-center gap-1 animate-in fade-in">
        <span className="text-xs font-medium text-red-600 mr-1">Delete?</span>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100"
          title="Confirm delete"
        >
          <Check size={13} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          title="Cancel"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startConfirm}
      className="p-1.5 text-slate-400 transition hover:text-red-600"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
      {label}
    </div>
  );
}

// ============ STEPPER SIDEBAR ============
function StepperSidebar({ steps, activeStep, onStepClick, completedSteps }) {
  return (
    <nav className="hidden lg:block w-[220px] shrink-0">
      <div className="sticky top-8 space-y-1">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          const isCompleted = completedSteps.has(idx);
          const Icon = step.icon;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onStepClick(idx)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-[#041A40] text-white shadow-md shadow-[#041A40]/20"
                  : isCompleted
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
              >
                {isCompleted ? <CheckCircle2 size={14} /> : <Icon size={14} />}
              </span>
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============ MOBILE STEP BAR ============
function MobileStepBar({ steps, activeStep, onStepClick, completedSteps }) {
  return (
    <div className="flex lg:hidden gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      {steps.map((step, idx) => {
        const isActive = activeStep === idx;
        const isCompleted = completedSteps.has(idx);
        return (
          <button
            key={step.key}
            type="button"
            onClick={() => onStepClick(idx)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${isActive
                ? "bg-[#041A40] text-white shadow-sm"
                : isCompleted
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
          >
            {isCompleted && <CheckCircle2 size={11} />}
            {step.label}
          </button>
        );
      })}
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

  // ============ STEPPER STATE ============
  const [activeStep, setActiveStep] = useState(0);

  // ============ AUTO-SCROLL REFS ============
  const docListRef = useRef(null);
  const fieldListRef = useRef(null);
  const scrollToDocIdx = useRef(null);
  const scrollToFieldIdx = useRef(null);

  // ============ DIRTY TRACKING REF ============
  const initialStateRef = useRef(null);
  const formRef = useRef(null);

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
  const isSubmitting = isLoading || isUpdating;

  // ============ SNAPSHOT INITIAL STATE FOR DIRTY CHECK ============
  const getCurrentSnapshot = useCallback(() => {
    return JSON.stringify({ name, description, price, processingTime, isActive, displayOrder, whatsappTemplate, option, question, documents, formFields, iconFile: iconFile?.name || null });
  }, [name, description, price, processingTime, isActive, displayOrder, whatsappTemplate, option, question, documents, formFields, iconFile]);

  const isDirty = useMemo(() => {
    if (!initialStateRef.current) return false;
    return getCurrentSnapshot() !== initialStateRef.current;
  }, [getCurrentSnapshot]);

  // Set initial snapshot after first render or after loading edit data
  useEffect(() => {
    // Delay slightly so edit data has time to populate
    const timer = setTimeout(() => {
      initialStateRef.current = getCurrentSnapshot();
    }, 100);
    return () => clearTimeout(timer);
  }, [editingService]); // re-snapshot when edit data loads

  // ============ UNSAVED CHANGES WARNING ============
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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

  // ============ STEP COMPLETION TRACKING ============
  const completedSteps = useMemo(() => {
    const completed = new Set();
    // Step 0: Basic Info — name + description filled
    if (name.en?.trim() && description.en?.trim()) completed.add(0);
    // Step 1: Pricing — price filled
    if (price !== "" && !Number.isNaN(Number(price)) && Number(price) >= 0) completed.add(1);
    // Step 2: Category — optional, mark complete if anything typed
    if (option.name.en?.trim()) completed.add(2);
    // Step 3: FAQ — optional, mark complete if anything typed
    if (question.title.en?.trim()) completed.add(3);
    // Step 4: Documents — at least one selected
    if (documents.some((d) => d.documentTypeId?.trim())) completed.add(4);
    // Step 5: Form Fields — at least one with a key
    if (formFields.some((f) => f.key?.trim())) completed.add(5);
    return completed;
  }, [name, description, price, option, question, documents, formFields]);

  // ============ DOCUMENT FUNCTIONS ============
  const updateDocument = (idx, patch) =>
    setDocuments((docs) => docs.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const handleDocumentTypeChange = (idx, value) => {
    const docType = getAllDocumentType?.data?.find((dt) => dt._id === value);
    let autoKey = "";
    if (docType) {
      autoKey = docType.internalKey || toCamelCase(docType.name?.en || "");
    }

    setDocuments((docs) =>
      docs.map((d, i) => {
        if (i !== idx) return d;
        // Only auto-set fieldKey when it's empty to preserve manual edits
        const fieldKey = d.fieldKey && d.fieldKey.trim() ? d.fieldKey : autoKey;
        return { ...d, documentTypeId: value, fieldKey };
      }),
    );
  };

  const addDocument = () => {
    setDocuments((docs) => {
      scrollToDocIdx.current = docs.length; // index of the new item
      return [...docs, { documentTypeId: "", isRequired: true, fieldKey: "" }];
    });
  };

  const removeDocument = (idx) => {
    setDocuments((docs) => {
      const next = docs.filter((_, i) => i !== idx);
      // scroll to the previous item, or 0, or null if empty
      scrollToDocIdx.current = next.length > 0 ? Math.min(idx, next.length - 1) : null;
      return next;
    });
  };

  // ============ DRAG AND DROP — DOCUMENTS ============
  const dragDocIdx = useRef(null);
  const dragOverDocIdx = useRef(null);

  const handleDocDragStart = (idx) => {
    dragDocIdx.current = idx;
  };

  const handleDocDragOver = (e, idx) => {
    e.preventDefault();
    dragOverDocIdx.current = idx;
  };

  const handleDocDrop = () => {
    const from = dragDocIdx.current;
    const to = dragOverDocIdx.current;
    if (from === null || to === null || from === to) return;
    setDocuments((docs) => {
      const updated = [...docs];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
    dragDocIdx.current = null;
    dragOverDocIdx.current = null;
  };

  // ============ FORM FIELD FUNCTIONS ============
  const updateField = (idx, patch) =>
    setFormFields((fields) => fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const addField = () => {
    setFormFields((fields) => {
      scrollToFieldIdx.current = fields.length; // index of the new item
      return [
        ...fields,
        {
          key: "",
          label: { ...emptyTri },
          inputType: "text",
          isRequired: true,
          placeholder: { ...emptyTri },
          options: [],
        },
      ];
    });
  };

  const setFieldInputType = (idx, inputType) =>
    updateField(idx, {
      inputType,
      options: OPTION_BASED_TYPES.includes(inputType)
        ? formFields[idx].options.length
          ? formFields[idx].options
          : [emptyOption()]
        : formFields[idx].options,
    });

  const removeField = (idx) => {
    setFormFields((fields) => {
      const next = fields.filter((_, i) => i !== idx);
      scrollToFieldIdx.current = next.length > 0 ? Math.min(idx, next.length - 1) : null;
      return next;
    });
  };

  // ============ DRAG AND DROP — FORM FIELDS ============
  const dragFieldIdx = useRef(null);
  const dragOverFieldIdx = useRef(null);

  const handleFieldDragStart = (idx) => {
    dragFieldIdx.current = idx;
  };

  const handleFieldDragOver = (e, idx) => {
    e.preventDefault();
    dragOverFieldIdx.current = idx;
  };

  const handleFieldDrop = () => {
    const from = dragFieldIdx.current;
    const to = dragOverFieldIdx.current;
    if (from === null || to === null || from === to) return;
    setFormFields((fields) => {
      const updated = [...fields];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
    dragFieldIdx.current = null;
    dragOverFieldIdx.current = null;
  };

  // ============ AUTO-SCROLL EFFECTS ============
  useEffect(() => {
    if (scrollToDocIdx.current === null) return;
    const container = docListRef.current;
    if (!container) { scrollToDocIdx.current = null; return; }
    const items = container.children;
    const target = items[scrollToDocIdx.current];
    scrollToDocIdx.current = null;
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "nearest" });
        // briefly highlight the item
        target.classList.add("ring-2", "ring-indigo-400/60");
        setTimeout(() => target.classList.remove("ring-2", "ring-indigo-400/60"), 1200);
      });
    }
  }, [documents]);

  useEffect(() => {
    if (scrollToFieldIdx.current === null) return;
    const container = fieldListRef.current;
    if (!container) { scrollToFieldIdx.current = null; return; }
    const items = container.children;
    const target = items[scrollToFieldIdx.current];
    scrollToFieldIdx.current = null;
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "nearest" });
        target.classList.add("ring-2", "ring-indigo-400/60");
        setTimeout(() => target.classList.remove("ring-2", "ring-indigo-400/60"), 1200);
      });
    }
  }, [formFields]);

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
    if (e) e.preventDefault();
    setSubmitAttempted(true);

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      // Jump to the step with the first error
      if (!name.en?.trim() || !description.en?.trim()) setActiveStep(0);
      else if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0) setActiveStep(1);
      else setActiveStep(5); // form field errors
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

      fd.append("option", JSON.stringify(option));
      fd.append("question", JSON.stringify(question));

      if (iconFile) {
        fd.append("iconFile", iconFile);
      }

      // Reset dirty tracking so beforeunload doesn't fire on success
      initialStateRef.current = getCurrentSnapshot();

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

  // ============ KEYBOARD SHORTCUTS ============
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S / Cmd+S → Submit
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }
      // Escape → Cancel (navigate back)
      if (e.key === "Escape") {
        // Don't trigger if user is in a dropdown or modal
        const tag = document.activeElement?.tagName;
        if (tag === "SELECT") return;
        if (isDirty) {
          const leave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
          if (!leave) return;
        }
        navigate("/services");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, navigate]);

  // ============ STEP NAVIGATION ============
  const goToStep = (idx) => {
    if (idx >= 0 && idx < STEPS.length) {
      setActiveStep(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-6xl px-4 py-8">
        {/* Page Header */}
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {isEditMode ? "Edit Service" : "Create Service"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add a government service with multilingual content
              </p>
            </div>
            {isDirty && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                <AlertCircle size={12} />
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {submitAttempted && validationErrors.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <ul className="list-disc space-y-0.5 pl-4">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mobile Step Bar */}
        <MobileStepBar
          steps={STEPS}
          activeStep={activeStep}
          onStepClick={goToStep}
          completedSteps={completedSteps}
        />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-6">
          {/* Stepper Sidebar */}
          <StepperSidebar
            steps={STEPS}
            activeStep={activeStep}
            onStepClick={goToStep}
            completedSteps={completedSteps}
          />

          {/* Step Content */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Step 0: Basic Info */}
            {activeStep === 0 && (
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
                  {/* <TriLangInput
                    label="WhatsApp Template"
                    value={whatsappTemplate}
                    onChange={setWhatsappTemplate}
                    showError={submitAttempted}
                    textarea
                    hint="Use {{name}} and {{link}} as placeholders"
                  /> */}
                </div>
              </SectionCard>
            )}

            {/* Step 1: Pricing & Settings */}
            {activeStep === 1 && (
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
            )}

            {/* Step 2: Category */}
            {activeStep === 2 && (
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
            )}

            {/* Step 3: FAQ */}
            {activeStep === 3 && (
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
            )}

            {/* Step 4: Documents */}
            {activeStep === 4 && (
              <SectionCard
                icon={ListChecks}
                title="Required documents"
                description="Documents citizens must upload to apply."
                badge={documents.filter((d) => d.documentTypeId?.trim()).length || null}
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
                  <div className="space-y-3" ref={docListRef}>
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={() => handleDocDragStart(idx)}
                        onDragOver={(e) => handleDocDragOver(e, idx)}
                        onDrop={handleDocDrop}
                        className="grid grid-cols-1 items-center gap-2 rounded-lg border border-slate-200 p-3 transition-all duration-200 hover:shadow-sm sm:grid-cols-[auto_1fr_1fr_auto_auto]"
                      >
                        {/* Drag handle */}
                        <div className="hidden sm:flex cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
                          <GripVertical size={16} />
                        </div>

                        <select
                          value={doc.documentTypeId}
                          onChange={(e) => handleDocumentTypeChange(idx, e.target.value)}
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

                        <DeleteButton onConfirm={() => removeDocument(idx)} />
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            )}

            {/* Step 5: Form Fields */}
            {activeStep === 5 && (
              <SectionCard
                icon={FileText}
                title="Application form fields"
                description="Custom fields citizens fill in when applying."
                badge={formFields.filter((f) => f.key?.trim()).length || null}
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
                  <div className="space-y-4" ref={fieldListRef}>
                    {formFields.map((field, idx) => {
                      return (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleFieldDragStart(idx)}
                          onDragOver={(e) => handleFieldDragOver(e, idx)}
                          onDrop={handleFieldDrop}
                          className="space-y-3 rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:shadow-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* Drag handle */}
                              <span className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
                                <GripVertical size={16} />
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Field #{idx + 1}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <DeleteButton onConfirm={() => removeField(idx)} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {/* Field key is generated from the English label to simplify admin UX */}
                            <div className="flex items-center rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                              Auto key: {field.key || "(will be generated)"}
                            </div>
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
                              onChange={(v) => updateField(idx, { label: v, key: toCamelCase(v.en || '') })}
                              showError={submitAttempted}
                            />
                          </div>

                          {!OPTION_BASED_TYPES.includes(field.inputType) && (
                            <TriLangInput
                              label="Placeholder"
                              value={field.placeholder}
                              onChange={(v) => updateField(idx, { placeholder: v })}
                              showError={submitAttempted}
                            />
                          )}

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
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => goToStep(activeStep - 1)}
                disabled={activeStep === 0}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              {/* Step indicator pills */}
              <div className="hidden sm:flex items-center gap-1.5">
                {STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeStep === idx
                        ? "w-6 bg-[#041A40]"
                        : completedSteps.has(idx)
                          ? "w-2 bg-emerald-400"
                          : "w-2 bg-slate-200"
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => goToStep(activeStep + 1)}
                disabled={activeStep === STEPS.length - 1}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur z-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {isDirty && (
              <span className="flex items-center gap-1.5 text-amber-600">
                <AlertCircle size={14} />
                Unsaved changes
              </span>
            )}
            {submitAttempted && validationErrors.length === 0 && (
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 size={16} /> Ready to submit
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (isDirty) {
                  const leave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
                  if (!leave) return;
                }
                navigate("/services");
              }}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
              <span className="ml-1.5 hidden sm:inline rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Esc
              </span>
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#041A40] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a2a5c] disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {isEditMode ? "Update Service" : "Create Service"}
              <span className="hidden sm:inline rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Ctrl+S
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
