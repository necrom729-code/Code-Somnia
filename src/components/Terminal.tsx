"use client";

import { useState, useEffect, useRef } from "react";

export default function Terminal() {
  const [currentLine, setCurrentLine] = useState("");
  const [history, setHistory] = useState<string[]>([
    "> NECROM CLOUD TERMINAL v3.0.0",
  ]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const bootMessages = [
    "> INITIALIZING SYSTEM...",
    "> CONNECTING TO SECURE SERVER...",
    "> ENCRYPTION: AES-256 ACTIVE",
    "> PROTOCOL: WATCH_DOGS",
    "> SYSTEM READY",
    "",
  ];

  const commands = [
    "status",
    "help",
    "scan",
    "backup",
    "vpn connect",
    "clear",
    "exit",
  ];

  // Typing animation for boot sequence
  useEffect(() => {
    let index = 0;
    const typeNext = () => {
      if (index < bootMessages.length) {
        setHistory((prev) => [...prev, bootMessages[index]]);
        index++;
        setTimeout(typeNext, 300 + Math.random() * 400);
      }
    };
    typeNext();
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      const cmd = currentLine.trim().toLowerCase();
      if (cmd) {
        setHistory((prev) => [...prev, `> ${cmd}`]);

        const responses: Record<string, string> = {
          status: "ALL SYSTEMS OPERATIONAL // PROTECTIONS ACTIVE",
          help: "AVAILABLE COMMANDS: status, scan, backup, vpn connect, clear, exit",
          scan: "SCANNING NETWORK... THREATS DETECTED: 0",
          backup: "INITIATING BACKUP PROTOCOL...",
          "vpn connect": "CONNECTING TO SECURE SERVER...",
          clear: "CLEARING TERMINAL...",
          exit: "LOGGING OUT...",
        };

        const response = responses[cmd] || `COMMAND NOT RECOGNIZED: ${cmd}`;
        
        // Type out response
        let charIndex = 0;
        const typeResponse = () => {
          if (charIndex < response.length) {
            setHistory((prev) => {
              const newHistory = [...prev];
              newHistory[newHistory.length - 1] = response.slice(0, charIndex + 1);
              return newHistory;
            });
            charIndex++;
            setTimeout(typeResponse, 20);
          } else {
            setHistory((prev) => [...prev, ""]);
          }
        };
        
        setHistory((prev) => [...prev, ""]);
        typeResponse();
      }
      setCurrentLine("");

      setTimeout(() => {
        const terminal = document.getElementById("terminal-output");
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
      }, 10);
    }
  }

  return (
    <div
      className="border p-4 font-mono text-xs relative overflow-hidden"
      style={{
        background: "rgba(0, 10, 0, 0.9)",
        borderColor: "#00ff41",
        height: "220px",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
        }}
      />
      
      {/* Glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 30px rgba(0, 255, 65, 0.1), 0 0 20px rgba(0, 255, 65, 0.2)",
        }}
      />

      <div
        id="terminal-output"
        className="h-[170px] overflow-y-auto mb-2 relative z-10"
        style={{ color: "#00ff41" }}
      >
        {history.map((line, i) => (
          <div 
            key={i} 
            className="whitespace-pre-wrap"
            style={{
              animation: i === history.length - 1 && line ? "fadeIn 0.3s ease" : "none",
            }}
          >
            {line}
            {i === history.length - 1 && line && (
              <span
                className="inline-block w-2 h-4 align-middle ml-1"
                style={{
                  background: "#00ff41",
                  animation: showCursor ? "blink 0.5s infinite" : "none",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center relative z-10" style={{ color: "#00ff41" }}>
        <span className="animate-pulse">{"\u276F"}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none ml-2 flex-1"
          style={{ color: "#00ff41" }}
          placeholder="Enter command..."
          autoFocus
        />
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}