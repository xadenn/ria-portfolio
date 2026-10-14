"use client";

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
import * as React from "react";

import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
  category?: string;
  client?: string;
  year?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
  /** When true, disables internal preventDefault on wheel so page scroll can drive it */
  disableInternalWheel?: boolean;
  /** Callback fired when the active/focused item changes */
  onActiveChange?: (index: number) => void;
  /** Callback fired when a card is clicked */
  onCardClick?: (item: WorksWheelItem, index: number) => void;
  /** Callback fired when an item in the right-hand index list is clicked */
  onIndexClick?: (index: number) => void;
  /** Whether to render the right-hand index list. @default false */
  showIndex?: boolean;
  /** Whether to render the front card title on the side. @default true */
  showTitle?: boolean;
  /** Whether to render the center ring label. @default true */
  showLabel?: boolean;
}

export interface WorksWheelRef {
  to: (next: number) => void;
  setTarget: (next: number) => void;
  getTurn: () => number;
  getTarget: () => number;
  getActive: () => number;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.50; // front card height, of the stage (was 0.38)
const CARD_MAX_W = 0.48; // ... but never wider than this much of the stage (was 0.34)
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export const WorksWheel = React.forwardRef<WorksWheelRef, WorksWheelProps>(
  function WorksWheel(
    {
      items,
      label = "Works '26",
      action = "View",
      disableInternalWheel = false,
      onActiveChange,
      onCardClick,
      onIndexClick,
      showIndex = false,
      showTitle = true,
      showLabel = true,
      className,
      ...props
    },
    ref,
  ) {
    const stageRef = React.useRef<HTMLDivElement>(null);
    const wheelRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
    const labelRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLDivElement>(null);

    // The wheel's position, and where it is heading. Only `active` is state -
    // everything else is written to the DOM, so turning the wheel is not a render.
    // 0 is the circular card ring, 1 is the 3D drum with item 0 at the front
    const turn = React.useRef(0);
    const target = React.useRef(0);
    const activeRef = React.useRef(0);
    const [active, setActive] = React.useState(0);
    const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

    const count = items.length;
    const last = Math.max(count - 1, 0);

    // Read after mount, not during render: the server has no matchMedia, and
    // branching on it inline is a hydration mismatch. Reduced motion drops the
    // easing, so the wheel lands where it is put instead of gliding there.
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const read = () => setReduced(query.matches);
      read();
      query.addEventListener("change", read);
      return () => query.removeEventListener("change", read);
    }, []);

