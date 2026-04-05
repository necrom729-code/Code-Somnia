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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const glitchCharsStr = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random glitch characters
      const randomChars = Array.from({ length: text.length }, () =>
        glitchCharsStr[Math.floor(Math.random() * glitchCharsStr.length)]
      ).join("");
      setGlitchChars(randomChars);
      
      // Random offset for split effect
      setOffset({
        x: Math.floor(Math.random() * 6) - 3,
        y: Math.floor(Math.random() * 4) - 2,
      });
      
      setGlitching(true);
      setTimeout(() => {
        setGlitching(false);
        setOffset({ x: 0, y: 0 });
      }, 150);
    }, 2500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span
      className={`${className} relative inline-block`}
      style={{ color }}
    >
      {/* Main text */}
      <span
        style={{
          textShadow: glitching
            ? `0 0 20px ${color}, -2px 0 #ff00ff, 2px 0 #00ffff`
            : `0 0 10px ${color}`,
          transform: glitching ? `translate(${offset.x}px, ${offset.y}px)` : "none",
        }}
      >
        {glitching ? glitchChars : text}
      </span>
      
      {/* Cyan copy with offset */}
      {glitching && (
        <span
          className="absolute top-0 left-0 -z-10"
          style={{
            color: "#00ffff",
            transform: `translate(${-offset.x + 2}px, ${-offset.y}px)`,
            opacity: 0.7,
          }}
        >
          {glitchChars}
        </span>
      )}
      
      {/* Magenta copy with offset */}
      {glitching && (
        <span
          className="absolute top-0 left-0 -z-10"
          style={{
            color: "#ff00ff",
            transform: `translate(${-offset.x - 2}px, ${-offset.y}px)`,
            opacity: 0.7,
          }}
        >
          {glitchChars}
        </span>
      )}
    </span>
  );
}