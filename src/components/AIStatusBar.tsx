"use client";

import { useState, useEffect } from "react";

interface AIStatusBarProps {
  status?: "online" | "scanning" | "analyzing" | "warning" | "offline";
  messages?: string[];
}

const defaultMessages = [
  "NEURAL NETWORK ACTIVE",
  "MONITORING SECTOR 7",
  "SCANNING THREATS",
  "ANALYZING DATA STREAMS",
  "PROTECTING SYSTEM",
];

export default function AIStatusBar({ status = "online", messages = defaultMessages }: AIStatusBarProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const messageCycle = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(messageCycle);
  }, [messages]);

  useEffect(() => {
    if (!isTyping) {
      setIsTyping(true);
      let i = 0;
      const text = messages[currentMessage];
      setDisplayText("");
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentMessage, messages, isTyping]);

  const statusColors = {
    online: { bg: "#00ff41", shadow: "rgba(0, 255, 65, 0.5)", text: "#00ff41" },
    scanning: { bg: "#00d4ff", shadow: "rgba(0, 212, 255, 0.5)", text: "#00d4ff" },
    analyzing: { bg: "#ffff00", shadow: "rgba(255, 255, 0, 0.5)", text: "#ffff00" },
    warning: { bg: "#ff6600", shadow: "rgba(255, 102, 0, 0.5)", text: "#ff6600" },
    offline: { bg: "#ff0000", shadow: "rgba(255, 0, 0, 0.5)", text: "#ff0000" },
  };

  const colors = statusColors[status];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-8 flex items-center justify-between px-4"
      style={{
        background: "linear-gradient(180deg, rgba(0, 10, 5, 0.95) 0%, rgba(0, 10, 5, 0.8) 100%)",
        borderBottom: `1px solid ${colors.bg}33`,
        fontFamily: "monospace",
      }}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: colors.bg, boxShadow: `0 0 8px ${colors.bg}` }}
          />
          <svg width="20" height="20" viewBox="0 0 50 60" fill="none" style={{ color: colors.text }}>
            <ellipse cx="25" cy="30" rx="20" ry="25" fill="#0a0000" stroke={colors.text} strokeWidth="1.5"/>
            <ellipse cx="15" cy="25" rx="6" ry="8" fill="#000" stroke={colors.text} strokeWidth="1"/>
            <ellipse cx="35" cy="25" rx="6" ry="8" fill="#000" stroke={colors.text} strokeWidth="1"/>
            <ellipse cx="15" cy="26" r="3" fill={colors.text} style={{ filter: `drop-shadow(0 0 4px ${colors.text})` }}/>
            <ellipse cx="35" cy="26" r="3" fill={colors.text} style={{ filter: `drop-shadow(0 0 4px ${colors.text})` }}/>
            <path d="M 25 35 L 23 42 L 27 42 Z" fill={colors.text}/>
            <line x1="15" y1="48" x2="15" y2="55" stroke={colors.text} strokeWidth="1"/>
            <line x1="25" y1="48" x2="25" y2="55" stroke={colors.text} strokeWidth="1"/>
            <line x1="35" y1="48" x2="35" y2="55" stroke={colors.text} strokeWidth="1"/>
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.text }}>
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke={colors.text} strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="3" fill={colors.text}/>
          </svg>
          <span className="text-xs tracking-wider" style={{ color: "#888" }}>
            {displayText}
            {isTyping && <span className="animate-pulse">▊</span>}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: "#444" }}>SECTOR:</span>
          <span className="text-xs tracking-wider" style={{ color: colors.text }}>7-G</span>
        </div>

        <div className="h-4 w-px" style={{ background: `${colors.bg}33` }} />

        <div className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: colors.text }}>
            <circle cx="12" cy="12" r="9" stroke={colors.text} strokeWidth="1.5"/>
            <path d="M12 7V12L15 15" stroke={colors.text} strokeWidth="1.5"/>
          </svg>
          <span className="text-xs tracking-wider" style={{ color: "#666" }}>
            {new Date().toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: "#444" }}>V3.0.0</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}