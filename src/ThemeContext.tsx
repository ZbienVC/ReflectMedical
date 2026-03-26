import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("reflect-theme") as Theme) || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove both classes first
    root.classList.remove("light", "dark");
    // Add the current theme class
    root.classList.add(theme);
    // Also set data attribute as backup
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("reflect-theme", theme);
    } catch {}
    console.log("Theme changed to:", theme, "Classes:", root.classList.toString());
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      console.log("Toggling from", prev, "to", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
