"use client";

import { useState, useEffect, useRef } from "react";

interface AmbientSoundProps {
  enabled?: boolean;
}

export default function AmbientSound({ enabled = true }: AmbientSoundProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (!enabled || isMuted) {
      stopSound();
      return;
    }

    return () => {
      stopSound();
    };
  }, [enabled, isMuted]);

  const createAmbientSound = () => {
    if (audioContextRef.current) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    
    const ctx = audioContextRef.current;
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create layered ambient drone - cyberpunk vibe
    const frequencies = [55, 82.5, 110, 165, 220]; // Low drone layers
    const oscillators: OscillatorNode[] = [];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      
      // Slow LFO for movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.1 + Math.random() * 0.1;
      lfoGain.gain.value = freq * 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      
      oscGain.gain.value = 0.15 / (i + 1);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    // Add subtle noise layer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 200;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    oscillatorsRef.current = oscillators;
  };

  const stopSound = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    oscillatorsRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
      setIsPlaying(false);
    } else {
      createAmbientSound();
      setIsPlaying(true);
    }
  };

  return (
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
            {isPlaying ? "AMBIENT AUDIO" : "AMBIENT MUTED"}
          </span>
          <span className="text-[10px]" style={{ color: "#1a3a5c" }}>
            Click to toggle
          </span>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-1 ml-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 animate-pulse"
                style={{
                  height: `${8 + Math.random() * 8}px`,
                  background: "#00d4ff",
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}