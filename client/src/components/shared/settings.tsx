// ============================================================
// NyaySetu — Settings Page (React + TypeScript, production-ready)
// File: src/pages/Settings.tsx
//
// Sections:
//  1. 👤 Account Settings
//  2. 🔐 Security Settings
//  3. 🔔 Notification Preferences
//  4. ⚖️ Legal Preferences
//  5. 📂 Document Settings
//  6. 🌐 Language & Accessibility
//  7. 🚨 Advanced (Aadhaar, Privacy, Data Export)
// ============================================================

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

// ─────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────

type Language = "en" | "hi" | "mr" | "ta" | "te";
type Theme = "light" | "dark" | "system";
type FontSize = "sm" | "md" | "lg" | "xl";
type Priority = "high" | "medium" | "low";
type CommMode = "email" | "sms" | "call" | "whatsapp";
type ReminderTiming = "1h" | "1d" | "3d" | "7d";
type SettingsTab =
  | "account"
  | "security"
  | "notifications"
  | "legal"
  | "documents"
  | "access"
  | "advanced";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  caseId: string;
  occupation: string;
  preferredLanguage: Language;
}

interface ProfileErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface PasswordForm {
  current: string;
  newPwd: string;
  confirm: string;
}

interface PasswordErrors {
  current?: string;
  newPwd?: string;
  confirm?: string;
}

interface SecuritySettings {
  twoFAEnabled: boolean;
  loginAlertsEnabled: boolean;
  suspiciousActivityBlock: boolean;
}

interface NotificationSettings {
  hearingReminders: boolean;
  orderUpdates: boolean;
  documentAlerts: boolean;
  adjournmentNotices: boolean;
  emailChannel: boolean;
  smsChannel: boolean;
  inAppChannel: boolean;
  reminderTiming: ReminderTiming;
  digestTime: string;
}

interface LegalSettings {
  courtLevel: string;
  jurisdiction: string;
  priority: Priority;
  autoSummary: boolean;
  delayPrediction: boolean;
  termSimplifier: boolean;
  commMode: CommMode;
}

interface DocumentSettings {
  defaultFormat: string;
  autoDownload: boolean;
  secureAccess: boolean;
  digiLockerSync: boolean;
  eSign: boolean;
}

interface AccessibilitySettings {
  language: Language;
  theme: Theme;
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

interface ConsentSettings {
  courtDataProcessing: boolean;
  analytics: boolean;
  lawyerMatching: boolean;
  aiTraining: boolean;
}

interface SettingsState {
  profile: ProfileForm;
  security: SecuritySettings;
  notifications: NotificationSettings;
  legal: LegalSettings;
  documents: DocumentSettings;
  accessibility: AccessibilitySettings;
  consent: ConsentSettings;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// ─────────────────────────────────────────────────────────────
// 2. DEFAULT STATE
// ─────────────────────────────────────────────────────────────

const DEFAULT_STATE: SettingsState = {
  profile: {
    name: `${localStorage.getItem("name")}`,
    email: `${localStorage.getItem("email")}`,
    phone: "+91 98765 43210",
    caseId: "DLHC010001232024",
    occupation: `${localStorage.getItem("role")}`,
    preferredLanguage: "en",
  },
  security: {
    twoFAEnabled: false,
    loginAlertsEnabled: true,
    suspiciousActivityBlock: false,
  },
  notifications: {
    hearingReminders: true,
    orderUpdates: true,
    documentAlerts: false,
    adjournmentNotices: true,
    emailChannel: true,
    smsChannel: true,
    inAppChannel: true,
    reminderTiming: "1d",
    digestTime: "08:00",
  },
  legal: {
    courtLevel: "High Court",
    jurisdiction: "Maharashtra",
    priority: "high",
    autoSummary: true,
    delayPrediction: true,
    termSimplifier: false,
    commMode: "email",
  },
  documents: {
    defaultFormat: "pdf",
    autoDownload: true,
    secureAccess: false,
    digiLockerSync: false,
    eSign: true,
  },
  accessibility: {
    language: "en",
    theme: "light",
    fontSize: "md",
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
  },
  consent: {
    courtDataProcessing: true,
    analytics: false,
    lawyerMatching: true,
    aiTraining: false,
  },
};

// ─────────────────────────────────────────────────────────────
// 3. TOAST CONTEXT
// ─────────────────────────────────────────────────────────────

interface ToastCtx {
  addToast: (msg: string, type?: Toast["type"]) => void;
}
const ToastContext = createContext<ToastCtx>({ addToast: () => {} });
const useToast = () => useContext(ToastContext);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "flex items-center gap-2 px-4 py-3 rounded-lg text-sm max-w-xs pointer-events-auto",
              "shadow-2xl border animate-[slideIn_0.25s_ease]",
              "bg-[#0b1a3c] text-[#f5e4b8]",
              t.type === "success" ? "border-l-4 border-l-[#1a7a6a] border-[rgba(200,150,42,0.3)]" :
              t.type === "error"   ? "border-l-4 border-l-red-500 border-[rgba(200,150,42,0.3)]" :
                                     "border-l-4 border-l-[#2a6ae0] border-[rgba(200,150,42,0.3)]",
            ].join(" ")}
          >
            <span className="flex-shrink-0">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────

