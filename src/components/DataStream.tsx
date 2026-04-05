"use client";

import { useEffect, useState, useRef } from "react";

interface DataStreamProps {
  position?: "left" | "right";
}

export default function DataStream({ position = "left" }: DataStreamProps) {
  const [chars, setChars] = useState<string[]>([]);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF");

  useEffect(() => {
    const stream = Array.from({ length: 8 }, () =>
      charsRef.current[Math.floor(Math.random() * charsRef.current.length)]
    );
    setChars(stream);

    const interval = setInterval(() => {
      const newChars = Array.from({ length: 8 }, () =>
        charsRef.current[Math.floor(Math.random() * charsRef.current.length)]
      );
      setChars(newChars);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const isLeft = position === "left";

  return (
    <div
      className="fixed top-0 bottom-0 w-12 pointer-events-none z-10 overflow-hidden"
      style={{
        [isLeft ? "left" : "right"]: 0,
      }}
    >
      <div className="flex flex-col gap-1 pt-20">
        {chars.map((char, i) => (
          <span
            key={i}
            className="text-xs font-mono animate-pulse"
            style={{
              color: i === 0 ? "#ffffff" : "#00d4ff",
              textShadow: i === 0 ? "0 0 8px #00d4ff" : "none",
              opacity: 1 - i * 0.1,
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1 mt-20">
        {chars.map((char, i) => (
          <span
            key={`dup-${i}`}
            className="text-xs font-mono animate-pulse"
            style={{
              color: i === 0 ? "#ffffff" : "#00d4ff",
              textShadow: i === 0 ? "0 0 8px #00d4ff" : "none",
              opacity: 1 - i * 0.1,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}