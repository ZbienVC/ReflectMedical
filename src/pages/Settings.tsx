import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { logOut } from "../firebase";
import { User, Sparkles, CreditCard, Bell, Shield, Save } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  const membershipTier = profile?.membershipTierId
    ? profile.membershipTierId.charAt(0).toUpperCase() + profile.membershipTierId.slice(1)
    : null;

  const handleSignOut = async () => {
    await logOut();
    navigate("/login");
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {membershipTier ? `${membershipTier} Plan` : "No active membership"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {membershipTier ? "Active" : "Enroll to unlock exclusive savings"}
              </p>
            </div>
            <Link
              to="/membership"
              className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              {membershipTier ? "Manage" : "Upgrade"}
            </Link>
          </div>
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
