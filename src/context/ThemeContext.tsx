import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "warm" | "dusk";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "warm",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("hayy-theme");
      return saved === "warm" || saved === "dusk" ? saved : "warm";
    } catch {
      return "warm";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", theme);
    try {
      localStorage.setItem("hayy-theme", theme);
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "warm" ? "dusk" : "warm"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
