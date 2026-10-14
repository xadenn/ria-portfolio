"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import { usePortfolio } from "@/context/PortfolioContext";
import TextRoll from "@/components/ui/text-roll";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Tools", href: "#tools" },
  { label: "Achievements", href: "#achievements" },
  { label: "Services", href: "#services" },
  { label: "Designs", href: "#designs" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const { portfolio } = usePortfolio();
  const { profile } = portfolio;
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const socialItems = [
    { label: "LinkedIn", href: profile.socials.linkedin },
    { label: "GitHub", href: profile.socials.github },
    { label: "Behance", href: profile.socials.behance },
    { label: "Resume", href: profile.resumeUrl },
    { label: "Email", href: `mailto:${profile.email}` },
  ];

  // Auto-hide on scroll down, reappear on scroll up or at top
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Always visible near the top
      if (currentY <= 40) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current + 6) {
        setVisible(false); // scrolling down
      } else if (currentY < lastScrollY.current - 6) {
        setVisible(true); // scrolling up
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      setTimeout(() => {
        if (
          typeof window !== "undefined" &&
          (window as unknown as { lenis?: { scrollTo: (t: string, o?: { duration?: number; offset?: number; easing?: (t: number) => number }) => void } }).lenis
        ) {
          (window as unknown as { lenis: { scrollTo: (t: string, o?: { duration?: number; offset?: number; easing?: (t: number) => number }) => void } }).lenis.scrollTo(
            href,
            {
              duration: 1.35,
              offset: -20,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            }
          );
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const brandName = profile.name.split(" ")[0] || "RIA";

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* ─────────────────────────────────────────────────────────────
          PRIMARY FLOATING TEXT NAVBAR
          - Pure floating text: No background bar, no glass container
          - Centered navigation links across the screen with zero wrapping
          - Soft blue (#A5B4FC) kinetic TextRoll hover animation
          - Auto-hides on scroll down, smoothly reappears on scroll up & top
          ───────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-auto bg-transparent py-5 sm:py-7 px-6 sm:px-10 lg:px-12 ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        aria-label="Primary navigation"
      >
        <div className="relative flex items-center justify-between w-full max-w-[1600px] mx-auto">
          {/* Left: Brand Name (Pure crisp floating text with soft blue hover roll) */}
          <div className="z-10 flex-shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#hero");
              }}
              className="group font-hn text-base sm:text-lg font-bold tracking-widest text-white uppercase hover:text-[#A5B4FC] transition-colors cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              aria-label="Scroll to top"
            >
              <TextRoll
                rollColor="text-[#A5B4FC]"
                className="font-bold tracking-widest text-white group-hover:text-[#A5B4FC] transition-colors"
              >
                {brandName}
              </TextRoll>
            </a>
          </div>

          {/* ─────────────────────────────────────────────────────────
              CENTER: CENTERED FLOATING NAV LINKS (DESKTOP)
              Clean floating typography, perfectly centered in viewport,
              guaranteed single-line (never wraps), soft blue hover roll
              ───────────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-auto w-max max-w-[85vw] whitespace-nowrap">
            <nav
              className="flex items-center gap-4 md:gap-5 lg:gap-7 xl:gap-8 text-xs sm:text-[13px] tracking-widest uppercase font-semibold text-white/90 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              aria-label="Main navigation links"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
                  className="group cursor-pointer whitespace-nowrap shrink-0 text-white/90 hover:text-[#A5B4FC] transition-colors"
                >
                  <TextRoll
                    rollColor="text-[#A5B4FC]"
                    className="font-hn tracking-widest uppercase font-semibold text-white/90 group-hover:text-[#A5B4FC] transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </TextRoll>
                </a>
              ))}
            </nav>
          </div>

          {/* ─────────────────────────────────────────────────────────
              RIGHT: MOBILE HAMBURGER / DESKTOP BALANCING SPACER
              ───────────────────────────────────────────────────────── */}
          <div className="z-10 flex items-center justify-end md:min-w-[48px]">
            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer text-cream p-1 rounded-full hover:bg-white/[0.06] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <div className="relative h-4 w-6 flex flex-col justify-between">
                <span
                  className={`block h-[1.75px] w-full bg-cream transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] origin-center ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[1.75px] w-full bg-cream transition-opacity duration-300 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-[1.75px] w-full bg-cream transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] origin-center ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SLIDE-IN NAVIGATION DRAWER
          Interactive TextRoll typography with soft blue hover
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex justify-end md:hidden"
            style={{
              background: "rgba(5,5,8,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Backdrop click to dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Sliding Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[85%] max-w-sm h-full bg-[#0C0C0C]/95 border-l border-white/10 px-8 py-10 flex flex-col justify-between overflow-y-auto z-10 text-cream"
              aria-label="Mobile navigation drawer"
            >
              {/* Top Drawer Bar: Brand & Close */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-hn text-lg font-bold tracking-widest uppercase">
                  {profile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:opacity-70 transition-opacity rounded-full hover:bg-white/10 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={22} weight="bold" />
                </button>
              </div>

              {/* Main Navigation Links with TextRoll effect */}
              <nav className="flex flex-col gap-3 my-auto py-6" aria-label="Site drawer navigation">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.4 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="group flex items-center justify-between py-2.5 px-3 rounded-xl border border-transparent hover:border-[#A5B4FC]/30 hover:bg-[#A5B4FC]/[0.05] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-cream/30 group-hover:bg-[#A5B4FC] group-hover:scale-125 transition-all" />
                      <TextRoll
                        center
                        rollColor="text-[#A5B4FC]"
                        className="text-2xl font-hn font-extrabold tracking-tight uppercase text-cream group-hover:text-[#A5B4FC] transition-colors"
                      >
                        {item.label}
                      </TextRoll>
                    </div>
                    <span className="text-xs font-mono text-cream/70 group-hover:text-[#A5B4FC] group-hover:translate-x-0.5 transition-all">
                      0{i + 1} ↗
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Bottom Footer Info */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3 text-xs font-hn text-cream/70">
                <span className="font-mono uppercase text-[11px] tracking-wider text-cream/50">
                  {profile.role} · {profile.location}
                </span>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-cream/80 pt-1">
                  {socialItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
