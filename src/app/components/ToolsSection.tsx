"use client";

import React, { useState, useRef } from "react";
import FadeIn from "./FadeIn";
import TiltCard from "./TiltCard";
import { Palette, Sparkle, Cpu, CaretDown, CaretUp } from "@phosphor-icons/react";
import { TextEffect } from "@/components/ui/text-effect";
import { usePortfolio } from "@/context/PortfolioContext";
import { useCenterSpotlight } from "@/lib/use-center-spotlight";
import { cn } from "@/lib/utils";

interface ToolItem {
  name: string;
  category: "Design & Prototyping" | "Engineering & Workflow";
  proficiency: string;
  desc: string;
}

const designTools: ToolItem[] = [
  {
    name: "Figma",
    category: "Design & Prototyping",
    proficiency: "Expert",
    desc: "Design Systems, Auto-layout, Interactive Prototypes",
  },
  {
    name: "Adobe XD",
    category: "Design & Prototyping",
    proficiency: "Advanced",
    desc: "User Journeys, Screen Flows & Component Architecture",
  },
  {
    name: "Sketch",
    category: "Design & Prototyping",
    proficiency: "Advanced",
    desc: "Vector Design & Mobile App Interface Toolkits",
  },
  {
    name: "Photoshop",
    category: "Design & Prototyping",
    proficiency: "Advanced",
    desc: "Digital Retouching, Compositing & Art Direction",
  },
  {
    name: "Illustrator",
    category: "Design & Prototyping",
    proficiency: "Advanced",
    desc: "Logomarks, Bespoke Monograms & Vector Systems",
  },
  {
    name: "InDesign",
    category: "Design & Prototyping",
    proficiency: "Advanced",
    desc: "Editorial Grid Systems, Typography & Print Publications",
  },
  {
    name: "CorelDRAW",
    category: "Design & Prototyping",
    proficiency: "Proficient",
    desc: "Vector Print Layouts & Large-scale Collateral",
  },
  {
    name: "Canva",
    category: "Design & Prototyping",
    proficiency: "Advanced",
    desc: "Rapid Social Prototypes & Visual Brand Guides",
  },
  {
    name: "Procreate",
    category: "Design & Prototyping",
    proficiency: "Proficient",
    desc: "Digital Illustration, Storyboarding & Textures",
  },
];

const devTools: ToolItem[] = [
  {
    name: "VS Code",
    category: "Engineering & Workflow",
    proficiency: "Advanced",
    desc: "Modern Frontend Web, Next.js & Interface Prototyping",
  },
  {
    name: "Git",
    category: "Engineering & Workflow",
    proficiency: "Advanced",
    desc: "Version Control, Branch Management & CI Deployment",
  },
  {
    name: "Notion",
    category: "Engineering & Workflow",
    proficiency: "Expert",
    desc: "Design Specifications, User Research & Knowledge Base",
  },
  {
    name: "Jira",
    category: "Engineering & Workflow",
    proficiency: "Advanced",
    desc: "Agile Sprint Planning, Storyboards & Design Handoff",
  },
];

/**
 * Unified Luxury Glass Card for Design & Spatial Systems
 * Integrated seamlessly into Ria Verma's portfolio design system:
 * - 3D Perspective Tilt via TiltCard with natural specular glare
 * - Frosted obsidian glass (bg-white/[0.03], border-white/10)
 * - Refined sapphire blue & amethyst purple edge caustics on hover / mobile center spotlight
 * - Razor-sharp top glass bevel sheen
 */
