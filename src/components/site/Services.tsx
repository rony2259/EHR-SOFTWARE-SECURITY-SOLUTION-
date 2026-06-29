import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 bg-slate-50/70 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <SectionHeading label="Our Expertise" align="center">
            What we do best
          </SectionHeading>
          <p className="text-base text-slate-700 sm:text-lg">
            Specialized digital solutions engineered for reliability, scale,
            and uncompromising security.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="lift group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-sky-300 sm:p-8"
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-700 group-hover:text-white">
                <s.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">{s.title}</h3>
              <p
                className="mt-1 text-xs font-semibold text-sky-700"
                lang="ar"
                dir="rtl"
              >
                {s.ar}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                {s.desc}
              </p>
              <a
                href="#contact"
                aria-label={`Inquire about ${s.title}`}
                className="mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-bold text-sky-800 transition hover:gap-2.5 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Inquire <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
