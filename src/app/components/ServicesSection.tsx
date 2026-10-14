"use client";

import React from "react";
import FadeIn from "./FadeIn";
import { usePortfolio } from "@/context/PortfolioContext";
import { TextEffect } from "@/components/ui/text-effect";

import { useCenterSpotlight } from "@/lib/use-center-spotlight";
import { cn } from "@/lib/utils";

export default function ServicesSection() {
  const { portfolio } = usePortfolio();
  const services = portfolio.services;
  const { containerRef, activeIndex } = useCenterSpotlight(services.length);

  return (
    <section
      id="services"
      className="relative w-full bg-[#0C0C0C] text-[#D7E2EA] font-kanit px-5 sm:px-8 md:px-10 py-24 sm:py-32 md:py-40 select-none z-10"
      aria-label="Services"
    >
      {/* Subtle edge blend gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Eyebrow + Massive Centered Heading */}
        <FadeIn delay={0} y={40} duration={0.8} className="text-center mb-16 sm:mb-20 md:mb-28">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#D7E2EA]/75 block mb-4 font-kanit">
            Capabilities &amp; Discipline
          </span>
          <TextEffect
            as="h2"
            per="char"
            preset="fade"
            className="hero-heading font-black uppercase text-[clamp(3rem,12vw,160px)] leading-none tracking-tight"
          >
            Services
          </TextEffect>
        </FadeIn>

        {/* 5 Service Items List with Center-Scroll Spotlight */}
        <div ref={containerRef} className="border-t border-[#D7E2EA]/15">
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={service.number}
                className={cn(
                  "group border-b border-[#D7E2EA]/15 py-8 sm:py-10 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 transition-all duration-500 px-4 sm:px-6 rounded-2xl",
                  isActive
                    ? "bg-white/[0.05] border-[#D7E2EA]/35 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(215,226,234,0.08)]"
                    : "hover:bg-white/[0.02]"
                )}
              >
                {/* Left: Giant Number */}
                <div className="flex-shrink-0">
                  <span
                    className={cn(
                      "font-black text-[clamp(3rem,10vw,140px)] leading-none select-none tracking-tighter transition-all duration-500",
                      isActive
                        ? "text-[#D7E2EA] drop-shadow-[0_0_30px_rgba(215,226,234,0.45)]"
                        : "text-[#D7E2EA]/20 group-hover:text-[#D7E2EA]/70"
                    )}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Right: Stacked Name + Description */}
                <div className="flex flex-col gap-2.5 max-w-2xl md:text-left">
                  <h3
                    className={cn(
                      "font-medium uppercase text-[clamp(1.15rem,2.2vw,2.1rem)] tracking-wide transition-colors duration-500",
                      isActive
                        ? "text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.35)]"
                        : "text-[#D7E2EA] group-hover:text-white"
                    )}
                  >
                    {service.name}
                  </h3>
                  <p
                    className={cn(
                      "font-light leading-relaxed text-[clamp(0.85rem,1.6vw,1.25rem)] transition-colors duration-500",
                      isActive ? "text-white/95" : "text-[#D7E2EA]/80"
                    )}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
