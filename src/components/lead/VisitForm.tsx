"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { submitLead, type LeadResult } from "@/app/actions/lead";
import { getAttribution, track } from "@/components/tracking/Attribution";
import { Bloomi } from "@/components/mascot/Bloomi";
import { burstConfetti } from "./Confetti";

// The child's age drives the suggested program: under 3 → Day Care, 3–6 → Preschool, over 6 → After School Activities.
const AGES = [
  { v: "Under 2 years", p: "day-care" },
  { v: "2–3 years", p: "day-care" },
  { v: "3–4 years", p: "preschool" },
  { v: "4–5 years", p: "preschool" },
  { v: "5–6 years", p: "preschool" },
  { v: "6+ years", p: "after-school" },
];
const PROGRAMS = [
  { v: "preschool", label: "Preschool", emoji: "🎨" },
  { v: "day-care", label: "Day Care", emoji: "🧸" },
  { v: "after-school", label: "After School", emoji: "⚽" },
  { v: "not-sure", label: "Not sure yet", emoji: "🤔" },
];
const WHEN = ["As soon as possible", "Within 1–3 months", "Next academic year", "Just exploring"];

/**
 * Three friendly steps (age → program & timing → contact). Small steps convert
 * far better for parents on phones than one long form, and each answer is
 * captured with the page + first/last-touch attribution.
 */
export function VisitForm({ source, defaultProgram, whatsappHref }: { source: string; defaultProgram?: string; whatsappHref: string }) {
  const pathname = usePathname();
  const [state, action, pending] = useActionState<LeadResult | null, FormData>(submitLead, null);
  const [step, setStep] = useState(0);
  const [age, setAge] = useState("");
  const [program, setProgram] = useState(defaultProgram ?? "");
  const [when, setWhen] = useState("");
  const [attr, setAttr] = useState<{ first?: string; last?: string }>({});
  const started = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    started.current = Date.now();
    // Deep links like /admissions?program=preschool preselect the program (page stays static).
    const q = new URLSearchParams(window.location.search).get("program");
    if (!defaultProgram && q && PROGRAMS.some((p) => p.v === q)) setProgram(q);
    const a = getAttribution();
    setAttr({ first: a.first && JSON.stringify(a.first), last: a.last && JSON.stringify(a.last) });
  }, []);

  useEffect(() => {
    if (state?.ok) {
      burstConfetti(box.current);
      track("generate_lead", { source, program, page: pathname });
    }
  }, [state, source, program, pathname]);

  const go = (n: number) => {
    setStep(n);
    if (n === 1) track("form_step", { step: "age", source });
    box.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  if (state?.ok) {
    return (
      <div ref={box} className="card-pop p-6 sm:p-8 text-center" role="status">
        <Bloomi mood="cheer" className="mx-auto w-32 h-auto" />
        <h3 className="mt-3 text-3xl font-semibold">Yay! Request received 🎉</h3>
        <p className="mt-2 text-ink-soft">
          Thank you! Our admissions team will contact you shortly to arrange your visit. Can&apos;t wait? Message us now.
        </p>
        <a href={whatsappHref} className="btn btn-whatsapp mt-5" data-cta="form-success-whatsapp">
          💬 Chat on WhatsApp
        </a>
      </div>
    );
  }

  const Chip = ({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-2xl border-[2.5px] border-ink px-4 py-3 text-left font-display text-[1.05rem] font-medium transition-all ${
        on ? "bg-yellow shadow-pop-sm -translate-y-0.5" : "bg-white hover:bg-yellow-soft"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div ref={box} className="card-pop p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-pink">Step {step + 1} of 3</p>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-2.5 rounded-full transition-all ${i <= step ? "w-8 bg-pink" : "w-2.5 bg-ink/15"}`} />
          ))}
        </div>
      </div>

      <form action={action} className="mt-4">
        <input type="hidden" name="childAge" value={age} />
        <input type="hidden" name="program" value={program} />
        <input type="hidden" name="startWhen" value={when} />
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="page" value={pathname} />
        <input type="hidden" name="firstTouch" value={attr.first ?? ""} />
        <input type="hidden" name="lastTouch" value={attr.last ?? ""} />
        <input type="hidden" name="started" value={started.current || ""} />
        <div aria-hidden className="absolute -left-[9999px]">
          <label>Company <input name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {step === 0 && (
          <fieldset className="animate-pop-in">
            <legend className="font-display text-2xl font-semibold">How old is your little one?</legend>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {AGES.map((a) => (
                <Chip
                  key={a.v}
                  on={age === a.v}
                  onClick={() => {
                    setAge(a.v);
                    if (!defaultProgram) setProgram(a.p);
                    go(1);
                  }}
                >
                  {a.v}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="animate-pop-in grid gap-5">
            <fieldset>
              <legend className="font-display text-2xl font-semibold">Which program interests you?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {PROGRAMS.map((p) => (
                  <Chip key={p.v} on={program === p.v} onClick={() => setProgram(p.v)}>
                    <span aria-hidden className="mr-1.5">{p.emoji}</span>
                    {p.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-display text-xl font-semibold">When would you like to start?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {WHEN.map((w) => (
                  <Chip key={w} on={when === w} onClick={() => setWhen(w)}>{w}</Chip>
                ))}
              </div>
            </fieldset>
            <div className="flex justify-between gap-3">
              <button type="button" className="btn btn-light" onClick={() => go(0)}>← Back</button>
              <button type="button" className="btn btn-sun" onClick={() => go(2)} disabled={!program}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-pop-in grid gap-4">
            <p className="font-display text-2xl font-semibold">Where can we reach you?</p>
            <Field label="Your name" name="parentName" autoComplete="name" required />
            <Field label="Mobile / WhatsApp" name="phone" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" required />
            <Field label="Email (optional)" name="email" type="email" autoComplete="email" />
            <fieldset>
              <legend className="text-sm font-bold text-ink-soft">Best way to reach you</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {["WhatsApp", "Call", "Email"].map((c, i) => (
                  <label key={c} className="cursor-pointer">
                    <input type="radio" name="contactPref" value={c} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block rounded-full border-2 border-ink px-4 py-1.5 font-bold peer-checked:bg-teal peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-sky">
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-ink-soft">Anything we should know? (optional)</span>
              <textarea name="message" rows={3} className="rounded-2xl border-[2.5px] border-ink bg-cream px-4 py-3 focus:bg-white" />
            </label>
            {state?.error && <p role="alert" className="rounded-xl bg-red-soft px-4 py-2 font-bold text-red">{state.error}</p>}
            <div className="flex flex-wrap justify-between gap-3">
              <button type="button" className="btn btn-light" onClick={() => go(1)}>← Back</button>
              <button type="submit" className="btn btn-primary" disabled={pending} data-cta={`form-submit-${source}`}>
                {pending ? "Sending…" : "Request my visit 🌸"}
              </button>
            </div>
            <p className="text-xs text-ink-soft">We only use your details to arrange your visit. No spam, ever.</p>
          </div>
        )}
      </form>

      {step < 2 && (
        <p className="mt-5 border-t-2 border-dashed border-ink/15 pt-4 text-sm font-bold text-ink-soft">
          Prefer chatting?{" "}
          <a href={whatsappHref} className="link-ub" data-cta={`form-whatsapp-${source}`}>Message us on WhatsApp</a>
        </p>
      )}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-ink-soft">{label}</span>
      <input
        {...props}
        className="rounded-2xl border-[2.5px] border-ink bg-cream px-4 py-3 text-lg focus:bg-white"
      />
    </label>
  );
}
