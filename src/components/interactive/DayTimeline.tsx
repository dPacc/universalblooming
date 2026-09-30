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

/**
 * The light across a day at the centre. Each moment in the timeline sits at a
 * point t (0 = first moment, 1 = last) and everything below is interpolated:
 * sky gradient, sun colour, size, glow and ray length, hills, clouds and stars.
 */
interface Light {
  t: number;
  label: string;
  top: string; mid: string; bot: string;
  core: string; ray: string; glowColor: string;
  glow: number; size: number; rays: number;
  hill: string; hillBack: string; cloud: string;
}
const LIGHT: Light[] = [
  { t: 0, label: "🌅 Sunrise", top: "#ffc3b0", mid: "#ffdcc4", bot: "#fff2da", core: "#ffd772", ray: "#ffb35c", glowColor: "#ffc98a", glow: 0.45, size: 0.78, rays: 0.5, hill: "#b3d98a", hillBack: "#d9ebb9", cloud: "#fff4ee" },
  { t: 0.22, label: "☀️ Morning", top: "#9fd8ff", mid: "#c9e9ff", bot: "#fff5dc", core: "#ffd23a", ray: "#ffa726", glowColor: "#ffe07a", glow: 0.6, size: 0.95, rays: 0.8, hill: "#9dd168", hillBack: "#c7e6a1", cloud: "#ffffff" },
  { t: 0.5, label: "🌞 Midday", top: "#4fb1f0", mid: "#8fd0fa", bot: "#dff3ff", core: "#fff4a8", ray: "#ffc20e", glowColor: "#fff3b0", glow: 1, size: 1.18, rays: 1, hill: "#8cc955", hillBack: "#b9e194", cloud: "#ffffff" },
  { t: 0.78, label: "🌤️ Golden hour", top: "#ffbd66", mid: "#ffd896", bot: "#fff0cc", core: "#ffad1f", ray: "#ff8a1f", glowColor: "#ffc766", glow: 0.75, size: 1, rays: 0.72, hill: "#a2c457", hillBack: "#d2d99a", cloud: "#fff1dd" },
  { t: 1, label: "🌇 Sunset", top: "#574799", mid: "#df7597", bot: "#ffb277", core: "#ff6a38", ray: "#ff8f5c", glowColor: "#ff9a6b", glow: 0.7, size: 0.9, rays: 0.38, hill: "#6c8d48", hillBack: "#8a7aa6", cloud: "#ffc1d4" },
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, k: number) =>
  `#${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k).toString(16).padStart(2, "0")).join("")}`;

function lightAt(t: number): Light {
  const i = Math.max(0, LIGHT.findIndex((l) => l.t >= t) - 1);
  const a = LIGHT[i];
  const b = LIGHT[Math.min(LIGHT.length - 1, i + 1)];
  const k = b.t === a.t ? 0 : Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  const out = { ...a, label: k < 0.5 ? a.label : b.label } as Light;
  for (const key of ["top", "mid", "bot", "core", "ray", "glowColor", "hill", "hillBack", "cloud"] as const) out[key] = mixHex(a[key], b[key], k);
  for (const key of ["glow", "size", "rays"] as const) out[key] = a[key] + (b[key] - a[key]) * k;
  return out;
}

const STARS = [
  { x: 18, y: 16, s: 7 }, { x: 31, y: 34, s: 5 }, { x: 47, y: 12, s: 6 }, { x: 58, y: 30, s: 4 },
  { x: 69, y: 14, s: 7 }, { x: 80, y: 32, s: 5 }, { x: 92, y: 18, s: 6 },
];
const CLOUDS = [
  { y: 14, w: 92, dur: 70, delay: -10 },
  { y: 36, w: 64, dur: 95, delay: -55 },
  { y: 22, w: 76, dur: 120, delay: -90 },
];
const CLOUD_PATH = "M28 58h66c12 0 20-8 20-18s-8-18-19-18c-2-11-12-19-24-19-10 0-18 6-22 14-3-2-6-3-10-3-10 0-17 8-17 17v1C12 33 6 40 6 47c0 7 9 11 22 11z";

