"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";

/**
 * Onboarding / Auth page
 * - Combined Signup + Login glassmorphic UI
 * - Accessible tab + segmented control
 * - Client-side validation with inline errors
 * - Minimal, self-contained (frontend only)
 * NOTE: Backend must hash passwords; never log raw passwords here.
 */

type Mode = "signup" | "login";
type SubRole = "advisory" | "contributor";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  expertise?: string;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/* Validation helpers return an error message or undefined */
function validateName(v: string) {
  if (!v.trim()) return "Name is required.";
  if (v.trim().length < 2) return "Name must be at least 2 characters.";
}
function validateEmail(v: string) {
  if (!v.trim()) return "Email is required.";
  if (!emailRegex.test(v)) return "Enter a valid email address.";
}
function validatePassword(v: string) {
  if (!v) return "Password is required.";
  if (!passwordStrengthRegex.test(v))
    return "Min 8 chars incl. uppercase, lowercase, and number.";
}
function validateRole(v: string) {
  if (!v) return "Role is required.";
}
function validateExpertise(v: string, role: string) {
  if (role === "Advisor") {
    if (!v.trim()) return "Expertise is required for Advisors.";
    if (v.trim().length < 20)
      return "Provide at least 20 characters describing expertise.";
  }
  // Contributor: optional (no error)
}

/* Simple spinner (respects reduced motion preference by fallback static icon) */
const Spinner: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => (
  <div
    className={
      "w-5 h-5 rounded-full border-2 border-white/60 border-t-transparent " +
      (reduceMotion ? "" : "animate-spin")
    }
    aria-label="Loading"
  />
);

