import Link from "next/link";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] items-center gap-10 pb-16 pt-28 md:grid-cols-2 md:pt-16">
      <div className="flex justify-center">
        <BloomiBuddy mood="think" bubble="Hmm… this page wandered off to play!" bubbleSide="top" size="w-48 sm:w-64" />
      </div>
      <div>
        <p className="font-display text-8xl font-semibold text-pink">404</p>
        <h1 className="mt-2 text-4xl font-semibold">Oops! We can&apos;t find that page</h1>
        <p className="mt-3 text-lg text-ink-soft">It might have moved during our spring clean. Try one of these instead:</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li><Link href="/" className="btn btn-primary">Home</Link></li>
          <li><Link href="/programs" className="btn btn-light">Programs</Link></li>
          <li><Link href="/admissions" className="btn btn-light">Admissions</Link></li>
          <li><Link href="/parents-guide" className="btn btn-light">Parents&apos; guide</Link></li>
        </ul>
      </div>
    </section>
  );
}
