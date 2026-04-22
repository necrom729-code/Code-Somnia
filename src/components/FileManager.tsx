"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type FileType = "document" | "video" | "audio" | "image" | "archive" | "code" | "other";

interface NecromFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  created: string;
  modified: string;
  /** For uploaded files, the real object URL */
  objectUrl?: string;
  /** For demo files, fake preview content */
  demoContent?: string;
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
  jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image", svg: "image", jfif: "image", bmp: "image", tiff: "image",tif: "image",
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

const DEMO_CONTENT: Record<string, string> = {
  "necrom_system_log.txt": `[2026-02-27 00:00:01] NECROM CLOUD SERVER BOOT
[2026-02-27 00:00:02] Loading kernel modules... OK
[2026-02-27 00:00:03] Initializing AES-256 encryption layer... OK
[2026-02-27 00:00:04] Connecting to ctOS-7 node... OK
[2026-02-27 00:00:05] Firewall rules loaded: 1,337 entries
[2026-02-27 00:00:06] Vault mounted at /necrom/vault
[2026-02-27 00:00:07] 6 files indexed
[2026-02-27 00:00:08] All systems nominal. WATCH_DOGS protocol active.
[2026-02-27 12:34:56] OPERATOR AIDEN_P authenticated
[2026-02-27 12:34:57] Session token issued: 8f3a...d9c2
[2026-02-27 16:44:38] Sync complete — 0 conflicts`,
  "hack_protocol.ts": `// NECROM HACK PROTOCOL v3.0.0
// WARNING: Authorized use only — ctOS enforcement active

import { encrypt, obfuscate } from "@necrom/core";

interface HackTarget {
  nodeId: string;
  accessLevel: 1 | 2 | 3 | 4 | 5;
  firewall: boolean;
}

export async function initiateHack(target: HackTarget): Promise<boolean> {
  if (target.firewall) {
    console.log("[NECROM] Bypassing firewall...");
    await bypassFirewall(target.nodeId);
  }

  const payload = obfuscate(encrypt({
    cmd: "INFILTRATE",
    target: target.nodeId,
    level: target.accessLevel,
    timestamp: Date.now(),
  }));

  const result = await fetch(\`/api/hack/\${target.nodeId}\`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result.ok;
}

async function bypassFirewall(nodeId: string): Promise<void> {
  // ctOS firewall bypass sequence
  for (let i = 0; i < 3; i++) {
    await sleep(300);
    console.log(\`[NECROM] Probe \${i + 1}/3 sent to \${nodeId}\`);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));`,
};

// Pre-computed waveform heights for the audio demo (avoids Math.random in render)
const WAVEFORM_HEIGHTS = Array.from({ length: 40 }, (_, i) =>
  Math.round(20 + Math.sin(i * 0.7) * 15 + (((i * 7919) % 17) / 17) * 10)
);

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

// ─── File Preview Modal ───────────────────────────────────────────────────────

function FilePreviewModal({ file, onClose, onDownload }: { file: NecromFile; onClose: () => void; onDownload: () => void }) {
  const cfg = FILE_TYPE_CONFIG[file.type];

  // Close on Escape (but not when video is fullscreen)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isVideo = file.type === "video";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: isVideo ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className={`necrom-panel w-full flex flex-col overflow-hidden ${isVideo ? "max-w-5xl max-h-[95vh]" : "max-w-3xl max-h-[90vh]"}`}
        style={{ borderColor: cfg.color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: cfg.borderColor }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl">{cfg.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-mono truncate" style={{ color: "#c0d8e8" }}>{file.name}</div>
              <div className="text-xs" style={{ color: "#3a6080" }}>
                {file.type.toUpperCase()} · {file.size} · Modified {file.modified}
              </div>
            </div>
          </div>
          <button
            className="text-xs px-3 py-1 border ml-4 flex-shrink-0 transition-all hover:opacity-80"
            style={{ borderColor: "#5c1a1a", color: "#ff3a3a" }}
            onClick={onClose}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-auto p-4">
          <PreviewContent file={file} onDownload={onDownload} />
        </div>
      </div>
    </div>
  );
}

