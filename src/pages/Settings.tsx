import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { logOut } from "../firebase";
import { linkWithPhoneNumber, RecaptchaVerifier, unlink } from "firebase/auth";
import { auth } from "../firebase";
import { User, Sparkles, CreditCard, Bell, Shield, Save, Phone, CheckCircle2 } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import { getMembershipStatus, pauseMembership, resumeMembership } from "../services/membershipService";

const Settings: React.FC = () => {
  const { user, profile, signInWithPhone, verifyPhoneCode } = useAuth();
  const navigate = useNavigate();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  // Phone linking state
  const [linkPhone, setLinkPhone] = useState("");
  const [linkStep, setLinkStep] = useState<"idle" | "verify">("idle");
  const [linkCode, setLinkCode] = useState("");
  const [linkConfirmation, setLinkConfirmation] = useState<any>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState(false);

  const isPhoneLinked = user?.providerData?.some(p => p.providerId === "phone");

  // Membership pause state
  const [membershipStatus, setMembershipStatus] = useState<"active" | "paused" | "inactive">("inactive");
  const [pauseUntil, setPauseUntil] = useState<string | null>(null);
  const [showPausePanel, setShowPausePanel] = useState(false);
  const [selectedPauseMonths, setSelectedPauseMonths] = useState<number | null>(null);
  const [pauseLoading, setPauseLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMembershipStatus(user.uid).then(setMembershipStatus);
    // Load pauseUntil from profile
    if ((profile as any)?.pauseUntil) setPauseUntil((profile as any).pauseUntil);
  }, [user, profile]);

  const handlePause = async () => {
    if (!user || !selectedPauseMonths) return;
    setPauseLoading(true);
    await pauseMembership(user.uid, selectedPauseMonths);
    setMembershipStatus("paused");
    const d = new Date();
    d.setMonth(d.getMonth() + selectedPauseMonths);
    setPauseUntil(d.toISOString());
    setShowPausePanel(false);
    setSelectedPauseMonths(null);
    setPauseLoading(false);
  };

  const handleResume = async () => {
    if (!user) return;
    setPauseLoading(true);
    await resumeMembership(user.uid);
    setMembershipStatus("active");
    setPauseUntil(null);
    setPauseLoading(false);
  };

  const membershipTier = profile?.membershipTierId
    ? profile.membershipTierId.charAt(0).toUpperCase() + profile.membershipTierId.slice(1)
    : null;

  const handleSignOut = async () => {
    await logOut();
    navigate("/login");
  };

  const handleLinkPhone = async () => {
    setLinkError("");
    setLinkLoading(true);
    try {
      let formatted = linkPhone.replace(/\D/g, "");
      if (formatted.length === 10) formatted = "+1" + formatted;
      else if (!formatted.startsWith("+")) formatted = "+" + formatted;
      const recaptchaVerifier = new RecaptchaVerifier(auth, "link-recaptcha", { size: "invisible" });
      const confirmation = await linkWithPhoneNumber(auth.currentUser!, formatted, recaptchaVerifier);
      setLinkConfirmation(confirmation);
      setLinkStep("verify");
    } catch (err: any) {
      setLinkError("Failed to send code. Check the number and try again.");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleVerifyLink = async () => {
    setLinkError("");
    setLinkLoading(true);
    try {
      await linkConfirmation.confirm(linkCode);
      setLinkSuccess(true);
      setLinkStep("idle");
    } catch (err: any) {
      setLinkError("Invalid code. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleUnlinkPhone = async () => {
    try {
      await unlink(auth.currentUser!, "phone");
      setLinkSuccess(false);
    } catch (err) {
      setLinkError("Failed to unlink phone number.");
    }
  };

  return (
    <motion.div
      className="space-y-6 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-400 dark:text-gray-500 text-sm bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Membership */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Membership</h2>
          </div>

          {membershipStatus === "inactive" ? (
            <div>
              <p className="text-sm text-gray-500 mb-3">No active membership.</p>
              <Link to="/membership" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors">
                View Plans
              </Link>
            </div>
          ) : membershipStatus === "paused" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">Paused</span>
                {pauseUntil && (
                  <span className="text-sm text-gray-500">until {new Date(pauseUntil).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                )}
              </div>
              <p className="text-xs text-gray-400">Your Beauty Bank credits are frozen during the pause. No charges are applied.</p>
              <button
                onClick={handleResume}
                disabled={pauseLoading}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
              >
                {pauseLoading ? "Resuming..." : "Resume Membership"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {membershipTier ? `${membershipTier} Plan` : "Active"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active membership</p>
                </div>
                <Link
                  to="/membership"
                  className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Manage
                </Link>
              </div>

              {!showPausePanel ? (
                <button
                  onClick={() => setShowPausePanel(true)}
                  className="border border-gray-200 hover:border-violet-300 text-gray-600 hover:text-violet-700 rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Pause Membership
                </button>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Pause for how long?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedPauseMonths(m)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          selectedPauseMonths === m
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-violet-400"
                        }`}
                      >
                        {m} month{m > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Your Beauty Bank credits freeze during the pause. No charges during pause.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePause}
                      disabled={!selectedPauseMonths || pauseLoading}
                      className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                    >
                      {pauseLoading ? "Pausing..." : "Pause Membership"}
                    </button>
                    <button
                      onClick={() => { setShowPausePanel(false); setSelectedPauseMonths(null); }}
                      className="border border-gray-200 text-gray-600 hover:text-gray-800 rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment</h2>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-900 dark:text-white">Card ending in </p>
            <button className="border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 rounded-xl px-4 py-2 text-sm font-semibold transition-colors">
              Update Payment Method
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email notifications", value: emailNotifs, setter: setEmailNotifs },
              { label: "SMS notifications", value: smsNotifs, setter: setSmsNotifs },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between">
                <p className="text-sm text-gray-900 dark:text-white">{pref.label}</p>
                <button
                  onClick={() => pref.setter(!pref.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pref.value ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pref.value ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred appearance</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Phone Number Linking */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Phone Number</h2>
          </div>

          {(isPhoneLinked || linkSuccess) ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Phone number linked — SMS sign-in enabled</span>
              </div>
              <button
                onClick={handleUnlinkPhone}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Unlink
              </button>
            </div>
          ) : linkStep === "idle" ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Link your phone to sign in with SMS verification.</p>
              {linkError && <p className="text-sm text-red-500">{linkError}</p>}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={linkPhone}
                    onChange={(e) => setLinkPhone(e.target.value)}
                    placeholder="(201) 882-1050"
                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <button
                  onClick={handleLinkPhone}
                  disabled={linkLoading || !linkPhone}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-4 rounded-xl transition-colors"
                >
                  {linkLoading ? "Sending..." : "Link"}
                </button>
              </div>
              <p className="text-xs text-gray-400">US numbers auto-formatted. International? Include country code (+44...).</p>
              <div id="link-recaptcha" />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to <span className="font-semibold text-gray-900 dark:text-white">{linkPhone}</span></p>
              {linkError && <p className="text-sm text-red-500">{linkError}</p>}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-center tracking-widest font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={handleVerifyLink}
                  disabled={linkLoading || linkCode.length < 6}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-4 rounded-xl transition-colors"
                >
                  {linkLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
              <button onClick={() => { setLinkStep("idle"); setLinkCode(""); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Use a different number
              </button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 rounded-xl px-4 py-2 text-sm font-semibold transition-colors">
              Change Password
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl px-4 py-2 text-sm font-semibold transition-colors border border-red-100 dark:border-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
