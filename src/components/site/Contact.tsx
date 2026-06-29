import { useCallback, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/data/site";

const FIELD =
  "mt-1.5 h-12 rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition focus-visible:border-sky-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-sky-100";
const LABEL = "text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600";

type FormState = {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  service: string;
  budget: string;
  details: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  address: "",
  service: services[0]?.title ?? "",
  budget: "",
  details: "",
};

const BUDGETS = ["< $1k", "$1k – $5k", "$5k – $10k", "$10k+"];

const COUNTRIES = [
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman",
  "United Kingdom", "United States", "Canada", "Germany", "France", "Switzerland",
  "Netherlands", "Italy", "Spain", "Sweden", "Norway", "Denmark", "Belgium",
  "Australia", "Singapore", "Japan", "India", "Pakistan", "Bangladesh",
  "Turkey", "Egypt", "Malaysia", "Indonesia", "South Africa", "Brazil", "Other",
];

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ id: string; service: string } | null>(null);

  const update = useCallback(
    (k: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value })),
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const bi = (en: string, ar: string) => `${en}  •  ${ar}`;
      if (!form.name.trim()) {
        toast.error(bi("Please enter your full name.", "الرجاء إدخال اسمك الكامل."));
        return;
      }
      if (!form.country.trim()) {
        toast.error(bi("Please select your country.", "الرجاء اختيار بلدك."));
        return;
      }
      if (!form.email.trim() && !form.phone.trim()) {
        toast.error(bi("Please provide an email or phone number.", "الرجاء إدخال البريد الإلكتروني أو رقم الهاتف."));
        return;
      }
      if (!form.service.trim()) {
        toast.error(bi("Please select a service.", "الرجاء اختيار خدمة."));
        return;
      }
      if (!form.budget.trim()) {
        toast.error(bi("Please select a budget range.", "الرجاء اختيار نطاق الميزانية."));
        return;
      }
      if (form.details.trim().length < 5) {
        toast.error(bi("Please describe your project briefly.", "الرجاء وصف مشروعك بإيجاز."));
        return;
      }
      setSubmitting(true);
      const orderId = crypto.randomUUID();
      const { error } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          country: form.country.trim() || null,
          address: form.address.trim() || null,
          service: form.service,
          budget: form.budget.trim() || null,
          details: form.details.trim(),
        });
      setSubmitting(false);
      if (error) {
        if (import.meta.env.DEV) console.error("order insert failed", error);
        toast.error("Couldn't place your order. Please try again.  •  تعذر تقديم طلبك. حاول مرة أخرى.");
        return;
      }
      toast.success("Order received — we'll contact you shortly!  •  تم استلام الطلب — سنتواصل معك قريبًا!");
      setConfirmed({ id: orderId, service: form.service });
      setForm(EMPTY);
    },
    [form],
  );

  return (
    <section id="contact" className="scroll-mt-24 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            <Sparkles className="h-3.5 w-3.5" /> Place an order
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Start your <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">project</span> today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
            Tell us what you need. We confirm every order within 2–4 hours.
          </p>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-white to-sky-50/40 shadow-[0_30px_80px_-30px_rgba(2,132,199,0.25)] ring-1 ring-white">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="relative p-6 sm:p-10 lg:p-12">
            {confirmed ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                  <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl">Order confirmed!</h3>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Thanks for ordering <span className="font-semibold text-slate-900">{confirmed.service}</span>.
                  Our team will reach out within 2–4 hours.
                </p>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-mono font-semibold text-slate-700">
                  Order ID · {confirmed.id.slice(0, 8).toUpperCase()}
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600" /> Securely stored
                </div>
                <Button
                  onClick={() => setConfirmed(null)}
                  className="mt-7 h-11 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Place another order
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1 */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">1</span>
                    <h3 className="text-sm font-bold text-slate-900">Your details</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className={LABEL}>Full name *</Label>
                      <Input id="name" value={form.name} onChange={update("name")} maxLength={100} required placeholder="John Doe" className={FIELD} />
                    </div>
                    <div>
                      <Label htmlFor="country" className={LABEL}>Country</Label>
                      <select
                        id="country"
                        value={form.country}
                        onChange={update("country")}
                        className="mt-1.5 flex h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3 text-sm text-slate-900 transition focus-visible:border-sky-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                      >
                        <option value="">Select country…</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="email" className={LABEL}>Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={update("email")} maxLength={120} placeholder="you@example.com" className={FIELD} />
                    </div>
                    <div>
                      <Label htmlFor="phone" className={LABEL}>Phone</Label>
                      <Input id="phone" value={form.phone} onChange={update("phone")} maxLength={40} placeholder="+971 …" className={FIELD} />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-t border-dashed border-slate-200 pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">2</span>
                    <h3 className="text-sm font-bold text-slate-900">Choose a service</h3>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {services.map((s) => {
                      const active = form.service === s.title;
                      return (
                        <button
                          type="button"
                          key={s.title}
                          onClick={() => setForm((f) => ({ ...f, service: s.title }))}
                          className={`group relative rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-sky-500 bg-sky-50 shadow-md shadow-sky-100"
                              : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-bold text-slate-900">{s.title}</div>
                              {s.ar && (
                                <div className="mt-0.5 text-[11px] text-slate-500" lang="ar" dir="rtl">
                                  {s.ar}
                                </div>
                              )}
                            </div>
                            <span
                              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${
                                active ? "border-sky-600 bg-sky-600" : "border-slate-300"
                              }`}
                            >
                              {active && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border-t border-dashed border-slate-200 pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">3</span>
                    <h3 className="text-sm font-bold text-slate-900">Project info</h3>
                  </div>

                  <div className="mb-4">
                    <Label className={LABEL}>Budget</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {BUDGETS.map((b) => {
                        const active = form.budget === b;
                        return (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setForm((f) => ({ ...f, budget: active ? "" : b }))}
                            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                              active
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700"
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="details" className={LABEL}>Project details *</Label>
                    <Textarea
                      id="details"
                      value={form.details}
                      onChange={update("details")}
                      maxLength={2000}
                      rows={5}
                      placeholder="Tell us what you want to build, your goals, timeline, references…"
                      required
                      className="mt-1.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition focus-visible:border-sky-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-sky-100"
                    />
                    <div className="mt-1 text-right text-[11px] text-slate-400">
                      {form.details.length}/2000
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-dashed border-slate-200 pt-6">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="group h-14 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-base font-bold text-white shadow-xl shadow-sky-200 transition hover:shadow-2xl hover:shadow-sky-300 disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing your order…
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure & private
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" /> No sign-up needed
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Reply in 2–4 hours
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
