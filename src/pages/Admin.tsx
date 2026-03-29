import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit, doc, setDoc, writeBatch } from "firebase/firestore";
import { Transaction, UserProfile, MembershipTier, Service } from "../types";
import { formatCurrency } from "../lib/utils";
import { Users, TrendingUp, History, Database, ShieldCheck, Sparkles, Calendar } from "lucide-react";
import { INITIAL_MEMBERSHIP_TIERS, INITIAL_SERVICES } from "../constants";

const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ mrr: 0, totalRevenue: 0, totalSavings: 0 });

  useEffect(() => {
    if (profile?.role !== "admin") return;

    const fetchData = async () => {
      const uSnap = await getDocs(collection(db, "users"));
      const uData = uSnap.docs.map((d) => d.data() as UserProfile);
      setUsers(uData);

      // Fetch all transactions (simplified for MVP)
      const allTxs: Transaction[] = [];
      for (const u of uData) {
        const tSnap = await getDocs(collection(db, `users/${u.uid}/transactions`));
        allTxs.push(...tSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)));
      }
      setTransactions(allTxs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      // Calculate stats
      const tiersSnap = await getDocs(collection(db, "membershipTiers"));
      const tiersMap = new Map(tiersSnap.docs.map((d) => [d.id, d.data() as MembershipTier]));
      
      const mrr = uData.reduce((acc, u) => {
        if (u.membershipTierId && u.status === "active") {
          return acc + (tiersMap.get(u.membershipTierId)?.monthlyPrice || 0);
        }
        return acc;
      }, 0);

      const totalRevenue = allTxs.reduce((acc, t) => acc + t.finalPrice, 0);
      const totalSavings = allTxs.reduce((acc, t) => acc + t.savings, 0);

      setStats({ mrr, totalRevenue, totalSavings });
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const handleSeed = async () => {
    setLoading(true);
    const batch = writeBatch(db);

    // Seed Tiers
    for (const tier of INITIAL_MEMBERSHIP_TIERS) {
      const tierRef = doc(collection(db, "membershipTiers"));
      batch.set(tierRef, tier);
    }

    // Seed Services
    for (const service of INITIAL_SERVICES) {
      const serviceRef = doc(collection(db, "services"));
      batch.set(serviceRef, service);
    }

    await batch.commit();
    window.location.reload();
  };

  if (profile?.role !== "admin") {
    return (
            <main className="pt-6">
          <div className="py-20 text-center">
            <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h1 className="text-2xl font-serif font-bold text-slate-900">Access Denied</h1>
            <p className="text-slate-500">You do not have administrative privileges.</p>
          </div>
        </main>
        );
  }

  if (loading) return (
        <main className="pt-6">
        <div className="py-20 text-center text-slate-400">Loading admin data...</div>
      </main>
    );

  return (
        <main className="pt-6">
        <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage practice performance and patient data.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/admin/bookings"
            className="flex items-center gap-2 px-5 py-3 bg-[#B57EDC] text-white font-bold rounded-full hover:bg-[#a06cc9] transition-all"
          >
            <Calendar className="w-4 h-4" /> Booking Requests
          </Link>
          <button
            onClick={handleSeed}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            <Database className="w-4 h-4" /> Seed Database
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Monthly Recurring Revenue" value={formatCurrency(stats.mrr)} icon={TrendingUp} color="emerald" />
        <StatCard label="Total Treatment Revenue" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} color="blue" />
        <StatCard label="Total Patient Savings" value={formatCurrency(stats.totalSavings)} icon={Sparkles} color="purple" />
        <StatCard label="Active Patients" value={users.length.toString()} icon={Users} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User List */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              Patient List
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                        u.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(u.beautyBucksBalance)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Transaction History */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Recent Transactions
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{tx.serviceName}</p>
                  <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(tx.finalPrice)}</p>
                  <p className="text-xs text-emerald-600 font-bold">Saved {formatCurrency(tx.savings)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
        </div>
      </main>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
      color === "emerald" ? "bg-emerald-100 text-emerald-600" : 
      color === "blue" ? "bg-blue-100 text-blue-600" : 
      color === "purple" ? "bg-purple-100 text-purple-600" : 
      "bg-slate-100 text-slate-600"
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-serif font-bold text-slate-900">{value}</p>
  </div>
);

export default Admin;

