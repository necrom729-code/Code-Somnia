"use client";

import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  color?: string;
}

export default function GlitchText({ text, className = "", color = "#00d4ff" }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);
  const [glitchChars, setGlitchChars] = useState<string>("");
  const glitchCharsStr = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

  useEffect(() => {
    const interval = setInterval(() => {
      const randomChars = Array.from({ length: text.length }, () =>
        glitchCharsStr[Math.floor(Math.random() * glitchCharsStr.length)]
      ).join("");
      setGlitchChars(randomChars);
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span
      className={`${className} relative inline-block ${glitching ? "animate-pulse" : ""}`}
      style={{
        color,
        textShadow: glitching
          ? `-2px 0 #ff00ff, 2px 0 #00ffff`
          : `0 0 10px ${color}`,
      }}
    >
      {glitching ? glitchChars : text}
    </span>
  );
}