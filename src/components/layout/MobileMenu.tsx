"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mainNav } from "@/lib/nav";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-11 w-11 place-items-center rounded-full border-[2.5px] border-ink bg-yellow shadow-pop-sm active:translate-y-0.5"
      >
        <span className="relative block h-3.5 w-5">
          <span className={`absolute left-0 h-[3px] w-5 rounded bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 h-[3px] w-5 rounded bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-[3px] w-5 rounded bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      {/* Portalled to <body>: the header's backdrop-blur makes it the containing block for
          position:fixed children, which clipped this panel to the header's 72px height. */}
      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            aria-hidden={!open}
            inert={!open}
            className={`fixed inset-x-0 top-[4.5rem] bottom-0 z-50 overflow-y-auto lg:hidden bg-cream dotted-bg px-4 pb-10 pt-4 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
            }`}
          >
            <nav aria-label="Mobile">
              <ul className="grid gap-2">
                {mainNav.map((item, i) => (
                  <li key={item.href} className={open ? "animate-pop-in" : ""} style={{ animationDelay: `${i * 35}ms` }}>
                    <Link href={item.href} className="card-pop !shadow-pop-sm block px-5 py-3.5 font-display text-xl font-medium">
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mt-2 grid gap-1.5 pl-4">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-2xl bg-white/70 px-4 py-2.5">
                              <span className="block font-display text-[1.05rem] leading-tight">{c.label}</span>
                              <span className="block text-sm font-bold text-ink-soft">{c.note}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3">
                <Link href="/admissions#book-a-visit" className="btn btn-primary w-full" data-cta="mobile-book-visit">Book a visit</Link>
                <Link href="/contact" className="btn btn-light w-full">Contact us</Link>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
