/**
 * Bloomi intro, v2 (12 s, 1920×1080, 30 fps).
 *
 * Story beats (synced to the score's beat grid, 120 BPM from the bloom):
 *   0.0 s  Hook: a sprout pops out of the grass, the bud grows and wiggles (slide whistle)
 *   1.2 s  BLOOM: the bud bursts into Bloomi; flowers pop up across the meadow; band enters
 *   1.5 s  "Hi! I'm Bloomi!" (wave, eyes to camera)
 *   3.0 s  Anticipation crouch → hop left; camera follows (parallax)
 *   3.3 s  "Every time a child learns something new, I grow a petal!"
 *   4.2 s+ Five learning moments fly in on the beat; Bloomi's eyes track each one;
 *          each grows a petal (rising chimes) with squash, head tilt and petal follow-through
 *   7.2 s  Full bloom: crouch, jump, confetti cannons, camera punch (ta-da)
 *   7.7 s  Flower-shaped wipe out of Bloomi into the end card
 *   8.7 s  "Come bloom with us, at Universal Blooming!" + programs + Book a visit
 *
 * All on-screen text is revealed word-by-word from the VO timings, so the film
 * works muted (website autoplay) and with sound.
 */
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { Bloomi, type BloomiMood } from "../../src/components/mascot/Bloomi";
import { Flower } from "../../src/components/art/Doodles";
import voice from "./voice.json";

const { fontFamily: DISPLAY } = loadFredoka("normal", { weights: ["500", "600", "700"] });
const { fontFamily: BODY } = loadNunito("normal", { weights: ["700", "800", "900"] });

const INK = "#2b2355";
const PINK = "#e6237a";
const COLORS = ["#e6237a", "#f7931e", "#ffc20e", "#7cb342", "#1fa99a", "#29abe2", "#3f6fc4", "#e53935"];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/* ─────────────── Timeline ─────────────── */
const SPROUT = 3;
const BLOOM = 36;
const VO = { l1: 46, l2: 100, l3: 262 } as const;
const HOP = 92;
const LEARN = [
  { icon: "🎨", label: "Art", at: 126 },
  { icon: "📚", label: "Stories", at: 141 },
  { icon: "🎵", label: "Music", at: 156 },
  { icon: "🔬", label: "Science", at: 171 },
  { icon: "⚽", label: "Play", at: 186 },
];
const START_PETALS = 3;
const CELEBRATE = 216;
const WIPE = 230;
const WIPE_END = 252;
const BLINKS = [74, 150, 205, 300, 340];
const LEFT_X = -420;
const HEAD_Y = 520;

type Key = keyof typeof VO;
type Line = { frames: number; envelope: number[]; words: { w: string; start: number; end: number }[] };
const V = voice as unknown as Record<Key, Line>;
const KEYS = Object.keys(VO) as Key[];

function mouthAt(frame: number): number | undefined {
  for (const k of KEYS) {
    const i = frame - VO[k];
    const env = V[k].envelope;
    if (i >= 0 && i < env.length) return Math.min(1, ((env[i] ?? 0) * 0.65 + (env[i - 1] ?? 0) * 0.35) * 1.2);
  }
  return undefined;
}
const speaking = (f: number) => KEYS.some((k) => f >= VO[k] && f < VO[k] + V[k].frames);

/** Damped wobble for follow-through (0 before t=0). */
const wobble = (t: number, amp: number, decay = 7, freq = 2.3) => (t < 0 ? 0 : amp * Math.exp(-t / decay) * Math.sin(t / freq));

/* ─────────────── Camera ─────────────── */
function useCamera() {
  const f = useCurrentFrame();
  const zoomIn = interpolate(f, [0, BLOOM - 2, BLOOM + 30], [1.62, 1.5, 1], { ...clamp, easing: EASE });
  const push = interpolate(f, [110, CELEBRATE], [0, 0.045], clamp);
  const punch = f >= CELEBRATE ? 0.05 * Math.exp(-(f - CELEBRATE) / 8) : 0;
  const panX = interpolate(f, [HOP - 4, HOP + 20], [0, 70], { ...clamp, easing: EASE });
  const shake = f >= CELEBRATE && f < CELEBRATE + 14 ? (random(`sx${f}`) - 0.5) * 14 * Math.exp(-(f - CELEBRATE) / 5) : 0;
  return { zoom: zoomIn + push + punch, panX, shake };
}

