import { cities, stats } from "@/data/site";

export function Marquee() {
  return (
    <div
      className="marquee-mask border-y border-slate-100 bg-slate-50/50 py-5 sm:py-6"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap sm:gap-12">
        {[...cities, ...cities, ...cities].map((c, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-base font-semibold text-slate-400 sm:gap-12 sm:text-lg"
          >
            {c}
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 text-center transition hover:bg-sky-50/40 sm:p-8 sm:text-left"
          >
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
