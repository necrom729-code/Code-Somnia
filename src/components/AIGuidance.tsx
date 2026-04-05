"use client";

import { useState, useEffect, useRef } from "react";

interface AIGuidanceProps {
  tips?: string[];
}

const defaultTips = [
  "Click on any file to preview or download it.",
  "Use the search bar to find files quickly.",
  "Toggle between grid and list view for files.",
  "Drag and drop files to upload them instantly.",
  "Create folders to organize your files better.",
  "Check your storage usage in the dashboard.",
  "Enable security features to protect your data.",
  "Use the settings to customize your profile.",
  "Switch languages from the navigation menu.",
  "Create backups to keep your data safe.",
];

export default function AIGuidance({ tips = defaultTips }: AIGuidanceProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [eyeGlow, setEyeGlow] = useState<"idle" | "happy" | "thinking" | "alert">("idle");
  const [mouthState, setMouthState] = useState<"neutral" | "smile" | "open">("neutral");
  const [floatingY, setFloatingY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [wobbleAngle, setWobbleAngle] = useState(0);
  const skullRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingY(Math.sin(Date.now() / 500) * 3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setWobbleAngle(Math.sin(Date.now() / 500) * 3);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setIsSpeaking(true);
      setEyeGlow("thinking");
      setMouthState("smile");
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setIsSpeaking(false);
        setEyeGlow("idle");
        setMouthState("neutral");
      }, 3000);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, [tips]);

  const handleHover = () => {
    setIsHovered(true);
    setEyeGlow("happy");
    setMouthState("smile");
    setShowTooltip(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
    setEyeGlow("idle");
    setMouthState("neutral");
    setShowTooltip(false);
  };

  const eyeColor = eyeGlow === "idle" ? "#00ff41" : eyeGlow === "happy" ? "#00ff88" : eyeGlow === "thinking" ? "#ffff00" : "#ff0040";
  const glowIntensity = isSpeaking ? 20 : eyeGlow === "happy" ? 25 : 15;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full border transition-all duration-300 hover:scale-110"
        style={{ background: "rgba(0, 20, 0, 0.9)", borderColor: "#00ff41", boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)" }}
      >
        <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
          <circle cx="50" cy="50" r="40" fill="#0a0a0a" stroke="#00ff41" strokeWidth="2"/>
          <circle cx="35" cy="45" r="8" fill="#00ff41" style={{ filter: `drop-shadow(0 0 5px #00ff41)` }}/>
          <circle cx="65" cy="45" r="8" fill="#00ff41" style={{ filter: `drop-shadow(0 0 5px #00ff41)` }}/>
          <path d="M 30 70 Q 50 85 70 70" stroke="#00ff41" strokeWidth="3" fill="none"/>
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={skullRef}
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      style={{
        transform: `translateY(${floatingY}px) rotate(${wobbleAngle}deg)`,
        transition: "transform 0.1s ease",
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="absolute bottom-full right-16 mb-4 w-64 p-4 rounded-lg border transition-all duration-300" style={{ 
        background: "rgba(0, 20, 10, 0.95)", 
        borderColor: "#00ff41",
        opacity: showTooltip ? 1 : 0.9,
        transform: showTooltip ? "scale(1)" : "scale(0.95)",
        boxShadow: "0 0 30px rgba(0, 255, 65, 0.2)",
      }}>
        <div className="text-xs font-mono" style={{ color: "#00ff41" }}>
          {isSpeaking && <span className="animate-pulse mr-1">▊</span>}
          {tips[currentTip]}
        </div>
      </div>

      <svg viewBox="0 0 120 140" width="100" height="120" style={{ filter: `drop-shadow(0 0 ${glowIntensity}px ${eyeColor})`, transition: "filter 0.3s ease" }}>
        <ellipse cx="60" cy="70" rx="50" ry="55" fill="#0a0a0a" stroke="#00ff41" strokeWidth="2"/>
        <path d="M 30 40 Q 60 20 90 40" fill="#0f0f0f" stroke="#00ff41" strokeWidth="1.5"/>
        <ellipse cx="40" cy="65" rx="14" ry="16" fill="#000" stroke="#00ff41" strokeWidth="2"/>
        <ellipse cx="80" cy="65" rx="14" ry="16" fill="#000" stroke="#00ff41" strokeWidth="2"/>
        <ellipse cx="40" cy="65" rx="8" ry="10" fill={eyeColor} style={{ filter: `drop-shadow(0 0 ${isSpeaking ? 15 : 8}px ${eyeColor})` }}/>
        <ellipse cx="80" cy="65" rx="8" ry="10" fill={eyeColor} style={{ filter: `drop-shadow(0 0 ${isSpeaking ? 15 : 8}px ${eyeColor})` }}/>
        <path d="M 60 80 L 55 95 L 65 95 Z" fill="#0a0a0a" stroke="#00ff41" strokeWidth="1.5"/>
        {mouthState === "neutral" && <path d="M 40 110 Q 60 115 80 110" stroke="#00ff41" strokeWidth="2" fill="none"/>}
        {mouthState === "smile" && <path d="M 35 108 Q 60 125 85 108" stroke="#00ff41" strokeWidth="2" fill="none" style={{ filter: `drop-shadow(0 0 3px #00ff41)` }}/>}
        {mouthState === "open" && <ellipse cx="60" cy="112" rx="12" ry="8" fill="#000" stroke="#00ff41" strokeWidth="1.5"/>}
        <line x1="45" y1="120" x2="45" y2="130" stroke="#00ff41" strokeWidth="1.5"/>
        <line x1="52" y1="120" x2="52" y2="130" stroke="#00ff41" strokeWidth="1.5"/>
        <line x1="60" y1="120" x2="60" y2="130" stroke="#00ff41" strokeWidth="1.5"/>
        <line x1="68" y1="120" x2="68" y2="130" stroke="#00ff41" strokeWidth="1.5"/>
        <line x1="75" y1="120" x2="75" y2="130" stroke="#00ff41" strokeWidth="1.5"/>
        <circle cx="25" cy="55" r="3" fill="#00ff41" opacity="0.5"/>
        <circle cx="95" cy="55" r="3" fill="#00ff41" opacity="0.5"/>
      </svg>

      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse" style={{ background: isSpeaking ? "#00ff41" : "#00ff88", boxShadow: `0 0 10px ${isSpeaking ? "#00ff41" : "#00ff88"}` }}/>
    </div>
  );
}