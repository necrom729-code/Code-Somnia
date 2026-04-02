"use client";

import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  opacity?: number;
}

export default function AnimatedBackground({ opacity = 0.3 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;
    let animationId: number;
    let drops: number[];
    let time = 0;

    const chars = "NECROM01アイウエオカキクケコサシスセソタチツテト☠⚔⚡█▓▒░╔╗╚╝║═";

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      const columns = Math.floor(canvas!.width / 18);
      drops = Array(columns).fill(1);
    }

    resize();
    window.addEventListener("resize", resize);

    // Floating skulls - more of them
    const skulls: { x: number; y: number; speed: number; size: number; opacity: number; rotation: number; rotSpeed: number }[] = [];
    for (let i = 0; i < 15; i++) {
      skulls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.8,
        size: 25 + Math.random() * 50,
        opacity: 0.15 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Glitch lines - more intense
    const glitchLines: { y: number; width: number; speed: number; opacity: number; color: string }[] = [];
    for (let i = 0; i < 12; i++) {
      glitchLines.push({
        y: Math.random() * canvas.height,
        width: 30 + Math.random() * 300,
        speed: 0.5 + Math.random() * 4,
        opacity: 0.08 + Math.random() * 0.15,
        color: ["#00d4ff", "#c0392b", "#00ff41", "#ff00ff"][Math.floor(Math.random() * 4)],
      });
    }

    // Particles for ambient effect
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 1 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.5,
        color: ["#00d4ff", "#00ff41", "#c0392b"][Math.floor(Math.random() * 3)],
      });
    }

    // Network nodes
    const nodes: { x: number; y: number; vx: number; vy: number; connections: number[] }[] = [];
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        connections: [],
      });
    }

    // Hexagon grid overlay
    const hexSize = 40;
    const hexHeight = hexSize * Math.sqrt(3);

    function drawSkull(x: number, y: number, size: number, alpha: number, rotation: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.font = `${size}px monospace`;
      ctx.fillStyle = "#c0392b";
      ctx.shadowColor = "#c0392b";
      ctx.shadowBlur = 15;
      ctx.fillText("☠", -size / 2, size / 3);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    function drawMatrixRain() {
      ctx.fillStyle = "rgba(5, 10, 15, 0.04)";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const xPos = i * 18;
        const yPos = drops[i] * 18;

        // Color variations
        const rand = Math.random();
        if (rand > 0.97) {
          ctx.fillStyle = "#c0392b";
          ctx.shadowColor = "#c0392b";
          ctx.shadowBlur = 8;
        } else if (rand > 0.93) {
          ctx.fillStyle = "#00d4ff";
          ctx.shadowColor = "#00d4ff";
          ctx.shadowBlur = 6;
        } else if (rand > 0.9) {
          ctx.fillStyle = "#ff00ff";
          ctx.shadowColor = "#ff00ff";
          ctx.shadowBlur = 5;
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.2 + Math.random() * 0.6})`;
          ctx.shadowColor = "#00ff41";
          ctx.shadowBlur = 3;
        }

        ctx.fillText(char, xPos, yPos);
        ctx.shadowBlur = 0;

        if (yPos > canvas!.height && Math.random() > 0.97) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function drawGlitchLines() {
      glitchLines.forEach((line) => {
        ctx.globalAlpha = line.opacity;
        ctx.fillStyle = line.color;
        ctx.shadowColor = line.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(Math.random() * 50, line.y, line.width, 1 + Math.random() * 2);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        line.y += line.speed;
        if (line.y > canvas!.height) {
          line.y = -10;
          line.width = 30 + Math.random() * 300;
          line.color = ["#00d4ff", "#c0392b", "#00ff41", "#ff00ff"][Math.floor(Math.random() * 4)];
        }
      });
    }

    function drawFloatingSkulls() {
      skulls.forEach((skull) => {
        drawSkull(skull.x, skull.y, skull.size, skull.opacity, skull.rotation);
        skull.y -= skull.speed;
        skull.x += Math.sin(skull.y * 0.008 + time * 0.01) * 0.8;
        skull.rotation += skull.rotSpeed;

        if (skull.y < -80) {
          skull.y = canvas!.height + 80;
          skull.x = Math.random() * canvas!.width;
        }
      });
    }

    function drawParticles() {
      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(time * 0.05 + p.x));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;
      });
      ctx.globalAlpha = 1;
    }

    function drawNetworkLines() {
      const maxDist = 150;
      ctx.lineWidth = 0.5;

      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = "#00d4ff";
            ctx.shadowColor = "#00d4ff";
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });

        // Draw node
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "#00d4ff";
        ctx.shadowColor = "#00d4ff";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas!.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas!.height) node.vy *= -1;
      });
      ctx.globalAlpha = 1;
    }

    function drawHexGrid() {
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "#00d4ff";
      ctx.lineWidth = 0.5;

      const cols = Math.ceil(canvas!.width / (hexSize * 1.5)) + 1;
      const rows = Math.ceil(canvas!.height / hexHeight) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * hexSize * 1.5;
          const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2);
          const pulse = 0.02 + 0.02 * Math.sin(time * 0.02 + col + row);
          ctx.globalAlpha = pulse;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = x + hexSize * Math.cos(angle);
            const hy = y + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawScanlines() {
      ctx.globalAlpha = 0.04;
      for (let y = 0; y < canvas!.height; y += 3) {
        ctx.fillStyle = y % 6 === 0 ? "#000" : "transparent";
        ctx.fillRect(0, y, canvas!.width, 1);
      }
      ctx.globalAlpha = 1;
    }

    function drawVignette() {
      const gradient = ctx.createRadialGradient(
        canvas!.width / 2,
        canvas!.height / 2,
        canvas!.height * 0.3,
        canvas!.width / 2,
        canvas!.height / 2,
        canvas!.height
      );
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
    }

    function drawPulsingSkullCenter() {
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;
      const pulse = 80 + 20 * Math.sin(time * 0.03);
      const alpha = 0.03 + 0.02 * Math.sin(time * 0.02);

      ctx.globalAlpha = alpha;
      ctx.font = `${pulse}px monospace`;
      ctx.fillStyle = "#c0392b";
      ctx.shadowColor = "#c0392b";
      ctx.shadowBlur = 50;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("☠", cx, cy);
      ctx.shadowBlur = 0;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.globalAlpha = 1;
    }

    function drawCornerSkulls() {
      const positions = [
        { x: 80, y: 80 },
        { x: canvas!.width - 80, y: 80 },
        { x: 80, y: canvas!.height - 80 },
        { x: canvas!.width - 80, y: canvas!.height - 80 },
      ];

      positions.forEach((pos, i) => {
        const pulse = 0.08 + 0.04 * Math.sin(time * 0.02 + i);
        ctx.globalAlpha = pulse;
        ctx.font = "40px monospace";
        ctx.fillStyle = "#c0392b";
        ctx.shadowColor = "#c0392b";
        ctx.shadowBlur = 20;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("☠", pos.x, pos.y);
        ctx.shadowBlur = 0;
      });
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.globalAlpha = 1;
    }

    function animate() {
      time++;
      drawMatrixRain();
      drawHexGrid();
      drawNetworkLines();
      drawParticles();
      drawFloatingSkulls();
      drawGlitchLines();
      drawPulsingSkullCenter();
      drawCornerSkulls();
      drawScanlines();
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
