"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bloomi } from "@/components/mascot/Bloomi";
import { track } from "@/components/tracking/Attribution";

interface P {
  slug: string;
  name: string;
  ageLabel?: string; // omitted for Day Care, which never shows an age
  min: number;
  max: number;
  emoji: string;
  tagline: string;
  color: string;
}

function label(m: number) {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y === 0) return `${mo} month${mo === 1 ? "" : "s"}`;
  return `${y} year${y === 1 ? "" : "s"}${mo ? ` ${mo} mo` : ""}`;
}

/**
 * Pick the main program for an age, plus any others that also fit.
 * Under 3 → Day Care; 3–6 → Preschool (After School Activities, 3+, as an extra);
 * over 6 → After School Activities. The narrowest matching range wins, so the
 * mapping follows the ranges in src/content/programs.ts.
 */
function matchFor(months: number, programs: P[]): { main: P | null; also: P[] } {
  const fits = programs.filter((p) => months >= p.min && months < p.max).sort((a, b) => a.max - a.min - (b.max - b.min));
  if (fits.length) return { main: fits[0], also: fits.slice(1) };
  const oldest = [...programs].sort((a, b) => b.max - a.max)[0];
  return { main: oldest && months >= oldest.max ? oldest : null, also: [] };
}

/** Drag the slider to your child's age; Bloomi recommends the right program. */
export function ProgramFinder({ programs }: { programs: P[] }) {
  const [months, setMonths] = useState(30);
  const [touched, setTouched] = useState(false);
  const { main: match, also } = useMemo(() => matchFor(months, programs), [months, programs]);

  return (
    <div className="card-pop overflow-hidden">
      <div className="grid md:grid-cols-[1.3fr_1fr]">
        <div className="p-6 sm:p-9">
          <p className="eyebrow">Find the right fit</p>
          <h2 className="mt-1 text-3xl font-semibold sm:text-4xl">How old is your little one?</h2>
          <p className="mt-2 text-ink-soft">Slide to your child&apos;s age and we&apos;ll show the program made for them.</p>

          <div className="mt-8">
            <output htmlFor="age" className="block font-display text-5xl font-semibold text-pink tabular-nums">
              {label(months)}
            </output>
            <input
              id="age"
              type="range"
              min={6}
              max={144}
              step={1}
              value={months}
              onChange={(e) => {
                setMonths(Number(e.target.value));
                if (!touched) {
                  setTouched(true);
                  track("program_finder_used");
                }
              }}
              aria-label="Child's age in months"
              aria-valuetext={label(months)}
              className="mt-4 h-4 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-pink),var(--color-orange))] border-2 border-ink
                [&::-webkit-slider-thumb]:h-9 [&::-webkit-slider-thumb]:w-9 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-yellow [&::-webkit-slider-thumb]:shadow-pop-sm
                [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-yellow"
            />
            <div className="mt-2 flex justify-between text-xs font-bold text-ink-soft">
              <span>6 months</span>
              <span>3 years</span>
              <span>6 years</span>
              <span>12 years</span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center border-t-[2.5px] border-ink p-6 sm:p-9 md:border-l-[2.5px] md:border-t-0" style={{ background: match ? `color-mix(in srgb, ${match.color} 14%, white)` : "var(--color-sky-soft)" }}>
          {match ? (
            <div key={match.slug} className="animate-pop-in">
              <Bloomi mood="happy" className="pointer-events-none float-right mb-2 ml-4 h-auto w-20 sm:w-24" look={{ x: -3, y: 2 }} />
              <p className="text-5xl" aria-hidden>{match.emoji}</p>
              <p className="mt-3 font-display text-3xl font-semibold">{match.name}</p>
              {match.ageLabel && <p className="font-bold" style={{ color: match.color }}>{match.ageLabel}</p>}
              <p className="mt-2 text-ink-soft">{match.tagline}</p>
              {also.map((a) => (
                <p key={a.slug} className="mt-3 text-sm">
                  <span aria-hidden>{a.emoji}</span> Also a great fit:{" "}
                  <Link className="link-ub font-bold" href={`/programs/${a.slug}`}>
                    {a.name}
                  </Link>
                  {a.ageLabel && <span className="text-ink-soft"> ({a.ageLabel})</span>}
                </p>
              ))}
              <div className="mt-5 flex clear-both flex-wrap gap-2">
                <Link href={`/programs/${match.slug}`} className="btn btn-light !py-2 !text-base">Explore</Link>
                <Link href={`/admissions?program=${match.slug}#book-a-visit`} className="btn btn-primary !py-2 !text-base" data-cta={`finder-${match.slug}`}>
                  Book a visit
                </Link>
              </div>
            </div>
          ) : (
            <div key="baby" className="animate-pop-in">
              <Bloomi mood="love" className="pointer-events-none float-right mb-2 ml-4 h-auto w-20 sm:w-24" look={{ x: -3, y: 2 }} />
              <p className="font-display text-2xl font-semibold">Let&apos;s find the right fit 🌸</p>
              <p className="mt-2 text-ink-soft">
                Tell us about your little one and we&apos;ll suggest the best program. Planning ahead is smart: many families register early.{" "}
                <Link className="link-ub" href="/tools/nursery-age-calculator">Check key dates</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
