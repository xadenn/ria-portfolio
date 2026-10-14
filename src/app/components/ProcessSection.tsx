"use client";

import { useEffect, useRef, useState, useId } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  deliverables: string[];
}

const steps: Step[] = [
  {
    number: "01",
    phase: "IMMERSION & SEMIOTICS",
    title: "Discovery",
    subtitle: "Excavating the unexpressed DNA of the brand",
    description:
      "Every engagement begins with deep acoustic and semiotic listening. I decode audience desire, cultural undercurrents, and latent narratives that competitors ignore.",
    image: "/images/hero-portrait.jpg",
    deliverables: ["Semiotic Analysis", "Competitive Topology", "Aesthetic Manifesto"],
  },
  {
    number: "02",
    phase: "SPATIAL ARCHITECTURE",
    title: "Concept",
    subtitle: "Translating strategic gravity into visual forms",
    description:
      "From raw insight comes tangible tension. Rapid prototyping of spatial layouts, variable typographic hierarchies, and interactive wireframes before any pixel commits.",
    image: "/images/project-flux.jpg",
    deliverables: ["Art Direction Decks", "Motion Language Specs", "Interface Wireframes"],
  },
  {
    number: "03",
    phase: "RELENTLESS EXECUTION",
    title: "Craft",
    subtitle: "Where computational precision meets visceral beauty",
    description:
      "This is where obsession lives. Every curve, shader parameter, lighting angle, and spring-physics transition is calibrated with micro-millimeter discipline.",
    image: "/images/project-ether.jpg",
    deliverables: ["Ray-traced 3D Renders", "Complete Design System", "Interactive Prototypes"],
  },
  {
    number: "04",
    phase: "ORCHESTRATION & POLISH",
    title: "Refine",
    subtitle: "Choreographing the final multi-sensory symphony",
    description:
      "Haptic tuning, audio sync, frame-rate optimization, and cross-platform stress-testing. Ensuring the delivered work leaves an indelible cultural imprint.",
    image: "/images/project-maison.jpg",
    deliverables: ["Production Code Hand-off", "Brand Guidelines", "Exhibition Assets"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const reduce = useReducedMotion();
  const instanceId = useId().replace(/:/g, "");
  const cardClass = `process-card-${instanceId}`;
  const innerClass = `process-inner-${instanceId}`;

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
        },
      });

      // Sticky Stacked Steps with Active Index Detection
      const cardEls = gsap.utils.toArray<HTMLElement>(`.${cardClass}`);
      cardEls.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });

        if (i === cardEls.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const inner = card.querySelector(`.${innerClass}`);
        if (!inner) return;
        gsap.to(inner, {
          scale: 0.94,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce, cardClass, innerClass]);

  const scrollToStep = (index: number) => {
    const cardEls = document.querySelectorAll(`.${cardClass}`);
    if (cardEls[index]) {
      cardEls[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative bg-[#0C0C0C] overflow-hidden font-hn text-cream"
      aria-label="Creative methodology"
    >
      {/* Seamless edge blend gradients into #0C0C0C */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-10" />

      {/* Ambient specular backdrop in warm neutral */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(239,238,233,0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Section Header */}
      <div
        ref={headlineRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-28 lg:pt-40 pb-12 relative z-10"
      >
        <div className="mb-4">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-cream/40">
            Process
          </span>
        </div>
        <h2 className="display-large text-cream font-hn">
          How Worlds<br />
          Take Form
        </h2>
        <p className="text-cream/60 text-base lg:text-lg mt-5 max-w-lg leading-relaxed font-hn">
          A four-act choreography designed to dissolve assumptions, unlock
          unprecedented aesthetic gravity, and ship bulletproof masterworks.
        </p>

        {/* Floating Liquid Glass Chapter Capsule */}
        <div className="mt-10 inline-flex items-center p-1 rounded-full border border-cream/12 bg-white/[0.03] backdrop-blur-2xl shadow-xl">
          {steps.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => scrollToStep(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                activeStep === idx
                  ? "bg-cream text-black font-semibold shadow-md"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              <span>{s.number}</span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Apple Keynote Chapter Walkthrough Sequence */}
      <div className="relative">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`${cardClass} relative min-h-[100dvh] flex items-center justify-center`}
            style={{ zIndex: i + 1 }}
          >
            <div
              className={`${innerClass} w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-12 will-change-transform`}
            >
              <div className="py-10 border-t border-cream/10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* Left: Phase info & Narrative */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-mono text-3xl font-bold text-cream/90">
                        {step.number}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-cream/20 via-cream/5 to-transparent" />
                      <span className="text-xs font-mono text-cream/70 tracking-widest uppercase">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="display-medium text-cream mb-3 font-hn">
                      {step.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-cream/75 font-light mb-6 font-hn">
                      {step.subtitle}
                    </p>
                    <p className="text-cream/55 leading-relaxed text-base max-w-xl mb-8 font-light font-hn">
                      {step.description}
                    </p>

                    {/* Apple-grade Liquid Glass Deliverable Chips */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-cream/5">
                      {step.deliverables.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-cream/10 hover:border-cream/20 text-cream/70 text-xs font-mono tracking-wider transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Floating Visual Plate with Apple Corner Curvature */}
                  <div className="lg:col-span-5">
                    <div className="relative w-full aspect-4/3 rounded-[30px] overflow-hidden border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] group">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover img-editorial transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
