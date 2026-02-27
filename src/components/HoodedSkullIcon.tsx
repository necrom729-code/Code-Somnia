"use client";

interface HoodedSkullIconProps {
  size?: number;
  className?: string;
  variant?: "black" | "red" | "blue" | "purple";
  expression?: "trick" | "happy" | "sad";
}

const variantColors = {
  black: {
    hoodie: "#0a0a0a",
    stroke: "#c0392b",
    glow: "#c0392b",
    inner: "#ff6b6b",
  },
  red: {
    hoodie: "#8b0000",
    stroke: "#ff3a3a",
    glow: "#ff3a3a",
    inner: "#ff9999",
  },
  blue: {
    hoodie: "#00008b",
    stroke: "#00d4ff",
    glow: "#00d4ff",
    inner: "#99ffff",
  },
  purple: {
    hoodie: "#4b0082",
    stroke: "#9b59b6",
    glow: "#9b59b6",
    inner: "#e8c5f2",
  },
};

export default function HoodedSkullIcon({ size = 48, className = "", variant = "black", expression = "trick" }: HoodedSkullIconProps) {
  const colors = variantColors[variant];
  
  // Expression-specific eye and mouth rendering
  const renderEyes = () => {
    if (expression === "happy") {
      // Happy eyes - curved upward (closed happy eyes)
      return (
        <>
          {/* Left eye - happy curved line */}
          <path d="M30 38 Q38 32 46 38" stroke={colors.glow} strokeWidth="2" fill="none" />
          {/* Left eye glow */}
          <circle cx="38" cy="40" r="3" fill={colors.stroke} opacity="0.5" />
          {/* Right eye - happy curved line */}
          <path d="M54 38 Q62 32 70 38" stroke={colors.glow} strokeWidth="2" fill="none" />
          {/* Right eye glow */}
          <circle cx="62" cy="40" r="3" fill={colors.stroke} opacity="0.5" />
        </>
      );
    } else if (expression === "sad") {
      // Sad/apologetic eyes - droopy, worried
      return (
        <>
          {/* Left eye socket - sad/worried */}
          <ellipse cx="38" cy="38" rx="8" ry="9" fill="#050a0f" stroke={colors.glow} strokeWidth="1" />
          {/* Left eye glow */}
          <ellipse cx="38" cy="40" rx="4" ry="3" fill={colors.stroke} opacity="0.7" />
          {/* Left eye - worried look */}
          <ellipse cx="38" cy="40" rx="2" ry="2" fill={colors.inner} />
          {/* Left eyebrow - worried/sad */}
          <path d="M30 32 Q38 34 46 32" stroke={colors.glow} strokeWidth="1" fill="none" opacity="0.6" />
          
          {/* Right eye socket - sad/worried */}
          <ellipse cx="62" cy="38" rx="8" ry="9" fill="#050a0f" stroke={colors.glow} strokeWidth="1" />
          {/* Right eye glow */}
          <ellipse cx="62" cy="40" rx="4" ry="3" fill={colors.stroke} opacity="0.7" />
          {/* Right eye - worried look */}
          <ellipse cx="62" cy="40" rx="2" ry="2" fill={colors.inner} />
          {/* Right eyebrow - worried/sad */}
          <path d="M54 32 Q62 34 70 32" stroke={colors.glow} strokeWidth="1" fill="none" opacity="0.6" />
        </>
      );
    } else {
      // Trick expression (default)
      return (
        <>
          {/* Left eye socket - evil trick expression */}
          <ellipse cx="38" cy="38" rx="8" ry="9" fill="#050a0f" stroke={colors.glow} strokeWidth="1" />
          {/* Left eye glow */}
          <ellipse cx="38" cy="38" rx="4" ry="5" fill={colors.stroke} opacity="0.7" />
          {/* Left eye - slanted trick look */}
          <ellipse cx="38" cy="36" rx="2" ry="3" fill={colors.inner} />
          <path d="M32 34 Q38 30 44 36" stroke={colors.glow} strokeWidth="1" fill="none" opacity="0.6" />
          
          {/* Right eye socket - evil trick expression */}
          <ellipse cx="62" cy="38" rx="8" ry="9" fill="#050a0f" stroke={colors.glow} strokeWidth="1" />
          {/* Right eye glow */}
          <ellipse cx="62" cy="38" rx="4" ry="5" fill={colors.stroke} opacity="0.7" />
          {/* Right eye - slanted trick look */}
          <ellipse cx="62" cy="36" rx="2" ry="3" fill={colors.inner} />
          <path d="M56 36 Q62 30 68 34" stroke={colors.glow} strokeWidth="1" fill="none" opacity="0.6" />
        </>
      );
    }
  };
  
  const renderMouth = () => {
    if (expression === "happy") {
      // Happy smile
      return (
        <path 
          d="M35 64 Q50 74 65 64" 
          stroke={colors.stroke} 
          strokeWidth="2" 
          fill="none"
        />
      );
    } else if (expression === "sad") {
      // Sad/apologetic frown
      return (
        <path 
          d="M35 68 Q50 60 65 68" 
          stroke={colors.stroke} 
          strokeWidth="1.5" 
          fill="none"
          opacity="0.8"
        />
      );
    } else {
      // Trick/grin (default)
      return (
        <path 
          d="M35 62 L37 66 L39 62 L41 66 L43 62 L45 66 L47 62 L49 66 L51 62 L53 66 L55 62 L57 66 L59 62 L61 66 L63 62 L65 66" 
          stroke={colors.stroke} 
          strokeWidth="1" 
          fill="none"
        />
      );
    }
  };
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`hooded-skull-glow ${className}`}
      style={{ filter: `drop-shadow(0 0 8px ${colors.glow}40)` }}
    >
      {/* Hoodie cloak - back */}
      <path 
        d="M15 20 Q15 5 50 5 Q85 5 85 20 L90 95 Q90 100 85 95 L15 95 Q10 100 10 95 Z" 
        fill={colors.hoodie} 
        stroke={colors.stroke} 
        strokeWidth="1.2"
      />
      
      {/* Hoodie inner shadow */}
      <path 
        d="M20 18 Q20 10 50 10 Q80 10 80 18 L83 90 Q83 93 80 90 L20 90 Q17 93 17 90 Z" 
        fill="#050a0f" 
        opacity="0.8"
      />
      
      {/* Skull cranium visible in hood */}
      <ellipse cx="50" cy="40" rx="28" ry="26" fill="#1a0a0a" stroke={colors.stroke} strokeWidth="1.2" />
      
      {/* Hood opening - darker around face */}
      <ellipse cx="50" cy="38" rx="24" ry="22" fill="#0a0505" />
      
      {/* Jaw */}
      <rect x="32" y="58" width="36" height="16" rx="3" fill="#1a0a0a" stroke={colors.stroke} strokeWidth="1" />
      
      {/* Jaw teeth */}
      <rect x="36" y="64" width="5" height="8" rx="1" fill="#050a0f" stroke={colors.stroke} strokeWidth="0.5" />
      <rect x="43" y="64" width="5" height="8" rx="1" fill="#050a0f" stroke={colors.stroke} strokeWidth="0.5" />
      <rect x="52" y="64" width="5" height="8" rx="1" fill="#050a0f" stroke={colors.stroke} strokeWidth="0.5" />
      <rect x="59" y="64" width="5" height="8" rx="1" fill="#050a0f" stroke={colors.stroke} strokeWidth="0.5" />
      
      {/* Eyes - expression based */}
      {renderEyes()}
      
      {/* Nose cavity */}
      <path d="M47 50 L50 45 L53 50 L51 54 L49 54 Z" fill="#050a0f" stroke={colors.stroke} strokeWidth="0.6" />
      
      {/* Mouth - expression based */}
      {renderMouth()}
      
      {/* Digital circuit lines on hoodie */}
      <line x1="12" y1="50" x2="25" y2="50" stroke={colors.glow} strokeWidth="0.8" opacity="0.4" />
      <line x1="75" y1="50" x2="88" y2="50" stroke={colors.glow} strokeWidth="0.8" opacity="0.4" />
      <line x1="50" y1="8" x2="50" y2="18" stroke={colors.glow} strokeWidth="0.8" opacity="0.4" />
      <circle cx="12" cy="50" r="1.5" fill={colors.glow} opacity="0.6" />
      <circle cx="88" cy="50" r="1.5" fill={colors.glow} opacity="0.6" />
      <circle cx="50" cy="8" r="1.5" fill={colors.glow} opacity="0.6" />
      
      {/* Hood edge highlight */}
      <path 
        d="M22 15 Q50 8 78 15" 
        stroke={colors.glow} 
        strokeWidth="0.5" 
        fill="none" 
        opacity="0.3"
      />
    </svg>
  );
}
