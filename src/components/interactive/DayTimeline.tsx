"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bloomi, type BloomiMood } from "@/components/mascot/Bloomi";

interface Step {
  time: string;
  title: string;
  text: string;
  icon: string;
}

/** Bloomi's mood mirrors what the children are doing at that moment. */
function moodFor(icon: string): BloomiMood {
  if (/[🌙😴]/u.test(icon)) return "sleep";
  if (/[📖📚📘]/u.test(icon)) return "read";
  if (/[🌳⚽🤸🏃🏅🎵🎶]/u.test(icon)) return "cheer";
  if (/[🍎🥗🧃🥣]/u.test(icon)) return "love";
  if (/[🔤🔢🧩🔬🧠🔍🛠🎯]/u.test(icon)) return "think";
  if (/[🎒👋⭕🤗🏡]/u.test(icon)) return "wave";
  return "happy";
}

const STEP_MS = 4200;

// Sky warms from morning butter-yellow to late-afternoon peach.
const SKY = ["#fff6d6", "#ffefcc", "#ffe6c4", "#ffdcc8", "#ffd6d6"];
const TILE = ["var(--color-yellow-soft)", "var(--color-pink-soft)", "var(--color-teal-soft)", "var(--color-orange-soft)", "var(--color-sky-soft)", "var(--color-green-soft)", "var(--color-blue-soft)"];

/** Point on the sun's arc for step i (percent of the sky box). */
function arcPoint(i: number, n: number) {
  const t = n > 1 ? i / (n - 1) : 0.5;
  return { x: 12 + t * 76, y: 72 - Math.sin(Math.PI * t) * 52 };
}