// ─── Video Player Component ───────────────────────────────────────────────────

function VideoPlayer({ src, fileName }: { src: string; fileName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time display (MM:SS or HH:MM:SS)
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Update time display
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    resetControlsTimeout();
  }, [isMuted, resetControlsTimeout]);

  const changeVolume = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    resetControlsTimeout();
  }, [volume, resetControlsTimeout]);

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    try {
      if (!document.fullscreenElement) {
        // Try to fullscreen the video element directly for better browser support
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if ((video as HTMLVideoElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (video as HTMLVideoElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        } else if ((video as HTMLVideoElement & { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
          await (video as HTMLVideoElement & { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
        } else if ((video as HTMLVideoElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
          await (video as HTMLVideoElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
        } else {
          // Fallback to container
          await container.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        } else if ((document as Document & { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
          await (document as Document & { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
        } else if ((document as Document & { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
          await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
        case "j":
          e.preventDefault();
          skip(-10);
          break;
        case "arrowright":
        case "l":
          e.preventDefault();
          skip(10);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowup":
          e.preventDefault();
          changeVolume(0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          changeVolume(-0.1);
          break;
        case "0":
        case "home":
          e.preventDefault();
          seekTo(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skip, toggleFullscreen, toggleMute, changeVolume, seekTo]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
    resetControlsTimeout();
  }, [duration, seekTo, resetControlsTimeout]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded overflow-hidden group"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* Center play/pause button (shows when paused or hovering) */}
      <button
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying && showControls ? "opacity-0 hover:opacity-100" : isPlaying ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.6)",
            borderColor: "#00d4ff",
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
          }}
        >
          {isPlaying ? (
            <span className="text-3xl" style={{ color: "#00d4ff" }}>⏸</span>
          ) : (
            <span className="text-3xl ml-1" style={{ color: "#00d4ff" }}>▶</span>
          )}
        </div>
      </button>

      {/* Controls overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-4 relative group/progress"
          onClick={handleProgressClick}
        >
          {/* Buffered progress (simplified - just show played) */}
          <div
            className="absolute h-full rounded-full transition-all duration-100"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #00d4ff, #00b4d8)",
              boxShadow: "0 0 10px rgba(0,212,255,0.5)",
            }}
          />
          {/* Hover handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 8px)`, boxShadow: "0 0 10px rgba(0,212,255,0.8)" }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-105"
              style={{ borderColor: "rgba(0,212,255,0.5)", background: "rgba(0,0,0,0.5)" }}
            >
              <span style={{ color: "#00d4ff" }}>{isPlaying ? "⏸" : "▶"}</span>
            </button>

            {/* Rewind 10s */}
            <button
              onClick={() => skip(-10)}
              className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono transition-all hover:bg-white/10"
              style={{ color: "#a0c8e0" }}
              title="Rewind 10s (←)"
            >
              ⏪
            </button>

            {/* Fast Forward 10s */}
            <button
              onClick={() => skip(10)}
              className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono transition-all hover:bg-white/10"
              style={{ color: "#a0c8e0" }}
              title="Forward 10s (→)"
            >
              ⏩
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: "#a0c8e0" }}
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (videoRef.current) videoRef.current.volume = v;
                    setIsMuted(v === 0);
                  }}
                  className="w-16 h-1 rounded-lg cursor-pointer"
                  style={{ accentColor: "#00d4ff" }}
                />
              </div>
            </div>

            {/* Time display */}
            <div className="text-xs font-mono ml-2" style={{ color: "#a0c8e0" }}>
              <span style={{ color: "#00d4ff" }}>{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span style={{ color: "#5a7a8a" }}>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* File name */}
            <span className="text-xs font-mono mr-2 hidden sm:block" style={{ color: "#5a7a8a" }}>
              {fileName}
            </span>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: "#a0c8e0" }}
              title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint (shows briefly on load) */}
      <div className="absolute top-4 left-4 text-xs font-mono" style={{ color: "rgba(160,200,224,0.5)" }}>
        Space: Play | ← →: Skip 10s | F: Fullscreen | M: Mute
      </div>
    </div>
  );
}

function PreviewContent({ file, onDownload }: { file: NecromFile; onDownload: () => void }) {
  const cfg = FILE_TYPE_CONFIG[file.type];

  // Real uploaded file
  if (file.objectUrl) {
    if (file.type === "video") {
      return <VideoPlayer src={file.objectUrl} fileName={file.name} />;
    }
    if (file.type === "audio") {
      return (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="text-6xl">🎵</div>
          <div className="text-sm font-mono" style={{ color: "#a29bfe" }}>{file.name}</div>
          <audio src={file.objectUrl} controls className="w-full" style={{ accentColor: "#a29bfe" }} />
        </div>
      );
    }
    if (file.type === "image") {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.objectUrl}
          alt={file.name}
          className="max-w-full max-h-[60vh] mx-auto block rounded"
          style={{ objectFit: "contain" }}
        />
      );
    }
  }

  // Demo / text content
  if (file.type === "document" || file.type === "code") {
    const content = file.demoContent ?? `[${file.name}]

This file is ready for editing.
Created: ${file.created}
Size: ${file.size}

NECROM Secure Document Vault
All changes are encrypted and monitored.`;
    return (
      <div className="flex flex-col gap-3">
        <pre
          className="text-xs leading-relaxed overflow-auto p-4 rounded font-mono whitespace-pre-wrap"
          style={{
            background: "rgba(0,0,0,0.4)",
            color: file.type === "code" ? "#00d4ff" : "#a0c8e0",
            border: `1px solid ${cfg.borderColor}`,
            maxHeight: "60vh",
          }}
        >
          {content}
        </pre>
        <div className="flex gap-2 justify-end">
          <button 
            className="text-xs px-3 py-1 border transition-all hover:opacity-80"
            style={{ borderColor: cfg.borderColor, color: cfg.color }}
            onClick={() => alert(`Editing ${file.name}...\n\n(In a full implementation, this would open an editor)`)} 
          >
            ✎ EDIT
          </button>
          <button 
            className="text-xs px-3 py-1 border transition-all hover:opacity-80"
            style={{ borderColor: cfg.borderColor, color: cfg.color }}
            onClick={onDownload} 
          >
            ↓ DOWNLOAD
          </button>
        </div>
      </div>
    );
  }

  if (file.type === "video") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-16 rounded"
        style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${cfg.borderColor}` }}
      >
        <div className="text-6xl">🎬</div>
        <div className="text-sm font-mono" style={{ color: cfg.color }}>{file.name}</div>
        <div className="text-xs text-center max-w-xs" style={{ color: "#3a6080" }}>
          This is a demo video. Upload a real video file to enable playback and fullscreen.
        </div>
        <div
          className="text-xs px-3 py-1 border"
          style={{ borderColor: cfg.borderColor, color: cfg.color }}
        >
          {file.size} · {file.type.toUpperCase()}
        </div>
      </div>
    );
  }

  if (file.type === "audio") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-16 rounded"
        style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${cfg.borderColor}` }}
      >
        <div className="text-6xl">🎵</div>
        <div className="text-sm font-mono" style={{ color: cfg.color }}>{file.name}</div>
        {/* Fake waveform */}
        <div className="flex items-end gap-0.5 h-12">
          {WAVEFORM_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-sm"
              style={{
                height: `${h}px`,
                background: cfg.color,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
        <div className="text-xs text-center max-w-xs" style={{ color: "#3a6080" }}>
          This is a demo file entry. Upload a real audio file to play it here.
        </div>
      </div>
    );
  }

  if (file.type === "image") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-16 rounded"
        style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${cfg.borderColor}` }}
      >
        <div className="text-6xl">🖼️</div>
        <div className="text-sm font-mono" style={{ color: cfg.color }}>{file.name}</div>
        <div className="text-xs text-center max-w-xs" style={{ color: "#3a6080" }}>
          Upload a real image to view it in fullscreen.
        </div>
      </div>
    );
  }

  if (file.type === "archive") {
    const fakeContents = [
      "necrom/", "necrom/config.json", "necrom/keys/", "necrom/keys/private.pem",
      "necrom/keys/public.pem", "necrom/data/", "necrom/data/vault.db",
      "necrom/scripts/deploy.sh", "necrom/README.md",
    ];
    return (
      <div
        className="rounded overflow-hidden"
        style={{ border: `1px solid ${cfg.borderColor}` }}
      >
        <div
          className="px-4 py-2 text-xs uppercase tracking-widest border-b"
          style={{ color: cfg.color, borderColor: cfg.borderColor, background: "rgba(0,0,0,0.4)" }}
        >
          Archive Contents — {file.name}
        </div>
        <div className="p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
          {fakeContents.map((entry) => (
            <div key={entry} className="flex items-center gap-2 py-1 border-b" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
              <span>{entry.endsWith("/") ? "📁" : "📄"}</span>
              <span className="text-xs font-mono" style={{ color: entry.endsWith("/") ? cfg.color : "#a0c8e0" }}>
                {entry}
              </span>
            </div>
          ))}
          <div className="text-xs mt-3" style={{ color: "#3a6080" }}>
            Demo archive — upload a real file to inspect its contents.
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16 rounded"
      style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${cfg.borderColor}` }}
    >
      <div className="text-6xl">{cfg.icon}</div>
      <div className="text-sm font-mono" style={{ color: cfg.color }}>{file.name}</div>
      <div className="text-xs" style={{ color: "#3a6080" }}>No preview available for this file type.</div>
    </div>
  );
}

