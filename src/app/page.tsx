import SkullIcon from "@/components/SkullIcon";
import FileManager from "@/components/FileManager";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--necrom-bg)" }}>
      {/* Top nav bar */}
      <nav
        className="border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{
          background: "rgba(5,10,15,0.95)",
          borderColor: "var(--necrom-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SkullIcon size={32} />
          <div>
            <div
              className="text-lg font-bold tracking-[0.3em] glitch-text"
              style={{ color: "#c0392b", fontFamily: "var(--font-geist-mono)" }}
            >
              NECROM
            </div>
            <div className="text-xs tracking-widest" style={{ color: "#3a6080" }}>
              CLOUD SERVER v2.7.7
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="hidden md:flex items-center gap-6">
          <StatusDot label="SERVER" active />
          <StatusDot label="ENCRYPT" active />
          <StatusDot label="SYNC" active />
          <StatusDot label="FIREWALL" active />
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs tracking-widest" style={{ color: "#a0c8e0" }}>OPERATOR</div>
            <div className="text-xs" style={{ color: "#3a6080" }}>AIDEN_P</div>
          </div>
          <div
            className="w-8 h-8 border flex items-center justify-center text-xs font-bold"
            style={{ borderColor: "#c0392b", color: "#c0392b", background: "rgba(192,57,43,0.1)" }}
          >
            AP
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <header
        className="relative overflow-hidden border-b px-6 py-10"
        style={{ borderColor: "var(--necrom-border)" }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(192,57,43,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Skull */}
          <div className="flex-shrink-0">
            <SkullIcon size={120} />
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="text-xs tracking-[0.4em] mb-2" style={{ color: "#3a6080" }}>
              {`// SECURE DIGITAL INFRASTRUCTURE`}
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-3"
              style={{
                color: "#c0392b",
                textShadow: "0 0 20px rgba(192,57,43,0.5), 0 0 40px rgba(192,57,43,0.2)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              NECROM
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "#3a6080" }}>
              Encrypted cloud storage with military-grade security. Store, manage, and access your files,
              videos, audio, and data from anywhere. Every byte is protected.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-6">
              <StatItem value="256-BIT" label="ENCRYPTION" />
              <StatItem value="99.9%" label="UPTIME" />
              <StatItem value="∞" label="STORAGE" />
              <StatItem value="0" label="BREACHES" />
            </div>
          </div>

          {/* Terminal widget */}
          <div
            className="necrom-panel p-4 w-full md:w-72 flex-shrink-0 font-mono text-xs"
            style={{ borderColor: "#1a3a5c" }}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: "#1a3a5c" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#ff3a3a" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#fdcb6e" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#55efc4" }} />
              <span className="ml-2" style={{ color: "#3a6080" }}>necrom_terminal</span>
            </div>
            <TerminalLines />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          <div
            className="text-xs tracking-[0.4em] px-4 py-1 border"
            style={{ color: "#00d4ff", borderColor: "#1a3a5c" }}
          >
            FILE SYSTEM
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        <FileManager />
      </main>

      {/* Footer */}
      <footer
        className="border-t px-6 py-4 mt-8"
        style={{ borderColor: "var(--necrom-border)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SkullIcon size={20} />
            <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>
              NECROM CLOUD // ALL DATA ENCRYPTED // WATCH_DOGS PROTOCOL ACTIVE
            </span>
          </div>
          <div className="text-xs" style={{ color: "#1a3a5c" }}>
            SYS_BUILD: 2026.02.27 — NODE: ctOS-7
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatusDot({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: active ? "#55efc4" : "#ff3a3a",
          boxShadow: active ? "0 0 6px #55efc4" : "0 0 6px #ff3a3a",
        }}
      />
      <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>{label}</span>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-bold" style={{ color: "#00d4ff" }}>{value}</div>
      <div className="text-xs tracking-widest" style={{ color: "#3a6080" }}>{label}</div>
    </div>
  );
}

function TerminalLines() {
  const lines = [
    { prefix: "$", text: "necrom --connect", color: "#a0c8e0" },
    { prefix: ">", text: "AUTH: VERIFIED ✓", color: "#55efc4" },
    { prefix: ">", text: "NODE: ctOS-7 ONLINE", color: "#55efc4" },
    { prefix: ">", text: "ENCRYPT: AES-256 ACTIVE", color: "#55efc4" },
    { prefix: ">", text: "FIREWALL: ENABLED", color: "#55efc4" },
    { prefix: "$", text: "ls /necrom/vault", color: "#a0c8e0" },
    { prefix: ">", text: "6 FILES INDEXED", color: "#00d4ff" },
    { prefix: "$", text: "status", color: "#a0c8e0" },
    { prefix: ">", text: "ALL SYSTEMS NOMINAL", color: "#55efc4" },
    { prefix: "$", text: "_", color: "#00d4ff" },
  ];

  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span style={{ color: "#c0392b" }}>{line.prefix}</span>
          <span style={{ color: line.color }}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}
