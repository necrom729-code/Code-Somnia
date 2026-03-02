"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useI18n } from "./i18n";

type NotificationType = "info" | "success" | "warning" | "error" | "threat";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface CleaningStatus {
  lastCleanTime: number | null;
  nextScheduledClean: number | null;
  isCleaning: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  cleaningStatus: CleaningStatus;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  performClean: () => void;
  getDaysSinceClean: () => number;
  getCleaningReminder: () => { message: string; urgent: boolean } | null;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const NOTIFICATIONS_KEY = "necrom_notifications";
const CLEANING_KEY = "necrom_cleaning_status";
const CLEANING_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cleaningStatus, setCleaningStatus] = useState<CleaningStatus>({
    lastCleanTime: null,
    nextScheduledClean: null,
    isCleaning: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
        const storedCleaning = localStorage.getItem(CLEANING_KEY);
        return {
          notifications: storedNotifications ? JSON.parse(storedNotifications) : [],
          cleaning: storedCleaning ? JSON.parse(storedCleaning) : null,
        };
      } catch {
        return { notifications: [], cleaning: null };
      }
    };

    const { notifications: storedNotifs, cleaning } = loadData();
    
    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      if (storedNotifs.length > 0) {
        setNotifications(storedNotifs);
      }
      if (cleaning) {
        setCleaningStatus(cleaning);
      }
    });
  }, []);

  // Save to localStorage when changes occur
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(CLEANING_KEY, JSON.stringify(cleaningStatus));
    } catch {
      // ignore
    }
  }, [cleaningStatus]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const performClean = useCallback(() => {
    setCleaningStatus((prev) => ({
      ...prev,
      isCleaning: true,
    }));

    // Simulate cleaning process
    setTimeout(() => {
      const now = Date.now();
      setCleaningStatus({
        lastCleanTime: now,
        nextScheduledClean: now + CLEANING_INTERVAL,
        isCleaning: false,
      });
      addNotification({
        type: "success",
        title: t("notifications.systemClean"),
        message: "System optimization complete. Temp files cleared, cache refreshed.",
      });
    }, 2000);
  }, [addNotification, t]);

  const getDaysSinceClean = useCallback(() => {
    if (!cleaningStatus.lastCleanTime) return Infinity;
    const diff = Date.now() - cleaningStatus.lastCleanTime;
    return Math.floor(diff / (24 * 60 * 60 * 1000));
  }, [cleaningStatus.lastCleanTime]);

  const getCleaningReminder = useCallback(() => {
    const days = getDaysSinceClean();
    
    if (days === Infinity) {
      return {
        message: t("notifications.daysSinceClean", { days: 0 }),
        urgent: true,
      };
    }
    
    if (days >= 7) {
      return {
        message: t("notifications.daysSinceClean", { days }),
        urgent: true,
      };
    }
    
    if (days >= 3) {
      return {
        message: t("notifications.daysSinceClean", { days }),
        urgent: false,
      };
    }
    
    return null;
  }, [getDaysSinceClean, t]);

  // Check for cleaning reminders periodically
  useEffect(() => {
    const checkCleaningReminder = () => {
      const reminder = getCleaningReminder();
      if (reminder && reminder.urgent) {
        // Check if we already have a recent cleaning reminder
        const hasRecentReminder = notifications.some(
          (n) =>
            n.type === "warning" &&
            n.title === t("notifications.daysSinceClean", { days: getDaysSinceClean() }) &&
            Date.now() - n.timestamp < 60 * 60 * 1000 // Within last hour
        );

        if (!hasRecentReminder) {
          addNotification({
            type: "warning",
            title: t("notifications.daysSinceClean", { days: getDaysSinceClean() }),
            message: "System maintenance recommended for optimal performance.",
            action: {
              label: t("notifications.cleanNow"),
              onClick: performClean,
            },
          });
        }
      }
    };

    // Check immediately and then every hour
    checkCleaningReminder();
    const interval = setInterval(checkCleaningReminder, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [getCleaningReminder, getDaysSinceClean, addNotification, notifications, t, performClean]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        cleaningStatus,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        performClean,
        getDaysSinceClean,
        getCleaningReminder,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
