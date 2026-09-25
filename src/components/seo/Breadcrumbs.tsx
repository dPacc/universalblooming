import Link from "next/link";
import type { Crumb } from "@/lib/schema";

/**
 * Visible breadcrumb trail. The same `Crumb[]` feeds breadcrumbNode() in the
 * page's JSON-LD, so the markup and the schema can never disagree.
 */
export function Breadcrumbs({ crumbs, className = "" }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm font-bold ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink">{c.name}</span>
              ) : (
                <>
                  <Link href={c.path} className="hover:text-pink transition-colors">{c.name}</Link>
                  <span aria-hidden className="text-pink">✦</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
