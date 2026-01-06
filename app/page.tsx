import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceGateway } from "@/components/home/ServiceGateway";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsDashboard } from "@/components/b2b/StatsDashboard";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessRoadmap } from "@/components/b2b/ProcessRoadmap";
import { SalarySimulator } from "@/components/tools/SalarySimulator";
import { TalentShowcase } from "@/components/b2b/TalentShowcase";
import { ContactSection } from "@/components/sections/ContactSection";
import { PartnerSection } from "@/components/sections/PartnerSection";
import { loadAssets } from "@/lib/theme-helpers";
import { getFeaturedCandidates } from "@/app/admin/candidates/actions";

// CRITICAL: Disable caching for homepage to ensure fresh data from database
// This ensures that updates in Admin are immediately visible on homepage
export const revalidate = 0;

export default async function Home() {
  // Load all dynamic assets from database
  const assetKeys = [
    // Hero Section
    "home_hero_bg",
    "home_hero_overlay_opacity",
    // Partner Section
    "home_partner_banner",
    // About/Intro Section
    "home_intro_img",
    "home_intro_video_thumb",
    // Programs Section
    "home_prog_nursing_img",
    "home_prog_tech_img",
    "home_prog_hotel_img",
    // CTA Section
    "home_cta_bg",
  ];

  const assets = await loadAssets(assetKeys);
  
  // Fetch featured candidates for Hero Section showcase
  const { data: featuredCandidates } = await getFeaturedCandidates();

  return (
    <div className="min-h-screen">
      <HeroSection 
        heroBg={assets["home_hero_bg"]}
        heroOverlayOpacity={assets["home_hero_overlay_opacity"]}
        featuredCandidates={featuredCandidates || []}
      />
      <PartnerSection 
        partnerBanner={assets["home_partner_banner"]}
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
      <StatsDashboard />
      <ValuesSection />
      <ServicesSection />
      <ProcessRoadmap />
      <SalarySimulator />
      <TalentShowcase />
      <ContactSection 
        ctaBg={assets["home_cta_bg"]}
      />
    </div>
  );
}
