"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Tracks which child element inside a container is closest to the vertical center
 * of the screen on mobile/touch viewports, giving it a virtual "hover / spotlight" effect.
 */
export function useCenterSpotlight(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const evaluateCenter = () => {
      // Only activate on mobile and tablet viewport widths (< 1024px)
      // On desktop (1024px+), standard mouse hover takes full precedence
      const isMobileViewport = window.innerWidth < 1024;

      if (!isMobileViewport) {
        setActiveIndex(null);
        ticking = false;
        return;
      }

      if (!containerRef.current) {
        ticking = false;
        return;
      }

      const children = Array.from(containerRef.current.children) as HTMLElement[];
      if (!children.length) {
        ticking = false;
        return;
      }

      const viewportCenter = window.innerHeight * 0.48;
      let closestIdx = -1;
      let minDistance = Infinity;

      children.forEach((child, idx) => {
        const rect = child.getBoundingClientRect();
        // Skip hidden or collapsed elements
        if (rect.height === 0) return;
        const childCenter = rect.top + rect.height / 2;
        const dist = Math.abs(childCenter - viewportCenter);

        // Active zone: must be within central 40% band of screen
        if (dist < minDistance && dist < window.innerHeight * 0.42) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx >= 0 ? closestIdx : null);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(evaluateCenter);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const timer = setTimeout(evaluateCenter, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [itemCount]);

  return { containerRef, activeIndex };
}
