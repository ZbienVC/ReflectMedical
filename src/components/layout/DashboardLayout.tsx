"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F0F14]">
      <Header isAuthenticated={true} />
      
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
