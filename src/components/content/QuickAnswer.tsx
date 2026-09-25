import { Inline } from "./Inline";
import { Bloomi } from "@/components/mascot/Bloomi";

/**
 * The 40–70 word direct answer that targets featured snippets and AI answer
 * engines. `.quick-answer` is referenced by SpeakableSpecification.
 */
export function QuickAnswer({ text, label = "Quick answer" }: { text: string; label?: string }) {
  return (
    <aside className="quick-answer relative card-pop !shadow-pop-sm bg-white p-5 pr-5 sm:pr-28">
      <p className="chip text-teal">⚡ {label}</p>
      <p className="mt-3 text-[1.1rem] leading-relaxed">
        <Inline text={text} />
      </p>
      <Bloomi mood="happy" animated={false} className="absolute -bottom-2 right-3 hidden w-20 h-auto sm:block" title="Bloomi" />
    </aside>
  );
}
