"use client";

import React, { useEffect, useRef } from "react";

interface AsciiDitherCanvasProps {
  isHovered: boolean;
  className?: string;
  cellSize?: number;
}

// 4x4 Bayer Dither Matrix for authentic ordered dithering
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// ASCII glyph palette from dark to luminous
const ASCII_CHARS = [" ", "·", ":", "•", "+", "x", "¤", "░", "▒", "▓"];
const MATRIX_CHARS = [" ", "0", "1", "·", ":", "+", "λ", "§", "□", "■"];

/**
 * Canvas2D "Gradient Pixelated" ASCII-Art & Dither Engine
 * Recreates the 21st.dev ASCII gradient dither pipeline:
 * 1. Animated wave/mesh multi-stop gradient (blue & purple soft neon tones)
 * 2. Grid sampling with Bayer matrix dithering & ASCII/Matrix glyph rendering
 * 3. Color grading (contrast 115%, saturation, bright blue & purple tint)
 * 4. Scanlines (intensity 60%) + Vignette (intensity 38%) + Bloom glow
 * 5. Hardware-optimized: ONLY runs animation loop on hover (0% idle CPU)
 */
export default function AsciiDitherCanvas({
  isHovered,
  className = "",
  cellSize = 12,
}: AsciiDitherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const opacityRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    // Handle high-DPI canvas sizing
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
      }
    };

    updateSize();

    // Render loop
    const render = () => {
      if (!isRunning) return;

      // Smoothly interpolate opacity for hover in/out transitions
      const targetOpacity = isHovered ? 1 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.12;

      // If fully invisible and not hovered, pause rendering loop to preserve 0 CPU
      if (opacityRef.current < 0.005 && !isHovered) {
        opacityRef.current = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      timeRef.current += 0.035;
      const t = timeRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const scaledCellSize = Math.max(Math.floor(cellSize * dpr), 8);

      const cols = Math.ceil(w / scaledCellSize);
      const rows = Math.ceil(h / scaledCellSize);

      ctx.clearRect(0, 0, w, h);

      // Setup typography for ASCII glyphs
      const fontSize = Math.floor(scaledCellSize * 0.85);
      ctx.font = `600 ${fontSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Loop through cells and sample animated mesh gradient
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          const v = r / rows;

          // Animated harmonic wave synthesis (from gradientSource spec: wave, ripple, distortion)
          const wave1 = Math.sin(u * 3.2 + t * 1.2 + Math.cos(v * 2.8));
          const wave2 = Math.cos(v * 3.6 - t * 0.95 + Math.sin(u * 3.0));
          const wave3 = Math.sin((u + v) * 4.2 + t * 1.4);
          const rawVal = (wave1 + wave2 + wave3 + 3) / 6;

          // Contrast adjustment (contrast: 115%)
          const val = Math.max(0, Math.min(1, (rawVal - 0.5) * 1.15 + 0.5));

          // Ordered Bayer Dither check
          const bayerThreshold = BAYER_4X4[r % 4][c % 4] / 16;
          const dithered = val > bayerThreshold * 0.75;

          if (!dithered) continue;

          // Calculate cell center
          const cx = c * scaledCellSize + scaledCellSize / 2;
          const cy = r * scaledCellSize + scaledCellSize / 2;

          // Color palette interpolation:
          // Deep Blue (#0055FF) -> Glazed Azure (#3CA6FF) -> Amethyst Violet (#9333EA) -> Soft Magenta (#C026D3) -> Specular White
          let red = 0;
          let green = 0;
          let blue = 0;
          let alpha = (val * 0.85 + 0.15) * opacityRef.current;

          // Coordinate-based chromatic tilt (blue pool on left, purple pool on right)
          const chromaticTilt = u * 0.6 + val * 0.4;

          if (chromaticTilt < 0.45) {
            // Electric Sapphire / Glazed Azure
            const mix = chromaticTilt / 0.45;
            red = Math.floor(0 + mix * 60);
            green = Math.floor(85 + mix * 81); // up to 166 (matches #3CA6FF)
            blue = Math.floor(255);
          } else if (chromaticTilt < 0.8) {
            // Radiant Amethyst Violet / Purple
            const mix = (chromaticTilt - 0.45) / 0.35;
            red = Math.floor(60 + mix * 132); // up to 192 (matches #C026D3)
            green = Math.floor(166 - mix * 128);
            blue = Math.floor(255 - mix * 44);
          } else {
            // Specular soft white/lavender highlight
            const mix = (chromaticTilt - 0.8) / 0.2;
            red = Math.floor(192 + mix * 63);
            green = Math.floor(38 + mix * 217);
            blue = Math.floor(211 + mix * 44);
          }

          // Pick character based on luminance
          const charIndex = Math.min(
            Math.floor(val * ASCII_CHARS.length),
            ASCII_CHARS.length - 1
          );
          const char = (r + c) % 3 === 0 ? MATRIX_CHARS[charIndex] : ASCII_CHARS[charIndex];

          if (char === " ") continue;

          // Bloom / soft glow for bright cells
          if (val > 0.65) {
            ctx.shadowColor = `rgba(${red}, ${green}, ${blue}, ${0.8 * opacityRef.current})`;
            ctx.shadowBlur = 8 * dpr;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          ctx.fillText(char, cx, cy);
        }
      }

      // Reset shadow for post-effects
      ctx.shadowBlur = 0;

      // Post-effect 1: Scanlines (intensity: 60%)
      ctx.fillStyle = `rgba(0, 0, 0, ${0.28 * opacityRef.current})`;
      const scanStep = Math.max(Math.floor(2 * dpr), 2);
      for (let y = 0; y < h; y += scanStep) {
        ctx.fillRect(0, y, w, 1);
      }

      // Post-effect 2: Vignette (intensity: 38%) - softly dissolves edges into black glass
      const vignetteGrad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.3,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.72
      );
      vignetteGrad.addColorStop(0, "rgba(6, 6, 9, 0)");
      vignetteGrad.addColorStop(0.7, `rgba(6, 6, 9, ${0.45 * opacityRef.current})`);
      vignetteGrad.addColorStop(1, `rgba(6, 6, 9, ${0.95 * opacityRef.current})`);

      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, w, h);

      // Loop frame
      animFrameRef.current = requestAnimationFrame(render);
    };

    // If hovered, kick off render loop
    if (isHovered || opacityRef.current > 0.01) {
      animFrameRef.current = requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [isHovered, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full rounded-[24px] transition-opacity duration-500 ease-out ${className}`}
      style={{
        opacity: isHovered ? 1 : 0,
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
}
