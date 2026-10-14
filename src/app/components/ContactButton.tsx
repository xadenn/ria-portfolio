"use client";

import React from "react";

interface ContactButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function ContactButton({
  label = "Contact Me",
  href = "#contact",
  onClick,
  className = "",
}: ContactButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full font-kanit font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 px-8 py-3.5 sm:px-10 sm:py-3.5 text-xs sm:text-sm md:text-base cursor-pointer min-h-[44px] ${className}`}
      style={{
        background:
          "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow:
          "0px 4px 18px rgba(181, 1, 167, 0.45), inset 4px 4px 12px #7721B1",
        outline: "2px solid white",
        outlineOffset: "-3px",
      }}
      aria-label={label}
    >
      <span>{label}</span>
    </a>
  );
}