export default function Page() {
  const [mode, setMode] = useState<Mode>("signup");
  const [subRole, setSubRole] = useState<SubRole>("advisory");
  const [reduceMotion, setReduceMotion] = useState(false);

  // Form state
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "Advisor", // default aligns with subRole 'advisory'
    expertise: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync role dropdown when subRole changes IF user has not manually changed role away
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      role: subRole === "advisory" ? "Advisor" : "Contributor",
    }));
  }, [subRole]);

  // Prefers-reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduceMotion(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate a single field onBlur for accessible inline feedback
  const validateField = useCallback(
    (field: keyof typeof values) => {
      let err: string | undefined;
      if (mode === "signup") {
        if (field === "name") err = validateName(values.name);
        if (field === "email") err = validateEmail(values.email);
        if (field === "password") err = validatePassword(values.password);
        if (field === "role") err = validateRole(values.role);
        if (field === "expertise")
          err = validateExpertise(values.expertise, values.role);
      } else {
        // login mode
        if (field === "email") err = validateEmail(values.email);
        if (field === "password") err = validatePassword(values.password);
      }
      setErrors((prev) => ({ ...prev, [field]: err }));
    },
    [values, mode],
  );

  const runFullValidation = () => {
    const next: FieldErrors = {};
    if (mode === "signup") {
      next.name = validateName(values.name);
      next.email = validateEmail(values.email);
      next.password = validatePassword(values.password);
      next.role = validateRole(values.role);
      next.expertise = validateExpertise(values.expertise, values.role);
    } else {
      next.email = validateEmail(values.email);
      next.password = validatePassword(values.password);
    }
    // Strip undefined fields
    Object.keys(next).forEach((k) => {
      if (!next[k as keyof FieldErrors]) delete next[k as keyof FieldErrors];
    });
    setErrors(next);
    return next;
  };

  const hasErrors = (errs: FieldErrors) => Object.keys(errs).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setSuccessMessage(null);
    const vErrs = runFullValidation();
    if (hasErrors(vErrs)) {
      // Focus first error field
      const firstKey = Object.keys(vErrs)[0] as keyof FieldErrors;
      const el = document.querySelector(
        `[name="${firstKey}"]`,
      ) as HTMLElement | null;
      el?.focus();
      return;
    }
    setLoading(true);
    try {
      const payload =
        mode === "signup"
          ? {
              type: "signup",
              name: values.name.trim(),
              email: values.email.trim(),
              password: values.password,
              role: values.role,
              expertise: values.expertise.trim(),
            }
          : {
              type: "login",
              email: values.email.trim(),
              password: values.password,
              remember: values.remember,
            };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGlobalError(
          data?.message ||
            "There was a problem. Please verify your details and try again.",
        );
      } else {
        // Log safe payload example (excluding password)
        console.info("Auth success", {
          type: payload.type,
          email: values.email.trim(),
          role: mode === "signup" ? values.role : undefined,
        });
        setSuccessMessage(
          mode === "signup"
            ? "Signup successful! Welcome aboard."
            : "Login successful!",
        );
        // Optionally clear password
        setValues((prev) => ({ ...prev, password: "" }));
      }
    } catch (err: any) {
      setGlobalError("Network error. Please retry shortly.");
    } finally {
      setLoading(false);
    }
  };

  // Accessible keyboard navigation for top-level tabs
  const handleTabKey = (
    e: React.KeyboardEvent<HTMLDivElement>,
    current: Mode,
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setMode(current === "signup" ? "login" : "signup");
    }
  };

  const handleSubRoleKey = (
    e: React.KeyboardEvent<HTMLDivElement>,
    current: SubRole,
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setSubRole(current === "advisory" ? "contributor" : "advisory");
    }
  };

  const passwordStrength = !values.password
    ? ""
    : passwordStrengthRegex.test(values.password)
      ? "Strong"
      : values.password.length >= 8
        ? "Weak"
        : "Too short";

  useEffect(() => {
    // Trigger mount animations
    setMounted(true);
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-black from-5%  to-[#0B0048] text-slate-100 transition-colors">
      <Navbar />
      <div
        className={
          "w-full max-w-xl rounded-3xl border border-white/30 bg-black/20  backdrop-blur-xl shadow-2xl shadow-blue-950/60 p-6 sm:p-8 relative transition-all duration-700 ease-out " +
          (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")
        }
        style={{
          WebkitBackdropFilter: "blur(20px)",
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
        }}
      >
        {/* Top-level tabs */}
        <div
          role="tablist"
          aria-label="Authentication modes"
          className="flex gap-2 mb-6"
        >
          <button
            role="tab"
            id="tab-signup"
            aria-controls="panel-signup"
            aria-selected={mode === "signup"}
            tabIndex={mode === "signup" ? 0 : -1}
            onClick={() => setMode("signup")}
            onKeyDown={(e) => handleTabKey(e, mode)}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-white/60 ${
              mode === "signup"
                ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-inner"
                : "bg-blue-950/40 hover:bg-blue-900/50 text-slate-200"
            }`}
          >
            Sign Up
          </button>
          <button
            role="tab"
            id="tab-login"
            aria-controls="panel-login"
            aria-selected={mode === "login"}
            tabIndex={mode === "login" ? 0 : -1}
            onClick={() => setMode("login")}
            onKeyDown={(e) => handleTabKey(e, mode)}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-white/60 ${
              mode === "login"
                ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-inner"
                : "bg-blue-950/40 hover:bg-blue-900/50 text-slate-200"
            }`}
          >
            Login
          </button>
        </div>

        {/* Sub-role segmented (only for signup) */}
        {mode === "signup" && (
          <div
            role="tablist"
            aria-label="Signup role selection"
            className="flex mb-6 rounded-full bg-white/5 p-1"
          >
            <button
              role="tab"
              id="subtab-advisory"
              aria-controls="panel-signup"
              aria-selected={subRole === "advisory"}
              tabIndex={subRole === "advisory" ? 0 : -1}
              onClick={() => setSubRole("advisory")}
              onKeyDown={(e) => handleSubRoleKey(e, subRole)}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm rounded-full transition-colors focus:outline-none focus-visible:ring-2 ring-white/50 ${
                subRole === "advisory"
                  ? "bg-blue-700/80 text-white"
                  : "text-slate-200 hover:bg-blue-900/40"
              }`}
            >
              Advisory Board
            </button>
            <button
              role="tab"
              id="subtab-contributor"
              aria-controls="panel-signup"
              aria-selected={subRole === "contributor"}
              tabIndex={subRole === "contributor" ? 0 : -1}
              onClick={() => setSubRole("contributor")}
              onKeyDown={(e) => handleSubRoleKey(e, subRole)}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm rounded-full transition-colors focus:outline-none focus-visible:ring-2 ring-white/50 ${
                subRole === "contributor"
                  ? "bg-blue-700/80 text-white"
                  : "text-slate-200 hover:bg-blue-900/40"
              }`}
            >
              Contributor
            </button>
          </div>
        )}

        {/* Panels */}
        <div
          role="tabpanel"
          id={`panel-${mode}`}
          aria-labelledby={`tab-${mode}`}
        >
          {globalError && (
            <div
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {globalError}
            </div>
          )}
          {successMessage && (
            <div
              className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200"
              role="status"
            >
              {successMessage}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
            aria-describedby="password-requirements"
          >
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name<span className="text-pink-300"> *</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  disabled={loading}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={() => validateField("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "error-name" : undefined}
                  className={inputClass(errors.name)}
                  placeholder="Jane Doe"
                />
                {errors.name && (
                  <p id="error-name" className="mt-1 text-xs text-red-300">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email<span className="text-pink-300"> *</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled={loading}
                value={values.email}
                onChange={handleChange}
                onBlur={() => validateField("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "error-email" : undefined}
                className={inputClass(errors.email)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p id="error-email" className="mt-1 text-xs text-red-300">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password<span className="text-pink-300"> *</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={() => validateField("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password
                      ? "error-password"
                      : "password-hint password-requirements"
                  }
                  className={inputClass(errors.password) + " pr-14"}
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 ring-indigo-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <p id="password-hint" className="text-[11px] text-slate-300">
                  Strength: {passwordStrength || "—"}
                </p>
                <p
                  id="password-requirements"
                  className="text-[11px] text-slate-400"
                >
                  Requires 8+ chars incl. upper, lower & number.
                </p>
              </div>
              {errors.password && (
                <p id="error-password" className="mt-1 text-xs text-red-300">
                  {errors.password}
                </p>
              )}
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium mb-1"
                  >
                    Role<span className="text-pink-300"> *</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    disabled={loading}
                    value={values.role}
                    onChange={handleChange}
                    onBlur={() => validateField("role")}
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "error-role" : undefined}
                    className={inputClass(errors.role)}
                  >
                    <option value="">Select a role</option>
                    <option value="Advisor">Advisor</option>
                    <option value="Contributor">Contributor</option>
                  </select>
                  {errors.role && (
                    <p id="error-role" className="mt-1 text-xs text-red-300">
                      {errors.role}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="expertise"
                    className="block text-sm font-medium mb-1"
                  >
                    Expertise{" "}
                    {values.role === "Advisor" && (
                      <span className="text-pink-300">*</span>
                    )}
                  </label>
                  <textarea
                    id="expertise"
                    name="expertise"
                    disabled={loading}
                    value={values.expertise}
                    onChange={handleChange}
                    onBlur={() => validateField("expertise")}
                    aria-invalid={!!errors.expertise}
                    aria-describedby={
                      errors.expertise ? "error-expertise" : "expertise-hint"
                    }
                    className={
                      inputClass(errors.expertise) + " min-h-[100px] resize-y"
                    }
                    placeholder={
                      values.role === "Advisor"
                        ? "Describe your domain expertise..."
                        : "Optional. Share relevant skills (recommended ≥ 20 chars)"
                    }
                  />
                  {!errors.expertise && (
                    <p
                      id="expertise-hint"
                      className="mt-1 text-[11px] text-slate-400"
                    >
                      {values.role === "Advisor"
                        ? "Required; help evaluators understand your background."
                        : "Optional, but helps us match opportunities."}
                    </p>
                  )}
                  {errors.expertise && (
                    <p
                      id="error-expertise"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.expertise}
                    </p>
                  )}
                </div>
              </>
            )}

            {mode === "login" && (
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={values.remember}
                  disabled={loading}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-400 focus:outline-none"
                />
                <label htmlFor="remember" className="text-sm text-slate-200">
                  Remember me (device only)
                </label>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 focus:outline-none focus-visible:ring-2 ring-white/70 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading && <Spinner reduceMotion={reduceMotion} />}
                {mode === "signup" ? "Create Account" : "Log In"}
              </button>
            </div>
          </form>
        </div>

        {/* Subtle corner decoration */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-white/30" />
      </div>
    </main>
  );
}

/* Tailwind utility builder for inputs (adds error styles conditionally) */
function inputClass(hasError?: string) {
  return (
    "w-full rounded-xl bg-white/10 border px-3 py-2 text-sm text-slate-100 placeholder-slate-400 " +
    "focus:outline-none focus-visible:ring-2 ring-indigo-400 transition-colors " +
    (hasError
      ? "border-red-400 focus-visible:ring-red-400"
      : "border-white/20 hover:border-white/40")
  );
}

/*
Security notes (client-side):
- Password only held in memory; not logged; clearing after success.
- Backend endpoint /api/login must enforce hashing, rate limiting, and server-side validation.
*/

/*
Example successful signup POST:
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'signup',
    name: 'Jane Doe',
    email: 'jane@demo.com',
    password: 'CorrectHorseBattery1',
    role: 'Advisor',
    expertise: '15 years in healthcare innovation...',
  }),
});

Example successful login POST:
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'login',
    email: 'jane@demo.com',
    password: 'CorrectHorseBattery1',
    remember: true,
  }),
});
*/
