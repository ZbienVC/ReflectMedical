import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { Users, Calendar, CreditCard, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface TierCount {
  id: string;
  label: string;
  count: number;
  color: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface TreatmentCount {
  name: string;
  count: number;
}

function StatCardUI({ label, value, icon, color }: StatCard) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [monthBookings, setMonthBookings] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [beautyBankIssued, setBeautyBankIssued] = useState(0);
  const [weekAppointments, setWeekAppointments] = useState(0);

  const [tierCounts, setTierCounts] = useState<TierCount[]>([
    { id: "core", label: "Core", count: 0, color: "bg-violet-200" },
    { id: "evolve", label: "Evolve", count: 0, color: "bg-violet-400" },
    { id: "transform", label: "Transform", count: 0, color: "bg-violet-600" },
  ]);

  const [topTreatments, setTopTreatments] = useState<TreatmentCount[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        // Fetch users
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

        const members = users.filter((u: any) => u.membershipTierId);
        setTotalMembers(members.length);

        const totalBB = users.reduce((sum: number, u: any) => sum + (u.beautyBankBalance || u.beautyBucksBalance || 0), 0);
        setBeautyBankIssued(Math.round(totalBB));

        const tierMap: Record<string, number> = { core: 0, evolve: 0, transform: 0 };
        for (const u of members) {
          const tid = (u.membershipTierId || "").toLowerCase();
          if (tid in tierMap) tierMap[tid]++;
        }
        setTierCounts([
          { id: "core", label: "Core", count: tierMap.core, color: "bg-violet-200" },
          { id: "evolve", label: "Evolve", count: tierMap.evolve, color: "bg-violet-400" },
          { id: "transform", label: "Transform", count: tierMap.transform, color: "bg-violet-600" },
        ]);

        // Fetch appointments
        const apptSnap = await getDocs(collection(db, "appointments"));
        const appts = apptSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekStartStr = weekStart.toISOString().slice(0, 10);
        const todayStr = now.toISOString().slice(0, 10);

        setMonthBookings(appts.filter((a: any) => (a.date || "") >= monthStart).length);
        setWeekAppointments(appts.filter((a: any) => (a.date || "") >= weekStartStr && (a.date || "") <= todayStr).length);

        // Top treatments
        const treatmentMap: Record<string, number> = {};
        for (const a of appts) {
          const svc = a.service || a.serviceName || "Unknown";
          treatmentMap[svc] = (treatmentMap[svc] || 0) + 1;
        }
        const sorted = Object.entries(treatmentMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }));
        setTopTreatments(sorted);

        // Recent activity — combine appointments + gift cards
        const gcSnap = await getDocs(collection(db, "giftCards"));
        const gcs = gcSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

        const activities: ActivityItem[] = [];

        // Recent signups
        const recentUsers = [...users]
          .sort((a, b) => (b.createdAt || "") > (a.createdAt || "") ? 1 : -1)
          .slice(0, 3);
        for (const u of recentUsers) {
          if (u.createdAt) {
            activities.push({
              id: `user-${u.id}`,
              type: "signup",
              description: `New signup: ${u.name || u.email || "User"}`,
              timestamp: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : u.createdAt,
            });
          }
        }

        // Recent appointments
        const recentAppts = [...appts]
          .sort((a, b) => (b.createdAt || b.date || "") > (a.createdAt || a.date || "") ? 1 : -1)
          .slice(0, 5);
        for (const a of recentAppts) {
          activities.push({
            id: `appt-${a.id}`,
            type: "appointment",
            description: `Appointment: ${a.service || "Service"} for ${a.patientName || "Patient"}`,
            timestamp: a.date || (a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : ""),
          });
        }

        // Recent gift cards
        const recentGCs = [...gcs]
          .sort((a, b) => (b.createdAt || "") > (a.createdAt || "") ? 1 : -1)
          .slice(0, 3);
        for (const gc of recentGCs) {
          activities.push({
            id: `gc-${gc.id}`,
            type: "giftcard",
            description: `Gift card: $${gc.amount} from ${gc.senderName || "Someone"}`,
            timestamp: gc.createdAt?.toDate ? gc.createdAt.toDate().toLocaleDateString() : "",
          });
        }

        setRecentActivity(activities.slice(0, 10));
      } catch (err) {
        console.error("AdminAnalytics error:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const totalTierMembers = tierCounts.reduce((s, t) => s + t.count, 0) || 1;
  const maxTreatments = topTreatments[0]?.count || 1;

  const activityIcon = (type: string) => {
    if (type === "signup") return "🆕";
    if (type === "appointment") return "📅";
    if (type === "giftcard") return "🎁";
    return "•";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of key performance metrics</p>
        </div>
        <button
          onClick={() => navigate("/admin")}
          className="text-sm text-violet-600 hover:underline"
        >
          ← Back to Admin
        </button>
      </div>

      {/* Section 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardUI label="This Month's Bookings" value={monthBookings} icon={<Calendar className="w-6 h-6 text-violet-600" />} color="bg-violet-50" />
        <StatCardUI label="Total Members" value={totalMembers} icon={<Users className="w-6 h-6 text-indigo-600" />} color="bg-indigo-50" />
        <StatCardUI label="Beauty Bank Issued ($)" value={`$${beautyBankIssued.toLocaleString()}`} icon={<CreditCard className="w-6 h-6 text-pink-600" />} color="bg-pink-50" />
        <StatCardUI label="Appointments This Week" value={weekAppointments} icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} color="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 2: Membership Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Membership Breakdown</h2>
          <div className="space-y-4">
            {tierCounts.map((tier) => {
              const pct = Math.round((tier.count / totalTierMembers) * 100);
              return (
                <div key={tier.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{tier.label}</span>
                    <span className="text-gray-500">{tier.count} members ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${tier.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Top Treatments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Treatments</h2>
          {topTreatments.length === 0 ? (
            <p className="text-gray-400 text-sm">No appointment data yet.</p>
          ) : (
            <div className="space-y-3">
              {topTreatments.map((t, i) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-5 text-right font-mono">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="text-gray-700 font-medium truncate">{t.name}</span>
                      <span className="text-gray-500 ml-2 flex-shrink-0">{t.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-400 rounded-full"
                        style={{ width: `${Math.round((t.count / maxTreatments) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-lg">{activityIcon(item.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{item.description}</p>
                  {item.timestamp && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
