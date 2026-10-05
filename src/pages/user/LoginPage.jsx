import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Phone,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import PageTransition from "../../components/PageTransition";

export default function LoginPage() {
  const { login, registerCustomer, currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login"); // 'login' | 'register'

  // Login Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fromPath = location.state?.from?.pathname || null;

  function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = login(identifier, password);
      setLoading(false);

      if (res.success) {
        if (res.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate(fromPath || "/");
        }
      } else {
        setError(res.message || "Invalid credentials");
      }
    }, 300);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match (கடவுச்சொற்கள் பொருந்தவில்லை)");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = registerCustomer({
        name: regName,
        phone: regPhone,
        username: regUsername,
        password: regPassword,
      });
      setLoading(false);

      if (res.success) {
        navigate(fromPath || "/");
      } else {
        setError(res.message || "Registration failed");
      }
    }, 300);
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
  }

  return (
    <PageTransition className="flex flex-col bg-storefront text-bark-900">

      <div className="flex-1 flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* Top Brand Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-500 p-1.5 mb-3 shadow-green border border-gold/40 overflow-hidden">
              <img src="/photos/logo.png" alt="MAYA_KRISHNAN Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-tamil text-bark-900 tracking-tight">
              உள்நுழைவுப் பக்கம்
            </h1>
            <p className="text-xs sm:text-sm font-bold font-lato text-forest-700 mt-1">
              Login & Registration
            </p>
            <p className="text-xs text-bark-500 mt-1 font-lato">
              MAYA_KRISHNAN (மாயக்கிருஷ்ணன்) — Quality Grocery & Herbal Store
            </p>
          </div>

          {/* Already logged in notice */}
          {currentUser ? (
            <div className="bg-[#faf6ee] rounded-none p-8 shadow-green border border-bark-200 text-center">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-lg font-bold font-tamil text-bark-900">
                நீங்கள் ஏற்கனவே உள்நுழைந்துள்ளீர்கள்
              </h2>
              <p className="text-sm font-extrabold text-forest-700 mt-1 font-lato">
                {currentUser.name} ({currentUser.role})
              </p>
              <div className="mt-6 space-y-3 font-lato">
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full bg-forest text-cream-100 py-3 rounded-none font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-green hover:bg-forest-700"
                  >
                    Go to Admin Panel <ArrowRight size={16} />
                  </button>
                )}
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gold text-bark-900 py-3 rounded-none font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-green hover:bg-gold-600"
                >
                  Browse Products (பொருட்கள்) <ArrowRight size={16} />
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 text-sm font-bold text-danger hover:bg-red-50 rounded-none transition-colors cursor-pointer"
                >
                  Logout (வெளியேறு)
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Card */
            <div className="bg-[#faf6ee] rounded-none p-6 sm:p-8 shadow-green border border-bark-200">
              {/* Tab Switcher */}
              <div className="flex bg-cream-200 p-1 rounded-none border border-bark-200 mb-6">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-none transition-all font-lato ${
                    mode === "login"
                      ? "bg-forest text-cream-100 shadow-sm"
                      : "text-bark-600 hover:text-bark-900"
                  }`}
                >
                  Login (உள்நுழை)
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-none transition-all font-lato ${
                    mode === "register"
                      ? "bg-forest text-cream-100 shadow-sm"
                      : "text-bark-600 hover:text-bark-900"
                  }`}
                >
                  Register (புதிய பதிவு)
                </button>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-none bg-red-50 border border-red-200 text-danger text-xs font-bold flex items-center gap-2 font-lato">
                  <AlertCircle size={16} className="flex-shrink-0 text-danger" />
                  <span>{error}</span>
                </div>
              )}

              {/* ── LOGIN FORM ── */}
              {mode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold font-tamil text-bark-900">
                      உள்நுழைவு (Login)
                    </h2>
                    <p className="text-xs text-bark-500 font-lato mt-0.5">
                      Enter your credentials to access your account or panel.
                    </p>
                  </div>

                  {/* User ID or Phone */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      User ID / Phone Number (பயனர் ஐடி / தொலைபேசி)
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="Enter User ID or Mobile Number"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      Password (கடவுச்சொல்)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 min-h-[44px] mt-2 px-4 bg-gold text-bark-900 hover:bg-gold-600 font-extrabold rounded-none shadow-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-base font-lato"
                  >
                    {loading ? (
                      <span>Logging in...</span>
                    ) : (
                      <>
                        <span>Login (உள்நுழை)</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="text-xs sm:text-sm font-bold text-forest-700 hover:text-gold hover:underline cursor-pointer font-lato min-h-[44px] px-2 inline-flex items-center justify-center"
                    >
                      புதிய வாடிக்கையாளரா? பதிவு செய்க (New Customer? Register)
                    </button>
                  </div>
                </form>
              ) : (
                /* ── REGISTER FORM ── */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold font-tamil text-bark-900">
                      புதிய வாடிக்கையாளர் பதிவு
                    </h2>
                    <p className="text-xs text-bark-500 font-lato mt-0.5">
                      Register as a new customer to shop and enjoy exclusive offers.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      Full Name (பெயர்)
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Anand Kumar"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      Phone Number (தொலைபேசி எண்)
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        autoComplete="tel"
                        placeholder="e.g. 9876543210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      Username (பயனர் பெயர்)
                    </label>
                    <div className="relative">
                      <UserCheck
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="e.g. anand99"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      Password (கடவுச்சொல்)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="password"
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-bark-800 uppercase tracking-wider mb-1.5 font-lato">
                      Confirm Password (கடவுச்சொல்லை உறுதிப்படுத்துக)
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400"
                      />
                      <input
                        type="password"
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-none border border-bark-200 text-base focus:outline-none focus:ring-2 focus:ring-forest focus:border-gold bg-cream-50 text-bark-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 min-h-[44px] mt-2 px-4 bg-gold text-bark-900 hover:bg-gold-600 font-extrabold rounded-none shadow-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-base font-lato"
                  >
                    {loading ? (
                      <span>Registering...</span>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Register & Login (பதிவு செய்)</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-xs sm:text-sm font-bold text-forest-700 hover:text-gold hover:underline cursor-pointer font-lato min-h-[44px] px-2 inline-flex items-center justify-center"
                    >
                      ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக (Already have an account? Login)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 text-center space-y-1 text-xs text-bark-400 font-lato">
            <p>Users can browse products without login.</p>
            <p>© MAYA_KRISHNAN Quality Grocery & Herbal Medicine Shop</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
