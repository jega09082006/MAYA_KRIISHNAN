import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Leaf,
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
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
      setError("கடவுச்சொற்கள் பொருந்தவில்லை! (Passwords do not match)");
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
    <div className="min-h-screen flex flex-col bg-[#f8faff] text-gray-800">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="w-full max-w-md animate-slide-up">
          {/* Top Brand Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-pink mb-3 shadow-lg shadow-orange-200">
              <Leaf size={30} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Login Page
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">
              உள்நுழைவுப் பக்கம்
            </p>
            <p className="text-xs text-gray-500 mt-1">
              MAYA_KRISHNAN (மாயகிருஷ்ணன்) — Traditional Grocery & Herbal Store
            </p>
          </div>

          {/* Already logged in notice */}
          {currentUser ? (
            <div className="bg-white rounded-3xl p-8 shadow-card border border-orange-100 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                You are currently logged in
              </h2>
              <p className="text-sm font-semibold text-brand-orange mt-1">
                {currentUser.name} ({currentUser.role})
              </p>
              <div className="mt-6 space-y-3">
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full btn-sky py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Go to Admin Panel <ArrowRight size={16} />
                  </button>
                )}
                <button
                  onClick={() => navigate("/")}
                  className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  Browse Products (பொருட்கள்) <ArrowRight size={16} />
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  Logout (வெளியேறு)
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Card */
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-orange-100">
              {/* Tab Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    mode === "login"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Login (உள்நுழை)
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    mode === "register"
                      ? "bg-white text-brand-orange shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Register (புதிய பதிவு)
                </button>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* ── LOGIN FORM ── */}
              {mode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-gray-900">
                      உள்நுழைவு (Login)
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enter your credentials to access your account or panel.
                    </p>
                  </div>

                  {/* User ID or Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      User ID / Phone Number (பயனர் ஐடி / தொலைபேசி)
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Enter User ID or Mobile Number"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Password (கடவுச்சொல்)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-brand-orange to-brand-pink text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
                  >
                    {loading ? (
                      <span>Logging in...</span>
                    ) : (
                      <>
                        <span>Login (உள்நுழை)</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="text-xs font-semibold text-brand-orange hover:underline cursor-pointer"
                    >
                      புதிய வாடிக்கையாளரா? பதிவு செய்க (New Customer? Register)
                    </button>
                  </div>
                </form>
              ) : (
                /* ── REGISTER FORM ── */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-gray-900">
                      புதிய வாடிக்கையாளர் பதிவு
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Register as a new customer to shop and enjoy exclusive offers.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name (பெயர்)
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number (தொலைபேசி எண்)
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Username (பயனர் பெயர்)
                    </label>
                    <div className="relative">
                      <UserCheck
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="e.g. anand99"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Password (கடவுச்சொல்)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Confirm Password (கடவுச்சொல்லை உறுதிப்படுத்துக)
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 bg-gray-50/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-brand-orange to-brand-pink text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
                  >
                    {loading ? (
                      <span>Registering...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Register & Login (பதிவு செய்)</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-xs font-semibold text-gray-600 hover:text-brand-orange hover:underline cursor-pointer"
                    >
                      ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக (Already have an account? Login)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 text-center space-y-1 text-xs text-gray-400">
            <p>Users can browse products without login.</p>
            <p>© MAYA_KRISHNAN Traditional Grocery & Herbal Medicine Shop</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
