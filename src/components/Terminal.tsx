"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function Terminal() {
  const { t } = useI18n();
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [history, setHistory] = useState<string[]>([
    "> NECROM CLOUD TERMINAL v3.0.0",
    "> INITIALIZING SYSTEM...",
    "> CONNECTING TO SECURE SERVER...",
    "> ENCRYPTION: AES-256 ACTIVE",
    "> PROTOCOL: WATCH_DOGS",
    "> SYSTEM READY",
    "",
  ]);

  const commands = [
    "status",
    "help",
    "scan",
    "backup",
    "vpn connect",
    "clear",
    "exit",
  ];

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
        setHistory((prev) => [...prev, response, ""]);
      }
      setCurrentLine("");
      
      // Auto-scroll to bottom
      setTimeout(() => {
        const terminal = document.getElementById("terminal-output");
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
      }, 10);
    }
  }

  return (
    <div
      className="border p-4 font-mono text-xs"
      style={{
        background: "rgba(0, 10, 0, 0.8)",
        borderColor: "#00ff41",
        height: "200px",
        overflow: "hidden",
      }}
    >
      <div
        id="terminal-output"
        className="h-[160px] overflow-y-auto mb-2"
        style={{ color: "#00ff41" }}
      >
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      <div className="flex items-center" style={{ color: "#00ff41" }}>
        <span>{">"}</span>
        <input
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
    </div>
  );
}