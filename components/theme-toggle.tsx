"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs React state with the class the inline init script (layout.tsx) already set on <html> before hydration; can't read this during SSR
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage puede fallar en modo privado; el toggle sigue funcionando en la sesión.
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-secondary text-muted-foreground transition-colors hover:border-brand-gold hover:text-brand-gold"
    >
      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  );
}
