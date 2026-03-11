"use client";

import SkullIcon from "@/components/SkullIcon";
import HoodedSkullIcon from "@/components/HoodedSkullIcon";
import FileManager from "@/components/FileManager";
import BackupManager from "@/components/BackupManager";
import VPNPanel from "@/components/VPNPanel";
import { NotificationBell } from "@/components/NotificationPanel";
import { useAuth } from "@/lib/auth";
import { useSecurity } from "@/lib/security";
import { useI18n, LANGUAGES, type Language } from "@/lib/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, startTransition } from "react";

export default function Home() {
  const [showWatchdogs, setShowWatchdogs] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const { protections, isAllEnabled, enableAll, logs, threatsBlockedTotal, lastFullScan } = useSecurity();
  const { t } = useI18n();

  // Enable all security protections
  const enableAllSecurity = () => {
    enableAll();
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
      <NavBar />

      {/* Watchdogs Animation Overlay */}
      {showWatchdogs && <WatchdogsAnimation securityActivation={isAllEnabled} />}

      {/* Security Panel Modal */}
      {showSecurityPanel && (
        <SecurityPanel onClose={() => setShowSecurityPanel(false)} />
      )}

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
              {t("home.subtitle")}
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-3"
              style={{
                color: "#c0392b",
                textShadow: "0 0 20px rgba(192,57,43,0.5), 0 0 40px rgba(192,57,43,0.2)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {t("home.title")}
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "#3a6080" }}>
              {t("home.description")}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-6">
              <StatItem value="256-BIT" label={t("home.encryption")} />
              <StatItem value="99.9%" label={t("home.uptime")} />
              <StatItem value="∞" label={t("home.storage")} />
              <StatItem value="0" label={t("home.breaches")} />
            </div>
          </div>

          {/* Storage Usage Display */}
          <StorageUsage />
        </div>
      </header>

      {/* Introduction for New Users */}
      <IntroductionSection />

      {/* Security Features Section */}
      <SecurityFeatures 
        onEnableAll={enableAllSecurity} 
        securityEnabled={isAllEnabled}
        onViewDetails={() => setShowSecurityPanel(true)}
        threatsBlocked={threatsBlockedTotal}
        lastScan={lastFullScan}
      />

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
              {t("storage.title")}
            </div>
            <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          </div>

          <BackupManager />
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
            {t("files.title")}
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
              {t("footer.tagline")}
            </span>
          </div>
          <div className="text-xs" style={{ color: "#1a3a5c" }}>
            {t("footer.build")}
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

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
            {t("nav.cloudServer")}
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="hidden md:flex items-center gap-6">
        <StatusDot label={t("security.antivirus")} active />
        <StatusDot label={t("security.encryption")} active />
        <StatusDot label={t("security.vpn")} active />
        <StatusDot label={t("security.firewall")} active />
      </div>

      {/* Right side — auth */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <LanguageSelector />
        
        {/* Notification Bell */}
        <NotificationBell />
        
        {/* VPN Panel */}
        <VPNPanel />
        
        {user ? (
          <>
            <Link
              href="/settings"
              className="text-xs tracking-widest transition-colors hidden sm:block"
              style={{ color: "#3a6080" }}
            >
              {t("nav.settings")}
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
              {t("nav.signIn")}
            </Link>
            <Link
              href="/signup"
              className="text-xs tracking-widest hidden sm:block transition-colors"
              style={{ color: "#3a6080" }}
            >
              {t("nav.register")}
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

function LanguageSelector() {
  const { language, setLanguage, languages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 border transition-colors hover:bg-white/5"
        style={{ borderColor: "var(--necrom-border)", color: "#3a6080" }}
        title="Select Language"
      >
        <span>{currentLang?.flag}</span>
        <span className="text-xs font-bold hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-40 z-50 border"
          style={{
            background: "rgba(5, 10, 15, 0.98)",
            borderColor: "var(--necrom-border)",
            backdropFilter: "blur(8px)",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/5"
              style={{
                background: lang.code === language ? "rgba(0, 212, 255, 0.1)" : undefined,
                borderLeft: lang.code === language ? "3px solid #00d4ff" : undefined,
              }}
            >
              <span>{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-xs" style={{ color: lang.code === language ? "#00d4ff" : "var(--necrom-text)" }}>
                  {lang.nativeName}
                </span>
                <span className="text-xs" style={{ color: "#3a6080" }}>
                  {lang.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
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
  const { t } = useI18n();
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
        <span className="ml-2" style={{ color: "#3a6080" }}>{t("storage.ssd")}</span>
      </div>
      
      {/* Storage bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: "#a0c8e0" }}>{t("storage.used")}</span>
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
          <div style={{ color: "#3a6080" }}>{t("storage.used")}</div>
          <div style={{ color: "#00d4ff", fontSize: "16px", fontWeight: "bold" }}>
            {Math.floor(usedStorage)}<span className="text-xs">GB</span> {usedMB}<span className="text-xs">MB</span>
          </div>
        </div>
        <div className="border p-2" style={{ borderColor: "#1a3a5c" }}>
          <div style={{ color: "#3a6080" }}>{t("storage.free")}</div>
          <div style={{ color: "#55efc4", fontSize: "16px", fontWeight: "bold" }}>
            {(totalStorage - usedStorage).toFixed(1)}<span className="text-xs">GB</span>
          </div>
        </div>
      </div>

      {/* Drive info */}
      <div className="mt-3 pt-2 border-t text-xs" style={{ borderColor: "#1a3a5c", color: "#3a6080" }}>
        <div className="flex justify-between">
          <span>{t("storage.ssd")}</span>
          <span style={{ color: "#55efc4" }}>● ONLINE</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>{t("storage.total")}:</span>
          <span>{totalStorage} GB</span>
        </div>
      </div>
    </div>
  );
}

function SecurityFeatures({ 
  onEnableAll, 
  securityEnabled,
  onViewDetails,
  threatsBlocked,
  lastScan
}: { 
  onEnableAll?: () => void; 
  securityEnabled?: boolean;
  onViewDetails?: () => void;
  threatsBlocked?: number;
  lastScan?: string | null;
}) {
  const { protections, toggleProtection } = useSecurity();
  const { t } = useI18n();

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
            {t("security.title")}
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.values(protections) as typeof protections[keyof typeof protections][]).map((feature) => (
            <div
              key={feature.id}
              className="necrom-panel p-4 text-center hover:scale-105 transition-transform cursor-pointer group"
              style={{ 
                borderColor: feature.enabled ? "#55efc4" : "#1a3a5c",
                background: feature.enabled ? "rgba(85, 239, 196, 0.05)" : undefined
              }}
              onClick={() => toggleProtection(feature.id)}
            >
              <div className="text-3xl mb-2 group-hover:animate-spin-slow">{feature.icon}</div>
              <div 
                className="text-xs font-bold tracking-wider mb-1" 
                style={{ color: feature.enabled ? "#55efc4" : "#c0392b" }}
              >
                {feature.name}
              </div>
              <div 
                className="text-[10px] tracking-[0.2em] mb-1" 
                style={{ color: feature.enabled ? "#55efc4" : "#ff3a3a" }}
              >
                {feature.enabled ? t("common.enabled") : t("common.disabled")}
              </div>
              <div className="text-[9px]" style={{ color: "#3a6080" }}>
                {feature.description}
              </div>
              {feature.enabled && feature.threatsBlocked > 0 && (
                <div className="text-[8px] mt-1" style={{ color: "#ff3a3a" }}>
                  {t("security.threatsBlocked")}: {feature.threatsBlocked}
                </div>
              )}
              <div className="text-[8px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00d4ff" }}>
                [{feature.enabled ? t("common.disabled") : t("common.enabled")}]
              </div>
            </div>
          ))}
        </div>

        {/* Security status bar */}
        <div 
          className="mt-6 p-3 border flex items-center justify-between flex-wrap gap-4"
          style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: securityEnabled ? "#55efc4" : "#ff3a3a", boxShadow: `0 0 8px ${securityEnabled ? "#55efc4" : "#ff3a3a"}` }}
              />
              <span className="text-xs tracking-widest" style={{ color: securityEnabled ? "#55efc4" : "#ff3a3a" }}>
                {securityEnabled ? t("security.allEnabled") : t("security.someEnabled")}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "#3a6080" }}>
              <span>{t("security.threatsBlocked")}: {threatsBlocked || 0}</span>
              <span>|</span>
              <span>{t("security.lastScan")}: {lastScan || t("security.never")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!securityEnabled && (
              <button
                onClick={onEnableAll}
                className="text-xs px-3 py-1 border hover:bg-cyan-900/30 transition-colors"
                style={{ color: "#00d4ff", borderColor: "#00d4ff" }}
              >
                {t("security.enableAll")}
              </button>
            )}
            <button
              onClick={onViewDetails}
              className="text-xs px-3 py-1 border hover:bg-red-900/30 transition-colors"
              style={{ color: "#c0392b", borderColor: "#c0392b" }}
            >
              {t("security.viewDetails")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Introduction Section for New Users
function IntroductionSection() {
  const { t } = useI18n();
  
  const steps = [
    {
      step: "01",
      title: t("intro.step1.title"),
      desc: t("intro.step1.desc"),
      icon: "📤"
    },
    {
      step: "02", 
      title: t("intro.step2.title"),
      desc: t("intro.step2.desc"),
      icon: "🔐"
    },
    {
      step: "03",
      title: t("intro.step3.title"),
      desc: t("intro.step3.desc"),
      icon: "☁️"
    },
    {
      step: "04",
      title: t("intro.step4.title"),
      desc: t("intro.step4.desc"),
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
            {t("intro.title")}
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
              {t("intro.cta.ready")}{" "}
            </span>
            <span className="text-xs" style={{ color: "#00d4ff" }}>
              ↓ {t("intro.cta.scroll")} ↓
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

  const { t } = useI18n();
  
  // Determine message based on scan phase and activation
  const getMessage = () => {
    if (securityActivation) {
      return {
        title: t("watchdogs.activating.title"),
        subtitle: t("watchdogs.activating.subtitle"),
      };
    }
    if (scanPhase === "safe") {
      return {
        title: t("watchdogs.safe.title"),
        subtitle: t("watchdogs.safe.subtitle"),
      };
    }
    if (scanPhase === "intruder") {
      return {
        title: t("watchdogs.threat.title"),
        subtitle: t("watchdogs.threat.subtitle"),
      };
    }
    return {
      title: t("watchdogs.scanning.title"),
      subtitle: t("watchdogs.scanning.subtitle"),
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

// Security Panel - Detailed security management interface
function SecurityPanel({ onClose }: { onClose: () => void }) {
  const { protections, logs, backups, toggleProtection, runScan, createBackup, deleteBackup, restoreBackup, isAllEnabled, enableAll, disableAll, threatsBlockedTotal } = useSecurity();
  const [activeTab, setActiveTab] = useState<"protections" | "logs" | "backups">("protections");
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)" }}>
      <div className="necrom-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ borderColor: "#c0392b" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#1a3a5c" }}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: isAllEnabled ? "#55efc4" : "#ff3a3a", boxShadow: `0 0 10px ${isAllEnabled ? "#55efc4" : "#ff3a3a"}` }} />
            <span className="text-lg font-bold tracking-widest" style={{ color: "#c0392b" }}>
              {t("securityPanel.title")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1 border hover:bg-red-900/30 transition-colors"
            style={{ color: "#c0392b", borderColor: "#c0392b" }}
          >
            {t("securityPanel.close")}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.5)" }}>
          <div className="flex items-center gap-6 text-xs">
            <span style={{ color: "#3a6080" }}>
              {t("securityPanel.activeProtections")}: <span style={{ color: isAllEnabled ? "#55efc4" : "#ff3a3a" }}>{Object.values(protections).filter(p => p.enabled).length}/6</span>
            </span>
            <span style={{ color: "#3a6080" }}>
              {t("security.threatsBlocked")}: <span style={{ color: "#ff3a3a" }}>{threatsBlockedTotal}</span>
            </span>
            <span style={{ color: "#3a6080" }}>
              {t("securityPanel.backups")}: <span style={{ color: "#55efc4" }}>{backups.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isAllEnabled ? (
              <button
                onClick={enableAll}
                className="text-xs px-3 py-1 border hover:bg-green-900/30 transition-colors"
                style={{ color: "#55efc4", borderColor: "#55efc4" }}
              >
                {t("securityPanel.enableAll")}
              </button>
            ) : (
              <button
                onClick={disableAll}
                className="text-xs px-3 py-1 border hover:bg-red-900/30 transition-colors"
                style={{ color: "#ff3a3a", borderColor: "#ff3a3a" }}
              >
                {t("securityPanel.disableAll")}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "#1a3a5c" }}>
          {(["protections", "logs", "backups"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 text-xs tracking-widest transition-colors uppercase"
              style={{
                color: activeTab === tab ? "#c0392b" : "#3a6080",
                background: activeTab === tab ? "rgba(192,57,43,0.1)" : undefined,
                borderBottom: activeTab === tab ? "2px solid #c0392b" : undefined,
              }}
            >
              {t(`securityPanel.tab.${tab}`)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "protections" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.values(protections) as typeof protections[keyof typeof protections][]).map((protection) => (
                <div
                  key={protection.id}
                  className="p-4 border transition-all"
                  style={{
                    borderColor: protection.enabled ? "#55efc4" : "#1a3a5c",
                    background: protection.enabled ? "rgba(85, 239, 196, 0.05)" : "rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{protection.icon}</span>
                      <div>
                        <div className="text-sm font-bold" style={{ color: protection.enabled ? "#55efc4" : "#c0392b" }}>
                          {protection.name}
                        </div>
                        <div className="text-[10px]" style={{ color: "#3a6080" }}>
                          {protection.description}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProtection(protection.id)}
                      className="w-10 h-5 border relative transition-colors"
                      style={{ borderColor: protection.enabled ? "#55efc4" : "#1a3a5c" }}
                    >
                      <div
                        className="absolute top-0.5 w-3.5 h-3.5 transition-all"
                        style={{
                          background: protection.enabled ? "#55efc4" : "#ff3a3a",
                          left: protection.enabled ? "calc(100% - 1rem)" : "2px",
                          boxShadow: protection.enabled ? "0 0 6px #55efc4" : "0 0 6px #ff3a3a",
                        }}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px]" style={{ color: "#3a6080" }}>
                    <span>STATUS: <span style={{ color: protection.enabled ? "#55efc4" : "#ff3a3a" }}>{protection.enabled ? "ACTIVE" : "OFFLINE"}</span></span>
                    {protection.enabled && (
                      <button
                        onClick={() => runScan(protection.id)}
                        className="text-[10px] px-2 py-0.5 border hover:bg-cyan-900/30 transition-colors"
                        style={{ color: "#00d4ff", borderColor: "#00d4ff" }}
                      >
                        RUN SCAN
                      </button>
                    )}
                  </div>
                  {protection.enabled && protection.lastScan && (
                    <div className="mt-2 text-[10px]" style={{ color: "#3a6080" }}>
                      Last scan: {protection.lastScan}
                      {protection.threatsBlocked > 0 && (
                        <span style={{ color: "#ff3a3a" }}> | Blocked: {protection.threatsBlocked}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Virus Detected Icon */}
                  {protection.enabled && protection.threatsBlocked > 0 && (
                    <div className="mt-3 flex items-center gap-2 p-2 border" style={{ borderColor: "#ff3a3a", background: "rgba(255,58,58,0.1)" }}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-5 h-5 animate-pulse" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#ff3a3a" 
                        strokeWidth="2"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M8 8l-2-2M16 8l2-2M8 16l-2 2M16 16l2 2"/>
                      </svg>
                      <span className="text-[10px] font-bold" style={{ color: "#ff3a3a" }}>
                        VIRUS DETECTED
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: "#3a6080" }}>
                  NO SECURITY EVENTS RECORDED
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-2 border text-xs"
                    style={{ 
                      borderColor: "#1a3a5c",
                      background: log.type === "threat" ? "rgba(255,58,58,0.1)" : 
                                  log.type === "warning" ? "rgba(255,165,0,0.1)" : 
                                  log.type === "success" ? "rgba(85,239,196,0.1)" : undefined
                    }}
                  >
                    <span style={{ color: "#3a6080" }}>[{log.timestamp}]</span>
                    <span
                      style={{
                        color: log.type === "threat" ? "#ff3a3a" :
                               log.type === "warning" ? "#ffa500" :
                               log.type === "success" ? "#55efc4" : "#00d4ff",
                      }}
                    >
                      {log.type.toUpperCase()}
                    </span>
                    <span style={{ color: "#a0c8e0" }}>{log.source}</span>
                    <span style={{ color: "#fff" }}>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "backups" && (
            <div className="space-y-4">
              {/* Create Backup */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => createBackup(`Full Backup ${new Date().toLocaleDateString()}`, "full")}
                  className="flex-1 py-2 border text-xs hover:bg-green-900/30 transition-colors"
                  style={{ color: "#55efc4", borderColor: "#55efc4" }}
                >
                  CREATE FULL BACKUP
                </button>
                <button
                  onClick={() => createBackup(`Incremental ${new Date().toLocaleTimeString()}`, "incremental")}
                  className="flex-1 py-2 border text-xs hover:bg-cyan-900/30 transition-colors"
                  style={{ color: "#00d4ff", borderColor: "#00d4ff" }}
                >
                  CREATE INCREMENTAL
                </button>
              </div>

              {/* Backup List */}
              <div className="space-y-2">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-3 border"
                    style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: "#a0c8e0" }}>{backup.name}</span>
                        <span
                          className="text-[8px] px-1.5 py-0.5"
                          style={{
                            color: backup.type === "full" ? "#55efc4" : "#00d4ff",
                            border: `1px solid ${backup.type === "full" ? "#55efc4" : "#00d4ff"}`,
                          }}
                        >
                          {backup.type.toUpperCase()}
                        </span>
                        {backup.status === "in_progress" && (
                          <span className="text-[8px] animate-pulse" style={{ color: "#ffa500" }}>
                            IN PROGRESS...
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: "#3a6080" }}>
                        {backup.size} • {backup.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        disabled={backup.status !== "complete"}
                        className="text-[10px] px-2 py-1 border hover:bg-cyan-900/30 transition-colors disabled:opacity-50"
                        style={{ color: "#00d4ff", borderColor: "#00d4ff" }}
                      >
                        RESTORE
                      </button>
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        className="text-[10px] px-2 py-1 border hover:bg-red-900/30 transition-colors"
                        style={{ color: "#ff3a3a", borderColor: "#ff3a3a" }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
