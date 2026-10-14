"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight, X, Sparkle } from "@phosphor-icons/react";
import TiltCard from "./TiltCard";
import { useToast } from "./Toast";
import {
  WorksWheel,
  type WorksWheelItem,
  type WorksWheelRef,
} from "@/components/ui/works-wheel";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  description: string;
  metrics: string;
  deliverables: string[];
  url?: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Cosmic Tools",
    client: "Cosmic Tools Platform",
    category: "UI/UX & Platform Design",
    year: "2024",
    image: "/projects/neon-place/img-14.png",
    description:
      "Cosmic Tools is a platform that offers group-buy services for premium SEO, AI, and design tools such as Semrush, Canva, and ChatGPT. Engineered high-converting user onboarding, frictionless checkout, and instant credential management.",
    metrics: "Live Platform at cosmictools.in · Group-Buy Marketplace",
    deliverables: ["Product UI/UX", "Group-Buy Architecture", "Design System", "Search & Discovery"],
    url: "https://cosmictools.in",
  },
  {
    id: "02",
    title: "Hideout Cafe",
    client: "Hideout Artisanal Cafe",
    category: "Brand Design",
    year: "2024",
    image: "/cases/cafe.png",
    description:
      "A complete brand identity and spatial visual ecosystem for Hideout Cafe. Merging minimalist typographic contrast with warm hospitality touchpoints, packaging, and interior menu systems.",
    metrics: "Complete Brand Identity Launch · Physical & Digital",
    deliverables: ["Brand Identity", "Packaging Design", "Spatial Signage", "Menu Architecture"],
    url: "https://behance.net/riaverma-here",
  },
  {
    id: "03",
    title: "Reflect Orbital",
    client: "Reflect Orbital Systems",
    category: "UX Research & UI Design",
    year: "2024",
    image: "/cases/reflect.png",
    description:
      "Comprehensive UX research and telemetry interface design for orbital solar reflection systems. Streamlined complex orbital parameters and sunlight scheduling into an intuitive, low-cognitive-load mission dashboard.",
    metrics: "Deep UX Field Study · Mission Control Telemetry",
    deliverables: ["UX Research", "Telemetry UI", "Interaction Design", "Cognitive Load Mapping"],
    url: "https://behance.net/riaverma-here",
  },
  {
    id: "04",
    title: "Moving On",
    client: "Moving On Publication",
    category: "Editorial Design",
    year: "2023",
    image: "/cases/moving-on.png",
    description:
      "Experimental editorial publication exploring human transitions, typographic pacing, and asymmetric negative space. Curated a tactile, rhythm-driven reading journey spanning print and digital mediums.",
    metrics: "Curated Print & Digital Editorial Series",
    deliverables: ["Editorial Layout", "Typography Direction", "Print Scenography", "Digital Translation"],
    url: "https://behance.net/riaverma-here",
  },
  {
    id: "05",
    title: "Quantabase",
    client: "Quantabase Intelligence",
    category: "UI/UX & Data Systems",
    year: "2024",
    image: "/images/project-flux.jpg",
    description:
      "Collaborative digital interface design for quantitative analytics and algorithmic trading models. Engineered dense telemetry visualizations and component systems optimized for fast, scalable execution.",
    metrics: "Enterprise Quant Workflow Platform",
    deliverables: ["Analytics Dashboard", "High-Density Data Grids", "Design System", "Interactive Telemetry"],
    url: "https://behance.net/riaverma-here",
  },
  {
    id: "06",
    title: "ArcVisionX",
    client: "ArcVisionX Labs",
    category: "Spatial UI & Vision Tech",
    year: "2023",
    image: "/images/project-ether.jpg",
    description:
      "Futuristic vision AI branding and spatial user interface system. Built responsive multi-viewport layouts and interactive 3D inspection components for computer vision applications.",
    metrics: "Computer Vision Innovation System",
    deliverables: ["Spatial UI Kit", "Brand Guidelines", "Interactive 3D Preview", "Multi-Viewport Layout"],
    url: "https://behance.net/riaverma-here",
  },
  {
    id: "07",
    title: "Internify",
    client: "Internify Talent Network",
    category: "Product Interface",
    year: "2023",
    image: "/images/project-maison.jpg",
    description:
      "Next-generation hiring and career accelerator platform matching emerging design and engineering talent with high-growth startups through frictionless search and profile discovery.",
    metrics: "Scalable Talent Ecosystem Platform",
    deliverables: ["Talent Portal UX", "Recruiter Dashboard", "Design Tokens", "Onboarding Flows"],
    url: "https://behance.net/riaverma-here",
  },
];

import { usePortfolio } from "@/context/PortfolioContext";

