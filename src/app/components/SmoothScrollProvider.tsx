"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Instantiate ultra-premium Lenis smooth scroll engine
    const instance = new Lenis({
      duration: 1.3, // Silky, weighted momentum that glides into place
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Velvet exponential deceleration curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95, // Calibrated momentum preventing aggressive wheel jumps
      touchMultiplier: 1.2, // Tactile, natural 1:1 response on trackpads & mobile
      infinite: false,
      autoRaf: false, // Driven by GSAP ticker for 120Hz/60Hz frame-perfect synchronization
    });

    lenisRef.current = instance;
    setLenis(instance);

    // Perfectly synchronize Lenis render loop with GSAP ticker (0 lag, zero frame tearing)
    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    instance.on("scroll", (e: { velocity: number; direction: number; scroll: number }) => {
      ScrollTrigger.update();
      if (typeof document !== "undefined") {
        const isMoving = Math.abs(e.velocity) > 0.08;
        document.documentElement.setAttribute("data-scrolling", isMoving ? "true" : "false");
        document.documentElement.setAttribute("data-scroll-direction", e.direction === 1 ? "down" : "up");
      }
    });

    // Expose lenis globally on window for anchor jumps and smooth navigation
    if (typeof window !== "undefined") {
      (window as unknown as { lenis: Lenis }).lenis = instance;
    }

    // Global smooth anchor link click interceptor for all on-page hashes
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1 && !href.includes("modal")) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          instance.scrollTo(targetElement as HTMLElement, {
            offset: -30,
            duration: 1.35,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Refresh ScrollTrigger once DOM layout stabilizes
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        delete (window as unknown as { lenis?: Lenis }).lenis;
      }
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
