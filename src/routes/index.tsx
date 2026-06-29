import { createFileRoute } from "@tanstack/react-router";
import { BRAND, WHATSAPP_NUMBER, services } from "@/data/site";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { Process } from "@/components/site/Process";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EHR — Software, Cybersecurity & AI Automation Agency" },
      { name: "description", content: "Custom software, cybersecurity & bug hunting, AI automation (n8n), bot development, and reverse engineering for international clients." },
      { property: "og:title", content: "EHR — Software, Cybersecurity & AI Automation" },
      { property: "og:description", content: "Elite engineering agency: software, cybersecurity, AI automation, bots, reverse engineering — for clients in Dubai, London, Zurich and Berlin." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://free-shop-joy.lovable.app/" },
      { name: "twitter:title", content: "EHR — Software, Cybersecurity & AI Automation" },
      { name: "twitter:description", content: "Elite engineering agency: software, cybersecurity, AI automation, bots, reverse engineering." },
    ],
    links: [{ rel: "canonical", href: "https://free-shop-joy.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: BRAND,
          description:
            "Custom software, cybersecurity & bug hunting, AI automation, bot development, and reverse engineering.",
          telephone: `+${WHATSAPP_NUMBER}`,
          url: "https://free-shop-joy.lovable.app/",
          address: {
            "@type": "PostalAddress",
            addressCountry: "BD",
          },
          priceRange: "$$$",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "30",
            bestRating: "5",
          },
          makesOffer: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.desc },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh w-full bg-white text-slate-900">
      <Nav />
      <main className="[&>section]:scroll-mt-24 [&>section:not(:first-child)]:border-t [&>section]:border-slate-100">
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