const TILE = ["var(--color-yellow-soft)", "var(--color-pink-soft)", "var(--color-teal-soft)", "var(--color-orange-soft)", "var(--color-sky-soft)", "var(--color-green-soft)", "var(--color-blue-soft)"];

/** Point on the sun's arc for step i (percent of the sky box). */
function arcPoint(i: number, n: number) {
  const t = n > 1 ? i / (n - 1) : 0.5;
  return { x: 12 + t * 76, y: 64 - Math.sin(Math.PI * t) * 46 }; // ends sit on the hill line: a half-risen / half-set sun
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
  const light = lightAt(t);
  const dusk = Math.max(0, (t - 0.82) / 0.18); // 0 → 1 over the last stretch: stars appear, labels turn light
  const sun = arcPoint(active, n);
  const pathD = Array.from({ length: 41 }, (_, k) => {
    const p = arcPoint((k / 40) * (n - 1), n);
    return `${k ? "L" : "M"}${p.x * 10} ${p.y * 2}`;
  }).join(" ");

  return (
    <div
      ref={root}
      className="dt-root card-pop overflow-hidden"
      style={
        {
          "--sky-top": light.top,
          "--sky-mid": light.mid,
          "--sky-bot": light.bot,
          "--sun-core": light.core,
          "--sun-ray": light.ray,
          "--sun-glow": light.glowColor,
          "--hill": light.hill,
          "--hill-back": light.hillBack,
          "--cloud": light.cloud,
        } as React.CSSProperties
      }
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
        @property --sky-top{syntax:'<color>';inherits:true;initial-value:#ffc3b0}
        @property --sky-mid{syntax:'<color>';inherits:true;initial-value:#ffdcc4}
        @property --sky-bot{syntax:'<color>';inherits:true;initial-value:#fff2da}
        @property --sun-core{syntax:'<color>';inherits:true;initial-value:#ffd772}
        @property --sun-ray{syntax:'<color>';inherits:true;initial-value:#ffb35c}
        @property --sun-glow{syntax:'<color>';inherits:true;initial-value:#ffc98a}
        @property --hill{syntax:'<color>';inherits:true;initial-value:#b3d98a}
        @property --hill-back{syntax:'<color>';inherits:true;initial-value:#d9ebb9}
        @property --cloud{syntax:'<color>';inherits:true;initial-value:#fff4ee}
        .dt-root{transition:--sky-top 1.1s ease,--sky-mid 1.1s ease,--sky-bot 1.1s ease,--sun-core 1.1s ease,--sun-ray 1.1s ease,--sun-glow 1.1s ease,--hill 1.1s ease,--hill-back 1.1s ease,--cloud 1.1s ease}
        .dt-sky{background:linear-gradient(180deg,var(--sky-top),var(--sky-mid) 58%,var(--sky-bot))}
        @keyframes dt-rays{to{transform:rotate(360deg)}}
        .dt-rays{transform-origin:50px 50px;animation:dt-rays 40s linear infinite}
        @keyframes dt-cloud{from{transform:translateX(-140px)}to{transform:translateX(calc(var(--w) + 140px))}}
        .dt-cloud{position:absolute;left:0;animation:dt-cloud linear infinite}
        @keyframes dt-twinkle{0%,100%{opacity:.35}50%{opacity:1}}
        .dt-star{animation:dt-twinkle 2.6s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.dt-in-1,.dt-in--1,.dt-rays,.dt-cloud,.dt-star{animation:none}}
      `}</style>

      {/* ── A living sky: colour, sun strength, clouds and stars follow the time of day ── */}
      <div className="dt-sky relative h-36 overflow-hidden border-b-[2.5px] border-ink sm:h-48" style={{ ["--w" as string]: "100%" }}>
        {/* stars come out for the calm closing (group fades; each star twinkles inside it) */}
        <div aria-hidden className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: dusk }}>
        {STARS.map((st, i) => (
          <svg
            key={i}
            aria-hidden
            viewBox="0 0 10 10"
            className="dt-star absolute transition-opacity duration-1000"
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s * 1.6, animationDelay: `${-i * 0.4}s` }}
          >
            <path d="M5 0 6.2 3.8 10 5 6.2 6.2 5 10 3.8 6.2 0 5 3.8 3.8z" fill="#fff7d6" />
          </svg>
        ))}
        </div>

        {/* drifting clouds that blush at sunset */}
        <div aria-hidden className="absolute inset-0" style={{ ["--w" as string]: "100cqw", containerType: "inline-size" } as React.CSSProperties}>
          {CLOUDS.map((c, i) => (
            <svg
              key={i}
              viewBox="0 0 120 64"
              className="dt-cloud"
              style={{ top: `${c.y}%`, width: c.w, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, opacity: 0.95 - dusk * 0.25 }}
            >
              <path d={CLOUD_PATH} fill="var(--cloud)" stroke="var(--color-ink)" strokeOpacity=".55" strokeWidth="3" />
            </svg>
          ))}
        </div>

        <svg aria-hidden viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d={pathD} fill="none" stroke={dusk > 0.4 ? "#ffffff" : "var(--color-ink)"} strokeOpacity={dusk > 0.4 ? 0.55 : 0.2} strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* the sun: position, size, colour, glow and ray length all follow the hour */}
        <div
          aria-hidden
          className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-16 sm:w-16"
          style={{ left: `${sun.x}%`, top: `${sun.y}%` }}
        >
          <div
            className="absolute -inset-[160%] rounded-full transition-[opacity,transform] duration-1000"
            style={{ background: "radial-gradient(circle, var(--sun-glow) 0%, transparent 62%)", opacity: 0.35 + light.glow * 0.5, transform: `scale(${0.6 + light.glow * 0.55})` }}
          />
          <svg viewBox="0 0 100 100" className="relative h-full w-full overflow-visible transition-transform duration-1000" style={{ transform: `scale(${light.size})` }}>
            <g className="dt-rays">
              {Array.from({ length: 12 }).map((_, k) => (
                <rect
                  key={k}
                  x="46.5"
                  y={22 - light.rays * 20}
                  width="7"
                  height={light.rays * 18 + 2}
                  rx="3.5"
                  fill="var(--sun-ray)"
                  transform={`rotate(${k * 30} 50 50)`}
                  style={{ transition: "y 1s ease, height 1s ease" }}
                />
              ))}
            </g>
            <circle cx="50" cy="50" r="25" fill="var(--sun-core)" stroke="var(--color-ink)" strokeWidth="3.5" />
            <circle cx="42" cy="42" r="7" fill="#fff" opacity={0.25 + light.glow * 0.35} />
          </svg>
        </div>

        {/* rolling hills: the sun rises from and sets behind them */}
        <svg aria-hidden viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 152 C 190 118, 380 128, 560 146 S 860 118, 1000 138 V200 H0 Z" fill="var(--hill-back)" stroke="var(--color-ink)" strokeOpacity=".35" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M0 174 C 180 150, 400 158, 620 172 S 880 156, 1000 168 V200 H0 Z" fill="var(--hill)" stroke="var(--color-ink)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
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
              className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink transition-[background-color,opacity] duration-300 ${i === active ? "opacity-0" : i < active ? "bg-ink" : "bg-white"}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          );
        })}

        <span
          key={light.label}
          className="animate-pop-in absolute left-3 top-3 rounded-full border-2 border-ink/15 bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink backdrop-blur-sm"
        >
          {light.label}
        </span>
        <span aria-hidden className="absolute bottom-2 left-4 hidden text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink/60 sm:block">Hello</span>
        <span aria-hidden className="absolute bottom-2 right-4 hidden text-[0.68rem] font-extrabold uppercase tracking-[0.14em] sm:block" style={{ color: dusk > 0.4 ? "rgba(255,255,255,.85)" : "rgba(43,35,85,.6)" }}>See you tomorrow</span>
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
