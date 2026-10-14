"use client";

import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";

const CURATED_IMAGES: TiltedGridImage[] = [
  {
    src: "/images/project-maison.jpg",
    alt: "Maison Lumière Couture Identity",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    alt: "Liquid iridescent fluid motion",
  },
  {
    src: "/images/project-flux.jpg",
    alt: "Flux Spatial Holographic Lab",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Brutalist architectural monolith",
  },
  {
    src: "/images/project-ether.jpg",
    alt: "Ether Motion Raytraced Sculpture",
  },
  {
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    alt: "Minimalist neon horizon",
  },
  {
    src: "/images/project-veil.jpg",
    alt: "Veil Editorial Ribbon Monologue",
  },
  {
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern tactile oil art study",
  },
  {
    src: "/images/about-world.jpg",
    alt: "Ria Visual Archive & Scenography",
  },
  {
    src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    alt: "Prismatic geometric refraction",
  },
];

export default function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero
      images={CURATED_IMAGES}
      className="h-[560px] w-full rounded-2xl border border-white/10 bg-[#07070d]"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
        <div className="px-6">
          <h1 className="text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Every frame,
            <br />
            brought into focus.
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-white/50">
          Images curve in from one edge, flatten out at the centre, then fade
          away round the other.
        </p>
      </div>
    </TiltedGridHero>
  );
}