/* ─────────────── World layers (parallax) ─────────────── */
const CLOUD = "M28 58h66c12 0 20-8 20-18s-8-18-19-18c-2-11-12-19-24-19-10 0-18 6-22 14-3-2-6-3-10-3-10 0-17 8-17 17v1C12 33 6 40 6 47c0 7 9 11 22 11z";

function Sky({ panX }: { panX: number }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffe9b8 0%, #fff4d6 45%, #fff9f0 75%)" }}>
      <div style={{ position: "absolute", right: 110 - panX * 0.1, top: 70, width: 170, height: 170 }}>
        <div style={{ position: "absolute", inset: -60, borderRadius: 999, background: "radial-gradient(circle, rgba(255,194,14,.35), rgba(255,194,14,0) 65%)" }} />
        <svg viewBox="0 0 120 120" style={{ position: "absolute", inset: 0, transform: `rotate(${f * 0.35}deg)` }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="56" y="2" width="8" height="20" rx="4" fill="#f7931e" transform={`rotate(${i * 30} 60 60)`} />
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 38, borderRadius: 999, background: "#ffc20e", border: `5px solid ${INK}` }} />
      </div>
      {[
        { x: 120, y: 190, s: 1, v: 0.25 },
        { x: 700, y: 60, s: 0.62, v: 0.14 },
      ].map((c, i) => (
        <svg key={i} viewBox="0 0 120 64" style={{ position: "absolute", left: c.x + f * c.v - panX * 0.15, top: c.y, width: 210 * c.s }}>
          <path d={CLOUD} fill="#fff" stroke={INK} strokeWidth="3" />
        </svg>
      ))}
    </AbsoluteFill>
  );
}

function Schoolhouse({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 -10 200 185" style={style}>
      <rect x="30" y="72" width="140" height="92" rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
      <path d="M14 82 L100 18 L186 82 Z" fill={PINK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="100" cy="56" r="11" fill="#ffc20e" stroke={INK} strokeWidth="4" />
      <rect x="84" y="112" width="32" height="52" rx="16" fill="#f7931e" stroke={INK} strokeWidth="4" />
      <rect x="44" y="94" width="28" height="24" rx="6" fill="#29abe2" stroke={INK} strokeWidth="4" />
      <rect x="128" y="94" width="28" height="24" rx="6" fill="#29abe2" stroke={INK} strokeWidth="4" />
      <path d="M100 18 V-6" stroke={INK} strokeWidth="4" />
      <path d="M100 -6 l22 6 -22 6z" fill="#7cb342" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Hills({ panX }: { panX: number }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-panX * 0.4}px)` }}>
        <Schoolhouse style={{ position: "absolute", right: 250, bottom: 318, width: 180 }} />
        <svg viewBox="0 0 2120 420" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: -100, width: 2120, height: 420 }}>
          <path d="M0 150 C 380 70, 760 120, 1100 150 S 1700 60, 2120 130 V420 H0 Z" fill="#d6ecb0" stroke={INK} strokeWidth="5" />
        </svg>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-panX}px)` }}>
        <svg viewBox="0 0 2200 300" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: -140, width: 2200, height: 300 }}>
          <path d="M0 110 C 420 40, 900 60, 1250 105 S 1900 160, 2200 80 V300 H0 Z" fill="#b5dc7f" stroke={INK} strokeWidth="6" />
          <path d="M0 200 C 520 150, 1060 180, 1500 205 S 2000 230, 2200 190 V300 H0 Z" fill="#8cc35a" opacity=".55" />
        </svg>
      </div>
    </>
  );
}

