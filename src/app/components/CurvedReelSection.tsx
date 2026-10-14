"use client";

import React from "react";
import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import { ArrowUpRight, Eye } from "@phosphor-icons/react";
import { useToast } from "./Toast";
import { TextEffect } from "@/components/ui/text-effect";

const CDN = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev";

const IMAGES: TiltedGridImage[] = [
  {
    src: `${CDN}/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg`,
    alt: "Diver silhouetted inside a sunset seascape shaped like a profile",
  },
  {
    src: `${CDN}/gradients/hero_gradient/hero-gradients-01.png`,
    alt: "Soft multi-tone gradient wash",
  },
  {
    src: `${CDN}/stock-images/821d815affa6496c39cbdeeec7a84603.jpg`,
    alt: "Double-exposure portrait blended with a city skyline at dusk",
  },
  {
    src: `${CDN}/gradients/moon/moon-grade-03.png`,
    alt: "Moon-toned gradient",
  },
  {
    src: `${CDN}/stock-images/937438c560ada1c83317f2c11b3454b0.jpg`,
    alt: "Motion-blurred side-profile portrait against a deep orange backdrop",
  },
  {
    src: `${CDN}/gradients/shade_shiters/shade-shifters-05.png`,
    alt: "Shifting shade gradient",
  },
  {
    src: `${CDN}/stock-images/98f89cb9994f5c382ab964062c4039db.jpg`,
    alt: "Figure holding a racket that dissolves into a swirling colourful cloud",
  },
  {
    src: `${CDN}/gradients/shade_shiters/shade-shifters-09.png`,
    alt: "Shifting shade gradient",
  },
  {
    src: `${CDN}/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg`,
    alt: "Hand gesture with a colourful cutout of a bird flying through the fingers",
  },
  {
    src: `${CDN}/gradients/moon/moon-grade-06.png`,
    alt: "Moon-toned gradient",
  },
];

import { usePortfolio } from "@/context/PortfolioContext";

export default function CurvedReelSection() {
  const { portfolio } = usePortfolio();
  const { showToast } = useToast();

  const images: TiltedGridImage[] = portfolio.designs.map((d) => ({
    src: d.src,
    alt: d.alt,
  }));

  return (
    <section
      id="designs"
      className="relative w-full py-24 lg:py-36 overflow-hidden font-kanit text-[#D7E2EA] bg-[#0C0C0C]"
      aria-label="Cinematic Designs Archive"
    >
      {/* Top & bottom edge blend gradients into #0C0C0C */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0C0C0C] via-[#0C0C0C]/85 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/85 to-transparent z-20" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header: Matching MarqueeSection layout & typography */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#D7E2EA]/75 block mb-3 font-kanit">
              Visual Archive
            </span>
            <TextEffect
              as="h2"
              per="char"
              preset="fade"
              className="hero-heading font-black uppercase text-3xl sm:text-5xl lg:text-6xl font-kanit tracking-tight"
            >
              Designs
            </TextEffect>
          </div>
          <p className="text-xs sm:text-sm font-kanit text-[#D7E2EA]/75 max-w-md leading-relaxed">
            A curated visual continuum of spatial artifacts, lighting architectures, and brand scenography.
          </p>
        </div>

        {/* TiltedGridHero Container with official 560px+ height and cylinder arc */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0C0C0C]/50 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <TiltedGridHero
            images={images.length > 0 ? images : IMAGES}
            speed={4}
            tileHeight={26}
            aspectRatio={16 / 9}
            gap={6}
            axis={56}
            curve={80}
            fade={12}
            className="h-[560px] sm:h-[600px] lg:h-[640px] w-full bg-transparent"
          >
            {/* Center Overlay Content inside the cylinder band */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center pointer-events-none">
              <div className="px-6">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D7E2EA]/75 block mb-3">
                  Spatial Continuum
                </span>
                <h3 className="text-balance text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                  Every frame,
                  <br />
                  brought into focus.
                </h3>
              </div>
              <p className="max-w-md text-balance px-6 text-xs sm:text-sm text-[#D7E2EA]/85 font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                Images curve in from one edge, flatten out at the centre, then fade away round the other.
              </p>
            </div>
          </TiltedGridHero>
        </div>

        {/* Editorial Statement & Actions: Cleanly positioned BELOW the reel */}
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-8 border-t border-[#D7E2EA]/10 font-kanit">
          <div className="max-w-2xl">
            <h3 className="hero-heading font-black uppercase text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              Where spatial form meets kinetic precision.
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#D7E2EA]/75 font-light leading-relaxed">
              Images stream along a 16-facet cylindrical arc, flattening as they greet the focal lens and bending smoothly past the perimeter.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => showToast("Curated Designs Archive Expanded", "sparkle")}
              className="px-6 py-3 rounded-full border border-[#D7E2EA]/20 bg-white/[0.04] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] text-[#D7E2EA] text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-2.5 cursor-pointer group shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            >
              <Eye size={16} weight="bold" className="text-[#D7E2EA]/75 group-hover:text-[#0C0C0C] transition-colors" />
              <span>Inspect Designs</span>
              <ArrowUpRight size={16} weight="bold" className="opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