export function DayTimeline({ steps, title = "A day in the life" }: { steps: Step[]; title?: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [playing, setPlaying] = useState(true); // autoplay until the visitor takes over
  const [hold, setHold] = useState(false); // temporary pause while hovered / focused / touched
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);
  const n = steps.length;
  const running = playing && !hold && inView;

  const go = useCallback(
    (i: number, fromUser = true) => {
      const next = (i + n) % n;
      setDir(next > active || (active === n - 1 && next === 0) ? 1 : -1);
      setActive(next);
      // Scroll only the rail, never the page (scrollIntoView would jump the window during autoplay).
      const r = rail.current;
      const tab = r?.querySelector<HTMLElement>(`[data-step="${next}"]`);
      if (r && tab && r.scrollWidth > r.clientWidth) {
        r.scrollTo({ left: tab.offsetLeft - (r.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
      }
      if (fromUser) setPlaying(false);
    },
    [n, active],
  );

  // Autoplay: only while on screen, never for reduced-motion users.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(active + 1, false), STEP_MS);
    return () => window.clearTimeout(t);
  }, [running, active, go]);

  const s = steps[active];
  const t = n > 1 ? active / (n - 1) : 0;
  const sky = SKY[Math.min(SKY.length - 1, Math.round(t * (SKY.length - 1)))];
  const sun = arcPoint(active, n);
  const pathD = Array.from({ length: 41 }, (_, k) => {
    const p = arcPoint((k / 40) * (n - 1), n);
    return `${k ? "L" : "M"}${p.x * 10} ${p.y * 2}`;
  }).join(" ");

  return (
    <div
      ref={root}
      className="card-pop overflow-hidden"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      <style>{`
        @keyframes dt-in-r{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
        @keyframes dt-in-l{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
        .dt-in-1{animation:dt-in-r .5s cubic-bezier(.22,1,.36,1) both}
        .dt-in--1{animation:dt-in-l .5s cubic-bezier(.22,1,.36,1) both}
        @keyframes dt-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .dt-progress{transform-origin:left;animation:dt-progress ${STEP_MS}ms linear both}
        @media (prefers-reduced-motion:reduce){.dt-in-1,.dt-in--1{animation:none}}
      `}</style>

      {/* ── Sky with the sun travelling along the day ── */}
      <div className="relative h-28 border-b-[2.5px] border-ink transition-colors duration-700 sm:h-36" style={{ background: sky }}>
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d={pathD} fill="none" stroke="var(--color-ink)" strokeOpacity=".18" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {steps.map((_, i) => {
          const p = arcPoint(i, n);
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={() => go(i)}
              className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink transition-colors duration-300 ${i <= active ? "bg-ink" : "bg-white"}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          );
        })}
        <div
          className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-14 sm:w-14"
          style={{ left: `${sun.x}%`, top: `${sun.y}%` }}
        >
          <svg viewBox="0 0 60 60" className="h-full w-full">
            {Array.from({ length: 10 }).map((_, k) => (
              <rect key={k} x="28" y="1" width="4" height="10" rx="2" fill="var(--color-orange)" transform={`rotate(${k * 36} 30 30)`} />
            ))}
            <circle cx="30" cy="30" r="15" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="2.5" />
          </svg>
        </div>
        <span aria-hidden className="absolute bottom-2.5 left-4 hidden sm:block text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink/45">Hello</span>
        <span aria-hidden className="absolute bottom-2.5 right-4 hidden sm:block text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink/45">See you tomorrow</span>
      </div>

      {/* ── The moment ── */}
      <div
        role="tabpanel"
        id="dt-panel"
        aria-live="polite"
        className="relative grid touch-pan-y gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-10"
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause the day tour" : "Play the day tour"}
          className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border-2 border-ink/20 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink-soft hover:border-ink hover:text-ink"
        >
          <span aria-hidden className="text-[0.7rem]">{playing ? "❚❚" : "▶"}</span>
          {playing ? "Pause" : "Play"}
        </button>
        <div key={`art-${active}`} className={`dt-in-${dir} relative mx-auto h-40 w-40 sm:h-52 sm:w-52`}>
          <div className="absolute inset-0 grid place-items-center rounded-[2.25rem] border-[2.5px] border-ink" style={{ background: TILE[active % TILE.length] }}>
            <span className="text-[4.5rem] leading-none sm:text-[6rem]" aria-hidden>{s.icon}</span>
          </div>
          <Bloomi mood={moodFor(s.icon)} still className="absolute -bottom-4 -right-6 h-auto w-16 sm:-right-8 sm:w-20" title="Bloomi" />
        </div>

        <div key={`txt-${active}`} className={`dt-in-${dir} min-w-0`}>
          <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
            <span className="rounded-full bg-ink px-3 py-1 uppercase tracking-wider text-white">{s.time}</span>
            <span className="text-ink-soft">
              {active + 1} of {n}
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">{s.title}</h3>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">{s.text}</p>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous moment" className="grid h-12 w-12 place-items-center rounded-full border-[2.5px] border-ink bg-white text-xl font-black shadow-pop-sm hover:-translate-y-0.5 active:translate-y-0.5">
              ←
            </button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next moment" className="btn btn-sun !py-2.5">
              {active === n - 1 ? "Start again" : `Next: ${steps[active + 1].title}`} →
            </button>
          </div>
        </div>
      </div>

      {/* ── Rail of every moment (the labelled tabs) ── */}
      <div
        ref={rail}
        role="tablist"
        aria-label={title}
        className="flex snap-x gap-2 overflow-x-auto border-t-[2.5px] border-dashed border-ink/15 bg-cream/60 px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-lg:[mask-image:linear-gradient(to_right,transparent,#000_28px,#000_calc(100%-28px),transparent)] lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-6"
        onTouchStart={() => setPlaying(false)}
      >
        {steps.map((st, i) => (
          <button
            key={i}
            data-step={i}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="dt-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => go(i)}
            className={`relative flex shrink-0 snap-center items-center gap-2 overflow-hidden rounded-full border-2 px-3.5 py-2 text-left transition-all duration-300 ${
              i === active ? "border-ink bg-ink text-white shadow-pop-sm" : "border-ink/15 bg-white hover:border-ink"
            }`}
          >
            <span aria-hidden>{st.icon}</span>
            <span className="whitespace-nowrap font-display text-[0.95rem] font-medium">{st.title}</span>
            {i === active && playing && (
              <span
                key={`p-${active}`}
                aria-hidden
                className="dt-progress absolute inset-x-0 bottom-0 h-[3px] bg-yellow"
                style={{ animationPlayState: running ? "running" : "paused" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Full schedule for screen readers and crawlers. */}
      <ol className="sr-only">
        {steps.map((st, i) => (
          <li key={i}>
            {st.time}: {st.title}. {st.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
