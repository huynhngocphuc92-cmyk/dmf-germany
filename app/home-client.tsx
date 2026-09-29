"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceGateway } from "@/components/home/ServiceGateway";
import { AboutSection } from "@/components/sections/AboutSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessRoadmap } from "@/components/b2b/ProcessRoadmap";
import { SalarySimulator } from "@/components/tools/SalarySimulator";
import ContactSection from "@/components/sections/ContactSection";
import type { PublicCandidate } from "@/lib/candidates/public-profile";

interface HomeClientProps {
  assets: Record<string, string | null>;
  featuredCandidates: PublicCandidate[];
}

export function HomeClient({ assets, featuredCandidates }: HomeClientProps) {
  return (
    <div className="min-h-screen">
      <HeroSection
        heroBg={assets["home_hero_bg"]}
        heroOverlayOpacity={assets["home_hero_overlay_opacity"]}
        featuredCandidates={featuredCandidates}
      />
      <ServiceGateway
        nursingImg={assets["home_prog_nursing_img"]}
        techImg={assets["home_prog_tech_img"]}
        hotelImg={assets["home_prog_hotel_img"]}
      />
      <AboutSection
        introImg={assets["home_intro_img"]}
        videoThumb={assets["home_intro_video_thumb"]}
      />
      <ValuesSection />
      <ServicesSection />
      <ProcessRoadmap />
      <SalarySimulator />
      <ContactSection />
    </div>
  );
}
