"use client";

import { useState } from "react";

export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "skull", emoji: "\u2620\uFE0F", label: "Skull", color: "#c0392b" },
  { id: "robot", emoji: "\uD83E\uDD16", label: "Robot", color: "#00d4ff" },
  { id: "alien", emoji: "\uD83D\uDC7D", label: "Alien", color: "#00ff41" },
  { id: "ghost", emoji: "\uD83D\uDC7B", label: "Ghost", color: "#c8c8c8" },
  { id: "dragon", emoji: "\uD83D\uDC09", label: "Dragon", color: "#ff3a3a" },
  { id: "ninja", emoji: "\uD83E\uDD77", label: "Ninja", color: "#2a2a2a" },
  { id: "wizard", emoji: "\uD83E\uDDD9", label: "Wizard", color: "#9b59b6" },
  { id: "vampire", emoji: "\uD83E\uDDDB", label: "Vampire", color: "#8e44ad" },
  { id: "zombie", emoji: "\uD83E\uDDDF", label: "Zombie", color: "#27ae60" },
  { id: "cyborg", emoji: "\uD83E\uDDBE", label: "Cyborg", color: "#3498db" },
  { id: "hacker", emoji: "\uD83D\uDCBB", label: "Hacker", color: "#00ff41" },
  { id: "shield", emoji: "\uD83D\uDEE1\uFE0F", label: "Shield", color: "#f39c12" },
  { id: "fire", emoji: "\uD83D\uDD25", label: "Fire", color: "#e74c3c" },
  { id: "lightning", emoji: "\u26A1", label: "Lightning", color: "#f1c40f" },
  { id: "eye", emoji: "\uD83D\uDC41\uFE0F", label: "Watcher", color: "#9b59b6" },
  { id: "lock", emoji: "\uD83D\uDD12", label: "Locked", color: "#3498db" },
  { id: "key", emoji: "\uD83D\uDD11", label: "Key", color: "#f39c12" },
  { id: "crown", emoji: "\uD83D\uDC51", label: "Crown", color: "#f1c40f" },
  { id: "diamond", emoji: "\uD83D\uDC8E", label: "Diamond", color: "#00d4ff" },
  { id: "star", emoji: "\u2B50", label: "Star", color: "#f1c40f" },
  { id: "moon", emoji: "\uD83C\uDF19", label: "Moon", color: "#9b59b6" },
  { id: "sun", emoji: "\u2600\uFE0F", label: "Sun", color: "#f39c12" },
  { id: "bolt", emoji: "\u26A1", label: "Bolt", color: "#e67e22" },
  { id: "biohazard", emoji: "\u2623\uFE0F", label: "Biohazard", color: "#27ae60" },
];

interface AvatarGalleryProps {
  selectedId: string;
  onSelect: (avatar: AvatarOption) => void;
  t: (key: string) => string;
}

export default function AvatarGallery({ selectedId, onSelect, t }: AvatarGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <div className="text-xs tracking-widest mb-3" style={{ color: "#3a6080" }}>
        {t("settings.selectAvatar")}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar)}
            onMouseEnter={() => setHoveredId(avatar.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative w-10 h-10 flex items-center justify-center text-xl border transition-all"
            style={{
              background:
                selectedId === avatar.id
                  ? `${avatar.color}25`
                  : hoveredId === avatar.id
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.3)",
              borderColor: selectedId === avatar.id ? avatar.color : "var(--necrom-border)",
              boxShadow: selectedId === avatar.id ? `0 0 10px ${avatar.color}40` : "none",
            }}
            title={avatar.label}
          >
            {avatar.emoji}
            {selectedId === avatar.id && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                style={{ background: avatar.color }}
              >
                <span className="text-[8px] text-black">\u2713</span>
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs mt-3" style={{ color: "#1a3a5c" }}>
        {t("settings.avatarDescription")}
      </p>
    </div>
  );
}
