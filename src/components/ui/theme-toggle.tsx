"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-full border border-border bg-surface"
        aria-label="Toggle theme"
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex w-10 h-10 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-[var(--card-shadow)] transition-all duration-300 hover:border-accent hover:bg-accent-light hover:rotate-[15deg]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
