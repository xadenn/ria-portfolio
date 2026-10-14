"use client";

import React from "react";
import FadeIn from "./FadeIn";
import { usePortfolio } from "@/context/PortfolioContext";
import { TextEffect } from "@/components/ui/text-effect";

export default function ServicesSection() {
  const { portfolio } = usePortfolio();
  const services = portfolio.services;

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

        {/* 5 Service Items List */}
        <div className="border-t border-[#D7E2EA]/15">
          {services.map((service, index) => (
            <FadeIn
              key={service.number}
              delay={index * 0.1}
              y={30}
              duration={0.7}
              className="group border-b border-[#D7E2EA]/15 py-8 sm:py-10 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 transition-all duration-300 hover:bg-white/[0.02] px-4 sm:px-6 rounded-2xl"
            >
              {/* Left: Giant Number */}
              <div className="flex-shrink-0">
                <span className="font-black text-[#D7E2EA]/20 group-hover:text-[#D7E2EA]/70 text-[clamp(3rem,10vw,140px)] leading-none select-none tracking-tighter transition-colors duration-300">
                  {service.number}
                </span>
              </div>

              {/* Right: Stacked Name + Description */}
              <div className="flex flex-col gap-2.5 max-w-2xl md:text-left">
                <h3 className="font-medium uppercase text-[#D7E2EA] group-hover:text-white text-[clamp(1.15rem,2.2vw,2.1rem)] tracking-wide transition-colors">
                  {service.name}
                </h3>
                <p className="font-light text-[#D7E2EA]/80 leading-relaxed text-[clamp(0.85rem,1.6vw,1.25rem)]">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
