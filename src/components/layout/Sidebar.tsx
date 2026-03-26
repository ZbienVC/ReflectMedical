"use client";

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  Stethoscope,
  Settings,
  LogOut,
  Users,
  Sparkles,
  Award,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Treatments", href: "/treatments", icon: Stethoscope },
  { name: "Membership", href: "/membership", icon: Award },
  { name: "Beauty Bank", href: "/credits", icon: CreditCard },
  { name: "Referrals", href: "/referrals", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useAuth();
  const [hasIntake, setHasIntake] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "intakeForms", user.uid))
      .then((snap) => setHasIntake(snap.exists()))
      .catch(() => setHasIntake(true));
  }, [user]);

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden w-64 border-r border-white/5 bg-gray-900 lg:block min-h-screen sticky top-16">
      <nav className="p-4 pt-6">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <motion.div key={item.name} whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                <Link
                  to={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${active ? "text-purple-400" : "text-gray-500 group-hover:text-white"} transition-colors`}
                  />
                  {item.name}
                </Link>
              </motion.div>
            );
          })}

          {!hasIntake && (
            <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
              <Link
                to="/intake"
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive("/intake")
                    ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                    : "text-violet-400 hover:bg-white/5 hover:text-violet-300 border border-violet-500/20"
                }`}
              >
                <ClipboardList className="h-5 w-5 flex-shrink-0 text-violet-400 group-hover:text-violet-300 transition-colors" />
                Intake Form
                <span className="ml-auto w-2 h-2 rounded-full bg-violet-500" />
              </Link>
            </motion.div>
          )}
        </div>

        <div className="my-6 border-t border-white/5" />

        <div className="space-y-1">
          <Link
            to="/admin"
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white border border-transparent"
          >
            <Settings className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
            Settings
          </Link>

          <button className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent">
            <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}



