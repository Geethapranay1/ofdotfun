import { HeroSection } from "@/components/landing/hero-section";
import { BrandSlider } from "@/components/landing/brand-slider";
import { AudienceCardsSection } from "@/components/landing/audience-cards-section";
import { AboutSection } from "@/components/landing/about-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { SmoothScroll } from "@/components/smooth-scroll";
import Pattern from "@/components/landing/pattern";

export default function Home() {
  return (
    <main className="w-full">
      <SmoothScroll />
      <Pattern />
      <div className="min-h-screen w-full uppercase mx-auto max-w-7xl md:border">
        <HeroSection />
        <BrandSlider />
        <AudienceCardsSection />
        <AboutSection />
        <FAQSection />
        <FooterSection />
      </div>
    </main>
  );
}
