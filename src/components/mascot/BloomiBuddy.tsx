"use client";

import { useEffect, useRef, useState } from "react";
import { Bloomi, type BloomiMood } from "./Bloomi";

const GIGGLES = [
  "Hee hee! That tickles! 🌸",
  "I grow a petal every time a child learns something new!",
  "Did you know? Play is how little brains learn best.",
  "Come visit! I'll show you the art corner 🎨",
  "Storytime is my favourite time 📚",
  "Every child blooms in their own season 🌼",
];

/**
 * Interactive Bloomi: eyes follow the pointer, a tap makes Bloomi spin their
 * petals, cheer and say something. Pass `bubble` for a fixed speech bubble.
 */
export function BloomiBuddy({
  mood = "wave",
  bubble,
  className = "",
  bubbleSide = "left",
  size = "w-40",
  still = false,
}: {
  mood?: BloomiMood;
  bubble?: string;
  className?: string;
  bubbleSide?: "left" | "right" | "top";
  size?: string;
  still?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [excited, setExcited] = useState(false);
  const [line, setLine] = useState<string | undefined>(bubble);
  const n = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.37);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 300);
        setLook({ x: (dx / d) * 4 * k, y: (dy / d) * 4 * k });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onTap = () => {
    setExcited(true);
    setLine(GIGGLES[n.current++ % GIGGLES.length]);
    window.setTimeout(() => setExcited(false), 1400);
  };

  // Side bubbles only fit beside Bloomi on wider screens. Below md they sit in
  // the flow above Bloomi (centred), so they can never run off the viewport.
  const bubblePos =
    bubbleSide === "top"
      ? "absolute bottom-full left-1/2 -translate-x-1/2 mb-1"
      : `relative block mx-auto mb-2 md:absolute md:mb-0 md:mx-0 md:top-2 ${bubbleSide === "left" ? "md:right-[82%]" : "md:left-[82%]"}`;

  return (
    <div className={`relative inline-block ${className}`}>
      {line && (
        <p
          key={line}
          aria-live="polite"
          className={`${bubblePos} z-10 w-max max-w-[min(13rem,calc(100vw-2rem))] animate-pop-in rounded-2xl border-[2.5px] border-ink bg-white px-3.5 py-2 text-center font-display text-[0.95rem] leading-snug text-ink shadow-pop-sm md:text-left`}
        >
          {line}
        </p>
      )}
      <button
        ref={ref}
        type="button"
        onClick={onTap}
        aria-label="Say hi to Bloomi, our mascot"
        className={`${size} block cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${excited ? "animate-wiggle" : ""}`}
      >
        <Bloomi mood={excited ? "cheer" : mood} look={look} spin={excited} still={still} className="w-full h-auto drop-shadow-sm" />
      </button>
    </div>
  );
}
