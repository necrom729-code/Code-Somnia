"use client";

import SkullIcon from "@/components/SkullIcon";
import HoodedSkullIcon from "@/components/HoodedSkullIcon";
import FileManager from "@/components/FileManager";
import BackupManager from "@/components/BackupManager";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, startTransition, useRef } from "react";

export default function Home() {
  const [showWatchdogs, setShowWatchdogs] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const ytReady = useRef(false);
  const [musicTriggered, setMusicTriggered] = useState(false);

  // YouTube player API
  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        playerRef.current = new (window.YT as any).Player("yt-player", {
          videoId: "G_CnnmRHNsw",
          playerVars: {
            autoplay: 0,
            loop: 1,
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
            iv_load_policy: 3,
            playlist: "G_CnnmRHNsw",
          },
          events: {
            onReady: () => {
              ytReady.current = true;
            },
            onStateChange: (event: any) => {
              if (event.data === (window.YT as any).PlayerState.ENDED) {
                playerRef.current?.seekTo(0);
                playerRef.current?.playVideo();
              }
            },
          },
        });
      };
    } else if ((window.YT as any).Player) {
      playerRef.current = new (window.YT as any).Player("yt-player", {
        videoId: "G_CnnmRHNsw",
        playerVars: {
          autoplay: 0,
          loop: 1,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          playlist: "G_CnnmRHNsw",
        },
        events: {
          onReady: () => {
            ytReady.current = true;
          },
        },
      });
    }
  }, []);

  // Toggle background music
  const toggleMusic = () => {
    if (playerRef.current && ytReady.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Trigger music when backup history is clicked
  const handleBackupHistoryClick = () => {
    if (!musicTriggered) {
      setMusicTriggered(true);
      if (playerRef.current && ytReady.current) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  // Enable all security protections
  const enableAllSecurity = () => {
    setSecurityEnabled(true);
    setShowWatchdogs(true);
    // Reset after animation
    setTimeout(() => {
      setShowWatchdogs(false);
    }, 5000);
  };

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
      {/* Hidden YouTube Player - TRON Legacy The Game Has Changed */}
      <div id="yt-player" style={{ display: "none" }}></div>

      {/* Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110"
        style={{ 
          background: isPlaying ? "rgba(0,212,255,0.2)" : "rgba(0,0,0,0.5)",
          borderColor: isPlaying ? "#00d4ff" : "#1a3a5c",
          boxShadow: isPlaying ? "0 0 15px rgba(0,212,255,0.5)" : "none"
        }}
        title={isPlaying ? "Pause Music" : "Play TRON Music"}
      >
        <span style={{ color: isPlaying ? "#00d4ff" : "#3a6080" }}>
          {isPlaying ? "🔊" : "🔇"}
        </span>
      </button>

      <NavBar />

      {/* Watchdogs Animation Overlay */}
      {showWatchdogs && <WatchdogsAnimation securityActivation={securityEnabled} />}

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

      {/* Introduction for New Users */}
      <IntroductionSection />

      {/* Security Features Section */}
      <SecurityFeatures onEnableAll={enableAllSecurity} securityEnabled={securityEnabled} />

      {/* Backup Data Cloud Server Section */}
      <section className="border-b" style={{ borderColor: "var(--necrom-border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
            <div
              className="text-xs tracking-[0.4em] px-4 py-1 border"
              style={{ color: "#55efc4", borderColor: "#1a3a5c" }}
            >
              BACKUP SERVER
            </div>
            <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          </div>

          <BackupManager onHistoryClick={handleBackupHistoryClick} />
        </div>
      </section>

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

function SecurityFeatures({ onEnableAll, securityEnabled }: { onEnableAll?: () => void; securityEnabled?: boolean }) {
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
              className="necrom-panel p-4 text-center hover:scale-105 transition-transform cursor-pointer group"
              style={{ borderColor: "#1a3a5c" }}
              onClick={onEnableAll}
            >
              <div className="text-3xl mb-2 group-hover:animate-spin-slow">{feature.icon}</div>
              <div 
                className="text-xs font-bold tracking-wider mb-1" 
                style={{ color: "#c0392b" }}
              >
                {feature.name}
              </div>
              <div 
                className="text-[10px] tracking-[0.2em] mb-1" 
                style={{ color: securityEnabled ? "#55efc4" : "#ff3a3a" }}
              >
                {securityEnabled ? "PROTECTED" : feature.status}
              </div>
              <div className="text-[9px]" style={{ color: "#3a6080" }}>
                {feature.desc}
              </div>
              {!securityEnabled && (
                <div className="text-[8px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00d4ff" }}>
                  [CLICK TO ENABLE]
                </div>
              )}
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
              style={{ background: securityEnabled ? "#55efc4" : "#ff3a3a", boxShadow: `0 0 8px ${securityEnabled ? "#55efc4" : "#ff3a3a"}` }}
            />
            <span className="text-xs tracking-widest" style={{ color: securityEnabled ? "#55efc4" : "#ff3a3a" }}>
              {securityEnabled ? "ALL SECURITY SYSTEMS OPERATIONAL" : "CLICK ANY PROTECTION TO ACTIVATE"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#3a6080" }}>
            <span>THREATS BLOCKED: {securityEnabled ? "0" : "--"}</span>
            <span>|</span>
            <span>LAST SCAN: {securityEnabled ? "JUST NOW" : "NEVER"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Introduction Section for New Users
function IntroductionSection() {
  const steps = [
    {
      step: "01",
      title: "UPLOAD YOUR FILES",
      desc: "Drag and drop or click to upload any file type - documents, images, videos, audio, and more.",
      icon: "📤"
    },
    {
      step: "02", 
      title: "ENCRYPTION ACTIVE",
      desc: "Every file is encrypted with AES-256 military-grade encryption before leaving your device.",
      icon: "🔐"
    },
    {
      step: "03",
      title: "SECURE STORAGE",
      desc: "Your encrypted files are stored in our protected cloud with 24/7 watchdog monitoring.",
      icon: "☁️"
    },
    {
      step: "04",
      title: "ACCESS ANYWHERE",
      desc: "Access your files from any device. Your data stays protected with end-to-end security.",
      icon: "🌐"
    }
  ];

  return (
    <section className="border-b" style={{ borderColor: "var(--necrom-border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          <div
            className="text-xs tracking-[0.4em] px-4 py-1 border"
            style={{ color: "#00d4ff", borderColor: "#1a3a5c" }}
          >
            HOW IT WORKS
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative necrom-panel p-5 hover:border-cyan-500 transition-colors"
              style={{ borderColor: "#1a3a5c" }}
            >
              {/* Step number */}
              <div 
                className="absolute -top-3 -left-2 text-4xl font-bold opacity-20"
                style={{ color: "#00d4ff" }}
              >
                {step.step}
              </div>
              
              {/* Icon */}
              <div className="text-4xl mb-4 mt-2">{step.icon}</div>
              
              {/* Title */}
              <div 
                className="text-sm font-bold tracking-wider mb-2" 
                style={{ color: "#00d4ff" }}
              >
                {step.title}
              </div>
              
              {/* Description */}
              <div className="text-xs leading-relaxed" style={{ color: "#3a6080" }}>
                {step.desc}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px"
                  style={{ background: "linear-gradient(90deg, #1a3a5c, transparent)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <div className="inline-block necrom-panel px-6 py-3" style={{ borderColor: "#1a3a5c" }}>
            <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>
              READY TO GET STARTED? {" "}
            </span>
            <span className="text-xs" style={{ color: "#00d4ff" }}>
              ↓ SCROLL DOWN TO UPLOAD ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WatchdogsAnimation({ securityActivation }: { securityActivation?: boolean }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [trickOffset, setTrickOffset] = useState({ x: 0, y: 0 });
  const [scanPhase, setScanPhase] = useState<"scanning" | "safe" | "intruder">("scanning");
  
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
    
    // If activating all security, show activation sequence
    // Otherwise, simulate normal scan result after 4 seconds
    const scanTimeout = setTimeout(() => {
      if (securityActivation) {
        // Show activation message
        setScanPhase("safe");
      } else {
        // 70% chance of no intruder, 30% chance of intruder detected
        const hasIntruder = Math.random() > 0.7;
        setScanPhase(hasIntruder ? "intruder" : "safe");
      }
    }, 4000);
    
    return () => {
      clearInterval(variantInterval);
      clearInterval(trickInterval);
      clearTimeout(scanTimeout);
    };
  }, [securityActivation]);

  // Determine expression based on scan phase
  const getExpression = (): "trick" | "happy" | "sad" => {
    if (scanPhase === "safe") return "happy";
    if (scanPhase === "intruder") return "sad";
    return "trick";
  };

  // Determine message based on scan phase and activation
  const getMessage = () => {
    if (securityActivation) {
      return {
        title: "ACTIVATING PROTECTION",
        subtitle: "Enabling all security systems...",
      };
    }
    if (scanPhase === "safe") {
      return {
        title: "ALL CLEAR",
        subtitle: "There are no intruders, your data is safe.",
      };
    }
    if (scanPhase === "intruder") {
      return {
        title: "THREAT DETECTED",
        subtitle: "Don't worry, your data was protected by NECROM. Please wait a while.",
      };
    }
    return {
      title: "WATCHDOGS ACTIVE",
      subtitle: "SCANNING FOR INTRUDERS...",
    };
  };

  const message = getMessage();
  const expression = getExpression();

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
        <HoodedSkullIcon size={180} variant={variant} expression={expression} />
      </div>

      {/* Status text */}
      <div className="absolute bottom-20 text-center">
        <div 
          className="text-2xl font-bold tracking-[0.5em] animate-pulse"
          style={{ 
            color: scanPhase === "intruder" ? "#ff4444" : 
                   scanPhase === "safe" ? "#44ff44" :
                   variant === "black" ? "#c0392b" : 
                   variant === "red" ? "#ff3a3a" : 
                   variant === "blue" ? "#00d4ff" : 
                   "#9b59b6",
            textShadow: scanPhase === "intruder" ? "0 0 20px rgba(255,68,68,0.8)" :
                        scanPhase === "safe" ? "0 0 20px rgba(68,255,68,0.8)" :
                        variant === "black" ? "0 0 20px rgba(192,57,43,0.8)" :
                        variant === "red" ? "0 0 20px rgba(255,58,58,0.8)" :
                        variant === "blue" ? "0 0 20px rgba(0,212,255,0.8)" :
                        "0 0 20px rgba(155,89,182,0.8)"
          }}
        >
          {message.title}
        </div>
        <div 
          className="text-sm mt-3 tracking-[0.2em] animate-pulse" 
          style={{ 
            color: scanPhase === "intruder" ? "#ff6666" : 
                   scanPhase === "safe" ? "#66ff66" : 
                   "#3a6080"
          }}
        >
          {message.subtitle}
        </div>
      </div>
    </div>
  );
}
