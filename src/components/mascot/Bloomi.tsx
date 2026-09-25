/**
 * Bloomi: the Universal Blooming mascot.
 *
 * A flower sprout with rainbow petals (the logo palette), a sunny face and
 * leaf arms. Legend (see /about#bloomi): Bloomi grows a new petal every time a
 * child learns something new.
 *
 * Server-safe and dependency-free: every pose is pure SVG, and the idle motion
 * (blink, sway, wave) is CSS-only so it costs nothing to hydrate. The eyes can
 * be steered via `look` by the client wrapper <BloomiBuddy>.
 */

export type BloomiMood = "wave" | "cheer" | "think" | "read" | "sleep" | "love" | "happy";

const INK = "#2b2355";
const PETALS = ["#e6237a", "#f7931e", "#ffc20e", "#7cb342", "#1fa99a", "#29abe2", "#3f6fc4", "#e53935"];

interface Props {
  mood?: BloomiMood;
  /** Pupil offset in SVG units, each axis clamped to ±4. */
  look?: { x: number; y: number };
  /** Idle animations (sway, blink, wave). Off for OG images / print. */
  animated?: boolean;
  spin?: boolean;
  /** Blink only: no idle sway, bob or wave loop (calm placements like the hero). */
  still?: boolean;
  className?: string;
  title?: string;
  /* ── Frame-driven controls for video (Remotion). Defaults = normal Bloomi. ── */
  /** How many petals are grown (0–8), in a balanced growth order. */
  petalCount?: number;
  /** Scale (0–1) of the newest petal, for the "grow a petal" moment. */
  petalPop?: number;
  /** Lip-sync: 0 = closed smile, 1 = wide open. Overrides the mood's mouth. */
  mouthOpen?: number;
  /** Force eyes closed for a blink. */
  blink?: boolean;
  /** Wave arm angle in degrees (wave mood), replaces the CSS wave loop. */
  waveAngle?: number;
  /** Head tilt in degrees (head + petals pivot at the neck). */
  headTilt?: number;
  /** Extra petal rotation in degrees, for follow-through wobble. */
  petalSpin?: number;
}

// Petals grow in a balanced order (top, sides, upper diagonals, lower diagonals, bottom) so a partly grown Bloomi still looks tidy.
const GROWTH_ORDER = [0, 2, 6, 1, 7, 3, 5, 4];

