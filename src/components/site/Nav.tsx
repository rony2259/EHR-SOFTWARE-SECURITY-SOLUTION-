import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BRAND_SHORT } from "@/data/site";
import logoUrl from "@/assets/logo.png";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Clients" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-12">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logoUrl}
            alt={`${BRAND_SHORT} logo`}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-xl object-contain"
          />

          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {BRAND_SHORT}
              <span className="ml-1 hidden font-medium text-slate-500 sm:inline">· Software & Cyber Solution</span>
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-800 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-sky-700">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/30 ring-1 ring-sky-600 transition hover:bg-sky-700 hover:ring-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 sm:px-5 sm:text-sm"
          >
            Order Now <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm font-medium text-slate-700 sm:px-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 transition hover:bg-sky-50 hover:text-sky-700"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