export default function WorkSection() {
  const { portfolio } = usePortfolio();
  const projects = portfolio.projects;

  const wheelItems: WorksWheelItem[] = projects.map((p) => ({
    title: p.title,
    image: p.image,
    href: `#project-${p.id}`,
    category: p.category,
    client: p.client,
    year: p.year,
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const pinnedViewportRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<WorksWheelRef>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { showToast } = useToast();
  const reduce = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Pinning and Scroll-Driven 3D Wheel Sequence
  useEffect(() => {
    const pinTrack = pinTrackRef.current;
    const pinnedViewport = pinnedViewportRef.current;
    if (!pinTrack || !pinnedViewport) return;

    const totalTurns = wheelItems.length;

    // Pin full-screen until all works are scrolled through
    const st = ScrollTrigger.create({
      trigger: pinTrack,
      pin: pinnedViewport,
      start: "top top",
      end: "bottom bottom",
      scrub: isMobile ? 0.35 : 0.12,
      anticipatePin: isMobile ? 0 : 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Continuous, silky smooth Hermite curve
        if (p <= 0.03) {
          wheelRef.current?.to(0);
        } else if (p >= 0.97) {
          wheelRef.current?.to(totalTurns);
        } else {
          const t = (p - 0.03) / 0.94;
          const smoothT = t * t * (3 - 2 * t);
          wheelRef.current?.to(smoothT * totalTurns);
        }
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [wheelItems.length, isMobile]);

  const handleOpenModal = (p: Project) => {
    setSelectedProject(p);
    setIsModalClosing(false);
    showToast(`Viewing ${p.title} Archive`, "sparkle");
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsModalClosing(false);
    }, 150); // Matches --modal-close-dur
  };

  // Keyboard accessibility: dismiss modal on Escape key
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const handleScrollToItem = (idx: number) => {
    if (!scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    const totalTurn = wheelItems.length + 1;
    const targetProgress = (idx + 1) / totalTurn;
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    if (
      typeof window !== "undefined" &&
      (window as unknown as { lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void } }).lenis
    ) {
      (window as unknown as { lenis: { scrollTo: (t: number, o?: { duration?: number }) => void } }).lenis.scrollTo(
        targetScroll,
        { duration: 1.2 }
      );
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full"
      aria-label="Selected work"
    >
      {/* ─────────────────────────────────────────────────────────────
          IMMERSIVE FULL-SCREEN 3D DRUM WHEEL
          Zero container boundaries. Pinned full screen as you scroll.
          Turns through all pieces before releasing to the next section.
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={pinTrackRef}
        className="relative w-full"
        style={{ height: `${(wheelItems.length + 1) * (isMobile ? 48 : 85)}vh` }}
      >
        {/* Pinned Fullscreen Stage */}
        <div
          ref={pinnedViewportRef}
          className="w-full h-screen h-[100dvh] overflow-hidden relative flex flex-col justify-between bg-[#0C0C0C]"
        >
          {/* Seamless edge blend gradients into #0C0C0C */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0C0C0C] via-[#0C0C0C]/70 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/70 to-transparent z-10" />

          {/* Pure Full-Bleed 3D WorksWheel (Circular Ring -> 3D Drum Wheel) */}
          <WorksWheel
            ref={wheelRef}
            items={wheelItems}
            label="Selected Works"
            action="Inspect"
            disableInternalWheel={true}
            showIndex={false}
            showTitle={true}
            showLabel={true}
            onCardClick={(item, idx) => {
              const found =
                projects.find((p) => p.title.toLowerCase() === item.title.toLowerCase()) ||
                projects[idx % projects.length];
              handleOpenModal(found);
            }}
            onIndexClick={(idx) => {
              handleScrollToItem(idx);
            }}
            className="w-full h-full"
          />
        </div>
    </div>

      {/* Case Study Modal with Open/Close Asymmetry */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10"
          style={{ background: "rgba(5,5,5,0.92)", backdropFilter: "blur(24px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={handleCloseModal}
        >
          <div
            className={`t-modal ${isModalClosing ? "is-closing" : "is-open"} relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/15 bg-[#0a0a10] p-8 lg:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)]`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <X size={20} weight="light" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <TiltCard maxAngle={8} className="w-full">
                <div className="relative w-full aspect-4/3 rounded-[20px] overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </TiltCard>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cream/60 block mb-2">
                  {selectedProject.category} · {selectedProject.year}
                </span>
                <h3 id="modal-title" className="display-medium text-cream mb-2 font-hn">
                  {selectedProject.title}
                </h3>
                <p className="text-cream/40 text-sm font-mono mb-6">
                  Client: {selectedProject.client}
                </p>

                <p className="text-cream/80 text-base leading-relaxed mb-6 font-hn">
                  {selectedProject.description}
                </p>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-cream/10 mb-6 flex items-center gap-3">
                  <Sparkle size={18} weight="fill" className="text-cream/70 shrink-0" />
                  <span className="text-xs font-mono text-cream/80">
                    {selectedProject.metrics}
                  </span>
                </div>

                <div className="mb-8">
                  <span className="text-xs uppercase tracking-wider text-white/30 font-mono block mb-3">
                    Deliverables
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.deliverables.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full border border-white/10 text-white/60 text-xs font-mono"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {selectedProject.url && (
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 justify-center cursor-pointer min-h-[44px] flex items-center gap-2"
                    >
                      <span>View Live Project</span>
                      <ArrowUpRight size={18} weight="bold" />
                    </a>
                  )}
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-6 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white transition-all text-sm font-medium flex items-center justify-center cursor-pointer min-h-[44px]"
                  >
                    Dismiss Case Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
