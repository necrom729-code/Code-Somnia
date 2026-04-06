"use client";

interface HackerProgressProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
}

export default function HackerProgress({
  value,
  max = 100,
  label,
  color = "#00d4ff",
}: HackerProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs tracking-wider" style={{ color: "#3a6080", minWidth: "80px" }}>
          {label}
        </span>
      )}
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${color}40` }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
      <span className="text-xs font-mono" style={{ color }}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}