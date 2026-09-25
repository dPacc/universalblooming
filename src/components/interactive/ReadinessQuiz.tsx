"use client";

import Link from "next/link";
import { useState } from "react";
import { Bloomi } from "@/components/mascot/Bloomi";
import { burstConfetti } from "@/components/lead/Confetti";
import { track } from "@/components/tracking/Attribution";

interface Q {
  q: string;
  area: string;
  options: { label: string; points: 0 | 1 | 2 }[];
}
interface R {
  min: number;
  title: string;
  text: string;
  mood: "cheer" | "happy" | "think";
}

/** One question at a time, Bloomi reacts, result band + confetti + tailored CTA. */
export function ReadinessQuiz({ questions, results, whatsappBase }: { questions: Q[]; results: R[]; whatsappBase: string }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = answers.length === questions.length;
  const score = answers.reduce((a, b) => a + b, 0);
  const max = questions.length * 2;
  const result = [...results].sort((a, b) => b.min - a.min).find((r) => score >= r.min) ?? results[results.length - 1];
  const growAreas = questions.filter((_, k) => answers[k] === 0).map((q) => q.area);

  const answer = (pts: number, el: HTMLElement) => {
    const next = [...answers.slice(0, i), pts];
    setAnswers(next);
    if (i === 0) track("quiz_start");
    if (next.length === questions.length) {
      track("quiz_complete", { score: next.reduce((a, b) => a + b, 0) });
      window.setTimeout(() => burstConfetti(el), 50);
    } else setI(i + 1);
  };

  if (done) {
    const wa = `${whatsappBase}${encodeURIComponent(`Hi Universal Blooming! My child scored ${score}/${max} on your readiness quiz. I'd love to book a visit.`)}`;
    return (
      <div className="card-pop overflow-hidden" aria-live="polite">
        <div className="grid items-center gap-6 bg-yellow-soft p-7 sm:grid-cols-[auto_1fr] sm:p-10">
          <Bloomi mood={result.mood} className="mx-auto w-36 h-auto" />
          <div>
            <p className="chip bg-white text-pink">Score {score} / {max}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">{result.title}</h2>
            <p className="mt-3 text-lg text-ink-soft">{result.text}</p>
          </div>
        </div>
        <div className="grid gap-6 p-7 sm:p-10 md:grid-cols-2">
          <div>
            <p className="font-display text-xl font-semibold">Your child&apos;s strengths</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {questions.filter((_, k) => answers[k] === 2).map((q) => (
                <li key={q.q} className="rounded-full bg-green-soft px-3 py-1 text-sm font-bold">🌟 {q.area}</li>
              ))}
              {!answers.includes(2) && <li className="text-ink-soft">Every child has strengths. We&apos;d love to discover them together!</li>}
            </ul>
          </div>
          <div>
            <p className="font-display text-xl font-semibold">Still blooming</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {growAreas.map((a) => (
                <li key={a} className="rounded-full bg-orange-soft px-3 py-1 text-sm font-bold">🌱 {a}</li>
              ))}
              {!growAreas.length && <li className="text-ink-soft">Nothing major. Great going!</li>}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-t-[2.5px] border-dashed border-ink/15 p-7 sm:px-10">
          <Link href="/admissions?from=readiness-quiz#book-a-visit" className="btn btn-primary" data-cta="quiz-book-visit">Book a visit</Link>
          <a href={wa} className="btn btn-whatsapp" data-cta="quiz-whatsapp">💬 Share result on WhatsApp</a>
          <button type="button" className="btn btn-light" onClick={() => { setAnswers([]); setI(0); }}>Retake quiz</button>
        </div>
      </div>
    );
  }

  const q = questions[i];
  const progress = (i / questions.length) * 100;
  return (
    <div className="card-pop overflow-hidden">
      <div className="h-3 bg-ink/10">
        <div className="h-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-pink),var(--color-orange))] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid gap-6 p-7 sm:grid-cols-[1fr_auto] sm:p-10">
        <div key={i} className="animate-pop-in">
          <p className="text-sm font-extrabold uppercase tracking-wider text-ink-soft">
            Question {i + 1} of {questions.length} · {q.area}
          </p>
          <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">{q.q}</h2>
          <div className="mt-6 grid gap-3">
            {q.options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={(e) => answer(o.points, e.currentTarget)}
                className="rounded-2xl border-[2.5px] border-ink bg-white px-5 py-4 text-left font-display text-lg font-medium transition-all hover:-translate-y-0.5 hover:bg-yellow-soft hover:shadow-pop-sm"
              >
                {o.label}
              </button>
            ))}
          </div>
          {i > 0 && (
            <button type="button" onClick={() => setI(i - 1)} className="mt-4 text-sm font-bold text-ink-soft hover:text-ink">
              ← Previous question
            </button>
          )}
        </div>
        <Bloomi mood={i < 3 ? "wave" : i < 7 ? "happy" : "cheer"} className="hidden w-32 h-auto self-end sm:block" />
      </div>
    </div>
  );
}
