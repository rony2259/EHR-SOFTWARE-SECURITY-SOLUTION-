import { steps } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-24 bg-slate-50/70 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <SectionHeading label="How we work" align="center">
            A simple, transparent process
          </SectionHeading>
          <p className="text-base text-slate-600 sm:text-lg">
            From discovery to delivery — clear milestones, weekly demos, no
            surprises.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="lift relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:border-sky-200"
            >
              <div className="text-xs font-bold tracking-[0.2em] text-sky-600">
                STEP {s.n}
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {s.d}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
