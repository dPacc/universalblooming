import type { Faq } from "@/content/types";
import { Inline } from "./Inline";

const DOTS = ["bg-pink", "bg-orange", "bg-teal", "bg-sky", "bg-green", "bg-yellow", "bg-blue", "bg-red"];

/** Native <details> accordion: works without JS, fully crawlable (answers are in the HTML). */
export function FaqList({ faqs, title = "Questions parents ask", id = "faq" }: { faqs: Faq[]; title?: string; id?: string }) {
  if (!faqs.length) return null;
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-3xl sm:text-[2.1rem] font-semibold mb-6">{title}</h2>
      <div className="grid gap-3">
        {faqs.map((f, i) => (
          <details key={i} className="group card-pop !shadow-pop-sm open:!shadow-pop overflow-hidden" name={id}>
            <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 font-display text-lg font-medium sm:text-xl [&::-webkit-details-marker]:hidden">
              <span aria-hidden className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${DOTS[i % DOTS.length]}`} />
              <span className="flex-1">{f.q}</span>
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink text-xl leading-none transition-transform duration-300 group-open:rotate-45 group-open:bg-yellow">+</span>
            </summary>
            <div className="prose-ub px-5 pb-5 pl-12 text-ink-soft">
              <p><Inline text={f.a} /></p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
