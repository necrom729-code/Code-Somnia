"use client";

import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  opacity?: number;
}

export default function AnimatedBackground({ opacity = 0.15 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;
    let animationId: number;
    let drops: number[];

    const chars = "NECROM01アイウエオカキクケコサシスセソタチツテト☠⚔⚡";

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      const columns = Math.floor(canvas!.width / 20);
      drops = Array(columns).fill(1);
    }

    resize();
    window.addEventListener("resize", resize);

    const skulls: { x: number; y: number; speed: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 8; i++) {
      skulls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.5,
        size: 20 + Math.random() * 30,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }

    const glitchLines: { y: number; width: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 5; i++) {
      glitchLines.push({
        y: Math.random() * canvas.height,
        width: 50 + Math.random() * 200,
        speed: 1 + Math.random() * 3,
        opacity: 0.05 + Math.random() * 0.1,
      });
    }

    function drawSkull(x: number, y: number, size: number, alpha: number) {
      ctx.globalAlpha = alpha;
      ctx.font = `${size}px monospace`;
      ctx.fillStyle = "#c0392b";
      ctx.fillText("☠", x, y);
      ctx.globalAlpha = 1;
    }

    function drawMatrixRain() {
      ctx.fillStyle = "rgba(5, 10, 15, 0.05)";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const xPos = i * 20;
        const yPos = drops[i] * 20;

        if (Math.random() > 0.95) {
          ctx.fillStyle = "#c0392b";
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = "#00d4ff";
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.3 + Math.random() * 0.5})`;
        }

        ctx.fillText(char, xPos, yPos);

        if (yPos > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function drawGlitchLines() {
      glitchLines.forEach((line) => {
        ctx.globalAlpha = line.opacity;
        ctx.fillStyle = Math.random() > 0.5 ? "#00d4ff" : "#c0392b";
        ctx.fillRect(0, line.y, line.width, 2);
        ctx.globalAlpha = 1;

        line.y += line.speed;
        if (line.y > canvas!.height) {
          line.y = -10;
          line.width = 50 + Math.random() * 200;
        }
      });
    }

    function drawFloatingSkulls() {
      skulls.forEach((skull) => {
        drawSkull(skull.x, skull.y, skull.size, skull.opacity);
        skull.y -= skull.speed;
        skull.x += Math.sin(skull.y * 0.01) * 0.5;

        if (skull.y < -50) {
          skull.y = canvas!.height + 50;
          skull.x = Math.random() * canvas!.width;
        }
      });
    }

    function drawScanlines() {
      ctx.globalAlpha = 0.03;
      for (let y = 0; y < canvas!.height; y += 4) {
        ctx.fillStyle = y % 8 === 0 ? "#000" : "transparent";
        ctx.fillRect(0, y, canvas!.width, 2);
      }
      ctx.globalAlpha = 1;
    }

    function animate() {
      drawMatrixRain();
      drawFloatingSkulls();
      drawGlitchLines();
      drawScanlines();
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
