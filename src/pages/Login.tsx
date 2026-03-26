import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Phone, Star } from "lucide-react";
import { useAuth } from "../AuthContext";

function getFriendlyError(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const TESTIMONIALS = [
  { text: "The results are always natural and beautiful. I've never felt more confident.", name: "Maria R.", tier: "Gold Member" },
  { text: "Leah's attention to detail is unmatched. Worth every penny.", name: "Jennifer K.", tier: "Platinum Member" },
  { text: "Same-day appointments and incredible care. My go-to for everything.", name: "Lisa T.", tier: "Silver Member" },
];

const Login: React.FC = () => {
  const { signIn, signInWithGoogle, signInWithPhone, verifyPhoneCode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState<"input" | "verify">("input");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      // Show the actual Firebase error code for debugging
      setError(`Google sign-in failed: ${err.code || err.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePhoneSend = async () => {
    setError("");
    setPhoneLoading(true);
    try {
      // Auto-format to E.164: strip non-digits, add +1 if no country code
      let formatted = phone.replace(/\D/g, "");
      if (formatted.length === 10) formatted = "+1" + formatted;
      else if (!formatted.startsWith("+")) formatted = "+" + formatted;
      else formatted = "+" + formatted;

      const result = await signInWithPhone(formatted, "recaptcha-container");
      setConfirmationResult(result);
      setPhoneStep("verify");
    } catch (err: any) {
      setError("Failed to send code. Check the number and try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handlePhoneVerify = async () => {
    setError("");
    setPhoneLoading(true);
    try {
      await verifyPhoneCode(confirmationResult, verificationCode);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid code. Please try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Brand ── */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #1a0533 0%, #3b0764 40%, #6d28d9 80%, #8b5cf6 100%)"
        }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Soft orb backgrounds */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ddd6fe, transparent)" }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <img
            src="/reflect-logo.png"
            alt="Reflect Medical & Cosmetic Center"
            className="h-24 w-auto object-contain"
          />
        </motion.div>

        {/* Center content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your beauty,<br />elevated.
            </h2>
            <p className="text-purple-200 text-lg mt-3 leading-relaxed">
              Premium aesthetic treatments in Hawthorne, NJ. Members save up to 40% on every visit.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "3,250+", label: "Patients" },
              { value: "98.7%", label: "Satisfaction" },
              { value: "8 Years", label: "Experience" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-purple-200 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            ))}
          </div>
          <p className="text-white/90 text-sm leading-relaxed italic">"{TESTIMONIALS[0].text}"</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-400/30 flex items-center justify-center text-white text-xs font-bold">
              {TESTIMONIALS[0].name.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{TESTIMONIALS[0].name}</p>
              <p className="text-purple-300 text-xs">{TESTIMONIALS[0].tier}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right Panel: Form ── */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F8F7FB] dark:bg-[#0B0B0F]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <motion.div
            className="lg:hidden text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="/reflect-logo.png"
              alt="Reflect Medical"
              className="h-14 w-auto object-contain mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your member account</p>
          </motion.div>

          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Auth mode tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => { setAuthMode("email"); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === "email" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
              >
                Email
              </button>
              <button
                onClick={() => { setAuthMode("phone"); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === "phone" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
              >
                Phone
              </button>
            </div>

            {/* Email form */}
            {authMode === "email" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <Link to="/forgot-password" className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      required
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-10 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-violet-500/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </motion.button>
              </form>
            )}

            {/* Phone form */}
            {authMode === "phone" && (
              <div className="space-y-4">
                {phoneStep === "input" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(201) 882-1050"
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">US numbers auto-formatted. International? Include country code (+44...).</p>
                    </div>
                    <div id="recaptcha-container" />
                    <motion.button
                      onClick={handlePhoneSend}
                      disabled={phoneLoading || !phone}
                      className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {phoneLoading ? "Sending..." : "Send Verification Code"}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Code sent to <span className="font-semibold text-gray-900 dark:text-white">{phone}</span></p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Verification Code</label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm text-center tracking-widest text-lg font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <motion.button
                      onClick={handlePhoneVerify}
                      disabled={phoneLoading || verificationCode.length < 6}
                      className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {phoneLoading ? "Verifying..." : "Verify & Sign In"}
                    </motion.button>
                    <button onClick={() => { setPhoneStep("input"); setVerificationCode(""); }} className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      Use a different number
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Google */}
            <motion.button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </motion.button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              New patient?{" "}
              <Link to="/signup" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 font-semibold transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


