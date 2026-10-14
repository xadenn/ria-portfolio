"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkle, DownloadSimple, ArrowUpRight, CheckCircle } from "@phosphor-icons/react";

interface JourneyMilestone {
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
}

const journeyMilestones: JourneyMilestone[] = [
  {
    period: "2024 — Present",
    role: "UI/UX & Platform Designer",
    company: "Cosmic Tools",
    summary:
      "Spearheaded end-to-end interface architecture for a high-traffic platform offering group-buy access to premier SEO, AI, and design tools such as Semrush, Canva, and ChatGPT.",
    highlights: [
      "Engineered high-converting onboarding and checkout workflows",
      "Designed instant credential delivery and search discovery systems",
      "Built resilient, responsive component library for digital tooling",
    ],
  },
  {
    period: "2024",
    role: "Digital Interface Designer",
    company: "Quantabase",
    summary:
      "Collaborated on designing fast, high-quality, and scalable digital interfaces for quantitative financial models and automated strategy execution.",
    highlights: [
      "Crafted high-density data grids and telemetry visualization dashboards",
      "Standardized design tokens for rapid cross-platform developer handoff",
      "Streamlined complex quantitative inputs into accessible user workflows",
    ],
  },
  {
    period: "2023 — 2024",
    role: "Brand & Spatial UI Designer",
    company: "ArcVisionX",
    summary:
      "Crafted visionary brand identity systems and futuristic user interfaces for edge computer vision and spatial visual intelligence software.",
    highlights: [
      "Designed dark-mode visual technology branding and spatial typography",
      "Built multi-viewport computer vision inspection interface layouts",
      "Developed interactive prototypes for investor and enterprise demos",
    ],
  },
  {
    period: "2023",
    role: "Product Designer",
    company: "Internify",
    summary:
      "Designed user-centered web and mobile experiences connecting ambitious students and tech talent with forward-thinking startup teams.",
    highlights: [
      "Mapped frictionless applicant discovery and recruiter review journeys",
      "Redesigned profile verification and talent matching interfaces",
      "Reduced candidate drop-off with clear, accessible onboarding UX",
    ],
  },
  {
    period: "2022 — 2024",
    role: "Head of Design Team & Secretary",
    company: "Kristu Jayanti University",
    summary:
      "Directed the institutional student design team and served as official secretary for the Department of Computer Science departmental club.",
    highlights: [
      "Won 11+ trophies in inter & intra-college IT fests for creative events",
      "Secured 1st place in 3 competitive 24-48hr Designathons",
      "Mentored junior designers and curated tech-design workshops",
    ],
  },
];

import { usePortfolio } from "@/context/PortfolioContext";

export default function JourneyModal() {
  const { portfolio } = usePortfolio();
  const journeyMilestones = portfolio.journey;
  const [isOpen, setIsOpen] = useState(false);

  // Listen to hash changes (#journey-modal) or query string (?modal=journey)
  useEffect(() => {
    const checkHash = () => {
      if (
        window.location.hash === "#journey-modal" ||
        window.location.search.includes("modal=journey")
      ) {
        setIsOpen(true);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("popstate", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("popstate", checkHash);
    };
  }, []);

  // Listen for escape key dismissal & synchronize Lenis scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    if (typeof window !== "undefined" && (window as unknown as { lenis?: { stop: () => void } }).lenis) {
      (window as unknown as { lenis: { stop: () => void } }).lenis.stop();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (typeof window !== "undefined" && (window as unknown as { lenis?: { start: () => void } }).lenis) {
        (window as unknown as { lenis: { start: () => void } }).lenis.start();
      }
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    if (window.location.hash === "#journey-modal") {
      history.pushState(null, "", window.location.pathname);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10"
      style={{ background: "rgba(5, 5, 5, 0.92)", backdropFilter: "blur(28px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-modal-title"
      onClick={closeModal}
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-[32px] border border-white/15 bg-[#0A0A10] p-6 sm:p-10 lg:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.85)] font-kanit text-[#D7E2EA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button with Apple HIG min 44x44px touch target */}
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
          aria-label="Close journey modal"
        >
          <X size={20} weight="light" />
        </button>

        {/* Modal Header */}
        <div className="mb-10 sm:mb-12 pr-12">
          <span className="text-xs font-mono tracking-[0.25em] text-[#D7E2EA]/60 uppercase block mb-2">
            Career Timeline
          </span>
          <h2 id="journey-modal-title" className="hero-heading font-black uppercase text-3xl sm:text-5xl text-white tracking-tight mb-3">
            Design Journey
          </h2>
          <p className="text-sm sm:text-base text-[#D7E2EA]/70 font-light max-w-2xl leading-relaxed">
            With 2+ years of experience in the industry, designing fast, high-quality, and scalable interfaces for digital platforms and visionary brands.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-8 sm:space-y-10 relative before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-px before:bg-white/10">
          {journeyMilestones.map((item, index) => (
            <div key={index} className="relative pl-9 sm:pl-12 group">
              {/* Timeline marker */}
              <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-[#D7E2EA] border-2 border-[#0A0A10] group-hover:scale-125 transition-transform" />

              <div className="p-6 sm:p-7 rounded-[22px] bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-[#D7E2EA]/60 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10">
                    {item.period}
                  </span>
                  <span className="text-xs font-mono text-[#D7E2EA]/40">
                    {item.company}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {item.role} &mdash; <span className="text-[#D7E2EA]/90">{item.company}</span>
                </h3>

                <p className="text-sm text-[#D7E2EA]/75 font-light leading-relaxed mb-4">
                  {item.summary}
                </p>

                <ul className="space-y-1.5">
                  {item.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="flex items-start gap-2 text-xs sm:text-sm text-[#D7E2EA]/65 font-light">
                      <span className="text-[#D7E2EA]/60 mt-1 shrink-0">✺</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={portfolio.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto justify-center min-h-[44px] flex items-center gap-2"
          >
            <DownloadSimple size={18} weight="bold" />
            <span>Download Official Resume (PDF)</span>
          </a>

          <button
            onClick={closeModal}
            className="w-full sm:w-auto py-3 px-6 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white transition-all text-sm font-medium flex items-center justify-center cursor-pointer min-h-[44px]"
          >
            Close Journey
          </button>
        </div>
      </div>
    </div>
  );
}
