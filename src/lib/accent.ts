import type { Accent } from "@/content/types";

/** Static class maps so Tailwind can see every class at build time. */
export const accentBg: Record<Accent, string> = {
  pink: "bg-pink", orange: "bg-orange", yellow: "bg-yellow", green: "bg-green",
  teal: "bg-teal", sky: "bg-sky", blue: "bg-blue", red: "bg-red",
};
export const accentSoft: Record<Accent, string> = {
  pink: "bg-pink-soft", orange: "bg-orange-soft", yellow: "bg-yellow-soft", green: "bg-green-soft",
  teal: "bg-teal-soft", sky: "bg-sky-soft", blue: "bg-blue-soft", red: "bg-red-soft",
};
export const accentText: Record<Accent, string> = {
  pink: "text-pink", orange: "text-orange", yellow: "text-yellow", green: "text-green",
  teal: "text-teal", sky: "text-sky", blue: "text-blue", red: "text-red",
};
export const accentVar: Record<Accent, string> = {
  pink: "var(--color-pink)", orange: "var(--color-orange)", yellow: "var(--color-yellow)", green: "var(--color-green)",
  teal: "var(--color-teal)", sky: "var(--color-sky)", blue: "var(--color-blue)", red: "var(--color-red)",
};
