"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SkullIcon from "@/components/SkullIcon";
import { useAuth } from "@/lib/auth";

export default function SignInPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--necrom-bg)" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SkullIcon size={64} />
          </div>
          <div
            className="text-3xl font-bold tracking-[0.3em] glitch-text mb-1"
            style={{ color: "#c0392b", fontFamily: "var(--font-geist-mono)" }}
          >
            NECROM
          </div>
          <div className="text-xs tracking-[0.4em]" style={{ color: "#3a6080" }}>
            SECURE ACCESS TERMINAL
          </div>
        </div>

        {/* Panel */}
        <div className="necrom-panel p-8">
          <div
            className="text-xs tracking-[0.3em] mb-6 pb-3 border-b"
            style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
          >
            {"// OPERATOR AUTHENTICATION"}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "#3a6080" }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                className="necrom-input"
                placeholder="operator@necrom.sys"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "#3a6080" }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                className="necrom-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div
                className="text-xs tracking-wider px-3 py-2 border"
                style={{ color: "#ff3a3a", borderColor: "#ff3a3a", background: "rgba(255,58,58,0.08)" }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="necrom-btn w-full py-3 text-sm tracking-[0.2em]"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
            </button>
          </form>

          <div
            className="mt-6 pt-5 border-t text-center text-xs"
            style={{ borderColor: "var(--necrom-border)", color: "#3a6080" }}
          >
            NO ACCOUNT?{" "}
            <Link
              href="/signup"
              className="transition-colors"
              style={{ color: "#00d4ff" }}
            >
              CREATE OPERATOR PROFILE →
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-6 text-xs" style={{ color: "#1a3a5c" }}>
          ALL CONNECTIONS ENCRYPTED // AES-256
        </div>
      </div>
    </div>
  );
}