export function Bloomi({ mood = "happy", look, animated = true, spin = false, still = false, className, title = "Bloomi, the Universal Blooming mascot", petalCount = 8, petalPop = 1, mouthOpen, blink = false, waveAngle, headTilt, petalSpin }: Props) {
  const tilt = headTilt ? `rotate(${headTilt} 100 140)` : undefined;
  const lx = Math.max(-4, Math.min(4, look?.x ?? (mood === "think" ? 2 : 0)));
  const ly = Math.max(-4, Math.min(4, look?.y ?? (mood === "think" ? -3 : mood === "read" ? 3 : 0)));
  const a = animated;
  const idle = animated && !still;

  const eyesClosed = mood === "sleep" || blink;
  const heartEyes = mood === "love";

  return (
    <svg viewBox="0 0 200 250" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <style>{`
        .bl-sway{transform-origin:100px 230px;animation:bl-sway 4.5s ease-in-out infinite}
        .bl-blink{transform-origin:100px 92px;animation:bl-blink 5s infinite}
        .bl-wave{transform-origin:122px 160px;animation:bl-wave 1.1s ease-in-out infinite}
        .bl-petals{transform-origin:100px 92px;transition:transform 1s cubic-bezier(.34,1.56,.64,1)}
        .bl-spin{transform:rotate(360deg)}
        .bl-bob{animation:bl-bob 2.4s ease-in-out infinite}
        .bl-z{animation:bl-z 3s ease-in infinite;opacity:0}
        @keyframes bl-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
        @keyframes bl-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
        @keyframes bl-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-28deg)}}
        @keyframes bl-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes bl-z{0%{opacity:0;transform:translate(0,0) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translate(14px,-30px) scale(1.2)}}
        @media (prefers-reduced-motion:reduce){.bl-sway,.bl-blink,.bl-wave,.bl-bob,.bl-z{animation:none}.bl-z{opacity:1}}
      `}</style>

      {/* ground shadow */}
      <ellipse cx="100" cy="238" rx="46" ry="7" fill={INK} opacity=".12" />

      <g className={idle ? "bl-sway" : undefined}>
        {/* feet */}
        <path d="M74 226 q0 -12 14 -12 h8 v14 q0 4 -4 4 h-14 q-4 0 -4 -6z" fill="#f7931e" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M126 226 q0 -12 -14 -12 h-8 v14 q0 4 4 4 h14 q4 0 4 -6z" fill="#f7931e" stroke={INK} strokeWidth="4" strokeLinejoin="round" />

        {/* petals sit behind the body so the stem reads as a neck */}
        <g className={idle && mood !== "sleep" ? "bl-bob" : undefined} transform={tilt}>
          {/* petals */}
          <g className={`bl-petals ${spin ? "bl-spin" : ""}`} transform={petalSpin ? `rotate(${petalSpin} 100 92)` : undefined}>
            {PETALS.map((c, i) => {
              const rank = GROWTH_ORDER.indexOf(i);
              if (rank >= petalCount) return null;
              const scale = rank === petalCount - 1 ? petalPop : 1;
              return (
                <ellipse
                  key={i}
                  cx="100"
                  cy="38"
                  rx="19"
                  ry="26"
                  fill={c}
                  stroke={INK}
                  strokeWidth="4"
                  transform={`rotate(${i * 45} 100 92)${scale !== 1 ? ` translate(100 64) scale(${scale}) translate(-100 -64)` : ""}`}
                />
              );
            })}
          </g>

        </g>

        {/* body: chubby sprout stem */}
        <path d="M76 150 q-4 40 4 62 q20 10 40 0 q8 -22 4 -62 q-24 -12 -48 0z" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M86 168 q14 8 28 0 q2 22 -2 36 q-12 5 -24 0 q-4 -14 -2 -36z" fill="#b5dc7f" />
        {/* star badge from the logo */}
        <path d="M100 172l3.6 7.4 8.2 1-6 5.6 1.6 8.1-7.4-4.1-7.4 4.1 1.6-8.1-6-5.6 8.2-1z" fill="#ffc20e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />

        {/* resting arms (drawn behind the head) */}
        {(mood === "happy" || mood === "read" || mood === "sleep" || mood === "love") && (
          <>
            <path d="M78 162 q-30 4 -40 26 q26 4 42 -14" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M122 162 q30 4 40 26 q-26 4 -42 -14" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
          </>
        )}
        {mood === "wave" && (
          <path d="M78 162 q-30 4 -40 26 q26 4 42 -14" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
        )}

        {/* book for reading pose */}
        {mood === "read" && (
          <g>
            <path d="M68 170 l32 6 v30 l-32 -6z" fill="#29abe2" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M132 170 l-32 6 v30 l32 -6z" fill="#e6237a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M76 180 l16 3 M76 188 l16 3 M124 180 l-16 3 M124 188 l-16 3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* head group */}
        <g className={idle && mood !== "sleep" ? "bl-bob" : undefined} transform={tilt}>
          {/* face */}
          <circle cx="100" cy="92" r="44" fill="#ffe3a8" stroke={INK} strokeWidth="4.5" />
          {/* little sprout curl on top */}
          <path d="M100 48 q-2 -10 6 -14" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />

          {/* cheeks */}
          <ellipse cx="72" cy="106" rx="9" ry="6" fill="#f79ac0" opacity=".85" />
          <ellipse cx="128" cy="106" rx="9" ry="6" fill="#f79ac0" opacity=".85" />

          {/* eyes */}
          {eyesClosed ? (
            <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M76 92 q8 6 16 0" />
              <path d="M108 92 q8 6 16 0" />
            </g>
          ) : heartEyes ? (
            <g fill="#e6237a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <path d="M84 100 l-10 -10 a6 6 0 0 1 10 -7 a6 6 0 0 1 10 7z" />
              <path d="M116 100 l-10 -10 a6 6 0 0 1 10 -7 a6 6 0 0 1 10 7z" />
            </g>
          ) : mood === "cheer" ? (
            <g stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none">
              <path d="M76 94 q8 -10 16 0" />
              <path d="M108 94 q8 -10 16 0" />
            </g>
          ) : (
            <g className={a ? "bl-blink" : undefined}>
              <ellipse cx="84" cy="90" rx="10" ry="12" fill="#fff" stroke={INK} strokeWidth="3.5" />
              <ellipse cx="116" cy="90" rx="10" ry="12" fill="#fff" stroke={INK} strokeWidth="3.5" />
              <g style={{ transition: "transform .15s ease-out" }} transform={`translate(${lx} ${ly})`}>
                <circle cx="84" cy="91" r="6.5" fill={INK} />
                <circle cx="116" cy="91" r="6.5" fill={INK} />
                <circle cx="86.5" cy="88" r="2.3" fill="#fff" />
                <circle cx="118.5" cy="88" r="2.3" fill="#fff" />
              </g>
            </g>
          )}

          {/* mouth */}
          {mouthOpen !== undefined ? (
            mouthOpen > 0.08 ? (
              <g>
                <path d={`M87 106 q13 ${4 + mouthOpen * 16} 26 0 q-13 -4 -26 0z`} fill="#c62828" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
                {mouthOpen > 0.45 && <ellipse cx="100" cy={108 + mouthOpen * 6} rx="6" ry={2 + mouthOpen * 2.5} fill="#f48fb1" />}
              </g>
            ) : (
              <path d="M88 108 q12 12 24 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
            )
          ) : mood === "cheer" || mood === "love" ? (
            <path d="M86 108 q14 18 28 0z" fill="#e53935" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          ) : mood === "think" ? (
            <ellipse cx="104" cy="112" rx="4.5" ry="5" fill={INK} />
          ) : mood === "sleep" ? (
            <path d="M94 112 q6 3 12 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          ) : (
            <path d="M88 108 q12 12 24 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          )}
        </g>

        {/* raised arms go in front of the petals */}
        {mood === "wave" && (
          <g className={idle && waveAngle === undefined ? "bl-wave" : undefined} transform={waveAngle !== undefined ? `rotate(${waveAngle} 122 160)` : undefined}>
            <path d="M120 160 q34 -6 52 -50 q-34 0 -54 36" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M136 146 q14 -12 24 -26" fill="none" stroke="#4f8a24" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}
        {mood === "cheer" && (
          <>
            <path d="M80 160 q-34 -8 -50 -52 q34 2 52 38" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M120 160 q34 -8 50 -52 q-34 2 -52 38" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
          </>
        )}
        {mood === "think" && (
          <>
            <path d="M80 164 q-22 10 -26 28 q18 2 30 -14" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M120 164 q18 -4 12 -24 q-8 -6 -24 -2 q8 8 4 20" fill="#7cb342" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
          </>
        )}

        {/* mood extras */}
        {mood === "cheer" && (
          <g fill="#ffc20e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
            <path d="M30 60l4 8 9 1-6.5 6 1.7 9-8.2-4.6-8.2 4.6 1.7-9L18 69l9-1z" />
            <path d="M172 50l3 6 7 .8-5 4.6 1.3 7-6.3-3.5-6.3 3.5 1.3-7-5-4.6 7-.8z" />
          </g>
        )}
        {mood === "think" && (
          <g fill="none" stroke="#3f6fc4" strokeWidth="4" strokeLinecap="round">
            <path d="M160 40 q10 -12 18 0 q2 10 -9 12 v6" />
            <circle cx="169" cy="66" r="1.5" fill="#3f6fc4" />
          </g>
        )}
        {mood === "love" && (
          <g fill="#e6237a" stroke={INK} strokeWidth="2">
            <path className={a ? "bl-z" : undefined} d="M160 60 l-8 -8 a5 5 0 0 1 8 -6 a5 5 0 0 1 8 6z" />
            <path className={a ? "bl-z" : undefined} style={{ animationDelay: "1.4s" }} d="M40 70 l-6 -6 a4 4 0 0 1 6 -5 a4 4 0 0 1 6 5z" />
          </g>
        )}
        {mood === "sleep" && (
          <g fill={INK} fontFamily="system-ui, sans-serif" fontWeight="800">
            <text className={a ? "bl-z" : undefined} x="146" y="54" fontSize="18">z</text>
            <text className={a ? "bl-z" : undefined} style={{ animationDelay: "1s" }} x="158" y="40" fontSize="22">Z</text>
          </g>
        )}
      </g>
    </svg>
  );
}
