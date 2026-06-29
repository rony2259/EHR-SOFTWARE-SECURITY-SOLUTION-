import { memo } from "react";
import { Star } from "lucide-react";
import { testimonials, type Testimonial } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

const TestimonialCard = memo(function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[82vw] max-w-[340px] shrink-0 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:w-[360px] sm:max-w-none sm:p-7 md:w-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-sky-500" role="img" aria-label="Rated 5 of 5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          ))}
        </div>
        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-sky-700">
          Verified
        </span>
      </div>
      <blockquote className="mt-4 whitespace-normal text-[15px] leading-relaxed text-slate-700 sm:mt-5">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 sm:mt-6">
        <img
          src={t.photo}
          alt=""
          loading="lazy"
          decoding="async"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-sky-100"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-900">{t.name}</div>
          <div className="truncate text-[11px] font-medium text-slate-500">{t.role}</div>
        </div>
      </figcaption>
    </figure>
  );
});

export function Testimonials() {
  const row1 = testimonials.slice(0, 16);
  const row2 = testimonials.slice(16);

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 space-y-10 py-20 sm:space-y-12 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading label="Trusted by leaders" className="max-w-2xl">
            Loved by 30+ teams worldwide
          </SectionHeading>
          <div className="text-left sm:text-right">
            <div className="text-5xl font-extrabold tracking-tight text-sky-600 sm:text-6xl">
              4.8<span className="text-2xl text-slate-400 sm:text-3xl">/5</span>
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {testimonials.length} verified reviews
            </div>
          </div>
        </div>
      </div>

      <div className="marquee-mask space-y-4 sm:space-y-5">
        <div className="flex w-max animate-marquee gap-4 sm:gap-5">
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`a-${i}`} t={t} />
          ))}
        </div>
        <div className="flex w-max animate-marquee-reverse gap-4 sm:gap-5">
          {[...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`b-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
