"use client";

import SkullIcon from "@/components/SkullIcon";
import HoodedSkullIcon from "@/components/HoodedSkullIcon";
import FileManager from "@/components/FileManager";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, startTransition } from "react";

export default function Home() {
  const [showWatchdogs, setShowWatchdogs] = useState(false);

  useEffect(() => {
    // Trigger watchdogs animation on page load
    startTransition(() => {
      setShowWatchdogs(true);
    });
    const timer = setTimeout(() => {
      startTransition(() => {
        setShowWatchdogs(false);
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--necrom-bg)" }}>
      <NavBar />

      {/* Watchdogs Animation Overlay */}
      {showWatchdogs && <WatchdogsAnimation />}

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
          {/* Skull with Watchdogs */}
          <div className="relative flex-shrink-0">
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

          {/* Storage Usage Display */}
          <StorageUsage />
        </div>
      </header>

      {/* Security Features Section */}
      <SecurityFeatures />

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

function NavBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push("/signin");
  }

  return (
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

      {/* Right side — auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href="/settings"
              className="text-xs tracking-widest transition-colors hidden sm:block"
              style={{ color: "#3a6080" }}
            >
              SETTINGS
            </Link>
            <div className="text-xs tracking-widest hidden sm:block" style={{ color: "#a0c8e0" }}>
              {user.username}
            </div>
            <div
              className="w-8 h-8 border flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ borderColor: "#c0392b", color: "#c0392b", background: "rgba(192,57,43,0.1)" }}
              title="Sign out"
              onClick={handleSignOut}
            >
              {user.avatarInitials}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin" className="necrom-btn text-xs py-1 px-3">
              SIGN IN
            </Link>
            <Link
              href="/signup"
              className="text-xs tracking-widest hidden sm:block transition-colors"
              style={{ color: "#3a6080" }}
            >
              REGISTER
            </Link>
          </div>
        )}
      </div>
    </nav>
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

function StorageUsage() {
  // Simulated storage data - in real app this would come from API
  const totalStorage = 500; // GB
  const usedStorage = 127.4; // GB
  const usedMB = Math.round((usedStorage % 1) * 1024);
  const percentage = (usedStorage / totalStorage) * 100;

  return (
    <div
      className="necrom-panel p-4 w-full md:w-72 flex-shrink-0"
      style={{ borderColor: "#1a3a5c" }}
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: "#1a3a5c" }}>
        <div className="w-2 h-2 rounded-full" style={{ background: "#55efc4" }} />
        <span className="ml-2" style={{ color: "#3a6080" }}>SSD STORAGE</span>
      </div>
      
      {/* Storage bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: "#a0c8e0" }}>USED</span>
          <span style={{ color: "#00d4ff" }}>{percentage.toFixed(1)}%</span>
        </div>
        <div 
          className="h-2 border"
          style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
        >
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #00d4ff, #c0392b)",
              boxShadow: "0 0 10px rgba(0,212,255,0.5)"
            }}
          />
        </div>
      </div>

      {/* Storage values */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="border p-2" style={{ borderColor: "#1a3a5c" }}>
          <div style={{ color: "#3a6080" }}>USED</div>
          <div style={{ color: "#00d4ff", fontSize: "16px", fontWeight: "bold" }}>
            {Math.floor(usedStorage)}<span className="text-xs">GB</span> {usedMB}<span className="text-xs">MB</span>
          </div>
        </div>
        <div className="border p-2" style={{ borderColor: "#1a3a5c" }}>
          <div style={{ color: "#3a6080" }}>FREE</div>
          <div style={{ color: "#55efc4", fontSize: "16px", fontWeight: "bold" }}>
            {(totalStorage - usedStorage).toFixed(1)}<span className="text-xs">GB</span>
          </div>
        </div>
      </div>

      {/* Drive info */}
      <div className="mt-3 pt-2 border-t text-xs" style={{ borderColor: "#1a3a5c", color: "#3a6080" }}>
        <div className="flex justify-between">
          <span>NVMe SSD</span>
          <span style={{ color: "#55efc4" }}>● ONLINE</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Total:</span>
          <span>{totalStorage} GB</span>
        </div>
      </div>
    </div>
  );
}

function SecurityFeatures() {
  const features = [
    { icon: "🛡️", name: "ANTIVIRUS", status: "ACTIVE", desc: "Real-time threat detection & removal" },
    { icon: "🔒", name: "PRIVACY VPN", status: "ACTIVE", desc: "Encrypted tunnel for all connections" },
    { icon: "🔥", name: "FIREWALL", status: "ACTIVE", desc: "Advanced packet filtering & monitoring" },
    { icon: "🔐", name: "END-TO-END", status: "ACTIVE", desc: "Military-grade AES-256 encryption" },
    { icon: "👁️", name: "WATCHDOGS", status: "ACTIVE", desc: "24/7 intrusion detection system" },
    { icon: "📊", name: "AUDIT LOG", status: "ACTIVE", desc: "Complete activity tracking & forensics" },
  ];

  return (
    <section className="border-b" style={{ borderColor: "var(--necrom-border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          <div
            className="text-xs tracking-[0.4em] px-4 py-1 border"
            style={{ color: "#c0392b", borderColor: "#1a3a5c" }}
          >
            SECURITY PROTECTION
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="necrom-panel p-4 text-center hover:scale-105 transition-transform cursor-default"
              style={{ borderColor: "#1a3a5c" }}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div 
                className="text-xs font-bold tracking-wider mb-1" 
                style={{ color: "#c0392b" }}
              >
                {feature.name}
              </div>
              <div 
                className="text-[10px] tracking-[0.2em] mb-1" 
                style={{ color: "#55efc4" }}
              >
                {feature.status}
              </div>
              <div className="text-[9px]" style={{ color: "#3a6080" }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Security status bar */}
        <div 
          className="mt-6 p-3 border flex items-center justify-between"
          style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#55efc4", boxShadow: "0 0 8px #55efc4" }}
            />
            <span className="text-xs tracking-widest" style={{ color: "#55efc4" }}>
              ALL SECURITY SYSTEMS OPERATIONAL
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#3a6080" }}>
            <span>THREATS BLOCKED: 0</span>
            <span>|</span>
            <span>LAST SCAN: JUST NOW</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WatchdogsAnimation() {
  const [variantIndex, setVariantIndex] = useState(0);
  const [trickOffset, setTrickOffset] = useState({ x: 0, y: 0 });
  
  const variants: Array<"black" | "red" | "blue" | "purple"> = ["black", "red", "blue", "purple"];
  const variant = variants[variantIndex];

  useEffect(() => {
    const v = ["black", "red", "blue", "purple"] as const;
    // Cycle through variants every 800ms
    const variantInterval = setInterval(() => {
      setVariantIndex(prev => (prev + 1) % v.length);
    }, 800);
    
    // Create trick/moving animation effect
    const trickInterval = setInterval(() => {
      setTrickOffset({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 15,
      });
    }, 150);
    
    return () => {
      clearInterval(variantInterval);
      clearInterval(trickInterval);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      style={{ background: "rgba(5,10,15,0.92)" }}
    >
      {/* Animated background glow based on variant */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{ 
          background: variant === "black" ? "radial-gradient(circle, rgba(192,57,43,0.3) 0%, transparent 70%)" :
                     variant === "red" ? "radial-gradient(circle, rgba(255,58,58,0.3) 0%, transparent 70%)" :
                     variant === "blue" ? "radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)" :
                     "radial-gradient(circle, rgba(155,89,182,0.3) 0%, transparent 70%)",
          animationDuration: "0.8s"
        }}
      />
      
      {/* Hooded skull with trick animation */}
      <div 
        className="relative"
        style={{
          transform: `translate(${trickOffset.x}px, ${trickOffset.y}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Pulsing glow behind skull */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: variant === "black" ? "radial-gradient(circle, rgba(192,57,43,0.5) 0%, transparent 60%)" :
                       variant === "red" ? "radial-gradient(circle, rgba(255,58,58,0.5) 0%, transparent 60%)" :
                       variant === "blue" ? "radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 60%)" :
                       "radial-gradient(circle, rgba(155,89,182,0.5) 0%, transparent 60%)",
            animation: "pulse-glow 0.8s ease-in-out infinite alternate",
          }}
        />
        <HoodedSkullIcon size={180} variant={variant} />
      </div>

      {/* Warning text */}
      <div className="absolute bottom-20 text-center">
        <div 
          className="text-2xl font-bold tracking-[0.5em] animate-pulse"
          style={{ 
            color: variant === "black" ? "#c0392b" : 
                   variant === "red" ? "#ff3a3a" : 
                   variant === "blue" ? "#00d4ff" : 
                   "#9b59b6",
            textShadow: variant === "black" ? "0 0 20px rgba(192,57,43,0.8)" :
                        variant === "red" ? "0 0 20px rgba(255,58,58,0.8)" :
                        variant === "blue" ? "0 0 20px rgba(0,212,255,0.8)" :
                        "0 0 20px rgba(155,89,182,0.8)"
          }}
        >
          WATCHDOGS ACTIVE
        </div>
        <div className="text-xs mt-2 tracking-[0.3em] animate-pulse" style={{ color: "#3a6080" }}>
          SCANNING FOR INTRUDERS...
        </div>
      </div>
    </div>
  );
}
