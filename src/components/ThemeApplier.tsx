"use client";

import { useEffect } from "react";
import { useAuth, type Theme } from "@/lib/auth";

const THEME_VARS: Record<Theme, Record<string, string>> = {
  cyberpunk: {
    "--necrom-bg": "#050a0f",
    "--necrom-surface": "#0a1520",
    "--necrom-border": "#1a3a5c",
    "--necrom-accent": "#00d4ff",
    "--necrom-accent2": "#ff3a3a",
    "--necrom-skull": "#c0392b",
    "--necrom-text": "#a0c8e0",
    "--necrom-dim": "#3a6080",
  },
  matrix: {
    "--necrom-bg": "#000d00",
    "--necrom-surface": "#001500",
    "--necrom-border": "#003300",
    "--necrom-accent": "#00ff41",
    "--necrom-accent2": "#ff3a3a",
    "--necrom-skull": "#00cc33",
    "--necrom-text": "#88cc88",
    "--necrom-dim": "#336633",
  },
  blood: {
    "--necrom-bg": "#0a0000",
    "--necrom-surface": "#150000",
    "--necrom-border": "#3a0000",
    "--necrom-accent": "#ff3a3a",
    "--necrom-accent2": "#ff8800",
    "--necrom-skull": "#cc0000",
    "--necrom-text": "#e08080",
    "--necrom-dim": "#803030",
  },
  ghost: {
    "--necrom-bg": "#080808",
    "--necrom-surface": "#111111",
    "--necrom-border": "#2a2a2a",
    "--necrom-accent": "#c8c8c8",
    "--necrom-accent2": "#888888",
    "--necrom-skull": "#aaaaaa",
    "--necrom-text": "#999999",
    "--necrom-dim": "#555555",
  },
  neon: {
    "--necrom-bg": "#08000f",
    "--necrom-surface": "#100020",
    "--necrom-border": "#2a0040",
    "--necrom-accent": "#ff00ff",
    "--necrom-accent2": "#00ffff",
    "--necrom-skull": "#cc00cc",
    "--necrom-text": "#cc88ff",
    "--necrom-dim": "#663388",
  },
};

export default function ThemeApplier() {
  const { theme } = useAuth();

  useEffect(() => {
    const vars = THEME_VARS[theme];
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }, [theme]);

  return null;
}
