"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNotifications } from "./notifications";
import { useI18n } from "./i18n";

type ProtectionType = "antivirus" | "vpn" | "firewall" | "encryption" | "watchdogs" | "audit";

interface Protection {
  id: ProtectionType;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  lastScan: string | null;
  threatsBlocked: number;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "threat" | "success";
  message: string;
  source: string;
}

interface BackupData {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "full" | "incremental";
  status: "complete" | "in_progress" | "failed";
  protected: boolean;
}

interface SecurityContextType {
  protections: Record<ProtectionType, Protection>;
  logs: SecurityLog[];
  backups: BackupData[];
  isAllEnabled: boolean;
  toggleProtection: (id: ProtectionType) => void;
  enableAll: () => void;
  disableAll: () => void;
  runScan: (id: ProtectionType) => void;
  addLog: (type: SecurityLog["type"], message: string, source: string) => void;
  createBackup: (name: string, type: BackupData["type"]) => void;
  deleteBackup: (id: string) => void;
  restoreBackup: (id: string) => void;
  threatsBlockedTotal: number;
  lastFullScan: string | null;
}

const getDefaultProtections = (t: (key: string) => string): Record<ProtectionType, Protection> => ({
  antivirus: {
    id: "antivirus",
    name: t("protection.antivirus.name"),
    icon: "🛡️",
    description: t("protection.antivirus.desc"),
    enabled: false,
    lastScan: null,
    threatsBlocked: 0,
  },
  vpn: {
    id: "vpn",
    name: t("protection.vpn.name"),
    icon: "🔒",
    description: t("protection.vpn.desc"),
    enabled: false,
    lastScan: null,
    threatsBlocked: 0,
  },
  firewall: {
    id: "firewall",
    name: t("protection.firewall.name"),
    icon: "🔥",
    description: t("protection.firewall.desc"),
    enabled: false,
    lastScan: null,
    threatsBlocked: 0,
  },
  encryption: {
    id: "encryption",
    name: t("protection.encryption.name"),
    icon: "🔐",
    description: t("protection.encryption.desc"),
    enabled: false,
    lastScan: null,
    threatsBlocked: 0,
  },
  watchdogs: {
    id: "watchdogs",
    name: t("protection.watchdogs.name"),
    icon: "👁️",
    description: t("protection.watchdogs.desc"),
    enabled: false,
    lastScan: null,
    threatsBlocked: 0,
  },
  audit: {
    id: "audit",
    name: t("protection.audit.name"),
    icon: "📊",
    description: t("protection.audit.desc"),
    enabled: false,
    lastScan: null,
    threatsBlocked: 0,
  },
});

const defaultBackups: BackupData[] = [
  { id: "1", name: "System Backup - Feb 28", size: "45.2 GB", date: "2026-02-28 03:00", type: "full", status: "complete", protected: true },
  { id: "2", name: "Daily Incremental", size: "1.3 GB", date: "2026-03-01 03:00", type: "incremental", status: "complete", protected: true },
  { id: "3", name: "Pre-Update Backup", size: "46.8 GB", date: "2026-02-25 14:30", type: "full", status: "complete", protected: true },
];

