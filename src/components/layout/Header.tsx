import { asset } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { mainNav } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-[2.5px] border-ink bg-cream/90 backdrop-blur-md">
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Universal Blooming home">
          <Image src={asset("/images/logo.webp")} alt="Universal Blooming logo" width={56} height={53} priority className="h-12 w-auto" />
          <span className="font-display text-xl font-semibold leading-none hidden sm:block">
            Universal<br />
            <span className="text-pink">Blooming</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3.5 py-2 font-display font-medium text-[1.02rem] hover:bg-yellow-soft transition-colors"
                >
                  {item.label}
                  {item.children && <span aria-hidden className="text-xs transition-transform group-hover:rotate-180">▾</span>}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full translate-y-2 pt-2 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <ul className="card-pop w-64 p-2">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex items-center justify-between rounded-2xl px-3 py-2.5 hover:bg-pink-soft">
                            <span className="font-display font-medium">{c.label}</span>
                            <span className="text-xs font-bold text-ink-soft">{c.note}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admissions#book-a-visit" className="btn btn-primary !py-2.5 !px-5 !text-base hidden sm:inline-flex" data-cta="header-book-visit">
            Book a visit
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
