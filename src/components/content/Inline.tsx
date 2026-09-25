import Link from "next/link";
import { Fragment } from "react";
import { tokenize } from "@/lib/inline";
import type { Linker } from "@/lib/autolink";
import { withYear } from "@/lib/seo";

export function Inline({ text, linker }: { text: string; linker?: Linker }) {
  const tokens = tokenize(withYear(text));
  if (linker) for (const t of tokens) if (t.t === "link") linker.claim(t.href);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.t === "bold") return <strong key={i}>{t.v}</strong>;
        if (t.t === "link") return <SmartLink key={i} href={t.href}>{t.v}</SmartLink>;
        if (!linker) return <Fragment key={i}>{t.v}</Fragment>;
        return (
          <Fragment key={i}>
            {linker.split(t.v).map((p, j) =>
              typeof p === "string" ? <Fragment key={j}>{p}</Fragment> : <Link key={j} href={p.href}>{p.v}</Link>,
            )}
          </Fragment>
        );
      })}
    </>
  );
}

export function SmartLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (/^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