const MEADOW = [
  { x: 90, y: 1060, s: 130, c: "#29abe2" },
  { x: 300, y: 1085, s: 92, c: "#f7931e" },
  { x: 760, y: 1090, s: 80, c: "#7cb342" },
  { x: 1230, y: 1070, s: 104, c: "#e6237a" },
  { x: 1470, y: 1092, s: 78, c: "#ffc20e" },
  { x: 1680, y: 1055, s: 120, c: "#3f6fc4" },
  { x: 1870, y: 1088, s: 88, c: "#e53935" },
];

/** Foreground flowers pop up in a cascade out from the bloom point. */
function Meadow({ panX }: { panX: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${-panX * 1.35}px)` }}>
      {MEADOW.map((m, i) => {
        const at = BLOOM + 4 + Math.abs(m.x - 960) / 45;
        const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 140 } });
        const sway = Math.sin((f + i * 17) / 16) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: m.x - m.s / 2, top: m.y - m.s * 1.9, width: m.s, transformOrigin: "50% 100%", transform: `scale(${s}) rotate(${sway}deg)` }}>
            <Flower petal={m.c} style={{ width: m.s, height: m.s, display: "block" }} />
            <div style={{ width: Math.max(6, m.s * 0.08), height: m.s * 0.9, background: "#5e9a2c", border: `2px solid ${INK}`, margin: "-6px auto 0", borderRadius: 4 }} />
          </div>
        );
      })}
      {Array.from({ length: 16 }).map((_, i) => (
        <svg key={i} viewBox="0 0 40 30" style={{ position: "absolute", left: i * 128 + 20, top: 1050 - (i % 3) * 8, width: 44 }}>
          <path d="M4 30 Q8 10 12 30 M14 30 Q20 2 24 30 M26 30 Q32 12 36 30" fill="none" stroke="#5e9a2c" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────── Hook: sprout → bud → bloom ─────────────── */
function Sprout() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f > BLOOM + 1) return null;
  const pop = spring({ frame: f - SPROUT, fps, config: { damping: 7, stiffness: 200 } });
  const grow = interpolate(f, [8, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wiggle = Math.sin(f / (2.4 - grow)) * (3 + grow * 9);
  const squash = interpolate(f, [28, 35], [1, 0.8], clamp);
  const stem = 40 + grow * 190;
  const bud = 0.4 + grow * 0.6;
  const leaf = `M100 ${400 - stem * 0.45} q -40 -30 -56 -8 q 26 20 56 8z`;
  return (
    <div style={{ position: "absolute", left: 960, bottom: 150, width: 200, height: 400, transform: `translateX(-50%) scale(${pop * 1.35}) scale(${2 - squash}, ${squash})`, transformOrigin: "50% 100%" }}>
      <svg viewBox="0 0 200 400" width={200} height={400} style={{ overflow: "visible" }}>
        <g transform={`rotate(${wiggle} 100 400)`}>
          <path d={`M100 400 C 92 ${400 - stem * 0.5}, 108 ${400 - stem * 0.7}, 100 ${400 - stem}`} stroke={INK} strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d={`M100 400 C 92 ${400 - stem * 0.5}, 108 ${400 - stem * 0.7}, 100 ${400 - stem}`} stroke="#7cb342" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d={leaf} fill="#7cb342" stroke={INK} strokeWidth="4" opacity={grow} />
          <g transform={`translate(100 ${400 - stem}) scale(${bud})`}>
            <path d="M0 10 C -44 -20, -30 -90, 0 -110 C 30 -90, 44 -20, 0 10z" fill={PINK} stroke={INK} strokeWidth="6" />
            <path d="M0 6 C -18 -30, -13 -78, 0 -100" fill="none" stroke="#ffc20e" strokeWidth="9" strokeLinecap="round" />
            <path d="M0 6 C 18 -30, 13 -78, 0 -100" fill="none" stroke="#29abe2" strokeWidth="9" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function BloomFlash() {
  const f = useCurrentFrame();
  const t = f - BLOOM;
  if (t < 0 || t > 22) return null;
  const r = interpolate(t, [0, 22], [40, 520], { easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 960 - r, top: 640 - r, width: r * 2, height: r * 2, borderRadius: 999, border: `${Math.max(1, 14 - t * 0.6)}px solid #ffc20e`, opacity: 1 - t / 22 }} />
      {Array.from({ length: 14 }).map((_, k) => {
        const a = (k / 14) * Math.PI * 2;
        const d = r * 0.8;
        return <div key={k} style={{ position: "absolute", left: 960 + Math.cos(a) * d - 11, top: 640 + Math.sin(a) * d - 11, width: 22, height: 22, borderRadius: k % 2 ? 999 : 5, background: COLORS[k % COLORS.length], opacity: 1 - t / 22, transform: `rotate(${t * 12}deg)` }} />;
      })}
    </>
  );
}

