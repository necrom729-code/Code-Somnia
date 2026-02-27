"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import SkullIcon from "@/components/SkullIcon";
import { useAuth, type Theme } from "@/lib/auth";

const THEMES: { id: Theme; label: string; description: string; accent: string; bg: string; border: string }[] = [
  {
    id: "cyberpunk",
    label: "CYBERPUNK",
    description: "Default — cyan & dark blue",
    accent: "#00d4ff",
    bg: "#050a0f",
    border: "#1a3a5c",
  },
  {
    id: "matrix",
    label: "MATRIX",
    description: "Green phosphor terminal",
    accent: "#00ff41",
    bg: "#000d00",
    border: "#003300",
  },
  {
    id: "blood",
    label: "BLOOD",
    description: "Red & black — maximum threat",
    accent: "#ff3a3a",
    bg: "#0a0000",
    border: "#3a0000",
  },
  {
    id: "ghost",
    label: "GHOST",
    description: "Monochrome stealth mode",
    accent: "#c8c8c8",
    bg: "#080808",
    border: "#2a2a2a",
  },
  {
    id: "neon",
    label: "NEON",
    description: "Purple & magenta synthwave",
    accent: "#ff00ff",
    bg: "#08000f",
    border: "#2a0040",
  },
];

export default function SettingsPage() {
  const { user, theme, setTheme, signOut } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push("/signin");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--necrom-bg)" }}>
      {/* Nav */}
      <nav
        className="border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{
          background: "rgba(5,10,15,0.95)",
          borderColor: "var(--necrom-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <SkullIcon size={28} />
          <div
            className="text-base font-bold tracking-[0.3em]"
            style={{ color: "#c0392b", fontFamily: "var(--font-geist-mono)" }}
          >
            NECROM
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-xs tracking-widest hidden sm:block" style={{ color: "#3a6080" }}>
                {user.username}
              </div>
              <div
                className="w-8 h-8 border flex items-center justify-center text-xs font-bold"
                style={{ borderColor: "#c0392b", color: "#c0392b", background: "rgba(192,57,43,0.1)" }}
              >
                {user.avatarInitials}
              </div>
            </>
          ) : (
            <Link href="/signin" className="necrom-btn text-xs">
              SIGN IN
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Page title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
          <div
            className="text-xs tracking-[0.4em] px-4 py-1 border"
            style={{ color: "#00d4ff", borderColor: "#1a3a5c" }}
          >
            SYSTEM SETTINGS
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        {/* Theme / Appearance */}
        <section className="necrom-panel p-6 mb-6">
          <div
            className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
            style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
          >
            {"// APPEARANCE & THEME"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="text-left p-4 border transition-all"
                style={{
                  background: theme === t.id ? `${t.accent}15` : "rgba(0,0,0,0.3)",
                  borderColor: theme === t.id ? t.accent : "var(--necrom-border)",
                  boxShadow: theme === t.id ? `0 0 12px ${t.accent}40` : "none",
                }}
              >
                {/* Color preview */}
                <div className="flex gap-2 mb-3">
                  <div
                    className="w-6 h-6 border"
                    style={{ background: t.bg, borderColor: t.border }}
                  />
                  <div
                    className="w-6 h-6"
                    style={{ background: t.accent }}
                  />
                  <div
                    className="w-6 h-6"
                    style={{ background: t.border }}
                  />
                </div>
                <div
                  className="text-xs font-bold tracking-widest mb-1"
                  style={{ color: theme === t.id ? t.accent : "var(--necrom-text)" }}
                >
                  {t.label}
                </div>
                <div className="text-xs" style={{ color: "#3a6080" }}>
                  {t.description}
                </div>
                {theme === t.id && (
                  <div className="text-xs mt-2" style={{ color: t.accent }}>
                    ✓ ACTIVE
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: "#1a3a5c" }}>
            Theme preference is saved locally and applied on next visit.
          </p>
        </section>

        {/* Account */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {"// OPERATOR ACCOUNT"}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>HANDLE</span>
                <span className="text-xs" style={{ color: "var(--necrom-text)" }}>{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>EMAIL</span>
                <span className="text-xs" style={{ color: "var(--necrom-text)" }}>{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>STATUS</span>
                <span className="text-xs" style={{ color: "#55efc4" }}>● ACTIVE</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="necrom-btn necrom-btn-danger text-xs"
            >
              SIGN OUT
            </button>
          </section>
        )}

        {!user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-4 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {"// OPERATOR ACCOUNT"}
            </div>
            <p className="text-xs mb-4" style={{ color: "#3a6080" }}>
              You are not signed in. Sign in to access your operator profile.
            </p>
            <div className="flex gap-3">
              <Link href="/signin" className="necrom-btn text-xs">SIGN IN</Link>
              <Link href="/signup" className="necrom-btn text-xs">REGISTER</Link>
            </div>
          </section>
        )}

        {/* System info */}
        <section className="necrom-panel p-6">
          <div
            className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
            style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
          >
            {"// SYSTEM INFORMATION"}
          </div>
          <div className="space-y-3">
            {[
              ["VERSION", "NECROM v2.7.7"],
              ["NODE", "ctOS-7"],
              ["ENCRYPTION", "AES-256-GCM"],
              ["PROTOCOL", "WATCH_DOGS"],
              ["BUILD", "2026.02.27"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>{k}</span>
                <span className="text-xs font-mono" style={{ color: "var(--necrom-text)" }}>{v}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
