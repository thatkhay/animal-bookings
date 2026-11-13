import { CoverageSection } from "@/components/marketing/coverage-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { Hero } from "@/components/marketing/hero";
import { HowSection } from "@/components/marketing/how-section";
import { ProofSection } from "@/components/marketing/proof-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { getHub, getMarketingContent, getServices, getZones } from "@/lib/api";

export default async function HomePage() {
  const [services, zones, hub, { testimonials, faqs }] = await Promise.all([
    getServices(),
    getZones(),
    getHub(),
    getMarketingContent(),
  ]);

  return (
    <>
      <Hero services={services} />
      <ServicesSection services={services} />
      <HowSection />
      <CoverageSection zones={zones} hub={hub} />
      <ProofSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <CtaSection />
    </>
  );
}
