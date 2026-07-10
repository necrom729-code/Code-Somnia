"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SkullIcon from "@/components/SkullIcon";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("PASSWORDS DO NOT MATCH");
      return;
    }
    setLoading(true);
    const result = await signUp(username, email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
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
            {t("auth.newOperatorRegistration")}
          </div>
        </div>

        {/* Panel */}
        <div className="necrom-panel p-8">
          <div
            className="text-xs tracking-[0.3em] mb-6 pb-3 border-b"
            style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
          >
            {"// " + t("auth.createOperatorProfile")}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "#3a6080" }}
              >
                {t("auth.operatorHandle")}
              </label>
              <input
                type="text"
                className="necrom-input"
                placeholder={t("auth.operatorHandlePlaceholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "#3a6080" }}
              >
                {t("auth.emailLabel")}
              </label>
              <input
                type="email"
                className="necrom-input"
                placeholder={t("auth.emailPlaceholder")}
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
                {t("auth.passwordLabel")}
              </label>
              <input
                type="password"
                className="necrom-input"
                placeholder={t("auth.minChars")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "#3a6080" }}
              >
                {t("auth.confirmPassword")}
              </label>
              <input
                type="password"
                className="necrom-input"
                placeholder={t("auth.repeatPassword")}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
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
              {loading ? "REGISTERING..." : "REGISTER OPERATOR"}
            </button>
          </form>

          <div
            className="mt-6 pt-5 border-t text-center text-xs"
            style={{ borderColor: "var(--necrom-border)", color: "#3a6080" }}
          >
            ALREADY REGISTERED?{" "}
            <Link
              href="/signin"
              className="transition-colors"
              style={{ color: "#00d4ff" }}
            >
              ACCESS SYSTEM →
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
