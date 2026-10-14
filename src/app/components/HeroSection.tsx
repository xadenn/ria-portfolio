"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function HeroSection() {
  const { portfolio } = usePortfolio();
  const { profile } = portfolio;
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  // Kinetic marquee: continuous smooth glide + scroll-driven acceleration
  useEffect(() => {
    let animationFrame: number;
    let baseOffset = 0;
    const autoSpeed = 1.2;

    const updateMarquee = () => {
      baseOffset += autoSpeed;
      const scrollInfluence = window.scrollY * 0.85;
      const totalOffset = baseOffset + scrollInfluence;

      if (marqueeTrackRef.current) {
        const loopWidth = marqueeTrackRef.current.scrollWidth / 2;
        if (loopWidth > 0) {
          const currentX = -(totalOffset % loopWidth);
          marqueeTrackRef.current.style.transform = `translate3d(${currentX}px, 0, 0)`;
        }
      }
      animationFrame = requestAnimationFrame(updateMarquee);
    };

    animationFrame = requestAnimationFrame(updateMarquee);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Clean uppercase name without any dash/hyphen
  const marqueeWord = `${profile.name.toUpperCase()} `;

  return (
    <section
      id="hero"
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0C0C0C] font-hn text-cream select-none"
      aria-label="Hero"
    >
      {/* ─────────────────────────────────────────────────────────────
          LAYER 0 (default z): BACKGROUND IMAGE (Full-bleed)
          ───────────────────────────────────────────────────────────── */}
      <img
        src={profile.heroImage || "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85"}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover anim-fade-in pointer-events-none"
      />

      {/* ─────────────────────────────────────────────────────────────
          LAYER 1 (z-10): GIANT SCROLLING MARQUEE NAME (NO DASH, FULLY LEGIBLE)
          ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden anim-fade-up pointer-events-none select-none"
        style={{ animationDelay: "500ms" }}
      >
        <div
          ref={marqueeTrackRef}
          className="flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-cream tracking-tight uppercase font-bold will-change-transform"
        >
          <span className="inline-block pr-[6vw]">{marqueeWord}&nbsp;</span>
          <span className="inline-block pr-[6vw]">{marqueeWord}&nbsp;</span>
          <span className="inline-block pr-[6vw]">{marqueeWord}&nbsp;</span>
          <span className="inline-block pr-[6vw]">{marqueeWord}&nbsp;</span>
          <span className="inline-block pr-[6vw]">{marqueeWord}&nbsp;</span>
          <span className="inline-block pr-[6vw]">{marqueeWord}&nbsp;</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 2 (z-20): FRONT PORTRAIT (Full-bleed cutout overlay)
          Natural edge-to-edge fit — no artificial scaling or cropped arms!
          ───────────────────────────────────────────────────────────── */}
      <img
        src={profile.portraitImage || "https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png"}
        alt="Portrait"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover z-20 pointer-events-none anim-rise-in"
        style={{ animationDelay: "300ms" }}
      />

      {/* ─────────────────────────────────────────────────────────────
          LAYER 3 (z-25): SEAMLESS BOTTOM TRANSITION GRADIENT
          Blends background image and portrait smoothly into #0C0C0C
          ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 sm:h-72 pointer-events-none z-25 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/85 via-35% to-transparent"
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          LAYER 4 (z-30): DESKTOP CREAM RULE & FOOTER
          ───────────────────────────────────────────────────────────── */}
      <div
        className="hidden sm:block absolute inset-x-10 bottom-28 z-30 h-0.5 bg-cream anim-line"
        style={{ animationDelay: "1200ms" }}
      />

      <footer
        className="absolute inset-x-0 bottom-0 z-30 hidden sm:flex items-end justify-between px-10 pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream pointer-events-auto"
        aria-label="Hero bottom summary"
      >
        <div
          className="anim-fade-up flex flex-col font-light text-cream/90"
          style={{ animationDelay: "1400ms" }}
        >
          <span className="font-semibold text-white tracking-wide">{profile.role}</span>
          {profile.subtitles.map((sub, i) => (
            <span key={i} className="text-cream/80">{sub}</span>
          ))}
        </div>

        <div
          className="anim-fade-up flex flex-col text-right font-light text-cream/90 space-y-0.5"
          style={{ animationDelay: "1550ms" }}
        >
          <span>{profile.collaborations.slice(0, 2).join(" · ")}</span>
          <span>{profile.location}</span>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 5 (z-30): MOBILE FOOTER CHROME (LINE CLEANLY ABOVE TEXT)
          The cream rule is placed directly above the text container
          with a generous margin so it NEVER crashes into or strikes
          through "Design Engineer".
          ───────────────────────────────────────────────────────────── */}
      <div
        className="anim-fade-up sm:hidden absolute inset-x-6 bottom-5 z-30 flex flex-col pointer-events-auto"
        style={{ animationDelay: "1400ms" }}
      >
        {/* Cream horizontal rule with clean margin above text */}
        <div
          className="w-full h-0.5 bg-cream mb-4 anim-line"
          style={{ animationDelay: "1200ms" }}
        />

        <div className="flex items-end justify-between text-[11px] leading-tight font-hn text-cream">
          <div className="flex flex-col font-light text-cream/90 space-y-1">
            <span className="font-semibold text-white tracking-wide">{profile.role}</span>
            {profile.subtitles.slice(0, 2).map((sub, i) => (
              <span key={i} className="text-cream/80">{sub}</span>
            ))}
          </div>

          <div className="flex flex-col text-right font-light text-cream/90 space-y-1">
            <span>{profile.collaborations.slice(0, 2).join(" · ")}</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