/* ─────────────── Bloomi, acted ─────────────── */
function tileScreenPos(i: number, f: number) {
  const l = LEARN[i];
  const fly = interpolate(f, [l.at - 14, l.at], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const start = { x: 1250 + i * 105, y: 780 - (i % 2) * 70 };
  const target = { x: 960 + LEFT_X, y: HEAD_Y - 40 };
  return {
    x: interpolate(fly, [0, 1], [start.x, target.x]),
    y: interpolate(fly, [0, 1], [start.y, target.y]) - Math.sin(fly * Math.PI) * 240,
    fly,
  };
}

function BloomiActor({ panX }: { panX: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < BLOOM) return null;

  const pop = spring({ frame: f - BLOOM, fps, config: { damping: 8, stiffness: 150, mass: 0.8 } });
  const stretchIn = interpolate(f - BLOOM, [0, 6, 14], [1.25, 0.9, 1], clamp);

  // Hop left: anticipation crouch → arc → squash on landing.
  const crouch = interpolate(f, [HOP - 8, HOP, HOP + 2], [1, 0.86, 1.08], clamp);
  const hopT = interpolate(f, [HOP, HOP + 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const hopY = f >= HOP && f <= HOP + 14 ? Math.sin(hopT * Math.PI) * 150 : 0;
  const land = HOP + 14;
  const landSquash = f >= land ? 1 - 0.14 * Math.exp(-(f - land) / 3) * Math.cos((f - land) / 2) : 1;
  const x = interpolate(hopT, [0, 1], [0, LEFT_X]);

  // Petal beats: squash, alternating head tilt, petal follow-through.
  const grown = LEARN.filter((l) => f >= l.at).length;
  const last = LEARN[grown - 1];
  const petalPop = last ? spring({ frame: f - last.at, fps, config: { damping: 7, stiffness: 170 } }) : 1;
  const beatSquash = LEARN.reduce((acc, l) => acc * (f >= l.at ? 1 - 0.08 * Math.exp(-(f - l.at) / 3) : 1), 1);
  const tilt = LEARN.reduce((acc, l, i) => acc + wobble(f - l.at, i % 2 ? -7 : 7, 8, 2.6), 0);
  const petalSpin = LEARN.reduce((acc, l) => acc + wobble(f - l.at, 10, 6, 1.8), 0) + wobble(f - BLOOM, 18, 7, 2);

  // Celebration: crouch then jump.
  const cCrouch = f < CELEBRATE ? interpolate(f, [CELEBRATE - 8, CELEBRATE], [1, 0.85], clamp) : 1;
  const jT = interpolate(f, [CELEBRATE, CELEBRATE + 20], [0, 1], clamp);
  const jumpY = f >= CELEBRATE ? Math.sin(jT * Math.PI) * 190 : 0;
  const jumpStretch = f >= CELEBRATE && f < CELEBRATE + 8 ? 1.1 : 1;

  // Eyes track the incoming tile.
  let look = { x: 0, y: 0 };
  const flying = LEARN.findIndex((l) => f >= l.at - 22 && f < l.at);
  if (flying >= 0) {
    const p = tileScreenPos(flying, f);
    const dx = p.x - (960 + x);
    const dy = p.y - HEAD_Y;
    const d = Math.hypot(dx, dy) || 1;
    look = { x: (dx / d) * 4, y: (dy / d) * 4 };
  }

  const mood: BloomiMood = f < HOP - 8 ? "wave" : f >= CELEBRATE - 2 ? "cheer" : "happy";
  const talk = mouthAt(f);
  const breathe = 1 + Math.sin(f / 9) * 0.012;
  const scaleY = stretchIn * crouch * landSquash * beatSquash * cCrouch * jumpStretch * breathe;
  const scaleX = 1 / Math.sqrt(scaleY);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 118,
        width: 470,
        transformOrigin: "50% 100%",
        transform: `translateX(calc(-50% + ${x - panX}px)) translateY(${-hopY - jumpY}px) scale(${pop}) scale(${scaleX}, ${scaleY})`,
      }}
    >
      <Bloomi
        animated={false}
        mood={mood}
        waveAngle={mood === "wave" ? Math.sin(f / 4.2) * 18 - 6 : undefined}
        petalCount={START_PETALS + grown}
        petalPop={petalPop}
        petalSpin={petalSpin}
        headTilt={tilt + Math.sin(f / 23) * 2}
        mouthOpen={talk ?? (mood === "cheer" ? undefined : 0)}
        blink={BLINKS.some((b) => f >= b && f < b + 4)}
        look={look}
      />
    </div>
  );
}

