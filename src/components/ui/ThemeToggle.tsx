import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDusk = theme === "dusk";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDusk ? "Switch to warm mode" : "Switch to dusk mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: "1px solid var(--line)",
        background: "var(--paper)",
        color: "var(--ink-soft)",
        borderRadius: "var(--radius-pill)",
        padding: "6px 14px",
        fontSize: 13,
        fontFamily: "'Inter', system-ui, sans-serif",
        cursor: "pointer",
        lineHeight: 1,
        transition: "border-color .15s, color .15s",
      }}
    >
      {isDusk ? <Sun size={14} /> : <Moon size={14} />}
      {isDusk ? "Warm" : "Dusk"}
    </button>
  );
};
