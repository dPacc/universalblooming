"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Lead attribution + analytics (the piece Neelim and Wathim were missing).
 *
 * - Stores FIRST-touch (utm_*, gclid/fbclid, referrer, landing page) in
 *   localStorage and LAST-touch in sessionStorage; the lead form sends both, so
 *   every enquiry says which page and which search/ad produced it.
 * - Fires GA4 events for every lead-intent click: tel:, wa.me, mailto:, and
 *   any element with data-cta="…".
 */
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

export type Touch = Record<string, string>;

function readTouch(): Touch {
  const q = new URLSearchParams(window.location.search);
  const t: Touch = {};
  for (const k of KEYS) {
    const v = q.get(k);
    if (v) t[k] = v.slice(0, 120);
  }
  const ref = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "";
  if (ref) t.referrer = ref.slice(0, 200);
  t.landing = window.location.pathname;
  t.at = new Date().toISOString();
  return t;
}

export function getAttribution(): { first?: Touch; last?: Touch } {
  try {
    return {
      first: JSON.parse(localStorage.getItem("ub_first_touch") || "null") ?? undefined,
      last: JSON.parse(sessionStorage.getItem("ub_last_touch") || "null") ?? undefined,
    };
  } catch {
    return {};
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", event, params);
}

export function Attribution({ ga4 }: { ga4?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const t = readTouch();
      if (!localStorage.getItem("ub_first_touch")) localStorage.setItem("ub_first_touch", JSON.stringify(t));
      if (!sessionStorage.getItem("ub_last_touch") || t.utm_source || t.gclid) {
        sessionStorage.setItem("ub_last_touch", JSON.stringify(t));
      }
    } catch {
      /* storage blocked: attribution is best-effort */
    }
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!el) return;
      const href = el instanceof HTMLAnchorElement ? el.href : "";
      const cta = el.dataset.cta;
      if (href.startsWith("tel:")) track("click_call", { page: pathname, cta });
      else if (href.includes("wa.me")) track("click_whatsapp", { page: pathname, cta });
      else if (href.startsWith("mailto:")) track("click_email", { page: pathname, cta });
      else if (cta) track("cta_click", { page: pathname, cta });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  if (!ga4) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`}
      </Script>
    </>
  );
}
