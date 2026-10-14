"use client";

import React, { useRef } from "react";
import FadeIn from "./FadeIn";
import TiltCard from "./TiltCard";
import { Trophy, Medal, Crown, UsersThree, Sparkle, ArrowUpRight } from "@phosphor-icons/react";
import { usePortfolio } from "@/context/PortfolioContext";
import { TextEffect } from "@/components/ui/text-effect";

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { portfolio } = usePortfolio();
  const achievements = portfolio.achievements;

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 bg-[#0C0C0C] font-kanit text-[#D7E2EA] overflow-hidden"
      aria-label="Honors and Key Achievements"
    >
      {/* Background ambient lighting - subtle neutral specular wash */}
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[600px] h-[400px] rounded-full opacity-[0.03] blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(215,226,234,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <FadeIn delay={0} y={25}>
            <span className="text-xs font-mono tracking-[0.25em] text-[#D7E2EA]/75 uppercase block mb-3">
              Recognition &amp; Impact
            </span>
          </FadeIn>
          <FadeIn delay={0.1} y={30}>
            <TextEffect
              as="h2"
              per="char"
              preset="fade"
              className="hero-heading font-black uppercase text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none"
            >
              Achievements
            </TextEffect>
          </FadeIn>
          <FadeIn delay={0.2} y={35}>
            <p className="text-[#D7E2EA]/85 text-sm sm:text-base max-w-xl mt-4 font-light leading-relaxed">
              Proven track record of competitive excellence, team mentorship, and organizational leadership across design fests, hackathons, and institutional clubs.
            </p>
          </FadeIn>
        </div>

        {/* 4 Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {achievements.map((item, index) => (
            <FadeIn key={item.id} delay={0.1 * index} y={25}>
              <TiltCard maxAngle={6} className="h-full">
                <div className="relative h-full p-8 sm:p-10 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-[#D7E2EA]/30 transition-all duration-500 flex flex-col justify-between group overflow-hidden">
                  {/* Subtle corner specular highlight */}
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-2xl"
                    style={{ background: "radial-gradient(circle, rgba(215,226,234,0.2) 0%, transparent 70%)" }}
                    aria-hidden="true"
                  />

                  <div>
                    {/* Top Row: Metric & Tag */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="text-5xl sm:text-6xl font-black tracking-tight text-white group-hover:text-[#D7E2EA] transition-colors leading-none font-kanit">
                        {item.metric}
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[#D7E2EA]/85 uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>

                    {/* Title & Organization */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2 group-hover:translate-x-0.5 transition-transform">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-[#D7E2EA]/75 uppercase tracking-widest mb-4">
                      {item.organization}
                    </p>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-[#D7E2EA]/85 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom ornament */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#D7E2EA]/70">
                    <span>Verified Milestone #{item.id}</span>
                    <span className="text-[#D7E2EA]/85 flex items-center gap-1 group-hover:text-white transition-colors">
                      <Sparkle size={14} weight="fill" />
                      Excellence
                    </span>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
