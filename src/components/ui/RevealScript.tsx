"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for every [data-reveal] element. Content is visible
 * by default; the `js` class on <html> opts into the animation, so crawlers and
 * no-JS visitors always see everything.
 */
export function RevealScript() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.transitionDelay = `${Number(el.dataset.reveal || 0) * 90}ms`;
            el.classList.add("is-in");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // Safety net: never leave content hidden (e.g. print, headless renderers, observer quirks).
    const fallback = window.setTimeout(() => els.forEach((el) => el.classList.add("is-in")), 4000);
    const reveal = () => els.forEach((el) => el.classList.add("is-in"));
    window.addEventListener("beforeprint", reveal);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener("beforeprint", reveal);
    };
  }, [pathname]);
  return null;
}
