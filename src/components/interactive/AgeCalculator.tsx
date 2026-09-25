"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { placements, programForAge, ageToday, type SchoolType } from "@/lib/age-rules";
import { Bloomi } from "@/components/mascot/Bloomi";
import { track } from "@/components/tracking/Attribution";

const STAGE_STYLE = {
  baby: "bg-sky-soft",
  nursery: "bg-teal-soft",
  kg: "bg-pink-soft",
  school: "bg-orange-soft",
} as const;

export function AgeCalculator({ whatsappBase }: { whatsappBase: string }) {
  const [dob, setDob] = useState("");
  const [type, setType] = useState<SchoolType>("september");
  const date = useMemo(() => (dob ? new Date(`${dob}T00:00:00Z`) : null), [dob]);
  const valid = date && !Number.isNaN(date.getTime()) && date.getUTCFullYear() > 2010 && date < new Date();

  const rows = useMemo(() => (valid ? placements(date!, type, 2026, 3) : []), [valid, date, type]);
  const prog = valid ? programForAge(date!) : null;
  const now = valid ? ageToday(date!) : null;

  const wa = `${whatsappBase}${encodeURIComponent(
    `Hi Universal Blooming! My child was born on ${dob}. ${prog ? `I'm interested in ${prog.name}.` : ""} (from: age calculator)`,
  )}`;

  return (
    <div className="card-pop overflow-hidden">
      <div className="grid gap-6 bg-yellow-soft p-6 sm:grid-cols-2 sm:p-8">
        <label className="grid gap-2">
          <span className="font-display text-xl font-semibold">1. Child&apos;s date of birth</span>
          <input
            type="date"
            value={dob}
            min="2012-01-01"
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => {
              setDob(e.target.value);
              if (e.target.value) track("age_calculator_used", { type });
            }}
            className="rounded-2xl border-[2.5px] border-ink bg-white px-4 py-3 text-lg font-bold"
          />
        </label>
        <fieldset className="grid gap-2">
          <legend className="font-display text-xl font-semibold">2. School year starts in…</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["september", "Aug / Sep", "British, American, IB, MoE, French"],
                ["april", "April", "Indian, Pakistani"],
              ] as const
            ).map(([v, l, d]) => (
              <button
                key={v}
                type="button"
                aria-pressed={type === v}
                onClick={() => setType(v)}
                className={`rounded-2xl border-[2.5px] border-ink px-3 py-2.5 text-left transition-all ${type === v ? "bg-pink text-white shadow-pop-sm" : "bg-white"}`}
              >
                <span className="block font-display text-lg font-semibold">{l}</span>
                <span className={`block text-xs font-bold ${type === v ? "text-white/85" : "text-ink-soft"}`}>{d}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="p-6 sm:p-8" aria-live="polite">
        {!valid ? (
          <div className="flex items-center gap-5">
            <Bloomi mood="think" className="w-24 h-auto shrink-0" />
            <p className="text-lg text-ink-soft">
              Enter a date of birth and I&apos;ll show which year group your child can join for the next three school years, using the
              <strong className="text-ink"> {type === "september" ? "31 December" : "31 March"}</strong> cut-off.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <Bloomi mood="cheer" className="w-20 h-auto" />
              <div>
                <p className="text-sm font-extrabold uppercase tracking-wider text-ink-soft">Age today</p>
                <p className="font-display text-3xl font-semibold">
                  {now!.years} years {now!.months} months
                </p>
              </div>
            </div>

            <ol className="mt-6 grid gap-3 md:grid-cols-3">
              {rows.map((r, i) => (
                <li key={r.academicYear} className={`animate-pop-in rounded-3xl border-[2.5px] border-ink p-5 ${STAGE_STYLE[r.stage]}`} style={{ animationDelay: `${i * 90}ms` }}>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    Academic year {r.academicYear} · starts {r.startLabel}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold leading-tight">{r.group}</p>
                  {r.aliases && <p className="mt-1 text-sm text-ink-soft">{r.aliases}</p>}
                  <p className="mt-3 text-sm font-bold">
                    Age on {r.cutoff}: {r.ageOnCutoff.years}y {r.ageOnCutoff.months}m
                  </p>
                  {r.notes.map((n) => (
                    <p key={n} className="mt-2 rounded-xl bg-white/80 px-3 py-2 text-sm">
                      ℹ️ {n}
                    </p>
                  ))}
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg">
                {prog ? (
                  <>
                    Right now, <strong className="text-yellow">{prog.name}</strong> at Universal Blooming is the perfect fit
                    {prog.slug === "preschool" ? (
                      <>
                        , and <strong className="text-yellow">After School Activities</strong> are a fun extra.
                      </>
                    ) : (
                      "."
                    )}
                  </>
                ) : (
                  <>Ask us about loving Day Care for your little one. Register your interest early!</>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {prog && (
                  <Link href={`/programs/${prog.slug}`} className="btn btn-light !py-2 !text-base">
                    See {prog.name}
                  </Link>
                )}
                <a href={wa} className="btn btn-whatsapp !py-2 !text-base" data-cta="age-calc-whatsapp">
                  💬 Ask about a place
                </a>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              Based on the UAE Ministry of Education and KHDA placement rules published for 2026-27 onwards. Schools make the final
              placement decision, so always confirm with the school.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
