import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { stats } from "@/data/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-100 bg-white"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,theme(colors.sky.100)_0%,white_55%,white_100%)]" />
      <div className="pointer-events-none absolute -left-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 -top-10 -z-10 h-[460px] w-[460px] rounded-full bg-blue-100/60 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-32 lg:pt-28">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-bold text-sky-800 sm:text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-600" />
            </span>
            Available for new projects worldwide
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Elite <span className="text-sky-700">Software</span> &amp;
            <br className="hidden sm:block" /> Cyber Security Agency
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl">
            We engineer custom software, secure critical infrastructure, and
            deliver intelligent automation for international clients across
            Dubai, London, Zurich and Berlin.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
            <a
              href="#contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-10 py-5 text-base font-extrabold text-white shadow-2xl shadow-slate-900/40 ring-2 ring-sky-600 transition hover:-translate-y-0.5 hover:bg-sky-700 hover:ring-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 sm:w-auto sm:text-lg"
            >
              Get a Free Consultation
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-bold uppercase tracking-[0.18em] text-slate-800 transition hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Explore services →
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-700" /> NDA on request
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-sky-700" /> Senior engineers only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" /> Replies in 2–4 hrs
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-6 border-t border-slate-200 pt-12 sm:mt-20 sm:grid-cols-4 sm:gap-8 sm:pt-16">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1 text-center">
              <div className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                {s.value.includes("/")
                  ? (
                    <>
                      {s.value.split("/")[0]}
                      <span className="text-sky-600">/{s.value.split("/")[1]}</span>
                    </>
                  )
                  : s.value}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 sm:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
