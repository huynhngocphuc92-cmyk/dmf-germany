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

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServiceGateway />
      <AboutSection />
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
