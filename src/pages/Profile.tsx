import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Calendar, Edit3, Key, AlertTriangle, Check, X, Stethoscope } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { physicians, membershipTiers } from "../data/practiceData";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  membershipTier: string;
  joinDate: string;
}

const Profile: React.FC = () => {
  const { user, profile, signOut, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: user?.email ?? "",
    phone: "",
    dob: "",
    membershipTier: "",
    joinDate: "",
  });
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(data);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const onboardingRef = doc(db, "users", user.uid, "profile", "onboarding");
        const snap = await getDoc(onboardingRef);
        const onboarding = snap.exists() ? snap.data() : {};

        const nameParts = (profile?.name ?? user.displayName ?? "").split(" ");
        const d: ProfileData = {
          firstName: onboarding.firstName ?? nameParts[0] ?? "",
          lastName: onboarding.lastName ?? nameParts.slice(1).join(" ") ?? "",
          email: user.email ?? "",
          phone: onboarding.phone ?? "",
          dob: onboarding.dob ?? "",
          membershipTier: profile?.membershipTierId ?? onboarding.membershipTier ?? "",
          joinDate: profile?.joinDate ?? "",
        };
        setData(d);
        setEditData(d);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, profile]);

  const initials = `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase() || "?";

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid, "profile", "onboarding"),
        { firstName: editData.firstName, lastName: editData.lastName, phone: editData.phone, dob: editData.dob },
        { merge: true }
      );
      await setDoc(
        doc(db, "users", user.uid),
        { name: `${editData.firstName} ${editData.lastName}`.trim() },
        { merge: true }
      );
      setData(editData);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    await resetPassword(user.email);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 5000);
  };

  const handleCancelMembership = async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { status: "canceled", membershipTierId: null }, { merge: true });
    setShowCancelModal(false);
    navigate("/dashboard");
  };

  const tierLabel = data.membershipTier
    ? data.membershipTier.charAt(0).toUpperCase() + data.membershipTier.slice(1)
    : "No Membership";

  const tierData = data.membershipTier
    ? membershipTiers.find((t) => t.id === data.membershipTier.toLowerCase())
    : null;

  const tierColors: Record<string, string> = {
    core: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700",
    evolve: "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700",
    transform: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700",
  };

  const primaryPhysician = physicians[0];

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and membership.</p>
      </div>

      {/* Avatar + Tier */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-xl">{loading ? "." : initials}</span>
        </div>
        <div>
          <p className="text-gray-900 dark:text-white font-bold text-lg">{data.firstName} {data.lastName}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{data.email}</p>
          {data.membershipTier && (
            <span className={`inline-block mt-1.5 text-xs font-semibold px-3 py-0.5 rounded-full border ${
              tierColors[data.membershipTier.toLowerCase()] || "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700"
            }`}>
              {tierLabel} Member
              {tierData && ` · $${tierData.monthlyPrice}/mo`}
            </span>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
          {!editing ? (
            <button
              onClick={() => { setEditing(true); setEditData(data); }}
              className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 text-sm font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {saved && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" /> Profile saved successfully.
          </div>
        )}

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={editData.dob}
                onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { icon: <User className="w-4 h-4" />, label: "Full Name", value: `${data.firstName} ${data.lastName}`.trim() || "-" },
              { icon: <Mail className="w-4 h-4" />, label: "Email", value: data.email || "-" },
              { icon: <Phone className="w-4 h-4" />, label: "Phone", value: data.phone || "-" },
              { icon: <Calendar className="w-4 h-4" />, label: "Date of Birth", value: data.dob || "-" },
              { icon: <Calendar className="w-4 h-4" />, label: "Member Since", value: data.joinDate ? new Date(data.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "-" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                  {row.icon}
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{row.label}</p>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Provider */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Your Provider
        </h2>
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(primaryPhysician.name)}&background=B57EDC&color=fff&size=200`}
            alt={primaryPhysician.name}
            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-md"
          />
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{primaryPhysician.name}</p>
            <p className="text-violet-600 dark:text-violet-400 text-sm">{primaryPhysician.title}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{primaryPhysician.experience} Experience</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {primaryPhysician.specialties.slice(0, 2).map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
        <button
          onClick={handlePasswordReset}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600 transition-colors text-left"
        >
          <Key className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <div>
            <p className="text-gray-900 dark:text-white text-sm font-medium">Change Password</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {resetSent ? "Reset link sent! Check your email." : "Send a password reset link to your email"}
            </p>
          </div>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm p-6">
        <h2 className="text-red-600 dark:text-red-400 font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h2>
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-800 transition-colors text-left"
        >
          <X className="w-4 h-4 text-red-500 dark:text-red-400" />
          <div>
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">Cancel Membership</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">This will cancel your membership at the end of the billing period.</p>
          </div>
        </button>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold text-center mb-2">Cancel Membership?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
                Your membership will be canceled and you'll lose access to credits and member discounts.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Keep Membership
                </button>
                <button
                  onClick={handleCancelMembership}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
