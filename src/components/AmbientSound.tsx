"use client";

import { useState, useRef, useEffect } from "react";

interface AmbientSoundProps {
  enabled?: boolean;
}

export default function AmbientSound({ enabled = true }: AmbientSoundProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(() => {
    if (typeof window === "undefined") return false;
    return true;
  });

  useEffect(() => {
    if (!isClient || !enabled) return;

    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        videoId: "XqJkdsqeDxw",
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: "XqJkdsqeDxw",
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
         iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(30);
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              // Loop when video ends
              event.target.playVideo();
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [enabled, isClient]);

  const toggleSound = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  if (!isClient) return null;

  return (
    <>
      {/* Hidden YouTube player */}
      <div className="hidden">
        <div id="youtube-player"></div>
      </div>

      {/* Audio control UI */}
      <div className="fixed bottom-4 left-4 z-50">
        <div 
          className="necrom-panel p-3 flex items-center gap-3"
          style={{ borderColor: "#1a3a5c" }}
        >
          <button
            onClick={toggleSound}
            className="w-8 h-8 flex items-center justify-center border transition-all hover:scale-105"
            style={{ 
              borderColor: isPlaying ? "#00d4ff" : "#1a3a5c",
              background: isPlaying ? "rgba(0,212,255,0.1)" : "transparent"
            }}
          >
            <span style={{ color: isPlaying ? "#00d4ff" : "#3a6080" }}>
              {isPlaying ? "🔊" : "🔇"}
            </span>
          </button>
          
          <div className="flex flex-col">
            <span className="text-xs tracking-widest" style={{ color: "#3a6080" }}>
              {isPlaying ? "WATCH DOGS THEME" : "AUDIO OFF"}
            </span>
            <span className="text-[10px]" style={{ color: "#1a3a5c" }}>
              Click to play
            </span>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-1 ml-2">
              {[8, 12, 10, 14, 8].map((height, i) => (
                <div
                  key={i}
                  className="w-1 animate-pulse"
                  style={{
                    height: `${height}px`,
                    background: "#00d4ff",
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}