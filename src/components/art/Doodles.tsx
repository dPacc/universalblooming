/**
 * Hand-drawn style SVG doodles echoing the logo (stars, planet, flowers,
 * clouds). Pure SVG so they are crisp, tiny, themeable and decorative-only
 * (aria-hidden).
 */
type P = { className?: string; style?: React.CSSProperties };

export function Star({ className, style, fill = "var(--color-yellow)" }: P & { fill?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={className} style={style}>
      <path
        d="M24 3.5l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 32.7l-11.9 6.7L15 26.2l-10-9 13.4-1.4z"
        fill={fill}
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ className, style, fill = "var(--color-pink)" }: P & { fill?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className} style={style}>
      <path d="M20 2c1.8 10.5 7.5 16.2 18 18-10.5 1.8-16.2 7.5-18 18-1.8-10.5-7.5-16.2-18-18C12.5 18.2 18.2 12.5 20 2z" fill={fill} />
    </svg>
  );
}

export function Cloud({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 120 64" className={className} style={style}>
      <path
        d="M28 58h66c12 0 20-8 20-18s-8-18-19-18c-2-11-12-19-24-19-10 0-18 6-22 14-3-2-6-3-10-3-10 0-17 8-17 17v1C12 33 6 40 6 47c0 7 9 11 22 11z"
        fill="#fff"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Saturn-style planet from the logo. */
export function Planet({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 160 110" className={className} style={style}>
      <ellipse cx="80" cy="58" rx="74" ry="20" fill="none" stroke="var(--color-ink)" strokeWidth="6" transform="rotate(-12 80 58)" />
      <circle cx="80" cy="55" r="34" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="6" />
      <circle cx="94" cy="48" r="8" fill="var(--color-orange)" stroke="var(--color-ink)" strokeWidth="4" />
      <circle cx="66" cy="70" r="5" fill="var(--color-blue)" stroke="var(--color-ink)" strokeWidth="3" />
      <path d="M8 72 C 40 90, 120 80, 152 44" fill="none" stroke="var(--color-ink)" strokeWidth="6" strokeLinecap="round" transform="rotate(-4 80 58)" />
    </svg>
  );
}

const PETALS = [0, 60, 120, 180, 240, 300];

/** Six-petal flower; `bloom` animates petals opening one by one. */
export function Flower({
  className,
  style,
  petal = "var(--color-pink)",
  center = "var(--color-yellow)",
  bloom = false,
}: P & { petal?: string; center?: string; bloom?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      {PETALS.map((r, i) => (
        <g key={r} transform={`rotate(${r} 50 50)`}>
          <ellipse
            cx="50"
            cy="24"
            rx="14"
            ry="20"
            fill={petal}
            stroke="var(--color-ink)"
            strokeWidth="3"
            className={bloom ? "animate-bloom" : undefined}
            style={bloom ? { transformOrigin: "50px 50px", animationDelay: `${0.15 * i}s` } : undefined}
          />
        </g>
      ))}
      <circle cx="50" cy="50" r="15" fill={center} stroke="var(--color-ink)" strokeWidth="3" />
      <circle cx="45" cy="47" r="2.2" fill="var(--color-ink)" />
      <circle cx="55" cy="47" r="2.2" fill="var(--color-ink)" />
      <path d="M44 54 q6 5 12 0" fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Sun({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className} style={style}>
      <g className="origin-center animate-spin-slow" style={{ transformBox: "fill-box" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="57" y="4" width="6" height="18" rx="3" fill="var(--color-orange)" transform={`rotate(${i * 30} 60 60)`} />
        ))}
      </g>
      <circle cx="60" cy="60" r="30" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="3.5" />
      <circle cx="50" cy="56" r="3" fill="var(--color-ink)" />
      <circle cx="70" cy="56" r="3" fill="var(--color-ink)" />
      <circle cx="44" cy="66" r="4" fill="var(--color-pink)" opacity=".5" />
      <circle cx="76" cy="66" r="4" fill="var(--color-pink)" opacity=".5" />
      <path d="M50 67 q10 9 20 0" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Squiggle({ className, style, color = "var(--color-teal)" }: P & { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 24" preserveAspectRatio="none" className={className} style={style}>
      <path d="M4 12 q10 -12 20 0 t20 0 t20 0 t20 0 t20 0 t12 0" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Scalloped/wavy section edge. `flip` puts the wave on the bottom of a section. */
export function Wave({ className, color = "var(--color-cream)", flip = false }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block w-full h-8 sm:h-12 ${flip ? "rotate-180" : ""} ${className ?? ""}`}>
      <path d="M0 30 C 120 0, 240 0, 360 30 S 600 60, 720 30 S 960 0, 1080 30 S 1320 60, 1440 30 V60 H0 Z" fill={color} />
    </svg>
  );
}

/** Two children reaching for stars: a simplified nod to the logo's figures. */
export function KidsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Two happy children reaching for the stars">
      <circle cx="200" cy="215" r="170" fill="var(--color-yellow-soft)" />
      <circle cx="200" cy="215" r="170" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeDasharray="4 12" strokeLinecap="round" />
      {/* planet base */}
      <ellipse cx="200" cy="340" rx="120" ry="26" fill="none" stroke="var(--color-ink)" strokeWidth="7" transform="rotate(-8 200 340)" />
      <circle cx="200" cy="332" r="46" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="7" />
      <circle cx="218" cy="322" r="10" fill="var(--color-orange)" stroke="var(--color-ink)" strokeWidth="5" />
      {/* boy */}
      <g>
        <circle cx="150" cy="150" r="24" fill="var(--color-blue)" />
        <path d="M128 182 q22 -12 44 0 l6 70 l-18 44 h-14 l4 -40 l-10 40 h-14 l6 -48 z" fill="var(--color-blue)" />
        <path d="M168 190 q30 -30 38 -76" stroke="var(--color-blue)" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M132 192 q-30 10 -52 2" stroke="var(--color-blue)" strokeWidth="16" strokeLinecap="round" fill="none" />
      </g>
      {/* girl */}
      <g>
        <circle cx="258" cy="148" r="24" fill="var(--color-pink)" />
        <path d="M252 124 q34 -6 34 30 l-12 -6z" fill="var(--color-pink)" />
        <path d="M240 180 q20 -10 40 0 l24 80 h-88z" fill="var(--color-pink)" />
        <path d="M248 262 v34 M272 262 v34" stroke="var(--color-pink)" strokeWidth="13" strokeLinecap="round" />
        <path d="M244 190 q-26 -30 -26 -80" stroke="var(--color-pink)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M278 192 q36 6 56 -6" stroke="var(--color-pink)" strokeWidth="14" strokeLinecap="round" fill="none" />
      </g>
      {/* stars */}
      <g className="origin-center animate-float" style={{ transformBox: "fill-box" }}>
        <path d="M208 60l6 13 14 1.5-10.5 9.5 3 14-12.5-7-12.5 7 3-14L188 74.5l14-1.5z" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g className="origin-center animate-float-slow" style={{ transformBox: "fill-box" }}>
        <path d="M320 110l5 11 12 1.3-9 8 2.6 12-10.6-6-10.6 6 2.6-12-9-8 12-1.3z" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g className="origin-center animate-float" style={{ transformBox: "fill-box", animationDelay: "-2s" }}>
        <path d="M86 128l5 11 12 1.3-9 8 2.6 12-10.6-6-10.6 6 2.6-12-9-8 12-1.3z" fill="var(--color-orange)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      </g>
      <circle cx="120" cy="84" r="9" fill="var(--color-blue)" />
      <circle cx="300" cy="70" r="7" fill="var(--color-teal)" />
      <circle cx="340" cy="210" r="8" fill="var(--color-pink)" />
      <circle cx="64" cy="220" r="7" fill="var(--color-green)" />
      <path d="M318 250 a22 22 0 0 0 20 -30" stroke="var(--color-orange)" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M78 270 a22 22 0 0 1 26 20" stroke="var(--color-teal)" strokeWidth="9" fill="none" strokeLinecap="round" />
    </svg>
  );
}
