"use client";

interface SkullIconProps {
  size?: number;
  className?: string;
}

export default function SkullIcon({ size = 48, className = "" }: SkullIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`skull-glow ${className}`}
    >
      {/* Skull cranium */}
      <ellipse cx="50" cy="42" rx="32" ry="30" fill="#1a0a0a" stroke="#c0392b" strokeWidth="1.5" />
      {/* Jaw */}
      <rect x="30" y="62" width="40" height="18" rx="4" fill="#1a0a0a" stroke="#c0392b" strokeWidth="1.5" />
      {/* Jaw teeth gaps */}
      <rect x="36" y="68" width="6" height="10" rx="1" fill="#050a0f" />
      <rect x="47" y="68" width="6" height="10" rx="1" fill="#050a0f" />
      <rect x="58" y="68" width="6" height="10" rx="1" fill="#050a0f" />
      {/* Left eye socket */}
      <ellipse cx="37" cy="40" rx="9" ry="10" fill="#050a0f" stroke="#ff3a3a" strokeWidth="1" />
      {/* Right eye socket */}
      <ellipse cx="63" cy="40" rx="9" ry="10" fill="#050a0f" stroke="#ff3a3a" strokeWidth="1" />
      {/* Left eye glow */}
      <ellipse cx="37" cy="40" rx="5" ry="6" fill="#c0392b" opacity="0.7" />
      {/* Right eye glow */}
      <ellipse cx="63" cy="40" rx="5" ry="6" fill="#c0392b" opacity="0.7" />
      {/* Left eye inner */}
      <ellipse cx="37" cy="40" rx="2" ry="2.5" fill="#ff6b6b" />
      {/* Right eye inner */}
      <ellipse cx="63" cy="40" rx="2" ry="2.5" fill="#ff6b6b" />
      {/* Nose cavity */}
      <path d="M46 52 L50 46 L54 52 L52 56 L48 56 Z" fill="#050a0f" stroke="#c0392b" strokeWidth="0.8" />
      {/* Digital circuit lines on skull */}
      <line x1="18" y1="42" x2="30" y2="42" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="70" y1="42" x2="82" y2="42" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="50" y1="12" x2="50" y2="20" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
      <circle cx="18" cy="42" r="2" fill="#00d4ff" opacity="0.7" />
      <circle cx="82" cy="42" r="2" fill="#00d4ff" opacity="0.7" />
      <circle cx="50" cy="12" r="2" fill="#00d4ff" opacity="0.7" />
      {/* Crack lines */}
      <path d="M50 20 L48 28 L52 32 L50 38" stroke="#c0392b" strokeWidth="0.8" opacity="0.6" fill="none" />
    </svg>
  );
}
