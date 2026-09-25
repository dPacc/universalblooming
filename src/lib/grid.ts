/**
 * Column widths for card rows laid out with `flex flex-wrap justify-center gap-4`.
 * The column count is picked from the item count, and any short last row is
 * centred, so a grid never ends in a lonely card with empty cells beside it.
 * (Width maths assumes a 1rem gap.)
 */
export const CARD_ROW = "flex flex-wrap justify-center gap-4";

export function cardCol(n: number): string {
  if (n <= 1) return "w-full sm:max-w-md";
  if (n === 2) return "w-full sm:w-[calc(50%-0.5rem)]";
  if (n === 3) return "w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)]";
  if (n === 4) return "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]";
  return "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]";
}

/** Same idea for small tiles that sit two-up even on phones. */
export function tileCol(n: number): string {
  if (n === 4) return "w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.75rem)]";
  if (n === 6) return "w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(16.666%-0.834rem)]";
  return "w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)]";
}
