"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SkullIcon from "@/components/SkullIcon";
import AvatarGallery, { AVATAR_OPTIONS, type AvatarOption } from "@/components/AvatarGallery";
import { useAuth, type Theme } from "@/lib/auth";
import { useI18n, LANGUAGES } from "@/lib/i18n";

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

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{
        background: enabled ? "rgba(0, 212, 255, 0.4)" : "rgba(255,255,255,0.1)",
        border: `1px solid ${enabled ? "#00d4ff" : "var(--necrom-border)"}`,
      }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
        style={{
          background: enabled ? "#00d4ff" : "#555",
          left: enabled ? "22px" : "2px",
        }}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--necrom-border)" }}>
      <div>
        <div className="text-xs tracking-widest" style={{ color: "var(--necrom-text)" }}>
          {label}
        </div>
        <div className="text-xs mt-1" style={{ color: "#3a6080" }}>
          {description}
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { user, theme, setTheme, signOut, updateSettings, updateUser } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const router = useRouter();
  const [profileName, setProfileName] = useState(user?.username || "");
  const [profileBio, setProfileBio] = useState(user?.bio || "");
  const [showSaved, setShowSaved] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(
    user?.avatarIcon ? AVATAR_OPTIONS.find((a) => a.emoji === user.avatarIcon) || null : null
  );
  const [customImage, setCustomImage] = useState<string | null>(user?.customAvatar || null);

  function handleSignOut() {
    signOut();
    router.push("/signin");
  }

  function handleSelectAvatar(avatar: AvatarOption) {
    setSelectedAvatar(avatar);
    setCustomImage(null);
    if (user) {
      updateUser({
        avatarIcon: avatar.emoji,
        avatarColor: avatar.color,
        customAvatar: undefined,
      });
    }
  }

  function handleCustomUpload(imageData: string) {
    setCustomImage(imageData);
    setSelectedAvatar(null);
    if (user) {
      updateUser({
        customAvatar: imageData,
        avatarIcon: undefined,
      });
    }
  }

  function handleRemoveCustom() {
    setCustomImage(null);
    if (user) {
      updateUser({
        customAvatar: undefined,
      });
    }
  }

  function handleSaveProfile() {
    if (user) {
      updateUser({
        username: profileName.toUpperCase().replace(/[^A-Z0-9_]/g, "_"),
        bio: profileBio,
        avatarInitials: profileName.slice(0, 2).toUpperCase(),
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
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
                className="w-8 h-8 border flex items-center justify-center text-sm overflow-hidden"
                style={{
                  borderColor: user.avatarColor || "#c0392b",
                  color: user.avatarColor || "#c0392b",
                  background: user.customAvatar ? "transparent" : `${user.avatarColor || "#c0392b"}15`,
                }}
              >
                {user.customAvatar ? (
                  <img src={user.customAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.avatarIcon || user.avatarInitials
                )}
              </div>
            </>
          ) : (
            <Link href="/signin" className="necrom-btn text-xs">
              {t("nav.signIn")}
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
            {t("settings.title")}
          </div>
          <div className="h-px flex-1" style={{ background: "var(--necrom-border)" }} />
        </div>

        {/* Profile Settings */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.profile")}
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 border flex items-center justify-center text-2xl overflow-hidden"
                  style={{
                    borderColor: customImage ? "#00d4ff" : selectedAvatar?.color || user.avatarColor || "#c0392b",
                    background: customImage ? "transparent" : `${selectedAvatar?.color || user.avatarColor || "#c0392b"}15`,
                  }}
                >
                  {customImage ? (
                    <img src={customImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    selectedAvatar?.emoji || user.avatarIcon || user.avatarInitials
                  )}
                </div>
              </div>

              {/* Avatar Gallery */}
              <AvatarGallery
                selectedId={selectedAvatar?.id || ""}
                customImage={customImage}
                onSelect={handleSelectAvatar}
                onCustomUpload={handleCustomUpload}
                onRemoveCustom={handleRemoveCustom}
                t={t}
              />

              {/* Display Name */}
              <div>
                <label className="text-xs tracking-widest block mb-2" style={{ color: "#3a6080" }}>
                  {t("settings.displayName")}
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/50 border"
                  style={{ borderColor: "var(--necrom-border)", color: "var(--necrom-text)" }}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs tracking-widest block mb-2" style={{ color: "#3a6080" }}>
                  {t("settings.bio")}
                </label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder={t("settings.enterBio")}
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-black/50 border resize-none"
                  style={{ borderColor: "var(--necrom-border)", color: "var(--necrom-text)" }}
                />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleSaveProfile} className="necrom-btn text-xs">
                  {t("settings.updateProfile")}
                </button>
                {showSaved && (
                  <span className="text-xs" style={{ color: "#55efc4" }}>
                    ✓ {t("settings.profileUpdated")}
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Theme / Appearance */}
        <section className="necrom-panel p-6 mb-6">
          <div
            className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
            style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
          >
            {t("settings.appearance")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEMES.map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className="text-left p-4 border transition-all"
                style={{
                  background: theme === th.id ? `${th.accent}15` : "rgba(0,0,0,0.3)",
                  borderColor: theme === th.id ? th.accent : "var(--necrom-border)",
                  boxShadow: theme === th.id ? `0 0 12px ${th.accent}40` : "none",
                }}
              >
                <div className="flex gap-2 mb-3">
                  <div className="w-6 h-6 border" style={{ background: th.bg, borderColor: th.border }} />
                  <div className="w-6 h-6" style={{ background: th.accent }} />
                  <div className="w-6 h-6" style={{ background: th.border }} />
                </div>
                <div
                  className="text-xs font-bold tracking-widest mb-1"
                  style={{ color: theme === th.id ? th.accent : "var(--necrom-text)" }}
                >
                  {th.label}
                </div>
                <div className="text-xs" style={{ color: "#3a6080" }}>
                  {th.description}
                </div>
                {theme === th.id && (
                  <div className="text-xs mt-2" style={{ color: th.accent }}>
                    ✓ {t("settings.active")}
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: "#1a3a5c" }}>
            {t("settings.themeNote")}
          </p>
        </section>

        {/* Language */}
        <section className="necrom-panel p-6 mb-6">
          <div
            className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
            style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
          >
            {t("settings.language")}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="flex items-center gap-3 p-3 border transition-all text-left"
                style={{
                  background: language === lang.code ? "rgba(0, 212, 255, 0.1)" : "rgba(0,0,0,0.3)",
                  borderColor: language === lang.code ? "#00d4ff" : "var(--necrom-border)",
                  boxShadow: language === lang.code ? "0 0 12px rgba(0, 212, 255, 0.25)" : "none",
                }}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div
                    className="text-xs font-bold tracking-widest"
                    style={{ color: language === lang.code ? "#00d4ff" : "var(--necrom-text)" }}
                  >
                    {lang.nativeName}
                  </div>
                  <div className="text-xs" style={{ color: "#3a6080" }}>
                    {lang.name}
                  </div>
                </div>
                {language === lang.code && (
                  <div className="ml-auto text-xs" style={{ color: "#00d4ff" }}>
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: "#1a3a5c" }}>
            {t("settings.languageDescription")}
          </p>
        </section>

        {/* Notifications */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.notifications")}
            </div>

            <div className="space-y-1">
              <SettingRow
                label={t("settings.notificationsEnabled")}
                description={t("settings.notificationsEnabledDesc")}
                enabled={user.settings.notifications.enabled}
                onChange={(v) => updateSettings("notifications", { enabled: v })}
              />
              <SettingRow
                label={t("settings.notificationSound")}
                description={t("settings.notificationSoundDesc")}
                enabled={user.settings.notifications.sound}
                onChange={(v) => updateSettings("notifications", { sound: v })}
              />
              <SettingRow
                label={t("settings.virusAlerts")}
                description={t("settings.virusAlertsDesc")}
                enabled={user.settings.notifications.virusAlerts}
                onChange={(v) => updateSettings("notifications", { virusAlerts: v })}
              />
              <SettingRow
                label={t("settings.backupAlerts")}
                description={t("settings.backupAlertsDesc")}
                enabled={user.settings.notifications.backupAlerts}
                onChange={(v) => updateSettings("notifications", { backupAlerts: v })}
              />
              <SettingRow
                label={t("settings.securityAlerts")}
                description={t("settings.securityAlertsDesc")}
                enabled={user.settings.notifications.securityAlerts}
                onChange={(v) => updateSettings("notifications", { securityAlerts: v })}
              />
            </div>
          </section>
        )}

        {/* Privacy */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.privacy")}
            </div>

            <div className="space-y-1">
              <SettingRow
                label={t("settings.analytics")}
                description={t("settings.analyticsDesc")}
                enabled={user.settings.privacy.analytics}
                onChange={(v) => updateSettings("privacy", { analytics: v })}
              />
              <SettingRow
                label={t("settings.shareUsageData")}
                description={t("settings.shareUsageDataDesc")}
                enabled={user.settings.privacy.shareUsageData}
                onChange={(v) => updateSettings("privacy", { shareUsageData: v })}
              />
              <SettingRow
                label={t("settings.showOnlineStatus")}
                description={t("settings.showOnlineStatusDesc")}
                enabled={user.settings.privacy.showOnlineStatus}
                onChange={(v) => updateSettings("privacy", { showOnlineStatus: v })}
              />
            </div>
          </section>
        )}

        {/* Security */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.security")}
            </div>

            <div className="space-y-1">
              <SettingRow
                label={t("settings.twoFactor")}
                description={t("settings.twoFactorDesc")}
                enabled={user.settings.security.twoFactor}
                onChange={(v) => updateSettings("security", { twoFactor: v })}
              />
              <SettingRow
                label={t("settings.autoLock")}
                description={t("settings.autoLockDesc")}
                enabled={user.settings.security.autoLock}
                onChange={(v) => updateSettings("security", { autoLock: v })}
              />
              {user.settings.security.autoLock && (
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--necrom-border)" }}>
                  <div>
                    <div className="text-xs tracking-widest" style={{ color: "var(--necrom-text)" }}>
                      {t("settings.autoLockMinutes")}
                    </div>
                  </div>
                  <select
                    value={user.settings.security.autoLockMinutes}
                    onChange={(e) => updateSettings("security", { autoLockMinutes: Number(e.target.value) })}
                    className="px-3 py-1 text-xs bg-black/50 border"
                    style={{ borderColor: "var(--necrom-border)", color: "var(--necrom-text)" }}
                  >
                    {[5, 10, 15, 30, 60].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <SettingRow
                label={t("settings.sessionTimeout")}
                description={t("settings.sessionTimeoutDesc")}
                enabled={user.settings.security.sessionTimeout}
                onChange={(v) => updateSettings("security", { sessionTimeout: v })}
              />
              {user.settings.security.sessionTimeout && (
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--necrom-border)" }}>
                  <div>
                    <div className="text-xs tracking-widest" style={{ color: "var(--necrom-text)" }}>
                      {t("settings.sessionTimeoutMinutes")}
                    </div>
                  </div>
                  <select
                    value={user.settings.security.sessionTimeoutMinutes}
                    onChange={(e) => updateSettings("security", { sessionTimeoutMinutes: Number(e.target.value) })}
                    className="px-3 py-1 text-xs bg-black/50 border"
                    style={{ borderColor: "var(--necrom-border)", color: "var(--necrom-text)" }}
                  >
                    {[15, 30, 60, 120].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Storage Settings */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.storageSettings")}
            </div>

            {/* Storage usage bar */}
            <div className="mb-4 p-4 border" style={{ borderColor: "var(--necrom-border)", background: "rgba(0,0,0,0.3)" }}>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: "#3a6080" }}>{t("settings.storageUsed")}</span>
                <span style={{ color: "var(--necrom-text)" }}>2.4 GB / 10 GB</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-2 rounded-full" style={{ width: "24%", background: "#00d4ff" }} />
              </div>
            </div>

            <div className="space-y-1">
              <SettingRow
                label={t("settings.autoCleanup")}
                description={t("settings.autoCleanupDesc")}
                enabled={user.settings.storage.autoCleanup}
                onChange={(v) => updateSettings("storage", { autoCleanup: v })}
              />
              {user.settings.storage.autoCleanup && (
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--necrom-border)" }}>
                  <div>
                    <div className="text-xs tracking-widest" style={{ color: "var(--necrom-text)" }}>
                      {t("settings.cleanupDays")}
                    </div>
                  </div>
                  <select
                    value={user.settings.storage.cleanupDays}
                    onChange={(e) => updateSettings("storage", { cleanupDays: Number(e.target.value) })}
                    className="px-3 py-1 text-xs bg-black/50 border"
                    style={{ borderColor: "var(--necrom-border)", color: "var(--necrom-text)" }}
                  >
                    {[7, 14, 30, 60, 90].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <SettingRow
                label={t("settings.compressUploads")}
                description={t("settings.compressUploadsDesc")}
                enabled={user.settings.storage.compressUploads}
                onChange={(v) => updateSettings("storage", { compressUploads: v })}
              />
            </div>
          </section>
        )}

        {/* Account */}
        {user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-5 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.account")}
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
                <span className="text-xs" style={{ color: "#55efc4" }}>● {t("settings.active")}</span>
              </div>
            </div>

            <button onClick={handleSignOut} className="necrom-btn necrom-btn-danger text-xs">
              {t("settings.signOut")}
            </button>
          </section>
        )}

        {!user && (
          <section className="necrom-panel p-6 mb-6">
            <div
              className="text-xs tracking-[0.3em] mb-4 pb-3 border-b"
              style={{ color: "#00d4ff", borderColor: "var(--necrom-border)" }}
            >
              {t("settings.account")}
            </div>
            <p className="text-xs mb-4" style={{ color: "#3a6080" }}>
              {t("settings.signedInAs")} — {t("auth.noAccount")}
            </p>
            <div className="flex gap-3">
              <Link href="/signin" className="necrom-btn text-xs">
                {t("auth.signIn")}
              </Link>
              <Link href="/signup" className="necrom-btn text-xs">
                {t("auth.register")}
              </Link>
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
              ["VERSION", "NECROM v3.0.0"],
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
