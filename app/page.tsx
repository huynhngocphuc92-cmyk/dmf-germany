import { HomeClient } from "./home-client";
import { loadAssets } from "@/lib/theme-helpers";
import { getFeaturedCandidates } from "@/app/admin/candidates/actions";

// ISR: Revalidate every 60 seconds to balance fresh data and performance
// Admin updates will appear within 60 seconds
export const revalidate = 60;

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

  return <HomeClient assets={assets} featuredCandidates={featuredCandidates || []} />;
}