// ─── Main FileManager ─────────────────────────────────────────────────────────

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
  const [previewFile, setPreviewFile] = useState<NecromFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => { if (f.objectUrl) URL.revokeObjectURL(f.objectUrl); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  function createFile() {
    if (!newFileName.trim()) return;
    const name = newFileName.includes(".") ? newFileName : `${newFileName}.${defaultExt(newFileType)}`;
    const type = getFileType(name);
    const today = todayStr();
    
    // Generate demo content based on file type
    const demoContent = generateDemoContent(name, type);
    
    const file: NecromFile = {
      id: genId(),
      name,
      type,
      size: randomSize(type),
      created: today,
      modified: today,
      demoContent,
    };
    setFiles((prev) => [file, ...prev]);
    setNewFileName("");
    setShowCreate(false);
    showNotif(`FILE CREATED: ${name}`);
  }
  
  function generateDemoContent(name: string, type: FileType): string | undefined {
    if (type === "document") {
      return `[${new Date().toISOString()}] Document: ${name}

--- Content ---

This is a newly created document.
You can edit this content by opening the file.

NECROM Cloud Storage
Military-grade encryption active
WATCH_DOGS protocol monitoring enabled

--- End of Document ---`;
    }
    if (type === "code") {
      const ext = name.split('.').pop()?.toLowerCase();
      return `// ${name}
// Created: ${new Date().toISOString()}
// NECROM Secure Code Vault

function initialize() {
  console.log("System initialized...");
  return {
    status: "active",
    encryption: "AES-256",
    protocol: "WATCH_DOGS"
  };
}

// Main execution
const system = initialize();
export default system;`;
    }
    return undefined;
  }

  function defaultExt(type: FileType): string {
  const map: Record<FileType, string> = {
    document: "txt", video: "mp4", audio: "mp3", image: "png",
    archive: "zip", code: "ts", other: "dat",
  };
  return map[type];
}

function downloadFile(file: NecromFile, showNotif: (msg: string) => void) {
  const content = file.demoContent ?? "";
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotif(`DOWNLOADED: ${file.name}`);
}

  function handleUploadFiles(uploadedFiles: File[]) {
    if (uploadedFiles.length === 0) return;
    const today = todayStr();
    const newFiles: NecromFile[] = uploadedFiles.map((f) => ({
      id: genId(),
      name: f.name,
      type: getFileType(f.name),
      size: formatBytes(f.size),
      created: today,
      modified: today,
      objectUrl: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...newFiles, ...prev]);
    showNotif(`${newFiles.length} FILE(S) UPLOADED`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFiles = Array.from(e.target.files ?? []);
    handleUploadFiles(uploadedFiles);
  }

  // Drag and drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleUploadFiles(droppedFiles);
  }

  function deleteSelected() {
    if (selected.size === 0) return;
    setFiles((prev) => {
      const toDelete = prev.filter((f) => selected.has(f.id));
      toDelete.forEach((f) => { if (f.objectUrl) URL.revokeObjectURL(f.objectUrl); });
      return prev.filter((f) => !selected.has(f.id));
    });
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
      const matchType = filterType === "all" || f.type === filterType;
      return matchType;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return b.modified.localeCompare(a.modified);
    });

  const totalFiles = files.length;
  const typeCount = Object.keys(FILE_TYPE_CONFIG) as FileType[];

  return (
    <div
      className="flex flex-col gap-4 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="necrom-panel p-12 text-center animate-pulse"
            style={{ borderColor: "#00d4ff", borderWidth: "2px" }}
          >
            <div className="text-6xl mb-4">📁</div>
            <div className="text-lg font-mono" style={{ color: "#00d4ff" }}>DROP FILES TO UPLOAD</div>
            <div className="text-xs mt-2" style={{ color: "#5a7a8a" }}>Videos, images, audio, documents...</div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} onDownload={() => downloadFile(previewFile, showNotif)} />
      )}

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
              gridTemplateColumns: "32px 1fr 100px 80px 100px 100px",
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
                  gridTemplateColumns: "32px 1fr 100px 80px 100px 100px",
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
                    className="text-xs px-2 py-1 border transition-all hover:opacity-80"
                    style={{ borderColor: cfg.borderColor, color: cfg.color }}
                    title="Open / Preview"
                    onClick={() => setPreviewFile(file)}
                  >
                    ▶
                  </button>
                  <button
                    className="text-xs px-2 py-1 border transition-all hover:opacity-80"
                    style={{ borderColor: "#1a3a5c", color: "#3a6080" }}
                    title="Download"
                    onClick={() => {
                      if (file.type === "document" || file.type === "code") {
                        downloadFile(file, showNotif);
                      } else {
                        showNotif(`DOWNLOADING: ${file.name}`);
                      }
                    }}
                  >
                    ↓
                  </button>
                  <button
                    className="text-xs px-2 py-1 border transition-all hover:opacity-80"
                    style={{ borderColor: "#5c1a1a", color: "#ff3a3a" }}
                    title="Delete"
                    onClick={() => {
                      if (file.objectUrl) URL.revokeObjectURL(file.objectUrl);
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
                    className="text-xs px-2 py-1 border hover:opacity-80"
                    style={{ borderColor: cfg.borderColor, color: cfg.color }}
                    title="Open / Preview"
                    onClick={() => setPreviewFile(file)}
                  >▶</button>
                  <button
                    className="text-xs px-2 py-1 border hover:opacity-80"
                    style={{ borderColor: "#1a3a5c", color: "#3a6080" }}
                    onClick={() => {
                      if (file.type === "document" || file.type === "code") {
                        downloadFile(file, showNotif);
                      } else {
                        showNotif(`DOWNLOADING: ${file.name}`);
                      }
                    }}
                  >↓</button>
                  <button
                    className="text-xs px-2 py-1 border hover:opacity-80"
                    style={{ borderColor: "#5c1a1a", color: "#ff3a3a" }}
                    onClick={() => {
                      if (file.objectUrl) URL.revokeObjectURL(file.objectUrl);
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
