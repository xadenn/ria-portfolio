"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const STAGGER = 0.03;

export function TextRoll({
  children,
  className,
  center = false,
  rollColor = "text-[#A5B4FC]",
}: {
  children: string;
  className?: string;
  center?: boolean;
  rollColor?: string;
}) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn(
        "relative inline-flex flex-col overflow-hidden text-inherit py-0.5 whitespace-nowrap select-none shrink-0",
        className
      )}
      style={{
        lineHeight: 1.2,
      }}
    >
      {/* Top Text (Slides up) */}
      <div className="flex flex-row flex-nowrap whitespace-nowrap select-none shrink-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: [0.22, 1, 0.36, 1],
                delay,
                duration: 0.28,
              }}
              className="inline-block whitespace-pre shrink-0"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>

      {/* Bottom Text (Slides in from bottom with soft blue color) */}
      <div
        className={cn(
          "absolute inset-0 flex flex-row flex-nowrap whitespace-nowrap select-none pointer-events-none py-0.5 shrink-0",
          rollColor
        )}
        aria-hidden="true"
      >
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: [0.22, 1, 0.36, 1],
                delay,
                duration: 0.28,
              }}
              className="inline-block whitespace-pre shrink-0"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
}

export default TextRoll;
