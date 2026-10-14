"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ── types ───────────────────────────────────────────────────── */

export interface PortfolioScrollGridImage {
  src: string;
  alt: string;
}

export interface PortfolioScrollGridProps {
  /** Name pinned to the centre of the viewport, between the layered photos. */
  title: React.ReactNode;
  /**
   * Photos, recycled to fill the grid. Pass 8 or more and no photo ever
   * touches a copy of itself.
   */
  images: PortfolioScrollGridImage[];
  /** Grid rows — sets how long the section scrolls. Default `8`. */
  rows?: number;
  className?: string;
}

/* ── layout constants ────────────────────────────────────────── */

const COLUMNS = 5;
const CENTER = 2;

const COL = 26.98;
const ROW = 32.23;
const BOX_W = 22;
const BOX_H = 21.24;
const TITLE = 5.63;

const u = (n: number) => `calc(var(--u) * ${n})`;

// PHASE: offset so the centre column drops and clears the initial view
const PHASE = `mod(50vh - ${u(ROW / 2)}, ${u(ROW)})`;

/**
 * Determines whether a card in column `c` and row `r` should be in the
 * FOREGROUND layer (z-30, rendering over the text and covering parts of it)
 * or in the BACKGROUND layer (z-10, rendering behind the text).
 */
const isForegroundCard = (c: number, r: number): boolean => {
  // Column 1 (left of text): odd rows in front
  if (c === 1) return r % 2 === 1;
  // Column 2 (centre of text): odd rows in front
  if (c === 2) return r % 2 === 1;
  // Column 3 (right of text): even rows in front
  if (c === 3) return r % 2 === 0;
  // Outer columns (0 and 4): stay in background
  return false;
};

/* ── component ───────────────────────────────────────────────── */

export function PortfolioScrollGrid({
  title,
  images,
  rows = 8,
  className,
}: PortfolioScrollGridProps) {
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    // Refresh ScrollTrigger so Lenis and GSAP coordinate layout accurately
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        try {
          ScrollTrigger.refresh();
        } catch {
          // ignore if ScrollTrigger not active
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full overflow-clip bg-[#0C0C0C]", className)}
      style={
        {
          containerType: "inline-size",
          // Floored so photos stay legible on phones; outer columns run off edges
          "--u": "max(1cqw, 5.5px)",
        } as React.CSSProperties
      }
    >
      {/* ── TOP EDGE FADE VIGNETTE (z-40) ─────────────────────────
          Crisp gradient fade into pure #0C0C0C (no blur), preventing any
          cards from spilling into the previous section. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-44 z-40 bg-gradient-to-b from-[#0C0C0C] via-[#0C0C0C]/85 to-transparent" />

      {/* ── PINNED TITLE LAYER (z-20) ─────────────────────────────
          Sticky in viewport centre throughout the section scroll.
          Crisp, sharp typography with deep contrast and zero blur. */}
      <div className="sticky top-0 z-20 flex h-screen w-full items-center justify-center px-4 pointer-events-none">
        <h2
          className="text-center font-extrabold uppercase leading-none tracking-tight text-foreground font-kanit select-none drop-shadow-[0_12px_45px_rgba(0,0,0,0.98)]"
          style={{ fontSize: u(TITLE) }}
        >
          {title}
        </h2>
      </div>

      {/* ── LAYER 1: BACKGROUND PHOTO GRID (z-10) ─────────────────
          Direct in-flow grid pulled up by -100vh to overlap sticky title.
          Renders cards that pass BEHIND the text. */}
      <div className="relative flex justify-center -mt-[100vh] pt-14 sm:pt-20 pb-24 sm:pb-36 z-10">
        {Array.from({ length: COLUMNS }, (_, c) => {
          const colTransform =
            c === CENTER
              ? `translateY(calc(50vh - ${PHASE} + ${u(ROW * 1.5)}))`
              : c % 2
                ? `translateY(${u(ROW / 2)})`
                : undefined;

          return (
            <div key={c} className="shrink-0" style={{ width: u(COL) }}>
              {Array.from({ length: rows }, (_, r) => {
                const image =
                  images[(r + c * 4 + (c === CENTER ? 3 : 0)) % images.length];
                const isFg = isForegroundCard(c, r);

                return (
                  <div
                    key={r}
                    className="relative flex items-center justify-center"
                    style={{
                      height: u(ROW),
                      transform: colTransform,
                    }}
                  >
                    {/* Render card in background layer only if not designated for foreground */}
                    {!isFg && image ? (
                      <div
                        className="overflow-hidden rounded-xl bg-neutral-900 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                        style={{ width: u(BOX_W), height: u(BOX_H) }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover select-none"
                        />
                      </div>
                    ) : (
                      // Empty placeholder to preserve column spacing
                      <div style={{ width: u(BOX_W), height: u(BOX_H) }} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── LAYER 2: FOREGROUND PHOTO GRID (z-30) ─────────────────
          Positioned absolute over the grid.
          Renders cards that pass IN FRONT OF the text, covering parts of
          the letters with physical drop shadows. */}
      <div className="absolute inset-0 flex justify-center pt-14 sm:pt-20 pb-24 sm:pb-36 z-30 pointer-events-none">
        {Array.from({ length: COLUMNS }, (_, c) => {
          const colTransform =
            c === CENTER
              ? `translateY(calc(50vh - ${PHASE} + ${u(ROW * 1.5)}))`
              : c % 2
                ? `translateY(${u(ROW / 2)})`
                : undefined;

          return (
            <div key={c} className="shrink-0" style={{ width: u(COL) }}>
              {Array.from({ length: rows }, (_, r) => {
                const image =
                  images[(r + c * 4 + (c === CENTER ? 3 : 0)) % images.length];
                const isFg = isForegroundCard(c, r);

                return (
                  <div
                    key={r}
                    className="relative flex items-center justify-center"
                    style={{
                      height: u(ROW),
                      transform: colTransform,
                    }}
                  >
                    {/* Render card in foreground layer so it passes over the text */}
                    {isFg && image ? (
                      <div
                        className="overflow-hidden rounded-xl bg-neutral-900 border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_20px_rgba(255,255,255,0.06)] ring-1 ring-white/15 pointer-events-auto transition-transform hover:scale-[1.02]"
                        style={{ width: u(BOX_W), height: u(BOX_H) }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover select-none"
                        />
                      </div>
                    ) : (
                      // Empty placeholder to preserve column spacing
                      <div style={{ width: u(BOX_W), height: u(BOX_H) }} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM EDGE FADE VIGNETTE (z-40) ──────────────────────
          Crisp gradient fade into pure #0C0C0C (no blur), preventing any
          cards from spilling into the Contact section below. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-44 z-40 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/85 to-transparent" />
    </section>
  );
}
