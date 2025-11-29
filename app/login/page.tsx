"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";

/**
 * Onboarding / Auth page
 * - Combined Signup + Login glassmorphic UI
 * - Accessible tab + segmented control
 * - Client-side validation with inline errors
 * - Role-specific forms for Contributors and Advisory Board
 * - Minimal, self-contained (frontend only)
 * NOTE: Backend must hash passwords; never log raw passwords here.
 */

type Mode = "signup" | "login";
type RoleType = "advisory" | "contributor";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  contributorRole?: string;
  contributorRoleOther?: string;
  contributorExperience?: string;
  contributorTechnique?: string;
  contributorTechniqueOther?: string;
  advisoryPositionTitle?: string;
  advisoryExperience?: string;
  advisoryDomain?: string;
  advisoryFeatures?: string;
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
function validateContributorRole(v: string) {
  if (!v) return "Select a contributor role.";
}
function validateContributorRoleOther(v: string, role: string) {
  if (role === "other" && !v.trim())
    return "Describe your contributor role.";
}
function validateContributorExperience(v: string) {
  if (!v.trim()) return "Share a bit about your experience.";
  if (v.trim().length < 20)
    return "Please provide at least 20 characters.";
}
function validateContributorTechnique(v: string) {
  if (!v) return "Select a preferred technique.";
}
function validateContributorTechniqueOther(v: string, technique: string) {
  if (technique === "other" && !v.trim())
    return "Describe the technique you use.";
}
function validateAdvisoryPositionTitle(v: string) {
  if (!v.trim()) return "Position title is required.";
}
function validateAdvisoryExperience(v: string) {
  if (!v.trim()) return "Experience detail is required.";
}
function validateAdvisoryDomain(v: string) {
  if (!v.trim()) return "Domain is required.";
}
function validateAdvisoryFeatures(v: string) {
  if (!v.trim()) return "Please share the features you expect.";
  if (v.trim().length < 20)
    return "Provide at least 20 characters so we can learn more.";
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
  const [subRole, setSubRole] = useState<RoleType>("advisory");
  const [reduceMotion, setReduceMotion] = useState(false);

  // Form state
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    remember: false,
    contributorRole: "",
    contributorRoleOther: "",
    contributorExperience: "",
    contributorTechnique: "",
    contributorTechniqueOther: "",
    advisoryPositionTitle: "",
    advisoryExperience: "",
    advisoryDomain: "",
    advisoryFeatures: "",
  };
  type ValueKey = keyof typeof defaultValues;
  const [values, setValues] = useState(defaultValues);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (mode !== "signup") return;
    setErrors((prev) => {
      const next = { ...prev };
      if (subRole === "contributor") {
        delete next.advisoryPositionTitle;
        delete next.advisoryExperience;
        delete next.advisoryDomain;
        delete next.advisoryFeatures;
      } else {
        delete next.contributorRole;
        delete next.contributorRoleOther;
        delete next.contributorExperience;
        delete next.contributorTechnique;
        delete next.contributorTechniqueOther;
      }
      return next;
    });
  }, [subRole, mode]);

  // Validate a single field onBlur for accessible inline feedback
  const validateField = useCallback(
    (field: ValueKey) => {
      let err: string | undefined;
      if (mode === "signup") {
        if (field === "name") err = validateName(values.name);
        if (field === "email") err = validateEmail(values.email);
        if (field === "password") err = validatePassword(values.password);

        if (subRole === "contributor") {
          if (field === "contributorRole")
            err = validateContributorRole(values.contributorRole);
          if (field === "contributorRoleOther")
            err = validateContributorRoleOther(
              values.contributorRoleOther,
              values.contributorRole,
            );
          if (field === "contributorExperience")
            err = validateContributorExperience(values.contributorExperience);
          if (field === "contributorTechnique")
            err = validateContributorTechnique(values.contributorTechnique);
          if (field === "contributorTechniqueOther")
            err = validateContributorTechniqueOther(
              values.contributorTechniqueOther,
              values.contributorTechnique,
            );
        }

        if (subRole === "advisory") {
          if (field === "advisoryPositionTitle")
            err = validateAdvisoryPositionTitle(
              values.advisoryPositionTitle,
            );
          if (field === "advisoryExperience")
            err = validateAdvisoryExperience(values.advisoryExperience);
          if (field === "advisoryDomain")
            err = validateAdvisoryDomain(values.advisoryDomain);
          if (field === "advisoryFeatures")
            err = validateAdvisoryFeatures(values.advisoryFeatures);
        }
      } else {
        // login mode
        if (field === "email") err = validateEmail(values.email);
        if (field === "password") err = validatePassword(values.password);
      }
      setErrors((prev) => ({ ...prev, [field]: err }));
    },
    [values, mode, subRole],
  );

  const runFullValidation = () => {
    const next: FieldErrors = {};
    if (mode === "signup") {
      next.name = validateName(values.name);
      next.email = validateEmail(values.email);
      next.password = validatePassword(values.password);

      if (subRole === "contributor") {
        next.contributorRole = validateContributorRole(values.contributorRole);
        next.contributorRoleOther = validateContributorRoleOther(
          values.contributorRoleOther,
          values.contributorRole,
        );
        next.contributorExperience = validateContributorExperience(
          values.contributorExperience,
        );
        next.contributorTechnique = validateContributorTechnique(
          values.contributorTechnique,
        );
        next.contributorTechniqueOther = validateContributorTechniqueOther(
          values.contributorTechniqueOther,
          values.contributorTechnique,
        );
      } else {
        next.advisoryPositionTitle = validateAdvisoryPositionTitle(
          values.advisoryPositionTitle,
        );
        next.advisoryExperience = validateAdvisoryExperience(
          values.advisoryExperience,
        );
        next.advisoryDomain = validateAdvisoryDomain(values.advisoryDomain);
        next.advisoryFeatures = validateAdvisoryFeatures(
          values.advisoryFeatures,
        );
      }
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
      const isSignup = mode === "signup";
      const signupPayload = isSignup
        ? {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
            roleType: subRole,
            contributor:
              subRole === "contributor"
                ? {
                    role: values.contributorRole,
                    roleOther:
                      values.contributorRole === "other"
                        ? values.contributorRoleOther.trim()
                        : undefined,
                    experienceText: values.contributorExperience.trim(),
                    technique: values.contributorTechnique,
                    techniqueOther:
                      values.contributorTechnique === "other"
                        ? values.contributorTechniqueOther.trim()
                        : undefined,
                  }
                : undefined,
            advisory:
              subRole === "advisory"
                ? {
                    positionTitle: values.advisoryPositionTitle.trim(),
                    experienceYears: values.advisoryExperience.trim(),
                    domain: values.advisoryDomain.trim(),
                    lmsFeatures: values.advisoryFeatures.trim(),
                  }
                : undefined,
          }
        : null;

      const res = isSignup
        ? await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupPayload),
          })
        : await fetch(
            `/api/login?${new URLSearchParams({
              email: values.email.trim(),
              password: values.password,
              remember: values.remember ? "true" : "false",
            }).toString()}`,
            {
              method: "GET",
              headers: { Accept: "application/json" },
            },
          );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGlobalError(
          data?.error ||
            data?.message ||
            "There was a problem. Please verify your details and try again.",
        );
      } else {
        // Log safe payload example (excluding password)
        console.info("Auth success", {
          type: isSignup ? "signup" : "login",
          email: values.email.trim(),
          roleType: isSignup
            ? signupPayload?.roleType
            : data?.user?.roleType,
        });
        setSuccessMessage(
          isSignup
            ? "Signup successful! Welcome aboard."
            : "Login successful!",
        );
        // Optionally clear password / reset form for signup
        setValues((prev) =>
          isSignup
            ? {
                ...defaultValues,
                email: prev.email,
              }
            : { ...prev, password: "" },
        );
      }
    } catch (err: unknown) {
      setGlobalError("Network error. Please retry shortly.");
      console.error("Auth error", err);
    } finally {
      setLoading(false);
    }
  };

  // Accessible keyboard navigation for top-level tabs
  const handleTabKey = (
    e: React.KeyboardEvent<HTMLElement>,
    current: Mode,
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setMode(current === "signup" ? "login" : "signup");
    }
  };

  const handleSubRoleKey = (
    e: React.KeyboardEvent<HTMLElement>,
    current: RoleType,
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

            {mode === "signup" && subRole === "contributor" && (
              <section className="space-y-5">
                <div>
                  <label
                    htmlFor="contributorRole"
                    className="block text-sm font-medium mb-1"
                  >
                    Contributor role<span className="text-pink-300"> *</span>
                  </label>
                  <select
                    id="contributorRole"
                    name="contributorRole"
                    disabled={loading}
                    value={values.contributorRole}
                    onChange={handleChange}
                    onBlur={() => validateField("contributorRole")}
                    aria-invalid={!!errors.contributorRole}
                    aria-describedby={
                      errors.contributorRole ? "error-contributor-role" : undefined
                    }
                    className={inputClass(errors.contributorRole)}
                  >
                    <option value="">Select a role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="psychologist">Psychologist</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.contributorRole && (
                    <p
                      id="error-contributor-role"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.contributorRole}
                    </p>
                  )}
                </div>

                {values.contributorRole === "other" && (
                  <div>
                    <label
                      htmlFor="contributorRoleOther"
                      className="block text-sm font-medium mb-1"
                    >
                      Describe your role<span className="text-pink-300"> *</span>
                    </label>
                    <input
                      id="contributorRoleOther"
                      name="contributorRoleOther"
                      type="text"
                      disabled={loading}
                      value={values.contributorRoleOther}
                      onChange={handleChange}
                      onBlur={() => validateField("contributorRoleOther")}
                      aria-invalid={!!errors.contributorRoleOther}
                      aria-describedby={
                        errors.contributorRoleOther
                          ? "error-contributor-role-other"
                          : undefined
                      }
                      className={inputClass(errors.contributorRoleOther)}
                      placeholder="Tell us your title"
                    />
                    {errors.contributorRoleOther && (
                      <p
                        id="error-contributor-role-other"
                        className="mt-1 text-xs text-red-300"
                      >
                        {errors.contributorRoleOther}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contributorExperience"
                    className="block text-sm font-medium mb-1"
                  >
                    Tell us about your experience
                    <span className="text-pink-300"> *</span>
                  </label>
                  <textarea
                    id="contributorExperience"
                    name="contributorExperience"
                    disabled={loading}
                    value={values.contributorExperience}
                    onChange={handleChange}
                    onBlur={() => validateField("contributorExperience")}
                    aria-invalid={!!errors.contributorExperience}
                    aria-describedby={
                      errors.contributorExperience
                        ? "error-contributor-experience"
                        : "contributor-experience-hint"
                    }
                    className={
                      inputClass(errors.contributorExperience) +
                      " min-h-[110px] resize-y"
                    }
                    placeholder="Share highlights, projects, or goals in 20+ characters"
                  />
                  {!errors.contributorExperience && (
                    <p
                      id="contributor-experience-hint"
                      className="mt-1 text-[11px] text-slate-400"
                    >
                      Helps us understand how you want to collaborate.
                    </p>
                  )}
                  {errors.contributorExperience && (
                    <p
                      id="error-contributor-experience"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.contributorExperience}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contributorTechnique"
                    className="block text-sm font-medium mb-1"
                  >
                    Which technique keeps you focused?
                    <span className="text-pink-300"> *</span>
                  </label>
                  <select
                    id="contributorTechnique"
                    name="contributorTechnique"
                    disabled={loading}
                    value={values.contributorTechnique}
                    onChange={handleChange}
                    onBlur={() => validateField("contributorTechnique")}
                    aria-invalid={!!errors.contributorTechnique}
                    aria-describedby={
                      errors.contributorTechnique
                        ? "error-contributor-technique"
                        : undefined
                    }
                    className={inputClass(errors.contributorTechnique)}
                  >
                    <option value="">Select a technique</option>
                    <option value="pomodoro">Pomodoro (25/5)</option>
                    <option value="45/15">45/15</option>
                    <option value="flow">Deep Flow</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.contributorTechnique && (
                    <p
                      id="error-contributor-technique"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.contributorTechnique}
                    </p>
                  )}
                </div>

                {values.contributorTechnique === "other" && (
                  <div>
                    <label
                      htmlFor="contributorTechniqueOther"
                      className="block text-sm font-medium mb-1"
                    >
                      Tell us the technique<span className="text-pink-300"> *</span>
                    </label>
                    <input
                      id="contributorTechniqueOther"
                      name="contributorTechniqueOther"
                      type="text"
                      disabled={loading}
                      value={values.contributorTechniqueOther}
                      onChange={handleChange}
                      onBlur={() => validateField("contributorTechniqueOther")}
                      aria-invalid={!!errors.contributorTechniqueOther}
                      aria-describedby={
                        errors.contributorTechniqueOther
                          ? "error-contributor-technique-other"
                          : undefined
                      }
                      className={inputClass(errors.contributorTechniqueOther)}
                      placeholder="e.g. Time-blocking"
                    />
                    {errors.contributorTechniqueOther && (
                      <p
                        id="error-contributor-technique-other"
                        className="mt-1 text-xs text-red-300"
                      >
                        {errors.contributorTechniqueOther}
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}

            {mode === "signup" && subRole === "advisory" && (
              <section className="space-y-5">
                <div>
                  <label
                    htmlFor="advisoryPositionTitle"
                    className="block text-sm font-medium mb-1"
                  >
                    Role / Position title
                    <span className="text-pink-300"> *</span>
                  </label>
                  <input
                    id="advisoryPositionTitle"
                    name="advisoryPositionTitle"
                    type="text"
                    disabled={loading}
                    value={values.advisoryPositionTitle}
                    onChange={handleChange}
                    onBlur={() => validateField("advisoryPositionTitle")}
                    aria-invalid={!!errors.advisoryPositionTitle}
                    aria-describedby={
                      errors.advisoryPositionTitle
                        ? "error-advisory-position"
                        : undefined
                    }
                    className={inputClass(errors.advisoryPositionTitle)}
                    placeholder="e.g. Director of Learning"
                  />
                  {errors.advisoryPositionTitle && (
                    <p
                      id="error-advisory-position"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.advisoryPositionTitle}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="advisoryExperience"
                    className="block text-sm font-medium mb-1"
                  >
                    Experience (years or summary)
                    <span className="text-pink-300"> *</span>
                  </label>
                  <input
                    id="advisoryExperience"
                    name="advisoryExperience"
                    type="text"
                    disabled={loading}
                    value={values.advisoryExperience}
                    onChange={handleChange}
                    onBlur={() => validateField("advisoryExperience")}
                    aria-invalid={!!errors.advisoryExperience}
                    aria-describedby={
                      errors.advisoryExperience
                        ? "error-advisory-experience"
                        : undefined
                    }
                    className={inputClass(errors.advisoryExperience)}
                    placeholder="15 years leading curriculum teams"
                  />
                  {errors.advisoryExperience && (
                    <p
                      id="error-advisory-experience"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.advisoryExperience}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="advisoryDomain"
                    className="block text-sm font-medium mb-1"
                  >
                    Domain of experience<span className="text-pink-300"> *</span>
                  </label>
                  <input
                    id="advisoryDomain"
                    name="advisoryDomain"
                    type="text"
                    disabled={loading}
                    value={values.advisoryDomain}
                    onChange={handleChange}
                    onBlur={() => validateField("advisoryDomain")}
                    aria-invalid={!!errors.advisoryDomain}
                    aria-describedby={
                      errors.advisoryDomain ? "error-advisory-domain" : undefined
                    }
                    className={inputClass(errors.advisoryDomain)}
                    placeholder="K-12 STEM, Higher-Ed Analytics, etc."
                  />
                  {errors.advisoryDomain && (
                    <p
                      id="error-advisory-domain"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.advisoryDomain}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="advisoryFeatures"
                    className="block text-sm font-medium mb-1"
                  >
                    What features are perfect for an LMS/ERP?
                    <span className="text-pink-300"> *</span>
                  </label>
                  <textarea
                    id="advisoryFeatures"
                    name="advisoryFeatures"
                    disabled={loading}
                    value={values.advisoryFeatures}
                    onChange={handleChange}
                    onBlur={() => validateField("advisoryFeatures")}
                    aria-invalid={!!errors.advisoryFeatures}
                    aria-describedby={
                      errors.advisoryFeatures
                        ? "error-advisory-features"
                        : "advisory-features-hint"
                    }
                    className={
                      inputClass(errors.advisoryFeatures) +
                      " min-h-[120px] resize-y"
                    }
                    placeholder="Share the must-haves you expect from a modern platform"
                  />
                  {!errors.advisoryFeatures && (
                    <p
                      id="advisory-features-hint"
                      className="mt-1 text-[11px] text-slate-400"
                    >
                      Your insight guides what we build next.
                    </p>
                  )}
                  {errors.advisoryFeatures && (
                    <p
                      id="error-advisory-features"
                      className="mt-1 text-xs text-red-300"
                    >
                      {errors.advisoryFeatures}
                    </p>
                  )}
                </div>
              </section>
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
Example successful contributor signup POST:
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'signup',
    name: 'Jane Doe',
    email: 'jane@demo.com',
    password: 'CorrectHorseBattery1',
    roleType: 'contributor',
    contributor: {
      role: 'teacher',
      experienceText: 'I run self-paced maker labs for high schoolers...',
      technique: 'pomodoro',
    },
  }),
});

Example successful advisory signup POST:
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'signup',
    name: 'Alex Kim',
    email: 'alex@demo.com',
    password: 'CorrectHorseBattery1',
    roleType: 'advisory',
    advisory: {
      positionTitle: 'Dean of Academics',
      experienceYears: '18',
      domain: 'Higher Education',
      lmsFeatures: 'Analytics dashboards, SIS integrations, and competency tracking.',
    },
  }),
});

Example successful login GET:
fetch(`/api/login?${new URLSearchParams({
  email: 'jane@demo.com',
  password: 'CorrectHorseBattery1',
  remember: 'true',
}).toString()}`);
*/
