"use client";

import { useState, useRef } from "react";

type FileType = "document" | "video" | "audio" | "image" | "archive" | "code" | "other";

interface NecromFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  created: string;
  modified: string;
}

const FILE_TYPE_CONFIG: Record<FileType, { icon: string; color: string; borderColor: string; bg: string }> = {
  document: { icon: "📄", color: "#a0c8e0", borderColor: "#1a3a5c", bg: "rgba(0,212,255,0.05)" },
  video:    { icon: "🎬", color: "#ff9f43", borderColor: "#5c3a1a", bg: "rgba(255,159,67,0.05)" },
  audio:    { icon: "🎵", color: "#a29bfe", borderColor: "#3a1a5c", bg: "rgba(162,155,254,0.05)" },
  image:    { icon: "🖼️", color: "#55efc4", borderColor: "#1a5c3a", bg: "rgba(85,239,196,0.05)" },
  archive:  { icon: "📦", color: "#fdcb6e", borderColor: "#5c4a1a", bg: "rgba(253,203,110,0.05)" },
  code:     { icon: "💻", color: "#00d4ff", borderColor: "#1a5c5c", bg: "rgba(0,212,255,0.05)" },
  other:    { icon: "📁", color: "#636e72", borderColor: "#2a2a2a", bg: "rgba(99,110,114,0.05)" },
};

const EXTENSION_MAP: Record<string, FileType> = {
  txt: "document", doc: "document", docx: "document", pdf: "document", md: "document",
  mp4: "video", mkv: "video", avi: "video", mov: "video", webm: "video",
  mp3: "audio", wav: "audio", flac: "audio", ogg: "audio", aac: "audio",
  jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image", svg: "image",
  zip: "archive", rar: "archive", tar: "archive", gz: "archive", "7z": "archive",
  js: "code", ts: "code", tsx: "code", jsx: "code", py: "code", html: "code", css: "code",
};

function getFileType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MAP[ext] ?? "other";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function randomSize(type: FileType): string {
  const ranges: Record<FileType, [number, number]> = {
    document: [1024, 5 * 1024 * 1024],
    video:    [50 * 1024 * 1024, 4 * 1024 * 1024 * 1024],
    audio:    [3 * 1024 * 1024, 100 * 1024 * 1024],
    image:    [100 * 1024, 20 * 1024 * 1024],
    archive:  [1024 * 1024, 500 * 1024 * 1024],
    code:     [512, 2 * 1024 * 1024],
    other:    [1024, 10 * 1024 * 1024],
  };
  const [min, max] = ranges[type];
  return formatBytes(Math.floor(Math.random() * (max - min) + min));
}

const INITIAL_FILES: NecromFile[] = [
  { id: "1", name: "necrom_system_log.txt", type: "document", size: "48 KB", created: "2026-02-10", modified: "2026-02-27" },
  { id: "2", name: "watchdogs_intro.mp4", type: "video", size: "1.2 GB", created: "2026-01-15", modified: "2026-01-15" },
  { id: "3", name: "skull_theme.mp3", type: "audio", size: "8.4 MB", created: "2026-02-01", modified: "2026-02-01" },
  { id: "4", name: "ctOS_blueprint.png", type: "image", size: "3.7 MB", created: "2026-02-20", modified: "2026-02-22" },
  { id: "5", name: "necrom_core.zip", type: "archive", size: "245 MB", created: "2026-02-25", modified: "2026-02-25" },
  { id: "6", name: "hack_protocol.ts", type: "code", size: "14 KB", created: "2026-02-27", modified: "2026-02-27" },
];

