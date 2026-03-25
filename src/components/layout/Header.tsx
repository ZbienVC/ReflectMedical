"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, User, Sparkles } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0F0F14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/20">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Reflect</span>
        </Link>

        {/* Right — Notifications + Profile */}
        <div className="flex items-center gap-3">
          <motion.button
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center transition-colors hover:bg-purple-600/30"
              aria-label="Profile"
            >
              <User className="h-4 w-4 text-purple-400" />
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
