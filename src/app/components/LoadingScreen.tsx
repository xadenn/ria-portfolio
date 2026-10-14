"use client";

import { useState } from "react";
import NoiseDissolveReveal from "@/components/ui/noise-dissolve-reveal";

export default function LoadingScreen() {
  const [isRemoved, setIsRemoved] = useState(false);

  const DELAY_MS = 800;
  const DURATION_MS = 1400;

  const handleReveal = () => {
    // Unmount once reveal is 100% complete
    setTimeout(() => {
      setIsRemoved(true);
    }, 80);
  };

  if (isRemoved) return null;

  return (
    <aside
      aria-label="Loading gate"
      className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden pointer-events-none select-none bg-transparent"
    >
      <NoiseDissolveReveal
        veilColor="#0C0C0C"
        edgeColor="#D7E2EA"
        veilTitle="RIA VERMA"
        veilSubtitle="CREATIVE DIRECTION & SPATIAL SYSTEMS"
        durationMs={DURATION_MS}
        delayMs={DELAY_MS}
        loop={false}
        noiseScale={5.5}
        softness={0.02}
        centerBias={0.32}
        height="100vh"
        onReveal={handleReveal}
        className="w-full h-full"
      />
    </aside>
  );
}
