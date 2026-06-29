import { ShieldCheck, Code2, Bot, Workflow, Binary, type LucideIcon } from "lucide-react";

export const WHATSAPP_NUMBER = "8801965536035";
export const BRAND = "EHR Software & Cyber Solution";
export const BRAND_SHORT = "EHR";
export const EMAIL = "ehrcybersecurity@gmail.com";
export const SERIF = { fontFamily: "'Times New Roman', Times, Georgia, serif" } as const;

export type Service = {
  num: string;
  icon: LucideIcon;
  title: string;
  ar: string;
  desc: string;
};

export const services: readonly Service[] = [
  { num: "I",   icon: ShieldCheck, title: "Cybersecurity & Bug Hunting",   ar: "الأمن السيبراني",        desc: "Offensive security audits, penetration testing, and zero-day vulnerability discovery for high-risk assets." },
  { num: "II",  icon: Code2,       title: "Custom Software Development",   ar: "تطوير البرمجيات",        desc: "Scalable backend systems, dashboards, SaaS products and secure communication tools, built end-to-end." },
  { num: "III", icon: Workflow,    title: "AI Automation & n8n",            ar: "أتمتة الذكاء الاصطناعي", desc: "Custom n8n workflows and LLM integrations to compress operational overhead by orders of magnitude." },
  { num: "IV",  icon: Bot,         title: "Bot & Chatbot Development",      ar: "البوتات والدردشة الآلية", desc: "Telegram, Discord, WhatsApp and Messenger bots — including AI chatbots and high-frequency trading bots." },
  { num: "V",   icon: Binary,      title: "Reverse Engineering",            ar: "الهندسة العكسية",        desc: "Decompilation, binary analysis, and system architecture reconstruction for legacy or hostile binaries." },
] as const;

export const serviceLayouts: readonly string[] = [
  "col-span-12 lg:col-span-7",
  "col-span-12 lg:col-span-5 lg:translate-y-16",
  "col-span-12 lg:col-span-5",
  "col-span-12 lg:col-span-7 lg:-translate-y-8",
  "col-span-12 lg:col-span-8 lg:col-start-3 lg:translate-y-4",
] as const;

export const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Global Clients" },
  { value: "4.8", label: "Average Rating" },
  { value: "24/7", label: "Live Support" },
] as const;

export type Testimonial = { name: string; role: string; photo: string; quote: string };

