"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceGateway } from "@/components/home/ServiceGateway";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsDashboard } from "@/components/b2b/StatsDashboard";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessRoadmap } from "@/components/b2b/ProcessRoadmap";
import { DeferredSalarySimulator } from "@/components/performance/DeferredSalarySimulator";
import { PathwayFinder } from "@/components/tools/PathwayFinder";
import { GeoKnowledgeSection } from "@/components/sections/GeoKnowledgeSection";
import ContactSection from "@/components/sections/ContactSection";
import { PartnerSection } from "@/components/sections/PartnerSection";
import type { ReactNode } from "react";

interface HomeClientProps {
  assets: Record<string, string | null>;
  heroCandidates: ReactNode;
  talentCandidates: ReactNode;
}

export function HomeClient({ assets, heroCandidates, talentCandidates }: HomeClientProps) {
  return (
    <div className="min-h-screen">
      <HeroSection
        heroBg={assets["home_hero_bg"] || "/images/home/hero-bg.jpg"}
        heroOverlayOpacity={assets["home_hero_overlay_opacity"]}
        candidateSlot={heroCandidates}
      />
      <PartnerSection
        partnerBanner={assets["home_partner_banner"] || "/images/home/partner-banner.jpg"}
      />
      <ServiceGateway
        nursingImg={assets["home_prog_nursing_img"] || "/images/home/prog-azubi.jpg"}
        techImg={assets["home_prog_tech_img"] || "/images/home/prog-skilled.jpg"}
        hotelImg={assets["home_prog_hotel_img"] || "/images/home/prog-seasonal.jpg"}
      />
      <AboutSection
        introImg={assets["home_intro_img"] || "/images/home/about-academy.jpg"}
        videoThumb={assets["home_intro_video_thumb"]}
        repDeImg={assets["home_rep_de_img"] || "/images/home/umit-elezov.jpg"}
        repVnImg={assets["home_rep_vn_img"] || "/images/home/achim-betticher.jpg"}
      />
      <StatsDashboard />
      <ValuesSection />
      <ServicesSection />
      <ProcessRoadmap />
      <DeferredSalarySimulator />
      {talentCandidates}
      <PathwayFinder />
      <GeoKnowledgeSection />
      <ContactSection
        repDeImg={assets["home_rep_de_img"] || "/images/home/umit-elezov.jpg"}
        repVnImg={assets["home_rep_vn_img"] || "/images/home/achim-betticher.jpg"}
      />
    </div>
  );
}
