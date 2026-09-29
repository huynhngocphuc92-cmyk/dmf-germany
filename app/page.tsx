import { pageMetadata, SITE_DESCRIPTION } from "@/lib/site";
export const metadata = {
  ...pageMetadata("/", "Fachkräfte aus Vietnam für Deutschland", SITE_DESCRIPTION),
  title: { absolute: "Fachkräfte aus Vietnam für Deutschland | DMF Talents" },
};
import { HomeClient } from "./home-client";
import { loadAssets } from "@/lib/theme-helpers";
import { getHomepageFeaturedCandidates } from "@/lib/supabase/candidates";

// Read publication state at request time, including withdrawals and expiry.
export const dynamic = "force-dynamic";

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
  const { data: featuredCandidates } = await getHomepageFeaturedCandidates();

  return <HomeClient assets={assets} featuredCandidates={featuredCandidates || []} />;
}
