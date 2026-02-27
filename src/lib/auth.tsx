"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, startTransition } from "react";

export type Theme = "cyberpunk" | "matrix" | "blood" | "ghost" | "neon";

export interface User {
  username: string;
  email: string;
  avatarInitials: string;
}

interface AuthContextValue {
  user: User | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "necrom_user";
const THEME_KEY = "necrom_theme";

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
    const u: User = { username, email, avatarInitials: initials };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return {};
  }, []);

  const signUp = useCallback(async (username: string, email: string, _password: string): Promise<{ error?: string }> => {
    if (!username || !email || !_password) return { error: "ALL FIELDS REQUIRED" };
    if (_password.length < 6) return { error: "PASSWORD MUST BE ≥ 6 CHARACTERS" };
    const clean = username.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    const initials = clean.slice(0, 2);
    const u: User = { username: clean, email, avatarInitials: initials };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return {};
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, theme, setTheme, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
