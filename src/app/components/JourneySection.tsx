"use client";

import React, { useRef } from "react";
import FadeIn from "./FadeIn";
import { usePortfolio } from "@/context/PortfolioContext";
import { TextEffect } from "@/components/ui/text-effect";
import { ArrowUpRight, Clock, Sparkle, DownloadSimple } from "@phosphor-icons/react";

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { portfolio } = usePortfolio();
  const journeyMilestones = portfolio.journey;
  const { profile } = portfolio;

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 bg-[#0C0C0C] font-kanit text-[#D7E2EA] overflow-hidden"
      aria-label="Design Journey and Career Milestones"
    >
      {/* Background ambient specular lighting */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 w-[700px] h-[500px] rounded-full opacity-[0.035] blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 w-[600px] h-[400px] rounded-full opacity-[0.025] blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(215,226,234,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <FadeIn delay={0} y={25}>
            <span className="text-xs font-mono tracking-[0.25em] text-[#D7E2EA]/75 uppercase block mb-3">
              Trajectory &amp; Chronology
            </span>
          </FadeIn>
          <FadeIn delay={0.1} y={30}>
            <TextEffect
              as="h2"
              per="char"
              preset="fade"
              className="hero-heading font-black uppercase text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none"
            >
              Design Journey
            </TextEffect>
          </FadeIn>
          <FadeIn delay={0.2} y={35}>
            <p className="text-[#D7E2EA]/85 text-sm sm:text-base max-w-xl mt-4 font-light leading-relaxed font-sans">
              Chronological milestones shaping user-centered platforms, quantitative interfaces, and brand systems across high-traffic digital products and creative leadership.
            </p>
          </FadeIn>
        </div>

        {/* Editorial Timeline Cascade */}
        <div className="relative border-t border-white/[0.08]">
          {journeyMilestones.map((item, index) => {
            const stepNum = index < 9 ? `0${index + 1}` : `${index + 1}`;
            return (
              <FadeIn key={item.id} delay={0.08 * index} y={20}>
                <article className="py-12 sm:py-16 border-b border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start group hover:bg-white/[0.015] px-2 sm:px-6 -mx-2 sm:-mx-6 rounded-3xl transition-all duration-300">
                  {/* Left Column: Index, Period & Company */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#A5B4FC] font-semibold tracking-widest">
                        [{stepNum}]
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/80 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
                        {item.period}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-kanit font-extrabold text-2xl sm:text-3xl text-white tracking-wide group-hover:text-cream transition-colors">
                        {item.company}
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-wider text-[#A5B4FC]/80 mt-1">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Narrative Summary & Highlights */}
                  <div className="lg:col-span-8 space-y-5">
                    <p className="font-sans text-sm sm:text-base text-[#D7E2EA]/85 font-light leading-relaxed">
                      {item.summary}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {item.highlights.map((h, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-start gap-3 font-sans text-xs sm:text-sm text-[#D7E2EA]/80 font-light leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A5B4FC] shrink-0 mt-2 shadow-[0_0_6px_rgba(165,180,252,0.8)]" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>

        {/* Bottom Resume Callout */}
        <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#A5B4FC] block mb-1">
              Curriculum Vitae
            </span>
            <h4 className="font-kanit text-xl sm:text-2xl font-bold text-white">
              Want to review the complete professional history?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#D7E2EA]/60 mt-1 font-light">
              Download the official verified PDF resume detailing technical tooling, honors, and impact.
            </p>
          </div>

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider bg-white text-black font-bold hover:bg-cream active:scale-95 transition-all shrink-0 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          >
            <DownloadSimple size={14} weight="bold" />
            <span>Download Resume PDF</span>
            <ArrowUpRight
              size={12}
              weight="bold"
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