// ── Toggle Switch ──────────────────────────────────────────────
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}
function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative w-11 h-6 rounded-full transition-all duration-200",
        "focus:outline-none flex-shrink-0",
        checked
          ? "bg-[#c8962a] shadow-[0_0_0_3px_rgba(200,150,42,0.15)]"
          : "bg-[#ddd6c2]",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white",
          "shadow-sm transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

// ── Toggle Row ─────────────────────────────────────────────────
interface ToggleRowProps {
  icon?: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  last?: boolean;
}
function ToggleRow({ icon, title, description, checked, onChange, last }: ToggleRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between py-3",
        !last ? "border-b border-[#ece8dc]" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
        <div>
          <p className="text-[13px] font-semibold text-[#1a2640]">{title}</p>
          <p className="text-[11px] text-[#7a8aaa] mt-0.5 leading-snug">{description}</p>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <ToggleSwitch checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────
interface CardProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
function Card({ icon, title, subtitle, badge, children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "bg-[#f9f7f2] border border-[#ddd6c2] rounded-xl overflow-hidden",
        "shadow-[0_2px_16px_rgba(11,26,60,0.10)] hover:shadow-[0_4px_24px_rgba(11,26,60,0.14)]",
        "transition-shadow duration-200 mb-4",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#ece8dc] bg-gradient-to-r from-[#0b1a3c] to-[#112249]">
        <div className="w-[34px] h-[34px] rounded-lg bg-[rgba(200,150,42,0.18)] border border-[rgba(200,150,42,0.3)] flex items-center justify-center text-[15px] flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[14px] font-bold text-[#f5e4b8] tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[rgba(180,200,255,0.45)] mt-0.5">{subtitle}</p>
          )}
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
      {/* Body */}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Input Field ────────────────────────────────────────────────
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  mono?: boolean;
}
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, required, error, mono, className = "", ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-[#3a4a62] uppercase tracking-widest">
        {label}
        {required && <span className="text-[#c8962a] ml-0.5">*</span>}
      </label>
      <input
        ref={ref}
        className={[
          "px-3 py-[9px] bg-[#f0ece0] border-[1.5px] rounded-lg",
          "text-[13px] text-[#1a2640] font-sans",
          "transition-all duration-150 outline-none w-full",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-[#ddd6c2] focus:border-[#c8962a] focus:shadow-[0_0_0_3px_rgba(200,150,42,0.12)] focus:bg-white",
          mono ? "font-mono text-[12px]" : "",
          className,
        ].join(" ")}
        {...rest}
      />
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
);
InputField.displayName = "InputField";

// ── Select Field ───────────────────────────────────────────────
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}
function SelectField({ label, children, ...rest }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-[#3a4a62] uppercase tracking-widest">
        {label}
      </label>
      <select
        className={[
          "px-3 py-[9px] pr-8 bg-[#f0ece0] border-[1.5px] border-[#ddd6c2] rounded-lg",
          "text-[13px] text-[#1a2640] cursor-pointer appearance-none",
          "outline-none transition-all focus:border-[#c8962a] focus:shadow-[0_0_0_3px_rgba(200,150,42,0.12)] focus:bg-white",
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%237a8aaa' d='M5 7L0 2h10z'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_10px_center]",
        ].join(" ")}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────
type BadgeVariant = "verified" | "active" | "pending" | "secure" | "unverified";
const BADGE_STYLES: Record<BadgeVariant, string> = {
  verified:   "bg-[rgba(26,122,106,0.12)] text-[#1a7a6a] border-[rgba(26,122,106,0.25)]",
  active:     "bg-[rgba(26,100,200,0.1)] text-[#1a64c8] border-[rgba(26,100,200,0.2)]",
  pending:    "bg-[rgba(200,150,42,0.12)] text-[#c8962a] border-[rgba(200,150,42,0.3)]",
  secure:     "bg-[rgba(26,122,106,0.12)] text-[#1a7a6a] border-[rgba(26,122,106,0.25)]",
  unverified: "bg-[rgba(176,48,48,0.1)] text-[#b03030] border-[rgba(176,48,48,0.2)]",
};
function StatusBadge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide ${BADGE_STYLES[variant]}`}>
      {children}
    </span>
  );
}

// ── Divider ────────────────────────────────────────────────────
function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 my-4">
      <div className="flex-1 h-px bg-[#ece8dc]" />
      {label && (
        <span className="text-[10px] text-[#b0bccc] font-bold uppercase tracking-widest whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-[#ece8dc]" />
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  children: React.ReactNode;
}
const BTN_VARIANTS = {
  primary: "bg-gradient-to-r from-[#c8962a] to-[#e4b84a] text-[#0b1a3c] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(200,150,42,0.35)]",
  outline: "bg-transparent text-[#3a4a62] border border-[#ddd6c2] hover:border-[#c8962a] hover:bg-[#f5e4b8] hover:text-[#0b1a3c]",
  ghost:   "bg-transparent text-[#c8962a] border border-[rgba(200,150,42,0.3)] hover:bg-[rgba(200,150,42,0.08)]",
  danger:  "bg-transparent text-[#b03030] border border-[rgba(176,48,48,0.3)] hover:bg-[rgba(176,48,48,0.08)]",
};
function Button({ variant = "primary", size = "md", loading, children, disabled, className = "", ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all duration-150 cursor-pointer",
        size === "sm" ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-[13px]",
        BTN_VARIANTS[variant],
        (disabled || loading) ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. PASSWORD STRENGTH HOOK
// ─────────────────────────────────────────────────────────────

function usePasswordStrength(password: string) {
  const rules = [
    { test: /[A-Z]/, label: "Uppercase" },
    { test: /[0-9]/, label: "Number" },
    { test: /[^A-Za-z0-9]/, label: "Symbol" },
    { test: /.{12}/, label: "12+ chars" },
  ];
  const score = rules.filter((r) => r.test.test(password)).length;
  const COLORS = ["", "#b03030", "#c8962a", "#22a08a", "#1a7a6a"];
  const LABELS = ["", "Weak", "Fair", "Good", "Strong"];
  return {
    score,
    color: COLORS[score] ?? "",
    label: LABELS[score] ?? "",
    rules: rules.map((r) => ({ ...r, passed: r.test.test(password) })),
  };
}

// ─────────────────────────────────────────────────────────────
// 6. SECTION COMPONENTS
// ─────────────────────────────────────────────────────────────

// ── Account Section ────────────────────────────────────────────
function AccountSection({
  state,
  setState,
}: {
  state: ProfileForm;
  setState: (p: Partial<ProfileForm>) => void;
}) {
  const { addToast } = useToast();
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);

  const validate = (): boolean => {
    const errs: ProfileErrors = {};
    if (!state.name.trim()) errs.name = "Full name is required";
    if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))
      errs.email = "Enter a valid email address";
    if (!state.phone || !/[6-9]\d{9}/.test(state.phone.replace(/[\s+\-()] /g, "")))
      errs.phone = "Enter a valid 10-digit Indian mobile number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    addToast("Profile updated successfully");
  };

  const completeness =
    [state.name, state.email, state.phone, state.caseId, state.occupation].filter(Boolean).length * 17;

  return (
    <Card
      icon="👤"
      title="Profile Information"
      subtitle="Personal details and case contact info"
      badge={<StatusBadge variant="verified">✓ Verified</StatusBadge>}
    >
      {/* Photo upload strip */}
      <div className="flex items-center gap-4 p-4 bg-[#f0ece0] border border-dashed border-[#ddd6c2] rounded-xl mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 border-2 border-[#ddd6c2]">
          AS
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-[#1a2640]">{state.name}</p>
          <p className="text-[11px] text-[#7a8aaa] mt-0.5">JPG or PNG · Max 2 MB · Aspect 1:1</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => addToast("Photo upload dialog opened", "info")}>
          📸 Upload Photo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <InputField
          label="Full Name" required
          value={state.name} error={errors.name}
          onChange={(e) => setState({ name: e.target.value })}
          placeholder="Enter full name"
        />
        <InputField
          label="Email Address" required type="email"
          value={state.email} error={errors.email}
          onChange={(e) => setState({ email: e.target.value })}
          placeholder="email@domain.com"
        />
        <InputField
          label="Mobile Number" required type="tel"
          value={state.phone} error={errors.phone}
          onChange={(e) => setState({ phone: e.target.value })}
          placeholder="+91 XXXXX XXXXX"
        />
        <InputField
          label="Primary Case ID" mono
          value={state.caseId}
          onChange={(e) => setState({ caseId: e.target.value })}
          placeholder="e.g. DLHC010001232024"
        />
        <SelectField
          label="Occupation"
          value={state.occupation}
          onChange={(e) => setState({ occupation: e.target.value })}
        >
          <option value="citizen">Citizen / Litigant</option>
          <option value="business">Business Owner</option>
          <option value="govt">Government Employee</option>
          <option value="self">Self-employed</option>
        </SelectField>
        <SelectField
          label="Preferred Language"
          value={state.preferredLanguage}
          onChange={(e) => setState({ preferredLanguage: e.target.value as Language })}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी — Hindi</option>
          <option value="mr">मराठी — Marathi</option>
        </SelectField>
      </div>

      {/* Profile completeness */}
      <div className="mt-4 p-3.5 bg-[#f0ece0] border border-[#ece8dc] rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-[12px] font-semibold text-[#3a4a62]">Profile Completeness</span>
          <span className="text-[13px] font-bold text-[#c8962a]">{completeness}%</span>
        </div>
        <div className="h-1.5 bg-[#e6dfc8] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c8962a] to-[#e4b84a] rounded-full transition-all duration-700"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="text-[11px] text-[#7a8aaa] mt-1.5">
          ⟶ Link your Aadhaar in Advanced settings to reach 100%
        </p>
      </div>

      <div className="flex gap-2 mt-5">
        <Button loading={saving} onClick={handleSave}>💾 Save Profile</Button>
        <Button variant="outline" onClick={() => addToast("Changes discarded", "info")}>
          Discard
        </Button>
      </div>
    </Card>
  );
}

// ── Security Section ───────────────────────────────────────────
function SecuritySection({
  state,
  setState,
  passwords,
  setPasswords,
}: {
  state: SecuritySettings;
  setState: (p: Partial<SecuritySettings>) => void;
  passwords: PasswordForm;
  setPasswords: (p: Partial<PasswordForm>) => void;
}) {
  const { addToast } = useToast();
  const [errors, setErrors] = useState<PasswordErrors>({});
  const strength = usePasswordStrength(passwords.newPwd);

  const handleChangePwd = () => {
    const errs: PasswordErrors = {};
    if (!passwords.current) errs.current = "Required";
    if (!passwords.newPwd || passwords.newPwd.length < 8 || strength.score < 2)
      errs.newPwd = "8+ chars with uppercase and number required";
    if (!passwords.confirm || passwords.newPwd !== passwords.confirm)
      errs.confirm = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPasswords({ current: "", newPwd: "", confirm: "" });
    addToast("Password updated successfully");
  };

  return (
    <>
      <Card icon="🔑" title="Change Password" subtitle="Last changed 3 months ago">
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-w-lg">
          <div className="col-span-2">
            <InputField
              label="Current Password" required type="password"
              value={passwords.current} error={errors.current}
              onChange={(e) => setPasswords({ current: e.target.value })}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <InputField
              label="New Password" required type="password"
              value={passwords.newPwd} error={errors.newPwd}
              onChange={(e) => setPasswords({ newPwd: e.target.value })}
              placeholder="Min 8 characters"
            />
            {passwords.newPwd && (
              <div className="mt-1.5">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-[3px] rounded-full transition-all duration-200"
                      style={{
                        background: i <= strength.score ? strength.color : "#ddd6c2",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: strength.color }}>
                  Strength: {strength.label}
                </p>
              </div>
            )}
          </div>
          <InputField
            label="Confirm Password" required type="password"
            value={passwords.confirm} error={errors.confirm}
            onChange={(e) => setPasswords({ confirm: e.target.value })}
            placeholder="Re-enter new password"
          />
        </div>
        <div className="mt-5">
          <Button onClick={handleChangePwd}>🔐 Update Password</Button>
        </div>
      </Card>

      <Card
        icon="🛡️"
        title="Security Controls"
        subtitle="2FA, login alerts and session management"
        badge={<StatusBadge variant="secure">🔒 Secure</StatusBadge>}
      >
        <ToggleRow
          title="Two-Factor Authentication (2FA)"
          description="Receive OTP on your mobile (+91 98765 ***10) every login"
          checked={state.twoFAEnabled}
          onChange={(v) => { setState({ twoFAEnabled: v }); }}
        />
        <ToggleRow
          title="Login Alerts"
          description="Email/SMS when a new device signs in to your account"
          checked={state.loginAlertsEnabled}
          onChange={(v) => setState({ loginAlertsEnabled: v })}
        />
        <ToggleRow
          title="Suspicious Activity Detection"
          description="Block logins from unrecognised locations automatically"
          checked={state.suspiciousActivityBlock}
          onChange={(v) => setState({ suspiciousActivityBlock: v })}
          last
        />

        <Divider label="Active Sessions" />

        {[
          { device: "Chrome on Windows 11", meta: "Pune, MH · Active now · IP 103.xx.xx.21", icon: "💻", current: true },
          { device: "Safari on iPhone 14", meta: "Mumbai, MH · 3 hours ago · IP 49.xx.xx.88", icon: "📱", current: false },
          { device: "Chrome on Android 14", meta: "Nashik, MH · Yesterday, 7:14 PM", icon: "📱", current: false },
        ].map((s) => (
          <div key={s.device} className="flex items-center gap-3 py-3 border-b last:border-0 border-[#ece8dc]">
            <div className="w-8 h-8 rounded-lg bg-[#f0ece0] border border-[#ddd6c2] flex items-center justify-center text-[14px] flex-shrink-0">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1a2640] flex items-center gap-2">
                {s.device}
                {s.current && <StatusBadge variant="active">● Current</StatusBadge>}
              </p>
              <p className="text-[11px] text-[#7a8aaa] mt-0.5">{s.meta}</p>
            </div>
            {!s.current && (
              <Button variant="danger" size="sm" onClick={() => addToast("Session terminated")}>
                Logout
              </Button>
            )}
          </div>
        ))}

        <div className="mt-4">
          <Button variant="danger" onClick={() => addToast("Logged out from all devices")}>
            ↩ Logout All Devices
          </Button>
        </div>
      </Card>
    </>
  );
}

// ── Notifications Section ──────────────────────────────────────
function NotificationsSection({
  state,
  setState,
}: {
  state: NotificationSettings;
  setState: (p: Partial<NotificationSettings>) => void;
}) {
  const { addToast } = useToast();
  return (
    <Card icon="🔔" title="Notification Preferences" subtitle="Choose when and how you receive alerts">
      <div className="p-3 bg-[rgba(200,150,42,0.06)] border border-[rgba(200,150,42,0.2)] border-l-[3px] border-l-[#c8962a] rounded-lg mb-4 font-serif italic text-[12px] text-[#3a4a62] leading-relaxed">
        ⚠ Hearing reminders are critical — keep SMS and Email enabled to avoid missing court dates.
      </div>

      {[
        { key: "hearingReminders", icon: "⏰", title: "Case Hearing Reminders", desc: "Alerts before scheduled court hearings" },
        { key: "orderUpdates", icon: "📜", title: "Court Order Updates", desc: "When a new order or judgment is uploaded" },
        { key: "documentAlerts", icon: "📄", title: "Document Alerts", desc: "When a new document is added to your case" },
        { key: "adjournmentNotices", icon: "⏸", title: "Adjournment Notices", desc: "When your case hearing date is rescheduled" },
      ].map((item, i, arr) => (
        <ToggleRow
          key={item.key}
          icon={item.icon}
          title={item.title}
          description={item.desc}
          checked={Boolean(state[item.key as keyof NotificationSettings])}
          onChange={(v) => setState({ [item.key]: v })}
          last={i === arr.length - 1}
        />
      ))}

      <Divider label="Delivery Channels" />

      {[
        { key: "emailChannel", title: "📧 Email Notifications", desc: "arjun.sharma@email.com" },
        { key: "smsChannel", title: "📱 SMS Alerts", desc: "+91 98765 43210" },
        { key: "inAppChannel", title: "💬 In-App Notifications", desc: "Alerts inside the NyaySetu dashboard" },
      ].map((item, i, arr) => (
        <ToggleRow
          key={item.key}
          title={item.title}
          description={item.desc}
          checked={Boolean(state[item.key as keyof NotificationSettings])}
          onChange={(v) => setState({ [item.key]: v })}
          last={i === arr.length - 1}
        />
      ))}

      <Divider label="Timing" />

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <SelectField
          label="Reminder Timing"
          value={state.reminderTiming}
          onChange={(e) => setState({ reminderTiming: e.target.value as ReminderTiming })}
        >
          <option value="1h">1 hour before</option>
          <option value="1d">1 day before (Recommended)</option>
          <option value="3d">3 days before</option>
          <option value="7d">7 days before</option>
        </SelectField>
        <SelectField
          label="Daily Digest Time"
          value={state.digestTime}
          onChange={(e) => setState({ digestTime: e.target.value })}
        >
          <option value="07:00">7:00 AM</option>
          <option value="08:00">8:00 AM</option>
          <option value="09:00">9:00 AM</option>
          <option value="18:00">6:00 PM</option>
        </SelectField>
      </div>

      <div className="mt-5">
        <Button onClick={() => addToast("Notification preferences saved")}>Save Preferences</Button>
      </div>
    </Card>
  );
}

// ── Legal Section ──────────────────────────────────────────────
function LegalSection({
  state,
  setState,
}: {
  state: LegalSettings;
  setState: (p: Partial<LegalSettings>) => void;
}) {
  const { addToast } = useToast();
  const PRIORITY_HINTS: Record<Priority, string> = {
    high:   "🔴 High — Immediate alerts for every case development",
    medium: "🟡 Medium — Alerts for major milestones only",
    low:    "🟢 Low — Weekly digest summary only",
  };

  return (
    <Card icon="⚖️" title="Legal Preferences" subtitle="Court-level settings, priority alerts, and AI features">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Preferred Court Level"
          value={state.courtLevel}
          onChange={(e) => setState({ courtLevel: e.target.value })}
        >
          <option>District Court</option>
          <option>High Court</option>
          <option>Supreme Court of India</option>
          <option>Tribunals & Forums</option>
        </SelectField>
        <SelectField
          label="Default State Jurisdiction"
          value={state.jurisdiction}
          onChange={(e) => setState({ jurisdiction: e.target.value })}
        >
          {["Maharashtra","Delhi","Karnataka","Tamil Nadu","Uttar Pradesh"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>
      </div>

      <Divider label="Case Priority Alert Level" />

      <div className="flex gap-2.5 mb-1">
        {(["high", "medium", "low"] as Priority[]).map((p) => {
          const DOT = { high: "#b03030", medium: "#c8962a", low: "#1a7a6a" };
          const ACT = {
            high:   "bg-[rgba(176,48,48,0.08)] border-[rgba(176,48,48,0.4)]",
            medium: "bg-[rgba(200,150,42,0.1)] border-[rgba(200,150,42,0.4)]",
            low:    "bg-[rgba(26,122,106,0.08)] border-[rgba(26,122,106,0.35)]",
          };
          const isActive = state.priority === p;
          return (
            <button
              key={p}
              onClick={() => setState({ priority: p })}
              className={[
                "flex-1 py-2 px-3 rounded-lg border-[1.5px] cursor-pointer flex flex-col items-center gap-1.5",
                "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md",
                isActive ? ACT[p] : "border-[#ddd6c2] bg-[#f0ece0]",
              ].join(" ")}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: DOT[p] }} />
              <span className="text-[11px] font-semibold text-[#3a4a62] capitalize">{p}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[#7a8aaa] mb-2">{PRIORITY_HINTS[state.priority]}</p>

      <Divider label="AI & Smart Features" />

      <ToggleRow
        title="🤖 Auto Case Summary"
        description="AI translates court orders into plain Hindi/English after each hearing"
        checked={state.autoSummary}
        onChange={(v) => setState({ autoSummary: v })}
      />
      <ToggleRow
        title="⚡ Delay Risk Prediction"
        description="AI flags cases likely to face scheduling delays based on court patterns"
        checked={state.delayPrediction}
        onChange={(v) => setState({ delayPrediction: v })}
      />
      <ToggleRow
        title="📖 Legal Term Simplifier"
        description="Replace complex legal jargon with plain-language explanations inline"
        checked={state.termSimplifier}
        onChange={(v) => setState({ termSimplifier: v })}
        last
      />

      <Divider label="Lawyer Communication" />

      <div className="grid grid-cols-4 gap-2">
        {(["email","sms","call","whatsapp"] as CommMode[]).map((m) => {
          const ICONS: Record<CommMode, string> = { email: "📧", sms: "📱", call: "📞", whatsapp: "💬" };
          const isActive = state.commMode === m;
          return (
            <button
              key={m}
              onClick={() => setState({ commMode: m })}
              className={[
                "py-2.5 px-2 rounded-lg cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-150",
                "border-[1.5px]",
                isActive ? "bg-[rgba(200,150,42,0.1)] border-[rgba(200,150,42,0.45)]" : "border-[#ddd6c2] bg-[#f0ece0] hover:border-[#c8962a]",
              ].join(" ")}
            >
              <span className="text-[18px]">{ICONS[m]}</span>
              <span className={`text-[11px] font-semibold capitalize ${isActive ? "text-[#c8962a]" : "text-[#3a4a62]"}`}>{m}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <Button onClick={() => addToast("Legal preferences saved")}>⚖️ Save Preferences</Button>
      </div>
    </Card>
  );
}

// ── Advanced Section ───────────────────────────────────────────
function AdvancedSection({
  consent,
  setConsent,
}: {
  consent: ConsentSettings;
  setConsent: (p: Partial<ConsentSettings>) => void;
}) {
  const { addToast } = useToast();
  return (
    <>
      <Card icon="🪪" title="Identity Verification" subtitle="Aadhaar e-KYC and government ID status">
        {/* Aadhaar card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1a3c] to-[#1a3060] rounded-xl p-5 mb-4">
          <span className="absolute right-2 top-0 text-[80px] opacity-5">⚖</span>
          <p className="text-[10px] text-[rgba(200,150,42,0.6)] uppercase tracking-widest mb-1">
            Aadhaar Number
          </p>
          <p className="font-mono text-[16px] font-medium text-[#f5e4b8] tracking-[0.2em]">
            XXXX  XXXX  4521
          </p>
          <div className="inline-flex items-center gap-1 mt-2.5 bg-[rgba(26,122,106,0.2)] text-[#22a08a] border border-[rgba(26,122,106,0.35)] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
            ✓ e-KYC Verified
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#3a4a62] uppercase tracking-widest">PAN Card Status</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#f0ece0] border border-[#ddd6c2] rounded-lg">
              <span className="font-mono text-[12px] text-[#1a2640]">ABCPS1234F</span>
              <StatusBadge variant="verified">✓ Linked</StatusBadge>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#3a4a62] uppercase tracking-widest">Bar Council ID</label>
            <div className="flex items-center px-3 py-2.5 bg-[#f0ece0] border border-[#ddd6c2] rounded-lg">
              <span className="text-[12px] text-[#7a8aaa]">Not applicable — Citizen</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => addToast("Aadhaar re-verification flow started", "info")}>
            🔁 Re-verify Aadhaar
          </Button>
          <Button variant="ghost" onClick={() => addToast("Linking PAN...", "info")}>
            + Link PAN
          </Button>
        </div>
      </Card>

      <Card icon="🛡" title="Data Privacy & Consent" subtitle="Manage how your data is used and shared">
        {(
          [
            { key: "courtDataProcessing", title: "Court data processing consent", desc: "Allow NyaySetu to fetch and display case data from eCourts on your behalf" },
            { key: "analytics", title: "Analytics and platform improvement", desc: "Share anonymised usage data to help improve NyaySetu for all citizens" },
            { key: "lawyerMatching", title: "Lawyer matching and referrals", desc: "Allow verified lawyers to see your case type for referral matching" },
            { key: "aiTraining", title: "AI model training (optional)", desc: "Contribute anonymised case data to improve legal AI tools" },
          ] as { key: keyof ConsentSettings; title: string; desc: string }[]
        ).map((item) => (
          <div
            key={item.key}
            className="flex items-start gap-3 p-3 bg-[#f0ece0] border border-[#ece8dc] rounded-lg mb-2 cursor-pointer hover:border-[#c8962a] transition-colors"
            onClick={() => setConsent({ [item.key]: !consent[item.key] })}
          >
            <div
              className={[
                "w-4.5 h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center",
                "flex-shrink-0 mt-0.5 text-[11px] text-white transition-all",
                consent[item.key]
                  ? "bg-[#0b1a3c] border-[#0b1a3c]"
                  : "bg-[#f9f7f2] border-[#ddd6c2]",
              ].join(" ")}
            >
              {consent[item.key] && "✓"}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1a2640]">{item.title}</p>
              <p className="text-[11px] text-[#7a8aaa] mt-0.5 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}

        <Divider label="Your Data" />
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => addToast("Preparing data export...", "info")}>
            ⬇ Download My Data
          </Button>
          <Button variant="outline" onClick={() => addToast("Account deletion request submitted")}>
            🗑 Request Account Deletion
          </Button>
        </div>
        <p className="text-[11px] text-[#7a8aaa] mt-3">
          Data export emailed within 24 hours. Deletion takes 30 days per DPDP Act 2023.
        </p>
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. MAIN SETTINGS PAGE
// ─────────────────────────────────────────────────────────────

const TABS: { id: SettingsTab; icon: string; label: string }[] = [
  { id: "account",       icon: "👤", label: "Account"       },
  { id: "security",      icon: "🔐", label: "Security"      },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "legal",         icon: "⚖️", label: "Legal"         },
  { id: "documents",     icon: "📂", label: "Documents"     },
  { id: "access",        icon: "🌐", label: "Language"      },
  { id: "advanced",      icon: "🚨", label: "Advanced"      },
];

function SettingsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  // Split state by section for clean updates
  const [profile, setProfileState] = useState(DEFAULT_STATE.profile);
  const [security, setSecurityState] = useState(DEFAULT_STATE.security);
  const [notifications, setNotificationsState] = useState(DEFAULT_STATE.notifications);
  const [legal, setLegalState] = useState(DEFAULT_STATE.legal);
  const [documents, setDocumentsState] = useState(DEFAULT_STATE.documents);
  const [accessibility, setAccessibilityState] = useState(DEFAULT_STATE.accessibility);
  const [consent, setConsentState] = useState(DEFAULT_STATE.consent);
  const [passwords, setPasswordsState] = useState<PasswordForm>({ current: "", newPwd: "", confirm: "" });

  const setProfile = (p: Partial<typeof profile>) => setProfileState((s) => ({ ...s, ...p }));
  const setSecurity = (p: Partial<typeof security>) => setSecurityState((s) => ({ ...s, ...p }));
  const setNotifications = (p: Partial<typeof notifications>) => setNotificationsState((s) => ({ ...s, ...p }));
  const setLegal = (p: Partial<typeof legal>) => setLegalState((s) => ({ ...s, ...p }));
  const setDocuments = (p: Partial<typeof documents>) => setDocumentsState((s) => ({ ...s, ...p }));
  const setAccessibility = (p: Partial<typeof accessibility>) => setAccessibilityState((s) => ({ ...s, ...p }));
  const setConsent = (p: Partial<typeof consent>) => setConsentState((s) => ({ ...s, ...p }));
  const setPasswords = (p: Partial<PasswordForm>) => setPasswordsState((s) => ({ ...s, ...p }));

  const { addToast } = useToast();

  return (
    <div className="flex h-screen max-w-full overflow-hidden bg-[#f0ece0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>


      {/* ── Right ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-[58px] flex-shrink-0 flex items-center px-7 gap-4 sticky top-0 z-20"
          style={{ background: "#f9f7f2", borderBottom: "1px solid #ddd6c2", boxShadow: "0 1px 0 #ece8dc" }}>
          <div>
            <h1 className="font-serif text-[17px] font-bold" style={{ color: "#0b1a3c" }}>Account Settings</h1>
            <p className="text-[11px]" style={{ color: "#7a8aaa" }}>
              Home <span style={{ color: "#c8962a" }}>›</span> Settings
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            {["🔔", "❓"].map((icon) => (
              <button key={icon} className="w-[34px] h-[34px] rounded-md flex items-center justify-center text-[15px] transition-all cursor-pointer"
                style={{ background: "#f0ece0", border: "1px solid #ddd6c2", color: "#3a4a62" }}>
                {icon}
              </button>
            ))}
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white cursor-pointer"
              style={{ background: "linear-gradient(135deg, #2a6ae0, #22a08a)", border: "2px solid #ddd6c2" }}>
              AS
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="flex-1 overflow-y-auto p-7">

          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-xl mb-6 flex-wrap" style={{ background: "#f9f7f2", border: "1px solid #ddd6c2" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 cursor-pointer border-none"
                style={activeTab === tab.id ? {
                  background: "#0b1a3c",
                  color: "#f5e4b8",
                  boxShadow: "0 2px 8px rgba(11,26,60,0.25)",
                } : {
                  background: "transparent",
                  color: "#3a4a62",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Section content */}
          {activeTab === "account" && (
            <AccountSection state={profile} setState={setProfile} />
          )}
          {activeTab === "security" && (
            <SecuritySection
              state={security}
              setState={setSecurity}
              passwords={passwords}
              setPasswords={setPasswords}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationsSection state={notifications} setState={setNotifications} />
          )}
          {activeTab === "legal" && (
            <LegalSection state={legal} setState={setLegal} />
          )}
          {activeTab === "documents" && (
            <Card icon="📂" title="Document Settings" subtitle="File preferences and security controls">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <SelectField label="Default File Format" value={documents.defaultFormat} onChange={(e) => setDocuments({ defaultFormat: e.target.value })}>
                  <option value="pdf">PDF (Recommended)</option>
                  <option value="docx">DOCX</option>
                  <option value="pdfa">PDF/A (Archival)</option>
                </SelectField>
                <SelectField label="Document Language" defaultValue="en">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bilingual</option>
                </SelectField>
              </div>
              <Divider label="Automation & Security" />
              {[
                { key: "autoDownload",    icon: "⬇", title: "Auto-Download Court Orders",    desc: "Automatically save signed orders to your document vault" },
                { key: "secureAccess",    icon: "🔒", title: "Secure Document Access",         desc: "Require PIN to open sensitive legal documents" },
                { key: "digiLockerSync", icon: "🔗", title: "DigiLocker Sync",                 desc: "Import Aadhaar, PAN and government docs from DigiLocker" },
                { key: "eSign",          icon: "✍", title: "Digital Signature (eSign)",       desc: "Enable Aadhaar-based digital signatures on petitions" },
              ].map((item, i, arr) => (
                <ToggleRow
                  key={item.key}
                  icon={item.icon}
                  title={item.title}
                  description={item.desc}
                  checked={Boolean(documents[item.key as keyof DocumentSettings])}
                  onChange={(v) => setDocuments({ [item.key]: v })}
                  last={i === arr.length - 1}
                />
              ))}
              <div className="mt-5">
                <Button onClick={() => addToast("Document settings saved")}>💾 Save Settings</Button>
              </div>
            </Card>
          )}
          {activeTab === "access" && (
            <Card icon="🌐" title="Language & Accessibility" subtitle="Personalise your reading and display preferences">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <SelectField label="Interface Language" value={accessibility.language} onChange={(e) => setAccessibility({ language: e.target.value as Language })}>
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिन्दी — Hindi</option>
                  <option value="mr">🟧 मराठी — Marathi</option>
                  <option value="ta">🟦 தமிழ் — Tamil</option>
                </SelectField>
                <SelectField label="Legal Document Language" defaultValue="en">
                  <option>English (Default)</option>
                  <option>Bilingual</option>
                  <option>Regional only</option>
                </SelectField>
              </div>
              <Divider label="Display Theme" />
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {([["light","☀️","Light","Clean ivory"],["dark","🌙","Dark","Deep navy"],["system","⚙️","System","OS default"]] as const).map(([v,icon,name,desc]) => (
                  <button key={v} onClick={() => { setAccessibility({ theme: v }); addToast(`Theme set to ${name}`); }}
                    className="py-3.5 px-2 rounded-xl cursor-pointer text-center transition-all duration-150 border-[1.5px]"
                    style={accessibility.theme === v ? { background: "rgba(200,150,42,0.06)", borderColor: "#c8962a" } : { background: "#f0ece0", borderColor: "#ddd6c2" }}>
                    <div className="text-[20px] mb-1.5">{icon}</div>
                    <div className="text-[12px] font-semibold" style={{ color: accessibility.theme === v ? "#c8962a" : "#1a2640" }}>{name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#7a8aaa" }}>{desc}</div>
                  </button>
                ))}
              </div>
              <Divider label="Font Size" />
              <div className="flex gap-2 mb-1">
                {([["sm","A",13],["md","A",16],["lg","A",20],["xl","A",24]] as const).map(([v,,sz]) => (
                  <button key={v} onClick={() => setAccessibility({ fontSize: v })}
                    className="flex-1 py-2.5 rounded-xl cursor-pointer flex items-center justify-center transition-all border-[1.5px]"
                    style={{
                      fontSize: sz,
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontWeight: 700,
                      background: accessibility.fontSize === v ? "rgba(11,26,60,0.07)" : "#f0ece0",
                      borderColor: accessibility.fontSize === v ? "#0b1a3c" : "#ddd6c2",
                      color: accessibility.fontSize === v ? "#0b1a3c" : "#3a4a62",
                    }}>
                    A
                  </button>
                ))}
              </div>
              <p className="text-[10px] mb-4" style={{ color: "#7a8aaa" }}>Small / Medium / Large / Extra Large</p>
              <Divider label="Accessibility" />
              {[
                { key: "highContrast",  icon: "🎨", title: "High Contrast Mode",   desc: "Increase text/background contrast for better readability" },
                { key: "reduceMotion",  icon: "⏸",  title: "Reduce Motion",         desc: "Minimise animations for users with motion sensitivity" },
                { key: "screenReader", icon: "🔊", title: "Screen Reader Mode",    desc: "Enhanced ARIA labels and keyboard navigation" },
              ].map((item, i, arr) => (
                <ToggleRow
                  key={item.key}
                  icon={item.icon}
                  title={item.title}
                  description={item.desc}
                  checked={Boolean(accessibility[item.key as keyof AccessibilitySettings])}
                  onChange={(v) => setAccessibility({ [item.key]: v })}
                  last={i === arr.length - 1}
                />
              ))}
              <div className="mt-5">
                <Button onClick={() => addToast("Accessibility settings saved")}>🌐 Save Preferences</Button>
              </div>
            </Card>
          )}
          {activeTab === "advanced" && (
            <AdvancedSection consent={consent} setConsent={setConsent} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. ROOT EXPORT
// ─────────────────────────────────────────────────────────────

export default function NyayaSetuSettingsApp(): React.ReactElement {
  return (
    <ToastProvider>
      <SettingsPage />
    </ToastProvider>
  );
}
