"use client";

import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  opacity?: number;
}

export default function AnimatedBackground({ opacity = 0.45 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;
    let animationId: number;
    let time = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // City grid nodes
    const gridNodes: { x: number; y: number; pulse: number; size: number }[] = [];
    for (let i = 0; i < 60; i++) {
      gridNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        pulse: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 4,
      });
    }

    // Japanese data streams (Watch Dogs hacker style)
    const dataStreams: { x: number; y: number; speed: number; length: number; chars: string[] }[] = [];
    for (let i = 0; i < 25; i++) {
      const chars: string[] = [];
      const len = 8 + Math.floor(Math.random() * 20);
      for (let j = 0; j < len; j++) {
        chars.push(String.fromCharCode(0x30A0 + Math.random() * 96));
      }
      dataStreams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 1.5,
        length: len,
        chars,
      });
    }

    // Network nodes
    const networkNodes: { x: number; y: number; vx: number; vy: number; pulse: number }[] = [];
    for (let i = 0; i < 40; i++) {
      networkNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Scan bars
    const scanBars: { y: number; speed: number; height: number; opacity: number }[] = [];
    for (let i = 0; i < 6; i++) {
      scanBars.push({
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 1,
        height: 1 + Math.random() * 2,
        opacity: 0.06 + Math.random() * 0.1,
      });
    }

    // Glitch blocks
    const glitchBlocks: { x: number; y: number; w: number; h: number; timer: number; active: boolean }[] = [];
    for (let i = 0; i < 8; i++) {
      glitchBlocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        w: 30 + Math.random() * 120,
        h: 3 + Math.random() * 15,
        timer: Math.random() * 200,
        active: false,
      });
    }

    // Surveillance markers (Watch Dogs targeting style)
    const markers: { x: number; y: number; radius: number; pulse: number }[] = [];
    for (let i = 0; i < 5; i++) {
      markers.push({
        x: 150 + Math.random() * (canvas.width - 300),
        y: 150 + Math.random() * (canvas.height - 300),
        radius: 25 + Math.random() * 40,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function drawGrid() {
      ctx.strokeStyle = "#00d4ff";
      ctx.lineWidth = 0.3;
      const spacing = 50;

      for (let x = 0; x < canvas!.width; x += spacing) {
        const wave = Math.sin(time * 0.008 + x * 0.005) * 0.015;
        ctx.globalAlpha = 0.025 + wave;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas!.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas!.height; y += spacing) {
        const wave = Math.sin(time * 0.008 + y * 0.005) * 0.015;
        ctx.globalAlpha = 0.025 + wave;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas!.width, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawGridNodes() {
      gridNodes.forEach((node) => {
        const pulse = 0.25 + 0.25 * Math.sin(time * 0.025 + node.pulse);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = "#00d4ff";
        ctx.shadowColor = "#00d4ff";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
    }

    function drawNetworkConnections() {
      const maxDist = 160;

      networkNodes.forEach((node, i) => {
        networkNodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.2;
            const pulse = 0.5 + 0.5 * Math.sin(time * 0.015 + i * 0.3);
            ctx.globalAlpha = alpha * pulse;
            ctx.strokeStyle = "#00d4ff";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Data packet
            if (Math.sin(time * 0.1 + i + j) > 0.98) {
              const progress = (time * 0.03 + i) % 1;
              const px = node.x + (other.x - node.x) * progress;
              const py = node.y + (other.y - node.y) * progress;
              ctx.fillStyle = "#00ff41";
              ctx.shadowColor = "#00ff41";
              ctx.shadowBlur = 6;
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });

        const nodePulse = 0.35 + 0.35 * Math.sin(time * 0.03 + node.pulse);
        ctx.globalAlpha = nodePulse;
        ctx.fillStyle = "#00d4ff";
        ctx.shadowColor = "#00d4ff";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas!.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas!.height) node.vy *= -1;
      });
      ctx.globalAlpha = 1;
    }

    function drawDataStreams() {
      ctx.font = "11px monospace";

      dataStreams.forEach((stream) => {
        stream.chars.forEach((char, i) => {
          const yPos = stream.y + i * 13;
          const alpha = 0.08 + (i / stream.length) * 0.35;
          const fadeOut = yPos > canvas!.height - 40 ? (canvas!.height - yPos) / 40 : 1;

          ctx.globalAlpha = alpha * fadeOut;

          if (i === stream.chars.length - 1) {
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#00d4ff";
            ctx.shadowBlur = 8;
          } else if (i > stream.chars.length - 4) {
            ctx.fillStyle = "#00d4ff";
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "#003344";
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, stream.x, yPos);
        });
        ctx.shadowBlur = 0;

        stream.y += stream.speed;
        if (stream.y > canvas!.height + stream.length * 13) {
          stream.y = -stream.length * 13;
          stream.x = Math.random() * canvas!.width;
          for (let j = 0; j < stream.length; j++) {
            stream.chars[j] = String.fromCharCode(0x30A0 + Math.random() * 96);
          }
        }
      });
      ctx.globalAlpha = 1;
    }

    function drawScanBars() {
      scanBars.forEach((bar) => {
        ctx.globalAlpha = bar.opacity;
        const gradient = ctx.createLinearGradient(0, bar.y, canvas!.width, bar.y);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.15, "#00d4ff");
        gradient.addColorStop(0.5, "#00d4ff");
        gradient.addColorStop(0.85, "#00d4ff");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, bar.y, canvas!.width, bar.height);

        bar.y += bar.speed;
        if (bar.y > canvas!.height) bar.y = -10;
      });
      ctx.globalAlpha = 1;
    }

    function drawGlitchBlocks() {
      glitchBlocks.forEach((block) => {
        block.timer--;
        if (block.timer <= 0 && !block.active) {
          block.active = true;
          block.timer = 3 + Math.random() * 8;
          block.x = Math.random() * canvas!.width;
          block.y = Math.random() * canvas!.height;
        }

        if (block.active) {
          ctx.globalAlpha = 0.08 + Math.random() * 0.12;
          ctx.fillStyle = Math.random() > 0.6 ? "#00d4ff" : "#c0392b";
          ctx.fillRect(block.x, block.y, block.w, block.h);

          if (Math.random() > 0.5) {
            ctx.globalAlpha = 0.04;
            ctx.fillRect(block.x + 3, block.y + 1, block.w * 0.7, block.h);
          }

          block.timer--;
          if (block.timer <= 0) {
            block.active = false;
            block.timer = 80 + Math.random() * 250;
          }
        }
      });
      ctx.globalAlpha = 1;
    }

    function drawSurveillanceMarkers() {
      markers.forEach((marker, i) => {
        const pulse = marker.radius + 8 * Math.sin(time * 0.025 + marker.pulse);
        const alpha = 0.06 + 0.04 * Math.sin(time * 0.015 + i);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#c0392b";
        ctx.lineWidth = 0.8;

        // Outer ring
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, pulse * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(marker.x - pulse * 1.3, marker.y);
        ctx.lineTo(marker.x - pulse * 0.7, marker.y);
        ctx.moveTo(marker.x + pulse * 0.7, marker.y);
        ctx.lineTo(marker.x + pulse * 1.3, marker.y);
        ctx.moveTo(marker.x, marker.y - pulse * 1.3);
        ctx.lineTo(marker.x, marker.y - pulse * 0.7);
        ctx.moveTo(marker.x, marker.y + pulse * 0.7);
        ctx.lineTo(marker.x, marker.y + pulse * 1.3);
        ctx.stroke();

        // Corner brackets
        const s = pulse * 0.75;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(marker.x - s, marker.y - s + 8);
        ctx.lineTo(marker.x - s, marker.y - s);
        ctx.lineTo(marker.x - s + 8, marker.y - s);
        ctx.moveTo(marker.x + s - 8, marker.y - s);
        ctx.lineTo(marker.x + s, marker.y - s);
        ctx.lineTo(marker.x + s, marker.y - s + 8);
        ctx.moveTo(marker.x - s, marker.y + s - 8);
        ctx.lineTo(marker.x - s, marker.y + s);
        ctx.lineTo(marker.x - s + 8, marker.y + s);
        ctx.moveTo(marker.x + s - 8, marker.y + s);
        ctx.lineTo(marker.x + s, marker.y + s);
        ctx.lineTo(marker.x + s, marker.y + s - 8);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    function drawCornerUI() {
      const pad = 15;
      ctx.font = "9px monospace";

      // Top-left
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#00d4ff";
      ctx.fillText("CTOS v3.0.0", pad, pad + 10);
      ctx.fillText(`NODE: ${Math.floor((time * 7) % 9999).toString().padStart(4, "0")}`, pad, pad + 22);
      ctx.fillText(`SYS: ${new Date().toLocaleTimeString()}`, pad, pad + 34);

      // Top-right
      ctx.textAlign = "right";
      ctx.fillText("WATCH_DOGS", canvas!.width - pad, pad + 10);
      ctx.fillText("PROTOCOL: ACTIVE", canvas!.width - pad, pad + 22);
      ctx.fillStyle = "#00ff41";
      ctx.fillText("\u25A0 SECURE", canvas!.width - pad, pad + 34);

      // Bottom-left
      ctx.textAlign = "left";
      ctx.fillStyle = "#00d4ff";
      ctx.fillText("AES-256 ENCRYPTED", pad, canvas!.height - pad - 22);
      ctx.fillText("UPLINK: STABLE", pad, canvas!.height - pad - 10);

      // Bottom-right
      ctx.textAlign = "right";
      ctx.fillText(`LAT: ${(Math.sin(time * 0.001) * 45 + 45).toFixed(4)}`, canvas!.width - pad, canvas!.height - pad - 22);
      ctx.fillText(`LNG: ${(Math.cos(time * 0.001) * 90 + 90).toFixed(4)}`, canvas!.width - pad, canvas!.height - pad - 10);

      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }

    function drawScanlines() {
      ctx.globalAlpha = 0.025;
      for (let y = 0; y < canvas!.height; y += 2) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, y, canvas!.width, 1);
      }
      ctx.globalAlpha = 1;
    }

    function drawVignette() {
      const gradient = ctx.createRadialGradient(
        canvas!.width / 2,
        canvas!.height / 2,
        canvas!.height * 0.35,
        canvas!.width / 2,
        canvas!.height / 2,
        canvas!.height
      );
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
    }

    function drawEdgeGlow() {
      const topGrad = ctx.createLinearGradient(0, 0, 0, 80);
      topGrad.addColorStop(0, "rgba(0, 212, 255, 0.08)");
      topGrad.addColorStop(1, "transparent");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, canvas!.width, 80);

      const bottomGrad = ctx.createLinearGradient(0, canvas!.height - 80, 0, canvas!.height);
      bottomGrad.addColorStop(0, "transparent");
      bottomGrad.addColorStop(1, "rgba(0, 212, 255, 0.08)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, canvas!.height - 80, canvas!.width, 80);
    }

    function animate() {
      time++;
      ctx.fillStyle = "rgba(5, 10, 15, 0.06)";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);

      drawGrid();
      drawGridNodes();
      drawNetworkConnections();
      drawDataStreams();
      drawScanBars();
      drawGlitchBlocks();
      drawSurveillanceMarkers();
      drawCornerUI();
      drawScanlines();
      drawEdgeGlow();
      drawVignette();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity, zIndex: 0 }}
    />
  );
}
