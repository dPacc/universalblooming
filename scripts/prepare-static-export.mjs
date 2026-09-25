/**
 * Prepares the source tree for a static export (GitHub Pages). Run in CI only,
 * on a throwaway checkout: it swaps server-only features for static equivalents.
 *   - the lead server action  -> client-side stand-in (endpoint or email)
 *   - the dynamic /og route   -> removed (one pre-rendered card is used instead)
 */
import { copyFileSync, rmSync, writeFileSync } from "node:fs";

copyFileSync("src/app/actions/lead.static.ts", "src/app/actions/lead.ts");
rmSync("src/app/og", { recursive: true, force: true });
writeFileSync("public/.nojekyll", "");
console.log("static export prepared: lead action swapped, /og removed");
