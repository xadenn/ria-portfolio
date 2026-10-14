"use client";

import React, { useEffect, useRef, useState } from "react";

const row1Images = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

const row2Images = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Triple for seamless looping
  const tripledRow1 = [...row1Images, ...row1Images, ...row1Images];
  const tripledRow2 = [...row2Images, ...row2Images, ...row2Images];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-16 select-none"
      aria-label="Kinetic 3D Motion Reel"
    >
      {/* Section Header Title */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#D7E2EA]/40 block mb-3 font-kanit">
            Motion Archive
          </span>
          <h2 className="hero-heading font-black uppercase text-3xl sm:text-5xl lg:text-6xl font-kanit tracking-tight">
            Selected Motion Renders
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-kanit text-[#D7E2EA]/50 max-w-md">
          A continuous streaming tapestry of spatial interfaces, lighting studies, and generative simulations.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Row 1: Moves RIGHT on scroll */}
        <div className="overflow-hidden w-full flex">
          <div
            className="flex gap-3 w-max transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${scrollOffset - 300}px)`,
              willChange: "transform",
            }}
          >
            {tripledRow1.map((src, i) => (
              <div
                key={`r1-${i}`}
                className="w-[320px] sm:w-[420px] h-[200px] sm:h-[270px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#161616] border border-white/5 shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              >
                <img
                  src={src}
                  alt={`Motion Reel ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moves LEFT on scroll */}
        <div className="overflow-hidden w-full flex">
          <div
            className="flex gap-3 w-max transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${-(scrollOffset - 300)}px)`,
              willChange: "transform",
            }}
          >
            {tripledRow2.map((src, i) => (
              <div
                key={`r2-${i}`}
                className="w-[320px] sm:w-[420px] h-[200px] sm:h-[270px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#161616] border border-white/5 shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              >
                <img
                  src={src}
                  alt={`Motion Reel ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
