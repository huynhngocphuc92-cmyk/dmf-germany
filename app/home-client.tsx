"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceGateway } from "@/components/home/ServiceGateway";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsDashboard } from "@/components/b2b/StatsDashboard";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessRoadmap } from "@/components/b2b/ProcessRoadmap";
import { SalarySimulator } from "@/components/tools/SalarySimulator";
import { TalentShowcase } from "@/components/b2b/TalentShowcase";
import ContactSection from "@/components/sections/ContactSection";
import { PartnerSection } from "@/components/sections/PartnerSection";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Candidate } from "@/app/admin/candidates/types";

interface HomeClientProps {
  assets: Record<string, string | null>;
  featuredCandidates: Candidate[];
}

export function HomeClient({ assets, featuredCandidates }: HomeClientProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <HeroSection
        heroBg={assets["home_hero_bg"]}
        heroOverlayOpacity={assets["home_hero_overlay_opacity"]}
        featuredCandidates={featuredCandidates}
      />
      <PartnerSection partnerBanner={assets["home_partner_banner"]} />
      <ServiceGateway
        nursingImg={assets["home_prog_nursing_img"]}
        techImg={assets["home_prog_tech_img"]}
        hotelImg={assets["home_prog_hotel_img"]}
      />
      <AboutSection
        introImg={assets["home_intro_img"]}
        videoThumb={assets["home_intro_video_thumb"]}
      />
      <StatsDashboard />
      <ValuesSection />
      <ServicesSection />
      <ProcessRoadmap />
      <SalarySimulator />
      <TalentShowcase />
      <ContactSection />
    </div>
  );
}
