"use client";

import { useRef, useEffect } from "react";

interface SlidingTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function SlidingTabs({
  tabs,
  activeTab,
  onChange,
}: SlidingTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const movePill = (tabEl: HTMLElement, animate = true) => {
    const pill = pillRef.current;
    if (!pill) return;

    if (!animate) {
      const prev = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${tabEl.offsetLeft}px)`;
      pill.style.width = `${tabEl.offsetWidth}px`;
      void pill.offsetWidth; // Force reflow
      pill.style.transition = prev;
    } else {
      pill.style.transform = `translateX(${tabEl.offsetLeft}px)`;
      pill.style.width = `${tabEl.offsetWidth}px`;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    );
    if (activeEl) {
      movePill(activeEl, true);
    }
  }, [activeTab]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    );
    if (activeEl) {
      requestAnimationFrame(() => movePill(activeEl, false));
    }

    const handleResize = () => {
      const el = container.querySelector<HTMLButtonElement>(
        `[data-tab="${activeTab}"]`
      );
      if (el) movePill(el, false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="t-tabs"
      role="tablist"
      aria-label="Filter categories"
    >
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
      {tabs.map((tab) => {
        const isSelected = tab === activeTab;
        return (
          <button
            key={tab}
            data-tab={tab}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab)}
            className="t-tab font-mono text-xs uppercase tracking-wider"
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