    React.useEffect(() => {
      const el = stageRef.current;
      if (!el) return;
      const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const metrics = React.useMemo(() => {
      const { w, h } = stage;
      const isMobile = w > 0 && w < 768;
      const maxW = isMobile ? 0.86 : CARD_MAX_W;
      const hScale = isMobile ? 0.40 : CARD_H;
      const cardW = Math.min(h * hScale * CARD_RATIO, w * maxW);
      const cardH = cardW / CARD_RATIO;
      const drumR = cardH * DRUM;
      const ringR = cardH * RING_R;
      // Shrink the ring's cards until the circle reads as a closed loop rather
      // than beads on a wire, however many pieces the wheel is given.
      const ringScale = count
        ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
        : 1;
      return {
        cardW,
        cardH,
        ringR,
        ringScale,
        drumR,
        bow: cardH * BOW,
        depth: cardH * LENS,
        title: cardH * TITLE,
        index: cardH * INDEX,
      };
    }, [stage, count]);

    const to = React.useCallback(
      (next: number) => {
        target.current = clamp(next, 0, last + 1);
      },
      [last],
    );

    // Imperative ref API for external scroll triggers
    React.useImperativeHandle(
      ref,
      () => ({
        to,
        setTarget: (v: number) => {
          target.current = clamp(v, 0, last + 1);
        },
        getTurn: () => turn.current,
        getTarget: () => target.current,
        getActive: () => active,
      }),
      [to, last, active],
    );

    // One pass per frame: ease toward the target, then write every transform.
    React.useEffect(() => {
      if (!stage.h) return;
      let frame = 0;
      const { ringR, ringScale, drumR, bow } = metrics;

      const draw = () => {
        frame = requestAnimationFrame(draw);
        const gap = target.current - turn.current;
        if (Math.abs(gap) < 0.0005) turn.current = target.current;
        else turn.current += gap * (reduced ? 1 : (disableInternalWheel ? 0.24 : EASE));

        const t = turn.current;
        const m = clamp(t, 0, 1);
        const pos = Math.max(0, t - 1);

        // At m=0, circular ring is centered (shiftX=0).
        // As m->1, drum glides rightwards so title has room on the left.
        if (wheelRef.current) {
          const isWide = stage.w >= 768;
          const shiftX = isWide ? m * (stage.w * 0.14) : 0;
          wheelRef.current.style.transform = `translateX(${shiftX}px) translateZ(${-m * drumR}px)`;
        }

        for (let i = 0; i < count; i++) {
          const d = i - pos;
          const drumDeg = d * STEP;
          const card = cardRefs.current[i];
          if (card) {
            card.style.transform = place(
              d * (360 / count),
              drumDeg,
              ringR,
              drumR,
              bow,
              m,
            );
            // Culled by distance, not by angle: at a full turn the far side comes
            // back round to face us, and everything past the neighbours lands on
            // the vanishing point in a heap.
            card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
            card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
          }
          const face = card?.firstElementChild as HTMLElement | null;
          if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
        }

        if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
        if (titleRef.current) titleRef.current.style.opacity = String(m);
        const near = clamp(Math.round(pos), 0, last);
        if (activeRef.current !== near) {
          activeRef.current = near;
          setActive(near);
          onActiveChange?.(near);
        }
      };

      frame = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(frame);
    }, [metrics, stage.h, count, last, reduced, onActiveChange]);

    // Native listener, because the wheel has to be cancellable - and it only
    // cancels while it still has somewhere to go, so the page scrolls on at
    // either end instead of trapping the reader.
    React.useEffect(() => {
      if (disableInternalWheel) return;
      const el = stageRef.current;
      if (!el) return;
      const onWheel = (event: WheelEvent) => {
        const next = target.current + event.deltaY / WHEEL_UNITS;
        if (next > 0 && next < last + 1) event.preventDefault();
        to(next);
        // Settle onto an item
        window.clearTimeout(settling.current);
        settling.current = window.setTimeout(
          () => to(Math.round(target.current)),
          SETTLE,
        );
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        el.removeEventListener("wheel", onWheel);
        window.clearTimeout(settling.current);
      };
    }, [to, last, disableInternalWheel]);

    const drag = React.useRef<number | null>(null);
    const settling = React.useRef(0);

    return (
      <section
        aria-label={label}
        className={cn(
          "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
          className,
        )}
        {...props}
      >
        <div
          ref={stageRef}
          tabIndex={0}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`works-wheel-${active}`}
          className={cn(
            "focus-visible:outline-foreground absolute inset-0 outline-none focus-visible:outline-2 focus-visible:-outline-offset-4",
            disableInternalWheel
              ? "touch-pan-y cursor-default"
              : "cursor-grab touch-pan-y active:cursor-grabbing"
          )}
          style={{ perspective: `${metrics.depth}px` }}
          onPointerDown={(event) => {
            if (disableInternalWheel || event.pointerType !== "mouse") return;
            drag.current = event.clientY;
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch (_) {}
          }}
          onPointerMove={(event) => {
            if (disableInternalWheel || drag.current === null) return;
            to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
            drag.current = event.clientY;
          }}
          onPointerUp={() => {
            if (disableInternalWheel) return;
            drag.current = null;
            if (target.current > 1) to(Math.round(target.current));
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
            else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
            else return;
            event.preventDefault();
          }}
        >
          <div
            ref={wheelRef}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d] will-change-transform"
          >
            {items.map((item, i) => {
              const Tag = (item.href ? "a" : "div") as "a";
              return (
                <React.Fragment key={item.title}>
                  <Tag
                    id={`works-wheel-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={item.href}
                    onClick={(e) => {
                      if (onCardClick) {
                        e.preventDefault();
                        onCardClick(item, i);
                      }
                    }}
                    ref={(node: HTMLElement | null) => {
                      cardRefs.current[i] = node;
                    }}
                    className="group absolute [backface-visibility:hidden] will-change-transform transform-gpu"
                    style={{
                      width: metrics.cardW,
                      height: metrics.cardH,
                      marginLeft: -metrics.cardW / 2,
                      marginTop: -metrics.cardH / 2,
                    }}
                  >
                    <span className="bg-[#0e0e12] shadow-foreground/12 relative block size-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.85)]">
                      <img
                        src={item.image}
                        alt={item.title}
                        draggable={false}
                        className="size-full object-cover"
                      />
                      {action && item.href ? (
                        <span className="bg-background/80 text-foreground pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 12 12"
                            className="size-2.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 9 9 3M4 3h5v5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {action}
                        </span>
                      ) : null}
                    </span>
                  </Tag>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Ring title and front-card title trade places across the transition.
            Type is sized off the measured stage, not vh, so the wheel keeps its
            proportions inside a card as well as at full bleed. */}
        {showLabel && (
          <div
            ref={labelRef}
            className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-hn text-cream"
            style={{ fontSize: metrics.title }}
          >
            {label}
          </div>
        )}
        {showTitle && items[active] && (
          <div
            ref={titleRef}
            className="pointer-events-none absolute top-1/2 left-[5%] lg:left-[7%] -translate-y-1/2 z-20 max-w-[320px] sm:max-w-[420px] lg:max-w-[480px] flex flex-col items-start select-none opacity-0"
          >
            {/* Display Title */}
            <h3 className="font-hn text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-cream leading-[1.05] mb-2.5 select-none">
              {items[active]?.title}
            </h3>

            {/* Small line below */}
            {(items[active]?.client || items[active]?.category) && (
              <p className="font-hn text-xs sm:text-sm text-cream/45 uppercase tracking-[0.2em]">
                {items[active]?.client || items[active]?.category}
              </p>
            )}
          </div>
        )}
      </section>
    );
  },
);

WorksWheel.displayName = "WorksWheel";

export default WorksWheel;
