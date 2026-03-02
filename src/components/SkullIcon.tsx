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
      {/* Angular aggressive skull shape - Watch Dogs style */}
      <path
        d="M50 8 L78 22 L82 48 L76 68 L65 80 L35 80 L24 68 L18 48 L22 22 Z"
        fill="#0d0505"
        stroke="#c0392b"
        strokeWidth="2"
      />
      
      {/* Dark fill overlay */}
      <path
        d="M50 12 L74 24 L78 48 L72 64 L63 74 L37 74 L28 64 L22 48 L26 24 Z"
        fill="#1a0a0a"
      />
      
      {/* Aggressive angular jaw */}
      <path
        d="M30 72 L35 88 L42 88 L45 78 L55 78 L58 88 L65 88 L70 72 L65 74 L35 74 Z"
        fill="#0d0505"
        stroke="#c0392b"
        strokeWidth="1.5"
      />
      
      {/* Teeth gaps - sharper */}
      <path d="M36 76 L38 86 L40 86 L41 76 Z" fill="#050a0f" />
      <path d="M43 76 L44 80 L46 80 L47 76 Z" fill="#050a0f" />
      <path d="M53 76 L54 80 L56 80 L57 76 Z" fill="#050a0f" />
      <path d="M59 76 L60 86 L62 86 L64 76 Z" fill="#050a0f" />
      
      {/* Angry eye sockets - angled down aggressively */}
      <path
        d="M28 38 L22 52 L35 56 L42 48 L38 34 Z"
        fill="#050a0f"
        stroke="#ff3a3a"
        strokeWidth="1.5"
      />
      <path
        d="M72 38 L78 52 L65 56 L58 48 L62 34 Z"
        fill="#050a0f"
        stroke="#ff3a3a"
        strokeWidth="1.5"
      />
      
      {/* Intense eye glow - larger and more aggressive */}
      <ellipse cx="32" cy="44" rx="6" ry="7" fill="#c0392b" opacity="0.9" />
      <ellipse cx="68" cy="44" rx="6" ry="7" fill="#c0392b" opacity="0.9" />
      
      {/* Burning eye cores */}
      <ellipse cx="32" cy="44" rx="3" ry="4" fill="#ff0000" />
      <ellipse cx="68" cy="44" rx="3" ry="4" fill="#ff0000" />
      
      {/* Eye highlights */}
      <circle cx="34" cy="42" r="1.5" fill="#ff9999" />
      <circle cx="70" cy="42" r="1.5" fill="#ff9999" />
      
      {/* Nose cavity - inverted triangle */}
      <path
        d="M50 54 L45 62 L50 68 L55 62 Z"
        fill="#050a0f"
        stroke="#c0392b"
        strokeWidth="1"
      />
      <path d="M50 56 L47 61 L50 65 L53 61 Z" fill="#1a0a0a" />
      
      {/* Digital circuit lines - more prominent Watch Dogs style */}
      <line x1="15" y1="42" x2="28" y2="42" stroke="#00d4ff" strokeWidth="1.2" opacity="0.8" />
      <line x1="72" y1="42" x2="85" y2="42" stroke="#00d4ff" strokeWidth="1.2" opacity="0.8" />
      <line x1="50" y1="8" x2="50" y2="18" stroke="#00d4ff" strokeWidth="1.2" opacity="0.8" />
      <line x1="30" y1="20" x2="35" y2="28" stroke="#00d4ff" strokeWidth="0.8" opacity="0.6" />
      <line x1="70" y1="20" x2="65" y2="28" stroke="#00d4ff" strokeWidth="0.8" opacity="0.6" />
      
      {/* Circuit nodes */}
      <circle cx="15" cy="42" r="2.5" fill="#00d4ff" opacity="0.9" />
      <circle cx="85" cy="42" r="2.5" fill="#00d4ff" opacity="0.9" />
      <circle cx="50" cy="8" r="2.5" fill="#00d4ff" opacity="0.9" />
      
      {/* Digital glitch effects */}
      <rect x="45" y="24" width="10" height="2" fill="#00d4ff" opacity="0.4" />
      <rect x="52" y="58" width="6" height="1.5" fill="#ff3a3a" opacity="0.5" />
      
      {/* Crack lines - more damage */}
      <path d="M50 18 L47 28 L52 32 L49 40" stroke="#ff3a3a" strokeWidth="1" opacity="0.7" fill="none" />
      <path d="M30 30 L26 38 L28 44" stroke="#c0392b" strokeWidth="0.8" opacity="0.5" fill="none" />
      <path d="M70 30 L74 38 L72 44" stroke="#c0392b" strokeWidth="0.8" opacity="0.5" fill="none" />
      
      {/* Forehead crease - angry expression */}
      <path d="M38 26 L50 24 L62 26" stroke="#c0392b" strokeWidth="0.8" opacity="0.4" fill="none" />
      
      {/* Side cheekbones */}
      <path d="M20 48 L22 58 L26 55" stroke="#c0392b" strokeWidth="0.6" opacity="0.4" fill="none" />
      <path d="M80 48 L78 58 L74 55" stroke="#c0392b" strokeWidth="0.6" opacity="0.4" fill="none" />
    </svg>
  );
}