const SecurityContext = createContext<SecurityContextType | null>(null);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const { addNotification } = useNotifications();
  const { t } = useI18n();
  
  const [protections, setProtections] = useState<Record<ProtectionType, Protection>>(() => getDefaultProtections(t));
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [backups, setBackups] = useState<BackupData[]>(defaultBackups);
  const [lastFullScan, setLastFullScan] = useState<string | null>(null);
  
  // Update protection names when language changes (use setTimeout to avoid cascading renders warning)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProtections(prev => {
        const updatedNames = getDefaultProtections(t);
        const result: Partial<Record<ProtectionType, Protection>> = {};
        (Object.keys(prev) as ProtectionType[]).forEach((key) => {
          result[key] = { ...prev[key], name: updatedNames[key].name, description: updatedNames[key].description };
        });
        return result as Record<ProtectionType, Protection>;
      });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [t]);

  const isAllEnabled = Object.values(protections).every((p) => p.enabled);

  const threatsBlockedTotal = Object.values(protections).reduce((sum, p) => sum + p.threatsBlocked, 0);

  const addLog = useCallback((type: SecurityLog["type"], message: string, source: string) => {
    const newLog: SecurityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      source,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 100));
  }, []);

  const toggleProtection = useCallback((id: ProtectionType) => {
    setProtections((prev) => {
      const updated = { ...prev };
      updated[id] = { ...updated[id], enabled: !updated[id].enabled };
      return updated;
    });
    
    const protection = protections[id];
    const action = protection.enabled ? "DISABLED" : "ENABLED";
    addLog(protection.enabled ? "warning" : "success", `${protection.name} ${action}`, "SECURITY_CORE");
  }, [protections, addLog]);

  const enableAll = useCallback(() => {
    setProtections((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as ProtectionType[]).forEach((key) => {
        updated[key] = { ...updated[key], enabled: true };
      });
      return updated;
    });
    addLog("success", "ALL SECURITY SYSTEMS ACTIVATED", "SECURITY_CORE");
    setLastFullScan(new Date().toLocaleString());
  }, [addLog]);

  const disableAll = useCallback(() => {
    setProtections((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as ProtectionType[]).forEach((key) => {
        updated[key] = { ...updated[key], enabled: false };
      });
      return updated;
    });
    addLog("warning", "ALL SECURITY SYSTEMS DEACTIVATED", "SECURITY_CORE");
  }, [addLog]);

  const runScan = useCallback((id: ProtectionType) => {
    setProtections((prev) => {
      const updated = { ...prev };
      updated[id] = { ...updated[id], lastScan: new Date().toLocaleTimeString() };
      
      // Simulate finding threats randomly
      if (Math.random() > 0.7) {
        const threats = Math.floor(Math.random() * 3) + 1;
        updated[id] = { ...updated[id], threatsBlocked: updated[id].threatsBlocked + threats };
        addLog("threat", `${threats} threats detected and neutralized by ${updated[id].name}`, updated[id].name);
        
        // Send notification for threat detection
        addNotification({
          type: "threat",
          title: t("notifications.virusDetected"),
          message: t("notifications.threatBlocked", { protection: updated[id].name }),
        });
      } else {
        addLog("info", `Scan completed - No threats found`, updated[id].name);
      }
      
      return updated;
    });
  }, [addLog, addNotification, t]);

  const createBackup = useCallback((name: string, type: BackupData["type"]) => {
    const newBackup: BackupData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      size: type === "full" ? "45-50 GB" : "1-2 GB",
      date: new Date().toLocaleString(),
      type,
      status: "in_progress",
      protected: true,
    };
    setBackups((prev) => [newBackup, ...prev]);
    addLog("info", `Backup "${name}" started (${type})`, "BACKUP_MANAGER");
    
    // Simulate backup completion
    setTimeout(() => {
      setBackups((prev) =>
        prev.map((b) => (b.id === newBackup.id ? { ...b, status: "complete" } : b))
      );
      addLog("success", `Backup "${name}" completed successfully`, "BACKUP_MANAGER");
      addNotification({
        type: "success",
        title: t("notifications.backupComplete"),
        message: `"${name}" has been saved successfully.`,
      });
    }, 3000);
  }, [addLog, addNotification, t]);

  const deleteBackup = useCallback((id: string) => {
    setBackups((prev) => prev.filter((b) => b.id !== id));
    addLog("warning", `Backup deleted`, "BACKUP_MANAGER");
  }, [addLog]);

  const restoreBackup = useCallback((id: string) => {
    const backup = backups.find((b) => b.id === id);
    if (backup) {
      addLog("info", `Restoring backup "${backup.name}"...`, "BACKUP_MANAGER");
      setTimeout(() => {
        addLog("success", `Backup "${backup.name}" restored successfully`, "BACKUP_MANAGER");
      }, 2000);
    }
  }, [backups, addLog]);

  // Auto-scan when protections are enabled
  useEffect(() => {
    const interval = setInterval(() => {
      Object.values(protections).forEach((p) => {
        if (p.enabled && Math.random() > 0.9) {
          runScan(p.id);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [protections, runScan]);

  return (
    <SecurityContext.Provider
      value={{
        protections,
        logs,
        backups,
        isAllEnabled,
        toggleProtection,
        enableAll,
        disableAll,
        runScan,
        addLog,
        createBackup,
        deleteBackup,
        restoreBackup,
        threatsBlockedTotal,
        lastFullScan,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}
