import { BRAND } from "@/data/site";
import logoUrl from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white sm:mt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 md:px-12 md:py-16">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt={`${BRAND} logo`}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-xl object-contain"
            />
            <div className="text-lg font-bold text-slate-900">{BRAND}</div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-600">
            Elite software, cybersecurity and AI automation agency for
            international clients.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            Order
          </div>
          <a
            href="/#contact"
            className="block font-semibold text-slate-900 transition hover:text-sky-600"
          >
            Place a new order
          </a>
        </div>

        <nav className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm font-medium text-slate-600 md:justify-end">
          <a href="/#services" className="transition hover:text-sky-600">Services</a>
          <a href="/#testimonials" className="transition hover:text-sky-600">Clients</a>
          <a href="/#process" className="transition hover:text-sky-600">Process</a>
          <a href="/#contact" className="transition hover:text-sky-600">Contact</a>
          <a href="/admin.php" className="transition hover:text-sky-600">Admin</a>

        </nav>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 md:px-12">
          <span>© {new Date().getFullYear()} {BRAND}</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
