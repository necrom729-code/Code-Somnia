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
  const filledBars = Math.floor(percentage / 5);
  const emptyBars = 20 - filledBars;

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs tracking-wider" style={{ color: "#3a6080", minWidth: "80px" }}>
          {label}
        </span>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: filledBars }).map((_, i) => (
          <div
            key={`filled-${i}`}
            className="w-3 h-2"
            style={{
              background: color,
              boxShadow: `0 0 4px ${color}`,
            }}
          />
        ))}
        {Array.from({ length: emptyBars }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-3 h-2"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: `1px solid ${color}40`,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono" style={{ color }}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}