/* ─────────────── Word-synced text ─────────────── */
function SyncedWords({ line, from, size, highlight = [], align = "left" }: { line: Key; from: number; size: number; highlight?: string[]; align?: "left" | "center" }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `0 ${size * 0.26}px`, fontFamily: DISPLAY, fontWeight: 600, fontSize: size, lineHeight: 1.06, color: INK }}>
      {V[line].words.map((w, i) => {
        const s = spring({ frame: f - from - w.start + 2, fps, config: { damping: 11, stiffness: 190 } });
        const hot = highlight.includes(w.w.replace(/[^\w]/g, "").toLowerCase());
        const saying = f - from >= w.start && f - from <= w.end + 2;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              transform: `translateY(${(1 - s) * 46}px) scale(${0.7 + s * 0.3 + (saying ? 0.05 : 0)}) rotate(${(1 - s) * -8}deg)`,
              color: hot ? PINK : undefined,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
}

function PetalMeter() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grown = START_PETALS + LEARN.filter((l) => f >= l.at).length;
  const show = interpolate(f, [112, 124], [0, 1], clamp);
  return (
    <div style={{ marginTop: 38, display: "flex", alignItems: "center", gap: 14, opacity: show, transform: `translateY(${(1 - show) * 20}px)` }}>
      {COLORS.map((c, i) => {
        const fillAt = i < START_PETALS ? -99 : LEARN[i - START_PETALS]?.at ?? 9999;
        const s = spring({ frame: f - fillAt, fps, config: { damping: 8, stiffness: 200 } });
        return (
          <div key={i} style={{ position: "relative", width: 50, height: 50, borderRadius: 999, border: `4px solid ${INK}`, background: "#fff" }}>
            <div style={{ position: "absolute", inset: 3, borderRadius: 999, background: c, transform: `scale(${i < grown ? s : 0})` }} />
          </div>
        );
      })}
      <span style={{ marginLeft: 10, fontFamily: BODY, fontWeight: 900, fontSize: 38, color: INK }}>{grown} / 8</span>
    </div>
  );
}

function StoryText({ panX }: { panX: number }) {
  const f = useCurrentFrame();
  const outA = interpolate(f, [HOP - 6, HOP + 4], [1, 0], clamp);
  const outB = interpolate(f, [WIPE - 6, WIPE + 2], [1, 0], clamp);
  return (
    <>
      {f < HOP + 6 && (
        <div style={{ position: "absolute", top: 130, width: "100%", opacity: outA, transform: `translateY(${(1 - outA) * -30}px)` }}>
          <SyncedWords line="l1" from={VO.l1} size={138} highlight={["bloomi"]} align="center" />
        </div>
      )}
      {f >= VO.l2 && f < WIPE + 4 && (
        <div style={{ position: "absolute", left: 880 - panX * 0.2, top: 170, width: 880, opacity: outB }}>
          <SyncedWords line="l2" from={VO.l2} size={84} highlight={["petal"]} />
          <PetalMeter />
        </div>
      )}
    </>
  );
}

/* ─────────────── Learning moments ─────────────── */
function LearningMoments() {
  const f = useCurrentFrame();
  return (
    <>
      {LEARN.map((l, i) => {
        const appear = l.at - 24;
        if (f < appear || f > l.at + 16) return null;
        const inT = interpolate(f, [appear, appear + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
        const p = tileScreenPos(i, f);
        const scale = inT * (1 - p.fly * 0.7);
        const burst = f >= l.at ? interpolate(f, [l.at, l.at + 16], [0, 1]) : 0;
        return (
          <div key={l.label}>
            {p.fly < 1 && (
              <div
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  transform: `translate(-50%,-50%) scale(${scale}) rotate(${(1 - inT) * -18 + p.fly * 200}deg)`,
                  background: "#fff",
                  border: `5px solid ${INK}`,
                  borderRadius: 30,
                  padding: "14px 24px",
                  boxShadow: `0 9px 0 ${INK}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: 46,
                  color: INK,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 62 }}>{l.icon}</span>
                {l.label}
              </div>
            )}
            {burst > 0 && burst < 1 && (
              <>
                {Array.from({ length: 12 }).map((_, k) => {
                  const a = (k / 12) * Math.PI * 2 + i;
                  const r = 50 + burst * 170;
                  return (
                    <div key={k} style={{ position: "absolute", left: 960 + LEFT_X + Math.cos(a) * r - 10, top: HEAD_Y - 80 + Math.sin(a) * r - 10, width: 20, height: 20, borderRadius: k % 2 ? 999 : 4, background: COLORS[(k + i) % COLORS.length], opacity: 1 - burst, transform: `scale(${1 - burst * 0.4}) rotate(${burst * 180}deg)` }} />
                  );
                })}
                <div style={{ position: "absolute", left: 960 + LEFT_X + 130, top: HEAD_Y - 260, fontFamily: DISPLAY, fontWeight: 700, fontSize: 54, color: PINK, opacity: 1 - burst, transform: `translateY(${-burst * 60}px)` }}>+1 🌸</div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ─────────────── Celebration ─────────────── */
function ConfettiCannons() {
  const f = useCurrentFrame();
  const t = f - CELEBRATE;
  if (t < 0 || t > 90) return null;
  return (
    <>
      {Array.from({ length: 120 }).map((_, i) => {
        const left = i % 2 === 0;
        const ang = (left ? -62 : -118) + (random(`a${i}`) - 0.5) * 36;
        const v = 30 + random(`v${i}`) * 24;
        const vx = Math.cos((ang * Math.PI) / 180) * v;
        const vy = Math.sin((ang * Math.PI) / 180) * v;
        const x = (left ? 40 : 1880) + vx * t * (1 - Math.min(0.5, t * 0.01));
        const y = 1080 + vy * t + 0.55 * t * t;
        const w = 14 + random(`w${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * (i % 3 === 0 ? 1 : 0.42),
              borderRadius: i % 3 === 0 ? 999 : 3,
              background: COLORS[i % COLORS.length],
              transform: `rotate(${random(`r${i}`) * 360 + t * (random(`s${i}`) * 18 - 9)}deg)`,
              opacity: interpolate(t, [60, 90], [1, 0], clamp),
            }}
          />
        );
      })}
    </>
  );
}

/* ─────────────── Flower wipe + end card ─────────────── */
function flowerPolygon(cx: number, cy: number, R: number, rot: number) {
  const pts: string[] = [];
  for (let k = 0; k < 120; k++) {
    const a = (k / 120) * Math.PI * 2;
    const r = R * (1 + 0.13 * Math.cos(8 * (a + rot)));
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)}px ${(cy + Math.sin(a) * r).toFixed(1)}px`);
  }
  return `polygon(${pts.join(",")})`;
}

function EndCard() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < WIPE) return null;
  const R = interpolate(f, [WIPE, WIPE_END], [0, 2400], { ...clamp, easing: Easing.in(Easing.quad) });
  const clip = f < WIPE_END ? flowerPolygon(960 + LEFT_X, HEAD_Y - 120, R, f / 20) : undefined;
  const s = (d: number) => spring({ frame: f - WIPE_END - d, fps, config: { damping: 13, stiffness: 120 } });
  const universalAt = VO.l3 + (V.l3.words.find((w) => w.w.startsWith("Universal"))?.start ?? 38);
  const logo = spring({ frame: f - universalAt + 4, fps, config: { damping: 10, stiffness: 140 } });
  const talk = mouthAt(f);
  const ctaPulse = f > 320 ? 1 + Math.max(0, Math.sin((f - 320) / 5)) * 0.035 : 1;
  const bloomiIn = spring({ frame: f - WIPE + 4, fps, config: { damping: 11, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ clipPath: clip, background: "#fff5cc" }}>
      <div style={{ position: "absolute", left: 960 + LEFT_X - 1400, top: 540 - 1400, width: 2800, height: 2800, borderRadius: 999, background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,.75) 0deg 9deg, rgba(255,255,255,0) 9deg 18deg)", transform: `rotate(${f * 0.25}deg)` }} />
      <div style={{ position: "absolute", left: 960 + LEFT_X - 360, top: 200, width: 720, height: 720, borderRadius: 999, background: "radial-gradient(circle, #ffe08a 0%, rgba(255,224,138,0) 70%)" }} />
      <svg viewBox="0 0 1920 200" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 170 }}>
        <path d="M0 80 C 500 20, 1100 40, 1500 70 S 1850 110, 1920 60 V200 H0 Z" fill="#b5dc7f" stroke={INK} strokeWidth="6" />
      </svg>

      <div style={{ position: "absolute", left: 960 + LEFT_X, bottom: 70, width: 500, transform: `translateX(-50%) scale(${0.75 + bloomiIn * 0.25})`, transformOrigin: "50% 100%" }}>
        <Bloomi
          animated={false}
          mood={f > 322 ? "wave" : "happy"}
          waveAngle={f > 322 ? Math.sin(f / 4) * 18 - 6 : undefined}
          petalSpin={wobble(f - WIPE, 12, 8, 2)}
          headTilt={Math.sin(f / 20) * 3}
          mouthOpen={talk ?? 0}
          blink={BLINKS.some((b) => f >= b && f < b + 4)}
          look={{ x: 2, y: 0 }}
        />
      </div>

      <div style={{ position: "absolute", left: 860, top: 150, width: 980 }}>
        <SyncedWords line="l3" from={VO.l3} size={92} highlight={["bloom"]} />
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 34, opacity: logo, transform: `translateY(${(1 - logo) * 40}px) scale(${0.9 + logo * 0.1})`, transformOrigin: "left center" }}>
          <div style={{ width: 150, height: 150, borderRadius: 999, background: "#fff", border: `5px solid ${INK}`, display: "grid", placeItems: "center", boxShadow: `0 8px 0 ${INK}` }}>
            <Img src={staticFile("images/logo.webp")} style={{ width: 122 }} />
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.25 }}>
            Preschool · Day Care · After School
            <div style={{ fontWeight: 800, fontSize: 30, color: "#564d7f" }}>Where young minds bloom</div>
          </div>
        </div>
        <div style={{ marginTop: 30, display: "flex", gap: 12, whiteSpace: "nowrap" }}>
          {["🎨 Preschool · 3–6", "🧸 Day Care", "⚽ After School Activities · 3+"].map((p, i) => (
            <span key={p} style={{ opacity: s(40 + i * 4), transform: `translateY(${(1 - s(40 + i * 4)) * 30}px)`, fontFamily: BODY, fontWeight: 800, fontSize: 29, color: INK, background: "#fff", border: `4px solid ${INK}`, borderRadius: 999, padding: "10px 20px" }}>
              {p}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 22, opacity: s(54), transform: `translateY(${(1 - s(54)) * 30}px) scale(${ctaPulse})`, transformOrigin: "left center" }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 50, color: "#fff", background: PINK, border: `5px solid ${INK}`, boxShadow: `0 10px 0 ${INK}`, borderRadius: 999, padding: "16px 44px" }}>Book a visit →</span>
          <span style={{ fontFamily: BODY, fontWeight: 900, fontSize: 30, color: INK }}>universalblooming.com</span>
        </div>
        <div style={{ marginTop: 26, opacity: s(62), transform: `translateY(${(1 - s(62)) * 20}px)`, fontFamily: BODY, fontWeight: 800, fontSize: 30, color: "#564d7f" }}>
          📍 Khalifa Street, Abu Dhabi · near WTC Mall
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─────────────── Composition ─────────────── */
/** The site's design tokens, so shared components (Doodles, Bloomi) render with brand colours. */
const TOKENS = {
  "--color-ink": INK, "--color-pink": PINK, "--color-orange": "#f7931e", "--color-yellow": "#ffc20e",
  "--color-green": "#7cb342", "--color-teal": "#1fa99a", "--color-sky": "#29abe2", "--color-blue": "#3f6fc4", "--color-red": "#e53935",
} as React.CSSProperties;

function Scene() {
  const { zoom, panX, shake } = useCamera();
  return (
    <AbsoluteFill style={{ ...TOKENS, background: "#fff9f0", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px) scale(${zoom})`, transformOrigin: "50% 78%" }}>
        <Sky panX={panX} />
        <Hills panX={panX} />
        <Sprout />
        <BloomFlash />
        <StoryText panX={panX} />
        <LearningMoments />
        <BloomiActor panX={panX} />
        <Meadow panX={panX} />
        <ConfettiCannons />
      </AbsoluteFill>
      <EndCard />
    </AbsoluteFill>
  );
}

