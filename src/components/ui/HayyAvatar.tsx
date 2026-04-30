interface HayyAvatarProps {
  name: string;
  size?: number;
  tone?: "clay" | "olive" | "sand" | "dark";
}

const toneMap: Record<string, { background: string; color: string }> = {
  clay:  { background: "var(--clay)",  color: "var(--paper)" },
  olive: { background: "var(--olive)", color: "var(--paper)" },
  sand:  { background: "var(--sand)",  color: "var(--ink)"   },
  dark:  { background: "var(--ink)",   color: "var(--paper)" },
};

export const HayyAvatar = ({ name, size = 40, tone = "clay" }: HayyAvatarProps) => {
  const words = name.trim().split(/\s+/);
  const initials =
    words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();

  const { background, color } = toneMap[tone] ?? toneMap.clay;

  return (
    <span
      aria-label={name}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background,
        color,
        fontWeight: 600,
        fontSize: Math.round(size * 0.375),
        fontFamily: "'Inter', system-ui, sans-serif",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initials}
    </span>
  );
};
