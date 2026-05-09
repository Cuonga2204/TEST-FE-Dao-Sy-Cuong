import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEME_STORAGE_KEY } from "@/constant/storage";

export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readInitialMode = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  ).matches;
  return prefersDark ? "dark" : "light";
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState(readInitialMode);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used inside ThemeProvider");
  return ctx;
}