export const BloomiIntro = () => (
  <>
    <CameraMotionBlur shutterAngle={160} samples={5}>
      <Scene />
    </CameraMotionBlur>

    {/* Sound: every event sits on the score's beat grid. */}
    <Audio src={staticFile("audio/music.wav")} volume={(f) => (speaking(f) ? 0.3 : 0.62)} />
    {KEYS.map((k) => (
      <Sequence key={k} from={VO[k]}>
        <Audio src={staticFile(`audio/${k}.wav`)} />
      </Sequence>
    ))}
    <Sequence from={SPROUT}><Audio src={staticFile("audio/boing.wav")} volume={0.35} /></Sequence>
    <Sequence from={9}><Audio src={staticFile("audio/slide.wav")} volume={0.55} /></Sequence>
    <Sequence from={BLOOM}><Audio src={staticFile("audio/bloom.wav")} volume={0.8} /></Sequence>
    <Sequence from={HOP + 14}><Audio src={staticFile("audio/boing.wav")} volume={0.3} /></Sequence>
    {LEARN.map((l, i) => (
      <Sequence key={l.label} from={l.at - 14}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.35} />
        <Sequence from={14}>
          <Audio src={staticFile(`audio/chime${i}.wav`)} volume={0.6} />
        </Sequence>
      </Sequence>
    ))}
    <Sequence from={CELEBRATE}><Audio src={staticFile("audio/tada.wav")} volume={0.75} /></Sequence>
    <Sequence from={WIPE}><Audio src={staticFile("audio/swish.wav")} volume={0.6} /></Sequence>
  </>
);
