"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "./FadeIn";
import ContactButton from "./ContactButton";
import { usePortfolio } from "@/context/PortfolioContext";
import { TextEffect } from "@/components/ui/text-effect";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const { portfolio } = usePortfolio();
  const aboutText = portfolio.profile.aboutText;
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const pinnedViewportRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Pin section until the character-by-character text animation is fully completed
  useEffect(() => {
    const pinTrack = pinTrackRef.current;
    const pinnedViewport = pinnedViewportRef.current;
    if (!pinTrack || !pinnedViewport) return;

    const total = charRefs.current.length;

    const st = ScrollTrigger.create({
      trigger: pinTrack,
      pin: pinnedViewport,
      start: "top top",
      end: "bottom bottom",
      scrub: isMobile ? 0.3 : 0.5,
      anticipatePin: isMobile ? 0 : 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Text animation completes smoothly
        const leadIn = 0.04;
        const revealEnd = isMobile ? 0.55 : 0.65;
        const animT = Math.max(0, Math.min(1, (p - leadIn) / (revealEnd - leadIn)));

        for (let i = 0; i < total; i++) {
          const el = charRefs.current[i];
          if (!el) continue;
          const charStart = i / total;
          const charEnd = Math.min(1, charStart + 0.035);
          if (animT <= charStart) {
            el.style.opacity = "0.2";
          } else if (animT >= charEnd) {
            el.style.opacity = "1";
          } else {
            const localT = (animT - charStart) / (charEnd - charStart);
            el.style.opacity = String(0.2 + 0.8 * localT);
          }
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [aboutText, isMobile]);

  const characters = aboutText.split("");

  return (
    <section
      id="about"
      ref={pinTrackRef}
      className="relative w-full bg-[#0C0C0C]"
      style={{ height: isMobile ? "140vh" : "280vh" }}
      aria-label="About Ria Verma"
    >
      {/* Pinned Fullscreen Stage: Stays in place until text animation completes */}
      <div
        ref={pinnedViewportRef}
        className="w-full h-screen h-[100dvh] overflow-hidden relative flex flex-col items-center justify-center px-6 sm:px-12 md:px-16 bg-[#0C0C0C] font-kanit text-[#D7E2EA] select-none"
      >
        {/* ─────────────────────────────────────────────────────────────
            FOUR 3D DECORATIVE ARTIFACTS IN THE EXACT FOUR CORNERS
            Persistent atmospheric background placement: z-0 in physical corners
            Mobile: top/bottom-3 left/right-3, w-[68px]
            Tablet/Desktop: top/bottom-6 lg:top/bottom-8, w-[120px] lg:w-[165px] xl:w-[200px]
            ───────────────────────────────────────────────────────────── */}
        {/* Top-left: Moon icon */}
        <div
          className="absolute pointer-events-none z-0 top-3 left-3 sm:top-6 sm:left-6 md:top-8 md:left-8"
          aria-hidden="true"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt=""
            width={240}
            height={240}
            className="w-[68px] sm:w-[95px] md:w-[130px] lg:w-[165px] xl:w-[200px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] animate-pulse [animation-duration:8s]"
            draggable={false}
          />
        </div>

        {/* Top-right: Lego icon */}
        <div
          className="absolute pointer-events-none z-0 top-3 right-3 sm:top-6 sm:right-6 md:top-8 md:right-8"
          aria-hidden="true"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt=""
            width={240}
            height={240}
            className="w-[68px] sm:w-[95px] md:w-[130px] lg:w-[165px] xl:w-[200px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] animate-pulse [animation-duration:7s]"
            draggable={false}
          />
        </div>

        {/* Bottom-left: Smiley face */}
        <div
          className="absolute pointer-events-none z-0 bottom-3 left-3 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8"
          aria-hidden="true"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt=""
            width={220}
            height={220}
            className="w-[62px] sm:w-[88px] md:w-[120px] lg:w-[155px] xl:w-[185px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] animate-pulse [animation-duration:9s]"
            draggable={false}
          />
        </div>

        {/* Bottom-right: 3D cursor arrow */}
        <div
          className="absolute pointer-events-none z-0 bottom-3 right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8"
          aria-hidden="true"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt=""
            width={240}
            height={240}
            className="w-[68px] sm:w-[95px] md:w-[130px] lg:w-[165px] xl:w-[200px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] animate-pulse [animation-duration:8.5s]"
            draggable={false}
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            EXPANSIVE CENTER COLUMN: FILLS THE SCREEN WITH BREATHING ROOM
            ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl lg:max-w-6xl w-full mx-auto my-auto px-4">
          {/* Bold Display Heading */}
          <FadeIn delay={0} y={30} duration={0.8}>
            <TextEffect
              as="h2"
              per="char"
              preset="fade"
              className="hero-heading font-black uppercase leading-none tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem]"
            >
              About me
            </TextEffect>
          </FadeIn>

          {/* Dynamic Gap */}
          <div className="h-4 sm:h-12 md:h-14" />

          {/* Character-by-Character Pinned Scroll Animated Text (Expansive Width) */}
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 sm:px-6">
            <p className="text-[#D7E2EA] font-medium leading-relaxed md:leading-[1.7] text-base sm:text-xl md:text-2xl lg:text-[1.4rem] text-center">
              {characters.map((char, i) => (
                <span
                  key={i}
                  ref={(node) => {
                    charRefs.current[i] = node;
                  }}
                  className="inline"
                  style={{ opacity: 0.2 }}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>

          {/* Collaborator badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-8">
            {portfolio.profile.collaborations.map((company) => (
              <span
                key={company}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-mono tracking-wider text-[#D7E2EA]/85 bg-white/[0.04] border border-[#D7E2EA]/20 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7E2EA]/70" />
                {company}
              </span>
            ))}
          </div>

          {/* Dynamic Gap */}
          <div className="h-4 sm:h-12 md:h-14" />

          {/* Dual Action: Contact Me & See Journey (Side-by-side on mobile & desktop) */}
          <FadeIn
            delay={0.2}
            y={20}
            duration={0.8}
            className="relative z-30 flex flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-sm sm:max-w-none px-2"
          >
            <ContactButton
              label="Contact Me"
              href="#contact"
              className="px-5 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm md:text-base shrink-0"
            />
            <a
              href="#journey"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base font-medium text-[#D7E2EA] bg-white/[0.05] hover:bg-white/[0.12] border border-[#D7E2EA]/20 transition-all duration-300 min-h-[44px] shrink-0 whitespace-nowrap"
            >
              <span>See Journey</span>
              <span className="text-[#D7E2EA]/70">→</span>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
