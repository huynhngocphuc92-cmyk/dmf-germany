import { pageMetadata, SITE_DESCRIPTION } from "@/lib/site";
export const metadata = {
  ...pageMetadata("/", "Fachkräfte aus Vietnam für Deutschland", SITE_DESCRIPTION),
  title: { absolute: "Fachkräfte aus Vietnam für Deutschland | DMF Talents" },
};
import { Suspense } from "react";
import { CandidateShowcase } from "@/components/sections/CandidateShowcase";
import { TalentShowcase } from "@/components/b2b/TalentShowcase";
import { CandidateRegionState } from "@/components/home/CandidateRegionState";
import { HomeClient } from "./home-client";
import { loadAssets } from "@/lib/theme-helpers";
import { getHomepageFeaturedCandidates } from "@/lib/supabase/candidates";

// Read publication state at request time, including withdrawals and expiry.
export const dynamic = "force-dynamic";

type CandidatesPromise = ReturnType<typeof getHomepageFeaturedCandidates>;

async function HeroCandidates({ candidates }: { candidates: CandidatesPromise }) {
  const { data, error } = await candidates;
  return error ? (
    <CandidateRegionState error region="hero" />
  ) : (
    <CandidateShowcase candidates={data ?? []} />
  );
}

async function TalentCandidates({ candidates }: { candidates: CandidatesPromise }) {
  const { data, error } = await candidates;
  return error ? (
    <CandidateRegionState error region="talent" />
  ) : (
    <TalentShowcase candidates={data ?? []} />
  );
}

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

  // One request-local read shared by both streamed regions. The loader settles
  // errors as a result, so an early failure cannot become an unhandled rejection.
  const candidates = getHomepageFeaturedCandidates();
  const assets = await loadAssets(assetKeys);

  return (
    <HomeClient
      assets={assets}
      heroCandidates={
        <Suspense fallback={<CandidateRegionState region="hero" />}>
          <HeroCandidates candidates={candidates} />
        </Suspense>
      }
      talentCandidates={
        <Suspense fallback={<CandidateRegionState region="talent" />}>
          <TalentCandidates candidates={candidates} />
        </Suspense>
      }
    />
  );
}
