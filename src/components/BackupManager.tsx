"use client";

import { useState } from "react";

// Backup data interface
interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  files: number;
  status: "completed" | "in-progress" | "failed";
  type: "full" | "incremental";
}

export default function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: "bkp_001",
      name: "Full System Backup",
      date: "2026-02-28 14:32:00",
      size: "45.2 GB",
      files: 1247,
      status: "completed",
      type: "full"
    },
    {
      id: "bkp_002", 
      name: "Daily Incremental",
      date: "2026-02-27 00:00:00",
      size: "2.8 GB",
      files: 156,
      status: "completed",
      type: "incremental"
    },
    {
      id: "bkp_003",
      name: "Documents Backup",
      date: "2026-02-26 18:45:00",
      size: "890 MB",
      files: 342,
      status: "completed",
      type: "incremental"
    },
    {
      id: "bkp_004",
      name: "Media Files Backup",
      date: "2026-02-25 22:10:00",
      size: "12.4 GB",
      files: 89,
      status: "completed",
      type: "full"
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showNewBackupModal, setShowNewBackupModal] = useState(false);
  const [newBackupName, setNewBackupName] = useState("");
  const [backupType, setBackupType] = useState<"full" | "incremental">("incremental");

  // Simulate creating a new backup
  const createBackup = () => {
    if (!newBackupName.trim()) return;
    
    setIsCreating(true);
    const newBackup: Backup = {
      id: `bkp_${Date.now()}`,
      name: newBackupName,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      size: "0 MB",
      files: 0,
      status: "in-progress",
      type: backupType
    };
    
    setBackups([newBackup, ...backups]);
    setShowNewBackupModal(false);
    setNewBackupName("");
    
    // Simulate backup completion after 3 seconds
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id 
          ? { ...b, status: "completed", size: backupType === "full" ? "38.5 GB" : "1.2 GB", files: backupType === "full" ? 892 : 67 }
          : b
      ));
      setIsCreating(false);
    }, 3000);
  };

  // Simulate restore
  const restoreBackup = (id: string) => {
    alert(`Restoring backup ${id}... Data will be restored to your cloud storage.`);
  };

  // Simulate delete
  const deleteBackup = (id: string) => {
    if (confirm("Are you sure you want to delete this backup? This action cannot be undone.")) {
      setBackups(backups.filter(b => b.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#55efc4";
      case "in-progress": return "#fdcb6e";
      case "failed": return "#ff3a3a";
      default: return "#3a6080";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return "✓";
      case "in-progress": return "⟳";
      case "failed": return "✗";
      default: return "○";
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: "0 0 8px #55efc4" }} />
          <span className="text-xs tracking-widest" style={{ color: "#55efc4" }}>
            BACKUP SERVER ONLINE
          </span>
        </div>
        
        <button
          onClick={() => setShowNewBackupModal(true)}
          className="necrom-btn text-xs py-2 px-4 flex items-center gap-2"
          disabled={isCreating}
        >
          <span>+</span>
          <span>NEW BACKUP</span>
        </button>
      </div>

      {/* Backup Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="necrom-panel p-4" style={{ borderColor: "#1a3a5c" }}>
          <div className="text-xs tracking-widest mb-1" style={{ color: "#3a6080" }}>TOTAL BACKUPS</div>
          <div className="text-2xl font-bold" style={{ color: "#00d4ff" }}>{backups.length}</div>
        </div>
        <div className="necrom-panel p-4" style={{ borderColor: "#1a3a5c" }}>
          <div className="text-xs tracking-widest mb-1" style={{ color: "#3a6080" }}>TOTAL SIZE</div>
          <div className="text-2xl font-bold" style={{ color: "#55efc4" }}>61.3 GB</div>
        </div>
        <div className="necrom-panel p-4" style={{ borderColor: "#1a3a5c" }}>
          <div className="text-xs tracking-widest mb-1" style={{ color: "#3a6080" }}>AUTO SCHEDULE</div>
          <div className="text-2xl font-bold" style={{ color: "#fdcb6e" }}>DAILY</div>
        </div>
        <div className="necrom-panel p-4" style={{ borderColor: "#1a3a5c" }}>
          <div className="text-xs tracking-widest mb-1" style={{ color: "#3a6080" }}>LAST BACKUP</div>
          <div className="text-lg font-bold" style={{ color: "#c0392b" }}>2h ago</div>
        </div>
      </div>

      {/* Backup List */}
      <div className="necrom-panel" style={{ borderColor: "#1a3a5c" }}>
        {/* Header */}
        <div 
          className="p-3 border-b flex items-center gap-2"
          style={{ borderColor: "#1a3a5c", background: "rgba(0,0,0,0.3)" }}
        >
          <span style={{ color: "#00d4ff" }}>◈</span>
          <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>
            💀 BACKUP HISTORY 💀
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs tracking-widest" style={{ color: "#3a6080", borderBottom: "1px solid #1a3a5c" }}>
                <th className="text-left p-3">STATUS</th>
                <th className="text-left p-3">BACKUP NAME</th>
                <th className="text-left p-3">TYPE</th>
                <th className="text-left p-3">DATE</th>
                <th className="text-left p-3">SIZE</th>
                <th className="text-left p-3">FILES</th>
                <th className="text-right p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr 
                  key={backup.id}
                  className="border-b hover:bg-white/5 transition-colors"
                  style={{ borderColor: "#1a3a5c" }}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className={`inline-flex items-center justify-center w-5 h-5 text-xs ${backup.status === "in-progress" ? "animate-spin" : ""}`}
                        style={{ color: getStatusColor(backup.status) }}
                      >
                        {getStatusIcon(backup.status)}
                      </span>
                      <span className="text-xs" style={{ color: getStatusColor(backup.status) }}>
                        {backup.status === "in-progress" ? "CREATING..." : backup.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-medium" style={{ color: "#a0c8e0" }}>
                      {backup.name}
                    </span>
                  </td>
                  <td className="p-3">
                    <span 
                      className="text-xs px-2 py-1 border"
                      style={{ 
                        color: backup.type === "full" ? "#c0392b" : "#00d4ff",
                        borderColor: backup.type === "full" ? "#c0392b" : "#00d4ff"
                      }}
                    >
                      {backup.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs" style={{ color: "#3a6080" }}>{backup.date}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs" style={{ color: "#00d4ff" }}>{backup.size}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs" style={{ color: "#55efc4" }}>{backup.files}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      {backup.status === "completed" && (
                        <>
                          <button
                            onClick={() => restoreBackup(backup.id)}
                            className="text-xs px-2 py-1 border transition-colors hover:bg-white/10"
                            style={{ color: "#00d4ff", borderColor: "#1a3a5c" }}
                          >
                            RESTORE
                          </button>
                          <button
                            onClick={() => deleteBackup(backup.id)}
                            className="text-xs px-2 py-1 border transition-colors hover:bg-white/10"
                            style={{ color: "#ff3a3a", borderColor: "#1a3a5c" }}
                          >
                            DELETE
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup Schedule Info */}
      <div className="necrom-panel p-4" style={{ borderColor: "#1a3a5c" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⏰</div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#00d4ff" }}>AUTOMATED BACKUP SCHEDULE</div>
              <div className="text-xs" style={{ color: "#3a6080" }}>
                Daily at 00:00 UTC • Incremental backups preserve bandwidth
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: "0 0 6px #55efc4" }} />
            <span className="text-xs" style={{ color: "#55efc4" }}>ACTIVE</span>
          </div>
        </div>
      </div>

      {/* New Backup Modal */}
      {showNewBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowNewBackupModal(false)}
          />
          <div 
            className="relative necrom-panel p-6 w-full max-w-md"
            style={{ borderColor: "#1a3a5c", background: "#050a0f" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold tracking-widest" style={{ color: "#00d4ff" }}>
                CREATE NEW BACKUP
              </h3>
              <button
                onClick={() => setShowNewBackupModal(false)}
                className="text-xl hover:text-white"
                style={{ color: "#3a6080" }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs tracking-widest block mb-2" style={{ color: "#3a6080" }}>
                  BACKUP NAME
                </label>
                <input
                  type="text"
                  value={newBackupName}
                  onChange={(e) => setNewBackupName(e.target.value)}
                  placeholder="Enter backup name..."
                  className="w-full p-3 text-sm bg-transparent border focus:border-cyan-500 outline-none"
                  style={{ borderColor: "#1a3a5c", color: "#a0c8e0" }}
                />
              </div>

              <div>
                <label className="text-xs tracking-widest block mb-2" style={{ color: "#3a6080" }}>
                  BACKUP TYPE
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBackupType("full")}
                    className={`p-3 border text-left transition-colors ${backupType === "full" ? "border-red-500 bg-red-500/10" : ""}`}
                    style={{ borderColor: backupType === "full" ? "#c0392b" : "#1a3a5c" }}
                  >
                    <div className="text-xs font-bold" style={{ color: backupType === "full" ? "#c0392b" : "#3a6080" }}>
                      FULL BACKUP
                    </div>
                    <div className="text-[10px]" style={{ color: "#3a6080" }}>
                      Complete snapshot of all data
                    </div>
                  </button>
                  <button
                    onClick={() => setBackupType("incremental")}
                    className={`p-3 border text-left transition-colors ${backupType === "incremental" ? "border-cyan-500 bg-cyan-500/10" : ""}`}
                    style={{ borderColor: backupType === "incremental" ? "#00d4ff" : "#1a3a5c" }}
                  >
                    <div className="text-xs font-bold" style={{ color: backupType === "incremental" ? "#00d4ff" : "#3a6080" }}>
                      INCREMENTAL
                    </div>
                    <div className="text-[10px]" style={{ color: "#3a6080" }}>
                      Only changed files since last backup
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowNewBackupModal(false)}
                  className="flex-1 py-3 text-xs tracking-widest border transition-colors hover:bg-white/5"
                  style={{ borderColor: "#1a3a5c", color: "#3a6080" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={createBackup}
                  className="flex-1 py-3 text-xs tracking-widest necrom-btn"
                  disabled={!newBackupName.trim()}
                >
                  START BACKUP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay when creating */}
      {isCreating && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
    </div>
  );
}
