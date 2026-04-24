import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { useToast } from "../components/ui/Toast";
import { UserRole } from "../types";
import { Crown, Search, Users, ShieldCheck, ShieldAlert, UserCheck, X, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipTierId?: string;
  role: UserRole;
  joinDate: string;
  status: string;
}

const PAGE_SIZE = 20;

function getRoleBadge(role: UserRole) {
  if (role === "superadmin") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
        <Crown className="w-3 h-3" />
        Super Admin
      </span>
    );
  }
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
        <ShieldCheck className="w-3 h-3" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
      <UserCheck className="w-3 h-3" />
      Member
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function AdminUsers() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [allUsers, setAllUsers] = useState<AdminUserRecord[]>([]);
  const [filtered, setFiltered] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);

  const isSuperAdmin = profile?.role === "superadmin";

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "users"));
        const users: AdminUserRecord[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AdminUserRecord, "id">),
        }));
        // Sort by joinDate desc
        users.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        setAllUsers(users);
        setFiltered(users);
      } catch (err) {
        showToast("error", "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = search.toLowerCase().trim();
      if (!q) {
        setFiltered(allUsers);
      } else {
        setFiltered(
          allUsers.filter(
            (u) =>
              u.name?.toLowerCase().includes(q) ||
              u.email?.toLowerCase().includes(q) ||
              u.phone?.toLowerCase().includes(q)
          )
        );
      }
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, allUsers]);

  const handleRoleChange = useCallback(
    async (userId: string, newRole: UserRole) => {
      const target = allUsers.find((u) => u.id === userId);
      if (!target) return;
      if (newRole === target.role) return;

      if (newRole !== "user") {
        const label = newRole === "superadmin" ? "Super Admin" : "Admin";
        const confirmed = window.confirm(
          `Make ${target.name} a ${label}? They will have access to admin features.`
        );
        if (!confirmed) return;
      }

      try {
        await updateDoc(doc(db, "users", userId), { role: newRole });
        setAllUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => prev ? { ...prev, role: newRole } : prev);
        }
        showToast("success", "Role updated");
      } catch {
        showToast("error", "Failed to update role");
      }
    },
    [allUsers, selectedUser, showToast]
  );

  // Stats
  const totalMembers = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.role === "admin").length;
  const totalSuperAdmins = allUsers.filter((u) => u.role === "superadmin").length;
  const thisMonth = allUsers.filter((u) => {
    try {
      const d = new Date(u.joinDate);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  }).length;

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const claimSuperAdmin = async () => {
    if (!user) return;
    const confirmed = window.confirm("Claim Super Admin access for your account?");
    if (!confirmed) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { role: "superadmin" });
      showToast("success", "Super Admin access claimed! Reloading...");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      showToast("error", "Failed to claim Super Admin");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Search, view, and manage user access levels.
          </p>
        </div>

        {/* One-time superadmin claim button */}
        {profile?.email === "zbienstock@gmail.com" && profile?.role === "admin" && (
          <button
            onClick={claimSuperAdmin}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Claim Super Admin Access
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: totalMembers, icon: Users, color: "violet" },
          { label: "Admins", value: totalAdmins, icon: ShieldCheck, color: "blue" },
          { label: "Super Admins", value: totalSuperAdmins, icon: Crown, color: "amber" },
          { label: "New This Month", value: thisMonth, icon: ShieldAlert, color: "emerald" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${stat.color === "violet" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : ""}
                ${stat.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : ""}
                ${stat.color === "amber" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : ""}
                ${stat.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : ""}
              `}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Phone</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Tier</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
                  {isSuperAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold text-xs flex-shrink-0">
                          {getInitials(u.name || "?")}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {u.phone || "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {u.membershipTierId ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400">
                          {u.membershipTierId}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(u.role || "user")}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {formatDate(u.joinDate)}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        >
                          <option value="user">Member</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Profile</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold text-xl">
                  {getInitials(selectedUser.name || "?")}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser.name}</p>
                  <div className="mt-1">{getRoleBadge(selectedUser.role || "user")}</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-gray-900 dark:text-white font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="text-gray-900 dark:text-white font-medium">{selectedUser.phone || "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Membership</span>
                  <span className="text-gray-900 dark:text-white font-medium">{selectedUser.membershipTierId || "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Joined</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formatDate(selectedUser.joinDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`font-medium capitalize ${
                    selectedUser.status === "active"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-red-400"
                  }`}>{selectedUser.status}</span>
                </div>
              </div>

              {/* Role change in modal (superadmin only) */}
              {isSuperAdmin && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Change role</span>
                    <select
                      value={selectedUser.role || "user"}
                      onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as UserRole)}
                      className="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="user">Member</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>

                  {/* Revoke access */}
                  {selectedUser.role !== "user" && (
                    <button
                      onClick={() => handleRoleChange(selectedUser.id, "user")}
                      className="w-full py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Revoke Admin Access
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}