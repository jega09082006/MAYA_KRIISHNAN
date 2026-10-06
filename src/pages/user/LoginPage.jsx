import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock, User, AlertCircle, ArrowRight, CheckCircle2,
  Phone, UserCheck, ShieldCheck, Sparkles, ShoppingBag,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useLang } from "../../context/LanguageContext";
import PageTransition from "../../components/PageTransition";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Read + clear the sessionStorage redirect path (refresh-safe backup). */
function consumeSessionRedirect() {
  try {
    const path = sessionStorage.getItem("redirectAfterLogin");
    sessionStorage.removeItem("redirectAfterLogin");
    return path;
  } catch (_) {
    return null;
  }
}

/**
 * Resolve the post-login destination.
 * Priority: location.state.from.pathname → sessionStorage → "/".
 * Only accepts paths that start with "/" to prevent open-redirect attacks.
 */
function resolveRedirectTarget(locationState) {
  const fromState    = locationState?.from?.pathname;
  const fromStorage  = consumeSessionRedirect();
  const candidate    = fromState || fromStorage || "/";
  return candidate.startsWith("/") ? candidate : "/";
}

// ────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login, registerCustomer, mergeCart, currentUser, logout } = useStore();
  const { t }       = useLang();
  const navigate    = useNavigate();
  const location    = useLocation();

  // ── Tab state ─────────────────────────────────────────────────────────
  const [mode, setMode] = useState("login");

  // ── Login form ────────────────────────────────────────────────────────
  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");

  // ── Register form ─────────────────────────────────────────────────────
  const [regName,            setRegName]            = useState("");
  const [regPhone,           setRegPhone]           = useState("");
  const [regUsername,        setRegUsername]        = useState("");
  const [regPassword,        setRegPassword]        = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Detect if we were redirected from /checkout so we can show the banner.
  // We read from location.state first; sessionStorage is consumed only once
  // on submit (to avoid showing a stale value after an unrelated navigation).
  const redirectTarget = location.state?.from?.pathname
    || (() => { try { return sessionStorage.getItem("redirectAfterLogin"); } catch { return null; } })()
    || "/";
  const isFromCheckout = redirectTarget === "/checkout";

  // ── Tab switch ─────────────────────────────────────────────────────────
  // Switching tabs keeps location.state so the redirect target is preserved.
  function switchMode(m) { setMode(m); setError(""); }

  // ── After a successful auth event ─────────────────────────────────────
  function afterAuth(role) {
    // Merge the guest cart into the now-logged-in session before navigating
    mergeCart([]);   // no-op merge (guest cart is already in state)

    const target = resolveRedirectTarget(location.state);

    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate(target, { replace: true });
    }
  }

  // ── Submit handlers ───────────────────────────────────────────────────
  function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const res = login(identifier, password);
      setLoading(false);
      if (res.success) {
        afterAuth(res.role);
      } else {
        setError(res.message || t("loginBtn"));
      }
    }, 300);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");
    if (regPassword !== regConfirmPassword) {
      setError(t("passwordsNoMatch"));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = registerCustomer({
        name:     regName,
        phone:    regPhone,
        username: regUsername,
        password: regPassword,
      });
      setLoading(false);
      if (res.success) {
        // Registration logs the user in immediately (StoreContext sets currentUser)
        afterAuth("customer");
      } else {
        setError(res.message || t("registerBtn"));
      }
    }, 300);
  }

  // ────────────────────────────────────────────────────────────────────────
  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">
      <div className="flex-1 flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="w-full max-w-md">

          {/* ── Brand header ──────────────────────────────────────────── */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-500 p-1.5 mb-3 shadow-green border border-gold/40 overflow-hidden">
              <img src="/photos/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-catamaran text-bark-900 tracking-tight">
              {t("loginTitle")}
            </h1>
            <p className="text-xs text-bark-500 mt-1">{t("loginFooterNote")}</p>
          </div>

          {/* ── Checkout redirect banner ──────────────────────────────── */}
          {isFromCheckout && !currentUser && (
            <div className="mb-5 flex items-start gap-3 bg-gold-50 border border-gold/50 px-4 py-3 rounded-none shadow-sm">
              <ShoppingBag size={18} className="text-gold-700 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-extrabold font-catamaran text-bark-900 text-sm leading-snug">
                  {t("loginToCheckout")}
                </p>
                <p className="text-xs text-bark-600 font-catamaran mt-0.5">
                  {t("loginToCheckoutSub")}
                </p>
              </div>
            </div>
          )}

          {/* ── Already logged in ─────────────────────────────────────── */}
          {currentUser ? (
            <div className="bg-[#faf6ee] rounded-none p-8 shadow-green border border-bark-200 text-center">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-lg font-bold font-catamaran text-bark-900">{t("alreadyLoggedIn")}</h2>
              <p className="text-sm font-extrabold text-forest-700 mt-1">
                {currentUser.name} ({currentUser.role})
              </p>
              <div className="mt-6 space-y-3">
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full bg-forest text-cream-100 py-3 rounded-none font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-green hover:bg-forest-700"
                  >
                    {t("goToAdminPanel")} <ArrowRight size={16} />
                  </button>
                )}
                {isFromCheckout && currentUser.role === "customer" && (
                  <button
                    onClick={() => navigate("/checkout", { replace: true })}
                    className="w-full bg-gold text-bark-900 py-3 rounded-none font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-green hover:bg-gold-600"
                  >
                    {t("checkout")} <ArrowRight size={16} />
                  </button>
                )}
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gold text-bark-900 py-3 rounded-none font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-green hover:bg-gold-600"
                >
                  {t("browseProducts")} <ArrowRight size={16} />
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 text-sm font-bold text-danger hover:bg-red-50 rounded-none transition-colors cursor-pointer"
                >
                  {t("logoutBtn")}
                </button>
              </div>
            </div>
          ) : (
            /* ── Form card ─────────────────────────────────────────────── */
            <div className="bg-[#faf6ee] rounded-none p-6 sm:p-8 shadow-green border border-bark-200">

              {/* Tab switcher */}
              <div className="flex bg-cream-200 p-1 rounded-none border border-bark-200 mb-6">
                {["login", "register"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-none transition-all font-catamaran ${
                      mode === m
                        ? "bg-forest text-cream-100 shadow-sm"
                        : "text-bark-600 hover:text-bark-900"
                    }`}
                  >
                    {m === "login" ? t("loginTab") : t("registerTab")}
                  </button>
                ))}
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-5 p-3.5 rounded-none bg-red-50 border border-red-200 text-danger text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ── LOGIN FORM ────────────────────────────────────────── */}
              {mode === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold font-catamaran text-bark-900">
                      {t("loginHeading")}
                    </h2>
                    <p className="text-xs text-bark-500 mt-0.5">{t("loginDesc")}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("userIdOrPhone")}
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="text" required autoComplete="username"
                        placeholder={t("userIdPlaceholder")}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("passwordLabel")}
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="password" required autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full h-12 min-h-[44px] mt-2 px-4 bg-gold text-bark-900 hover:bg-gold-600 font-extrabold rounded-none shadow-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-base"
                  >
                    {loading ? t("loggingIn") : <><span>{t("loginBtn")}</span><ArrowRight size={18} /></>}
                  </button>

                  {/* Switch to Register — preserves redirect target via location.state */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="text-xs sm:text-sm font-bold text-forest-700 hover:text-gold hover:underline cursor-pointer min-h-[44px] px-2 inline-flex items-center justify-center"
                    >
                      {t("newCustomer")}
                    </button>
                  </div>
                </form>
              )}

              {/* ── REGISTER FORM ─────────────────────────────────────── */}
              {mode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold font-catamaran text-bark-900">
                      {t("registerHeading")}
                    </h2>
                    <p className="text-xs text-bark-500 mt-0.5">{t("registerDesc")}</p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("fullNameLabel")}
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="text" required autoComplete="name"
                        placeholder={t("fullNamePlaceholder")}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("phoneLabel")}
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="tel" inputMode="numeric" required autoComplete="tel"
                        placeholder={t("phonePlaceholder")}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("userIdOrPhone")}
                    </label>
                    <div className="relative">
                      <UserCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="text" required autoComplete="username"
                        placeholder={t("usernamePlaceholder")}
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("passwordLabel")}
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="password" required autoComplete="new-password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5">
                      {t("confirmPasswordLabel")}
                    </label>
                    <div className="relative">
                      <ShieldCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
                      <input
                        type="password" required autoComplete="new-password"
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full h-12 min-h-[44px] mt-2 px-4 bg-gold text-bark-900 hover:bg-gold-600 font-extrabold rounded-none shadow-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-base"
                  >
                    {loading
                      ? t("registering")
                      : <><Sparkles size={18} /><span>{t("registerBtn")}</span></>
                    }
                  </button>

                  {/* Switch to Login — preserves redirect target via location.state */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-xs sm:text-sm font-bold text-forest-700 hover:text-gold hover:underline cursor-pointer min-h-[44px] px-2 inline-flex items-center justify-center"
                    >
                      {t("hasAccount")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-xs text-bark-400">
            <p>{t("guestNote")}</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
