"use client";

import { useState, useEffect, useRef } from "react";
import { useNotifications } from "@/lib/notifications";
import { useI18n } from "@/lib/i18n";

const typeStyles: Record<string, { bg: string; border: string; icon: string }> = {
  info: { bg: "rgba(0, 212, 255, 0.1)", border: "#00d4ff", icon: "ℹ️" },
  success: { bg: "rgba(85, 239, 196, 0.1)", border: "#55efc4", icon: "✓" },
  warning: { bg: "rgba(253, 203, 110, 0.1)", border: "#fdcb6e", icon: "⚠️" },
  error: { bg: "rgba(192, 57, 43, 0.1)", border: "#c0392b", icon: "✗" },
  threat: { bg: "rgba(192, 57, 43, 0.15)", border: "#ff3a3a", icon: "🛡️" },
};

export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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
        className="relative p-2 transition-colors hover:bg-white/5 rounded"
        style={{ color: "#3a6080" }}
        title="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
            style={{
              background: "#c0392b",
              color: "#fff",
              animation: "pulse 2s infinite",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllAsRead, clearNotification, clearAll } = useNotifications();
  const { t } = useI18n();

  const [now] = useState(() => Date.now());
  
  const formatTime = (timestamp: number) => {
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 border"
      style={{
        background: "rgba(5, 10, 15, 0.98)",
        borderColor: "var(--necrom-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--necrom-border)" }}
      >
        <span
          className="text-xs font-bold tracking-widest"
          style={{ color: "var(--necrom-text)" }}
        >
          {t("notifications.title")}
        </span>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs px-2 py-1 transition-colors hover:bg-white/5"
            style={{ color: "#3a6080" }}
          >
            {t("notifications.clearAll")}
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div
            className="px-4 py-8 text-center text-xs"
            style={{ color: "#3a6080" }}
          >
            {t("notifications.empty")}
          </div>
        ) : (
          notifications.map((notification) => {
            const style = typeStyles[notification.type];
            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className="px-4 py-3 border-b cursor-pointer transition-colors hover:bg-white/5"
                style={{
                  borderColor: "var(--necrom-border)",
                  background: notification.read ? undefined : `${style.bg}`,
                  borderLeft: notification.read ? undefined : `3px solid ${style.border}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold mb-1"
                      style={{ color: style.border }}
                    >
                      {notification.title}
                    </div>
                    <div
                      className="text-xs mb-2"
                      style={{ color: "var(--necrom-text)" }}
                    >
                      {notification.message}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#3a6080" }}>
                        {formatTime(notification.timestamp)}
                      </span>
                      {notification.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action!.onClick();
                          }}
                          className="text-xs px-2 py-1 border transition-colors hover:bg-white/10"
                          style={{ borderColor: style.border, color: style.border }}
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notification.id);
                    }}
                    className="text-xs p-1 transition-colors hover:bg-white/10 rounded"
                    style={{ color: "#3a6080" }}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          className="px-4 py-2 border-t text-center"
          style={{ borderColor: "var(--necrom-border)" }}
        >
          <button
            onClick={clearAll}
            className="text-xs transition-colors hover:text-white"
            style={{ color: "#3a6080" }}
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}