function genId(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function FileManager() {
  const [files, setFiles] = useState<NecromFile[]>(INITIAL_FILES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<FileType>("document");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FileType | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "type" | "modified">("modified");
  const [view, setView] = useState<"grid" | "list">("list");
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  function createFile() {
    if (!newFileName.trim()) return;
    const name = newFileName.includes(".") ? newFileName : `${newFileName}.${defaultExt(newFileType)}`;
    const type = getFileType(name);
    const today = todayStr();
    const file: NecromFile = {
      id: genId(),
      name,
      type,
      size: randomSize(type),
      created: today,
      modified: today,
    };
    setFiles((prev) => [file, ...prev]);
    setNewFileName("");
    setShowCreate(false);
    showNotif(`FILE CREATED: ${name}`);
  }

  function defaultExt(type: FileType): string {
    const map: Record<FileType, string> = {
      document: "txt", video: "mp4", audio: "mp3", image: "png",
      archive: "zip", code: "ts", other: "dat",
    };
    return map[type];
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFiles = Array.from(e.target.files ?? []);
    const today = todayStr();
    const newFiles: NecromFile[] = uploadedFiles.map((f) => ({
      id: genId(),
      name: f.name,
      type: getFileType(f.name),
      size: formatBytes(f.size),
      created: today,
      modified: today,
    }));
    setFiles((prev) => [...newFiles, ...prev]);
    showNotif(`${newFiles.length} FILE(S) UPLOADED`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function deleteSelected() {
    if (selected.size === 0) return;
    setFiles((prev) => prev.filter((f) => !selected.has(f.id)));
    showNotif(`${selected.size} FILE(S) DELETED`);
    setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((f) => f.id)));
  }

  const filtered = files
    .filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || f.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return b.modified.localeCompare(a.modified);
    });

  const totalFiles = files.length;
  const typeCount = Object.keys(FILE_TYPE_CONFIG) as FileType[];

  return (
    <div className="flex flex-col gap-4">
      {/* Notification */}
      {notification && (
        <div
          className="fixed top-4 right-4 z-50 necrom-panel px-4 py-3 text-xs font-mono"
          style={{ color: "#00d4ff", borderColor: "#00d4ff", minWidth: 260 }}
        >
          <span className="mr-2">▶</span>{notification}
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["document", "video", "audio", "image"] as FileType[]).map((t) => {
          const cfg = FILE_TYPE_CONFIG[t];
          const count = files.filter((f) => f.type === t).length;
          return (
            <div
              key={t}
              className="necrom-panel p-3 cursor-pointer transition-all"
              style={{ borderColor: filterType === t ? cfg.color : undefined }}
              onClick={() => setFilterType(filterType === t ? "all" : t)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{cfg.icon}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: cfg.color }}>{t}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="necrom-panel p-3 flex flex-wrap gap-2 items-center">
        {/* Search */}
        <input
          className="necrom-input flex-1 min-w-[160px]"
          placeholder="SEARCH FILES..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />

        {/* Filter */}
        <select
          className="necrom-input"
          style={{ width: "auto", minWidth: 120 }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FileType | "all")}
        >
          <option value="all">ALL TYPES</option>
          {typeCount.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="necrom-input"
          style={{ width: "auto", minWidth: 120 }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "type" | "modified")}
        >
          <option value="modified">SORT: DATE</option>
          <option value="name">SORT: NAME</option>
          <option value="type">SORT: TYPE</option>
        </select>

        {/* View toggle */}
        <button
          className="necrom-btn"
          onClick={() => setView(view === "list" ? "grid" : "list")}
        >
          {view === "list" ? "⊞ GRID" : "☰ LIST"}
        </button>

        <div className="flex-1" />

        {/* Upload */}
        <label className="necrom-btn cursor-pointer">
          ↑ UPLOAD
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>

        {/* Create */}
        <button className="necrom-btn" onClick={() => setShowCreate(!showCreate)}>
          + CREATE
        </button>

        {/* Delete */}
        {selected.size > 0 && (
          <button className="necrom-btn necrom-btn-danger" onClick={deleteSelected}>
            ✕ DELETE ({selected.size})
          </button>
        )}
      </div>

      {/* Create file panel */}
      {showCreate && (
        <div className="necrom-panel p-4 flex flex-wrap gap-3 items-end" style={{ borderColor: "#00d4ff" }}>
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="text-xs uppercase tracking-widest" style={{ color: "#00d4ff" }}>File Name</label>
            <input
              className="necrom-input"
              placeholder="e.g. report.pdf or video.mp4"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createFile()}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "#00d4ff" }}>Type</label>
            <select
              className="necrom-input"
              style={{ width: "auto", minWidth: 120 }}
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value as FileType)}
            >
              {typeCount.map((t) => (
                <option key={t} value={t}>{t.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <button className="necrom-btn" onClick={createFile}>CREATE FILE</button>
          <button className="necrom-btn necrom-btn-danger" onClick={() => setShowCreate(false)}>CANCEL</button>
        </div>
      )}

      {/* File count + select all */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs" style={{ color: "#3a6080" }}>
          {filtered.length} / {totalFiles} FILES
          {selected.size > 0 && <span style={{ color: "#00d4ff" }}> — {selected.size} SELECTED</span>}
        </span>
        {filtered.length > 0 && (
          <button
            className="text-xs uppercase tracking-widest cursor-pointer"
            style={{ color: "#3a6080", background: "none", border: "none" }}
            onClick={selectAll}
          >
            {selected.size === filtered.length ? "DESELECT ALL" : "SELECT ALL"}
          </button>
        )}
      </div>

      {/* File list / grid */}
      {filtered.length === 0 ? (
        <div className="necrom-panel p-12 text-center" style={{ color: "#3a6080" }}>
          <div className="text-4xl mb-3">💀</div>
          <div className="text-sm uppercase tracking-widest">NO FILES FOUND</div>
        </div>
      ) : view === "list" ? (
        <div className="necrom-panel overflow-hidden">
          {/* Header */}
          <div
            className="grid text-xs uppercase tracking-widest px-4 py-2 border-b"
            style={{
              gridTemplateColumns: "32px 1fr 100px 80px 100px 80px",
              color: "#3a6080",
              borderColor: "#1a3a5c",
            }}
          >
            <span />
            <span>Name</span>
            <span>Type</span>
            <span>Size</span>
            <span>Modified</span>
            <span>Actions</span>
          </div>
          {filtered.map((file) => {
            const cfg = FILE_TYPE_CONFIG[file.type];
            const isSelected = selected.has(file.id);
            return (
              <div
                key={file.id}
                className="grid items-center px-4 py-3 border-b transition-all cursor-pointer"
                style={{
                  gridTemplateColumns: "32px 1fr 100px 80px 100px 80px",
                  borderColor: "#0d2035",
                  background: isSelected ? "rgba(0,212,255,0.05)" : "transparent",
                }}
                onClick={() => toggleSelect(file.id)}
              >
                {/* Checkbox */}
                <div
                  className="w-4 h-4 border flex items-center justify-center text-xs"
                  style={{
                    borderColor: isSelected ? "#00d4ff" : "#1a3a5c",
                    background: isSelected ? "rgba(0,212,255,0.2)" : "transparent",
                    color: "#00d4ff",
                  }}
                >
                  {isSelected && "✓"}
                </div>
                {/* Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <span>{cfg.icon}</span>
                  <span className="truncate text-sm" style={{ color: "#c0d8e8" }}>{file.name}</span>
                </div>
                {/* Type tag */}
                <div>
                  <span
                    className="file-tag text-xs"
                    style={{ color: cfg.color, borderColor: cfg.borderColor, background: cfg.bg }}
                  >
                    {file.type}
                  </span>
                </div>
                {/* Size */}
                <span className="text-xs" style={{ color: "#3a6080" }}>{file.size}</span>
                {/* Modified */}
                <span className="text-xs" style={{ color: "#3a6080" }}>{file.modified}</span>
                {/* Actions */}
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="text-xs px-2 py-1 border transition-all"
                    style={{ borderColor: "#1a3a5c", color: "#3a6080" }}
                    title="Download"
                    onClick={() => showNotif(`DOWNLOADING: ${file.name}`)}
                  >
                    ↓
                  </button>
                  <button
                    className="text-xs px-2 py-1 border transition-all"
                    style={{ borderColor: "#5c1a1a", color: "#ff3a3a" }}
                    title="Delete"
                    onClick={() => {
                      setFiles((prev) => prev.filter((f) => f.id !== file.id));
                      showNotif(`DELETED: ${file.name}`);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((file) => {
            const cfg = FILE_TYPE_CONFIG[file.type];
            const isSelected = selected.has(file.id);
            return (
              <div
                key={file.id}
                className="necrom-panel p-4 flex flex-col gap-2 cursor-pointer transition-all"
                style={{
                  borderColor: isSelected ? "#00d4ff" : cfg.borderColor,
                  background: isSelected ? "rgba(0,212,255,0.05)" : cfg.bg,
                }}
                onClick={() => toggleSelect(file.id)}
              >
                <div className="text-3xl text-center">{cfg.icon}</div>
                <div className="text-xs truncate text-center" style={{ color: "#c0d8e8" }}>{file.name}</div>
                <div className="flex justify-between items-center">
                  <span className="file-tag text-xs" style={{ color: cfg.color, borderColor: cfg.borderColor }}>
                    {file.type}
                  </span>
                  <span className="text-xs" style={{ color: "#3a6080" }}>{file.size}</span>
                </div>
                <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="text-xs px-2 py-1 border"
                    style={{ borderColor: "#1a3a5c", color: "#3a6080" }}
                    onClick={() => showNotif(`DOWNLOADING: ${file.name}`)}
                  >↓</button>
                  <button
                    className="text-xs px-2 py-1 border"
                    style={{ borderColor: "#5c1a1a", color: "#ff3a3a" }}
                    onClick={() => {
                      setFiles((prev) => prev.filter((f) => f.id !== file.id));
                      showNotif(`DELETED: ${file.name}`);
                    }}
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
