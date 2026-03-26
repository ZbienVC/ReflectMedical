import React, { useState, useEffect } from "react";

const DISMISS_KEY = "reflect_install_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after 30 seconds
      setTimeout(() => setVisible(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAdd = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 flex items-center gap-3">
        <img src="/reflect-logo.png" alt="Reflect Medical" className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Add Reflect Medical to your home screen</p>
          <p className="text-xs text-gray-500 mt-0.5">for quick access</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAdd}
            className="bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
          >
            Add
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
