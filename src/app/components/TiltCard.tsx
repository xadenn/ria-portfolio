"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxAngle?: number;
  onClick?: () => void;
}

export default function TiltCard({
  children,
  className = "",
  maxAngle = 14,
  onClick,
}: TiltCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card || reduce) return;

    const reset = () => {
      tilt.classList.remove("is-hover");
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-rx", "0deg");
      card.style.setProperty("--tilt-ry", "0deg");
    };

    const track = (e: PointerEvent) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = tilt.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tilt.classList.add("is-hover");
      card.classList.add("is-tilting");
      card.style.setProperty("--tilt-ry", ((px - 0.5) * maxAngle).toFixed(2) + "deg");
      card.style.setProperty("--tilt-rx", ((0.5 - py) * maxAngle).toFixed(2) + "deg");
      card.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") reset();
    };

    tilt.addEventListener("pointermove", track);
    tilt.addEventListener("pointerleave", onPointerLeave);

    return () => {
      tilt.removeEventListener("pointermove", track);
      tilt.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduce, maxAngle]);

  return (
    <div
      ref={tiltRef}
      className={`t-tilt ${className}`}
      onClick={onClick}
    >
      <div ref={cardRef} className="t-tilt-card w-full h-full">
        {children}
        <div className="t-tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
