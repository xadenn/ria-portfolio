"use client";

import React from "react";
import {
  PortfolioScrollGrid,
  type PortfolioScrollGridImage,
} from "@/components/ui/portfolio-scroll-grid";

// High-aesthetic curated editorial, spatial systems, 3D motion, and architectural visuals
const CONTACT_GRID_IMAGES: PortfolioScrollGridImage[] = [
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    alt: "Abstract dark obsidian fluid sculpture",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    alt: "Modernist spatial pavilion architecture",
  },
  {
    src: "/images/spatial_ui_system_1791812450572.jpg",
    alt: "Spatial UI design system architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    alt: "High fashion editorial fine art",
  },
  {
    src: "/images/fashion_brand_editorial_1791812428673.jpg",
    alt: "Maison editorial fashion direction",
  },
  {
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
    alt: "Iridescent prismatic glass caustics",
  },
  {
    src: "/images/motion_sculpture_render_1791812470081.jpg",
    alt: "3D kinetic motion sculpture",
  },
  {
    src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    alt: "Minimalist spatial geometry and shadow study",
  },
  {
    src: "/images/veil_editorial_art_1791812491385.jpg",
    alt: "Veil experimental generative canvas",
  },
  {
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1000&q=80",
    alt: "Spatial lighting installation and neon horizon",
  },
  {
    src: "/images/project-ether.jpg",
    alt: "Project Ether decentralized spatial interface",
  },
  {
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
    alt: "Chromatic wave dispersion and kinetic flow",
  },
];

export default function ContactTransitionSection() {
  return (
    <div
      id="contact-reel"
      className="relative w-full overflow-clip bg-[#0C0C0C] font-kanit text-[#D7E2EA]"
      aria-label="Contact Portfolio Reel"
    >
      <PortfolioScrollGrid
        title={
          <span className="flex flex-col items-center justify-center">
            <span className="text-[0.24em] font-mono tracking-[0.35em] text-[#D7E2EA]/50 uppercase mb-2 select-none">
              Initiate Collaboration
            </span>
            <span className="font-kanit font-black tracking-tight text-[#D7E2EA] drop-shadow-[0_12px_48px_rgba(0,0,0,0.95)]">
              GET IN TOUCH
            </span>
          </span>
        }
        images={CONTACT_GRID_IMAGES}
        rows={8}
        className="bg-[#0C0C0C]"
      />
    </div>
  );
}
