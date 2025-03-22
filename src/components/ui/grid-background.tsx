"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  containerClassName?: string;
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  blur?: number;
}

export function GridBackground({
  className,
  children,
  containerClassName,
  dotColor = "rgba(255, 255, 255, 0.15)",
  dotSize = 1,
  dotSpacing = 30,
  blur = 50,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        drawGrid(ctx, width, height);
      }
    });

    resizeObserver.observe(canvas);

    function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;

      // Draw dots
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initial draw
    drawGrid(ctx, canvas.width, canvas.height);

    return () => {
      resizeObserver.disconnect();
    };
  }, [dotColor, dotSize, dotSpacing]);

  return (
    <div className={cn("relative w-full overflow-hidden", containerClassName)}>
      {/* Background with blur effect */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `blur(${blur}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/30 opacity-40 z-10" />
      
      {/* Content */}
      <div className={cn("relative z-20", className)}>
        {children}
      </div>
    </div>
  );
} 