function DesignToolCard({ tool, isActive }: { tool: ToolItem; isActive?: boolean }) {
  return (
    <TiltCard maxAngle={6} className="h-full">
      <div
        className={cn(
          "relative h-full min-h-[148px] p-6 sm:p-7 rounded-[26px] bg-white/[0.03] border border-white/10 transition-all duration-500 flex flex-col justify-between group overflow-hidden",
          isActive
            ? "bg-white/[0.07] border-[#38BDF8]/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_-5px_rgba(56,189,248,0.28),0_0_30px_-5px_rgba(192,38,211,0.28)] scale-[1.02]"
            : "hover:bg-white/[0.06] hover:border-[#D7E2EA]/30 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_-5px_rgba(56,189,248,0.18),0_0_30px_-5px_rgba(192,38,211,0.18)]"
        )}
      >
        {/* Soft optical glass caustics (Sapphire Blue on bottom-left, Amethyst Purple on top-right) */}
        <div
          className={cn(
            "absolute -bottom-10 -left-10 w-44 h-44 rounded-full transition-opacity duration-700 pointer-events-none blur-2xl",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{ background: "radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute -top-10 -right-10 w-44 h-44 rounded-full transition-opacity duration-700 pointer-events-none blur-2xl",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{ background: "radial-gradient(circle, rgba(192, 38, 211, 0.28) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Top glass bevel specular highlight seam */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-colors duration-500",
            isActive ? "via-white/60" : "group-hover:via-white/40"
          )}
          aria-hidden="true"
        />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top: Sparkle Icon, Tool Title, and Frosted Glass Pill Badge */}
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "transition-all duration-300 transform",
                  isActive
                    ? "text-[#38BDF8] scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                    : "text-[#D7E2EA]/70 group-hover:text-[#38BDF8] group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                )}
              >
                <Sparkle size={18} weight="fill" />
              </span>
              <h4
                className={cn(
                  "text-lg sm:text-xl font-bold tracking-wide transition-colors font-kanit",
                  isActive ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "text-white group-hover:text-[#D7E2EA]"
                )}
              >
                {tool.name}
              </h4>
            </div>

            <span
              className={cn(
                "text-xs font-mono px-3 py-1 rounded-full border transition-all duration-300",
                isActive
                  ? "bg-white/[0.12] border-[#38BDF8]/40 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                  : "bg-white/[0.06] group-hover:bg-white/[0.1] border-white/10 group-hover:border-[#D7E2EA]/25 text-[#D7E2EA]/80 group-hover:text-white"
              )}
            >
              {tool.proficiency}
            </span>
          </div>

          {/* Bottom: Editorial Description */}
          <p
            className={cn(
              "text-xs sm:text-sm font-light leading-relaxed transition-colors duration-300",
              isActive ? "text-[#D7E2EA]" : "text-[#D7E2EA]/70 group-hover:text-[#D7E2EA]/90"
            )}
          >
            {tool.desc}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

/**
 * Unified Luxury Card for Engineering & Agile Collaboration
 */
function DevToolCard({ tool, isActive }: { tool: ToolItem; isActive?: boolean }) {
  return (
    <TiltCard maxAngle={6} className="h-full">
      <div
        className={cn(
          "relative h-full min-h-[145px] p-6 sm:p-7 rounded-[26px] bg-white/[0.03] border border-white/10 transition-all duration-500 flex flex-col justify-between group overflow-hidden",
          isActive
            ? "bg-white/[0.07] border-[#D7E2EA]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(215,226,234,0.15)] scale-[1.02]"
            : "hover:bg-white/[0.06] hover:border-[#D7E2EA]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
        )}
      >
        {/* Subtle corner specular highlight */}
        <div
          className={cn(
            "absolute -top-10 -right-10 w-36 h-36 rounded-full transition-opacity duration-700 pointer-events-none blur-2xl",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{ background: "radial-gradient(circle, rgba(215, 226, 234, 0.2) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <h4
              className={cn(
                "text-lg sm:text-xl font-bold tracking-wide transition-colors font-kanit",
                isActive ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "text-white group-hover:text-[#D7E2EA]"
              )}
            >
              {tool.name}
            </h4>
            <span
              className={cn(
                "text-xs font-mono px-3 py-1 rounded-full border transition-all duration-300",
                isActive
                  ? "bg-white/[0.12] border-white/30 text-white"
                  : "bg-white/[0.06] group-hover:bg-white/[0.1] border-white/10 group-hover:border-[#D7E2EA]/25 text-[#D7E2EA]/80 group-hover:text-white"
              )}
            >
              {tool.proficiency}
            </span>
          </div>
          <p
            className={cn(
              "text-xs sm:text-sm font-light leading-relaxed transition-colors duration-300",
              isActive ? "text-[#D7E2EA]" : "text-[#D7E2EA]/70 group-hover:text-[#D7E2EA]/90"
            )}
          >
            {tool.desc}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

export default function ToolsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { portfolio } = usePortfolio();
  const allTools = portfolio.tools;

  const [designLimit, setDesignLimit] = useState(5);
  const [devLimit, setDevLimit] = useState(5);

  const designTools = allTools.filter(
    (t) => t.category === "Design & Prototyping"
  );
  const devTools = allTools.filter(
    (t) => t.category === "Engineering & Workflow"
  );

  const visibleDesignTools = designTools.slice(0, designLimit);
  const visibleDevTools = devTools.slice(0, devLimit);

  const { containerRef: designGridRef, activeIndex: activeDesignIndex } =
    useCenterSpotlight(visibleDesignTools.length);
  const { containerRef: devGridRef, activeIndex: activeDevIndex } =
    useCenterSpotlight(visibleDevTools.length);

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 bg-[#0C0C0C] font-kanit text-[#D7E2EA] overflow-hidden"
      aria-label="Design Tools and Technical Capabilities"
    >
      {/* Ambient background glow - subtle neutral specular highlight */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.03] blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(215,226,234,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* Section Eyebrow & Title */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <FadeIn delay={0} y={25}>
            <span className="text-xs font-mono tracking-[0.25em] text-[#D7E2EA]/60 uppercase block mb-3">
              Technical Arsenal
            </span>
          </FadeIn>
          <FadeIn delay={0.1} y={30}>
            <TextEffect
              as="h2"
              per="char"
              preset="fade"
              className="hero-heading font-black uppercase text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none"
            >
              Tools & Stack
            </TextEffect>
          </FadeIn>
          <FadeIn delay={0.2} y={35}>
            <p className="text-[#D7E2EA]/70 text-sm sm:text-base max-w-xl mt-4 font-light leading-relaxed">
              Mastering industry-standard tools across the creative lifecycle &mdash; from abstract vector concept to high-density digital platform engineering.
            </p>
          </FadeIn>
        </div>

        {/* Category 1: Design & Spatial Systems (Hidden if 0 tools) */}
        {designTools.length > 0 && (
          <div className="mb-14 sm:mb-16">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <Palette size={20} weight="light" className="text-sky-400" />
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                Design &amp; Spatial Systems
              </h3>
              <span className="text-xs font-mono text-sky-300/60 ml-auto">
                {visibleDesignTools.length} of {designTools.length} Tools
              </span>
            </div>

            <div
              ref={designGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {visibleDesignTools.map((tool, index) => (
                <FadeIn key={tool.name} delay={0.03 * (index % 5)} y={20}>
                  <DesignToolCard
                    tool={tool}
                    isActive={activeDesignIndex === index}
                  />
                </FadeIn>
              ))}
            </div>

            {/* Load More Button for Design Tools (+5 cards at a time) */}
            {designTools.length > 5 && (
              <div className="flex justify-center mt-8">
                {designLimit < designTools.length ? (
                  <button
                    type="button"
                    onClick={() => setDesignLimit((prev) => prev + 5)}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono tracking-widest uppercase text-[#D7E2EA] bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/10 hover:border-[#38BDF8]/40 transition-all cursor-pointer group shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-95"
                  >
                    <span>Load More Tools (+{Math.min(5, designTools.length - designLimit)})</span>
                    <CaretDown size={14} weight="bold" className="text-[#38BDF8] group-hover:translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDesignLimit(5)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider text-[#D7E2EA]/60 hover:text-[#D7E2EA] bg-transparent border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Show Less</span>
                    <CaretUp size={14} weight="bold" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Category 2: Engineering & Agile Collaboration (Completely hidden if 0 tools) */}
        {devTools.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <Cpu size={20} weight="light" className="text-[#D7E2EA]/70" />
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                Engineering &amp; Agile Collaboration
              </h3>
              <span className="text-xs font-mono text-[#D7E2EA]/50 ml-auto">
                {visibleDevTools.length} of {devTools.length} Tools
              </span>
            </div>

            <div
              ref={devGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            >
              {visibleDevTools.map((tool, index) => (
                <FadeIn key={tool.name} delay={0.04 * (index % 5)} y={20}>
                  <DevToolCard
                    tool={tool}
                    isActive={activeDevIndex === index}
                  />
                </FadeIn>
              ))}
            </div>

            {/* Load More Button for Dev Tools (+5 cards at a time) */}
            {devTools.length > 5 && (
              <div className="flex justify-center mt-8">
                {devLimit < devTools.length ? (
                  <button
                    type="button"
                    onClick={() => setDevLimit((prev) => prev + 5)}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono tracking-widest uppercase text-[#D7E2EA] bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/10 hover:border-[#D7E2EA]/30 transition-all cursor-pointer group shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-95"
                  >
                    <span>Load More Tools (+{Math.min(5, devTools.length - devLimit)})</span>
                    <CaretDown size={14} weight="bold" className="text-[#D7E2EA] group-hover:translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDevLimit(5)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider text-[#D7E2EA]/60 hover:text-[#D7E2EA] bg-transparent border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Show Less</span>
                    <CaretUp size={14} weight="bold" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
