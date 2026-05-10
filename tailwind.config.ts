import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        clay: {
          DEFAULT: "hsl(var(--clay))",
          foreground: "hsl(var(--clay-foreground))",
        },
        olive: {
          DEFAULT: "hsl(var(--olive))",
          foreground: "hsl(var(--olive-foreground))",
        },
        cream: "hsl(var(--cream))",
        sand: "hsl(var(--sand))",

        /* === Hayy redesign tokens =================================
           Use these inside `.hy` ancestors (or pages styled with the
           redesign idiom). They resolve to full hsl() colors via the
           --hy-* / .hy-scoped vars defined in src/index.css. */
        ink: "var(--hy-ink)",
        "ink-soft": "var(--hy-ink-soft)",
        "ink-mute": "var(--hy-ink-mute)",
        line: "var(--hy-line)",
        "line-soft": "var(--hy-line-soft)",
        paper: "var(--hy-paper)",
        "hy-bg": "var(--hy-bg)",
        "clay-2": "var(--hy-clay-2)",
        live: "var(--hy-live)",
        spotlight: "var(--hy-spotlight)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
        /* Redesign radii (tokens.css) */
        "hy-xs": "var(--radius-xs)",
        "hy-sm": "var(--radius-sm-hy)",
        "hy-md": "var(--radius-md)",
        "hy-lg": "var(--radius-lg-hy)",
        "hy-xl": "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      fontFamily: {
        display: ["Fraunces", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        /* Redesign type pairings (tokens.css) — hy- prefixed so they don't
           override Tailwind's default `font-mono`, which is referenced by
           pre-existing components (e.g. src/components/ui/chart.tsx). */
        "hy-inter-tight": ["Inter Tight", "Inter", "system-ui", "sans-serif"],
        "hy-instrument-serif": ["Instrument Serif", "Fraunces", "Georgia", "serif"],
        "hy-mono": ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        /* Redesign live-dot pulse + waveform bar */
        "hy-pulse": {
          "0%":   { boxShadow: "0 0 0 0 hsl(0 0% 0% / 0)" },
          "50%":  { boxShadow: "0 0 0 6px hsl(8 80% 55% / .25)" },
          "100%": { boxShadow: "0 0 0 12px hsl(8 80% 55% / 0)" },
        },
        "hy-bar": {
          from: { transform: "scaleY(.4)" },
          to:   { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "hy-pulse": "hy-pulse 1.6s ease-out infinite",
        "hy-bar": "hy-bar 1s ease-in-out infinite alternate",
      },
      boxShadow: {
        /* Redesign shadows — use inside `.hy` so the var resolves to a
           full color. Outside .hy these reuse the existing :root vars. */
        "hy-soft": "var(--shadow-soft)",
        "hy-warm": "var(--shadow-warm)",
        "hy-glow": "var(--shadow-glow)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