export const testimonials: readonly Testimonial[] = [
  { name: "Lucas Bennett", role: "CEO · Dubai FinEdge", photo: "https://randomuser.me/api/portraits/men/32.jpg", quote: "The security audit uncovered critical flaws in our core API that three other firms missed. World-class expertise." },
  { name: "Marcus Chen", role: "Director · Nexus Global Dubai", photo: "https://randomuser.me/api/portraits/men/45.jpg", quote: "Automating our workflows via n8n saved us nearly 30% in operational costs. Highly efficient team." },
  { name: "Sophia Müller", role: "Lead Architect · Frankfurt", photo: "https://randomuser.me/api/portraits/women/68.jpg", quote: "Their reverse engineering work is rare. Modernized a legacy system that was thought to be untouchable." },
  { name: "Oliver Hayes", role: "CTO · London Holdings", photo: "https://randomuser.me/api/portraits/men/12.jpg", quote: "Delivered a complex trading bot ahead of schedule. Communication via WhatsApp was effortless." },
  { name: "Sarah Richardson", role: "Ops Director · FinFlow UK", photo: "https://randomuser.me/api/portraits/women/44.jpg", quote: "Reduced our support response time by 85% with their AI chatbot. ROI visible within two weeks." },
  { name: "Henrik Andersen", role: "Founder · Delta Systems Oslo", photo: "https://randomuser.me/api/portraits/men/76.jpg", quote: "Flawless engineering. Modernized our legacy stack without a single minute of downtime." },
  { name: "Charlotte Dubois", role: "Product Lead · Mirage Paris", photo: "https://randomuser.me/api/portraits/women/22.jpg", quote: "The team integrated AI agents into our CRM in under 3 weeks. Sales productivity jumped 40%." },
  { name: "Daniel Weber", role: "CISO · Bauer Logistics Berlin", photo: "https://randomuser.me/api/portraits/men/85.jpg", quote: "Penetration testing report was the most detailed we've ever received. Actionable, ranked, brutal." },
  { name: "Isabelle Laurent", role: "Head of Eng · Pay Dubai", photo: "https://randomuser.me/api/portraits/women/55.jpg", quote: "Built our entire payment automation suite. On time, under budget, zero bugs in production." },
  { name: "Thomas Becker", role: "CTO · Zurich Capital", photo: "https://randomuser.me/api/portraits/men/23.jpg", quote: "Their Telegram trading bots run our entire desk now. 24/7 uptime, profitable from day one." },
  { name: "Emma Lindqvist", role: "VP Eng · Nordic AI Stockholm", photo: "https://randomuser.me/api/portraits/women/9.jpg", quote: "Real engineers, real results. They speak the language of senior architects, not freelancers." },
  { name: "James Whitmore", role: "Founder · Dubai Ventures", photo: "https://randomuser.me/api/portraits/men/56.jpg", quote: "Discrete, professional, and seriously talented. Perfect for sensitive cybersecurity work." },
  { name: "Anna Kowalski", role: "Director · Warsaw DataWorks", photo: "https://randomuser.me/api/portraits/women/33.jpg", quote: "n8n workflows they built replaced an entire ops team. Setup was clean, documentation excellent." },
  { name: "James O'Connor", role: "CEO · Dublin Cyber", photo: "https://randomuser.me/api/portraits/men/41.jpg", quote: "Bug bounty work was top-tier. Found a P1 vulnerability in our infra that saved us millions." },
  { name: "Camille Moreau", role: "Tech Lead · Lyon Digital", photo: "https://randomuser.me/api/portraits/women/72.jpg", quote: "Custom dashboard exceeded every expectation. Beautiful UI, blazing fast, rock solid backend." },
  { name: "Ethan Walker", role: "Founder · Dubai Bots", photo: "https://randomuser.me/api/portraits/men/64.jpg", quote: "WhatsApp chatbot handles 2000+ messages a day automatically. Customers think it's human." },
  { name: "Isabella Romano", role: "CTO · Milano Fintech", photo: "https://randomuser.me/api/portraits/women/17.jpg", quote: "Engineering rigor of a top consultancy at a fraction of the price. Easy 5 stars from us." },
  { name: "Sebastian Hoffmann", role: "Head of Security · Munich", photo: "https://randomuser.me/api/portraits/men/29.jpg", quote: "Reverse engineered a competitor protocol cleanly and ethically. Saved months of R&D." },
  { name: "Nora Schmidt", role: "COO · Vienna Health", photo: "https://randomuser.me/api/portraits/women/40.jpg", quote: "Automated our entire patient intake. Staff freed up to do real medicine, not paperwork." },
  { name: "Lukas Becker", role: "Director · Berlin SaaS", photo: "https://randomuser.me/api/portraits/men/18.jpg", quote: "Custom Discord bot manages our 50k member community. Zero downtime in 8 months." },
  { name: "Priya Sharma", role: "Lead PM · Dubai Stack", photo: "https://randomuser.me/api/portraits/women/26.jpg", quote: "Shipped a full SaaS MVP in 6 weeks. Investors funded us the next round on that demo alone." },
  { name: "Alexander Reid", role: "CEO · Edinburgh Trade", photo: "https://randomuser.me/api/portraits/men/52.jpg", quote: "Trustworthy, fast, expert. We hired them for one project and have stayed for three more." },
  { name: "Maya Cohen", role: "VP Product · Amsterdam Labs", photo: "https://randomuser.me/api/portraits/women/61.jpg", quote: "AI agent they built researches and writes our weekly market reports. Genuinely impressive." },
  { name: "Diego Fernández", role: "CTO · Madrid Innovate", photo: "https://randomuser.me/api/portraits/men/3.jpg", quote: "Senior-level work, junior-level pricing. Communication was clear and timely throughout." },
  { name: "Zoe Carter", role: "Founder · Dubai Cyber", photo: "https://randomuser.me/api/portraits/women/50.jpg", quote: "They patched a critical zero-day in our auth flow within 24 hours. True professionals." },
  { name: "Anders Holm", role: "Architect · Oslo Cloud", photo: "https://randomuser.me/api/portraits/men/91.jpg", quote: "Migrated our entire infra to a hardened setup. Pen test scores went from C to A+." },
  { name: "Hannah Vogel", role: "Head of Ops · Dubai Tech", photo: "https://randomuser.me/api/portraits/women/85.jpg", quote: "n8n + AI workflows replaced four full-time roles. ROI was insane within a quarter." },
  { name: "Maximilian Klein", role: "CIO · Hamburg Digital", photo: "https://randomuser.me/api/portraits/men/77.jpg", quote: "Outstanding cyber team. Quietly fixed issues our internal team couldn't even identify." },
  { name: "Elena Rossi", role: "Product Lead · Rome AI", photo: "https://randomuser.me/api/portraits/women/79.jpg", quote: "Telegram bot they built scaled to 100k users without a hiccup. Engineering quality is rare." },
  { name: "Benjamin Clarke", role: "Founder · Manchester Software", photo: "https://randomuser.me/api/portraits/men/14.jpg", quote: "Custom CRM exactly as specced, delivered early. Will absolutely hire them again." },
  { name: "Olivia Janssen", role: "CEO · Rotterdam Ventures", photo: "https://randomuser.me/api/portraits/women/12.jpg", quote: "Genuinely the most reliable tech partner we've worked with. Always responsive on WhatsApp." },
  { name: "Pierre Dubois", role: "CTO · Paris SecureNet", photo: "https://randomuser.me/api/portraits/men/36.jpg", quote: "Reverse engineering and patching work was surgical. Hard to find this calibre of engineer." },
] as const;

export const steps = [
  { n: "01", t: "Discovery", d: "Understand your requirements and finalize scope, timeline, and budget." },
  { n: "02", t: "Design & Plan", d: "Architecture, mockups, and a clear technical plan signed off in writing." },
  { n: "03", t: "Build & Test", d: "Iterative development with weekly demos and thorough QA at every milestone." },
  { n: "04", t: "Deliver & Support", d: "Deploy, handover, plus ongoing maintenance and support contracts." },
] as const;

export const cities = [
  "Dubai", "London", "Zurich", "Berlin", "Paris", "Milano", "Oslo",
  "Amsterdam", "Vienna", "Stockholm", "Madrid", "Dublin", "Rotterdam", "Hamburg",
] as const;
