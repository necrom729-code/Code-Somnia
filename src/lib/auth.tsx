"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, startTransition } from "react";

export type Theme = "cyberpunk" | "matrix" | "blood" | "ghost" | "neon";

export interface UserSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    virusAlerts: boolean;
    backupAlerts: boolean;
    securityAlerts: boolean;
  };
  privacy: {
    analytics: boolean;
    shareUsageData: boolean;
    showOnlineStatus: boolean;
  };
  security: {
    twoFactor: boolean;
    autoLock: boolean;
    autoLockMinutes: number;
    sessionTimeout: boolean;
    sessionTimeoutMinutes: number;
  };
  storage: {
    autoCleanup: boolean;
    cleanupDays: number;
    compressUploads: boolean;
  };
}

export interface User {
  username: string;
  email: string;
  avatarInitials: string;
  avatarIcon?: string;
  avatarColor?: string;
  bio?: string;
  settings: UserSettings;
}

interface AuthContextValue {
  user: User | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (section: keyof UserSettings, updates: Partial<UserSettings[keyof UserSettings]>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "necrom_user";
const THEME_KEY = "necrom_theme";

const defaultSettings: UserSettings = {
  notifications: {
    enabled: true,
    sound: true,
    virusAlerts: true,
    backupAlerts: true,
    securityAlerts: true,
  },
  privacy: {
    analytics: false,
    shareUsageData: false,
    showOnlineStatus: true,
  },
  security: {
    twoFactor: false,
    autoLock: true,
    autoLockMinutes: 15,
    sessionTimeout: true,
    sessionTimeoutMinutes: 30,
  },
  storage: {
    autoCleanup: false,
    cleanupDays: 30,
    compressUploads: true,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setThemeState] = useState<Theme>("cyberpunk");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
      startTransition(() => {
        if (stored) setUser(JSON.parse(stored));
        if (storedTheme) setThemeState(storedTheme);
      });
    } catch {
      // ignore
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  }, []);

  const signIn = useCallback(async (email: string, _password: string): Promise<{ error?: string }> => {
    // Simulated auth — accept any non-empty credentials
    if (!email || !_password) return { error: "EMAIL AND PASSWORD REQUIRED" };
    const username = email.split("@")[0].toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    const initials = username.slice(0, 2);
    const u: User = { username, email, avatarInitials: initials, settings: defaultSettings };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return {};
  }, []);

  const signUp = useCallback(async (username: string, email: string, _password: string): Promise<{ error?: string }> => {
    if (!username || !email || !_password) return { error: "ALL FIELDS REQUIRED" };
    if (_password.length < 6) return { error: "PASSWORD MUST BE ≥ 6 CHARACTERS" };
    const clean = username.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    const initials = clean.slice(0, 2);
    const u: User = { username: clean, email, avatarInitials: initials, settings: defaultSettings };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return {};
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSettings = useCallback((section: keyof UserSettings, updates: Partial<UserSettings[keyof UserSettings]>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        settings: {
          ...prev.settings,
          [section]: { ...prev.settings[section], ...updates },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, theme, setTheme, signIn, signUp, signOut, updateUser, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
