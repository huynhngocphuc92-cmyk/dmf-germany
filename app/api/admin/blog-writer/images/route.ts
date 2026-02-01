import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ImageSuggestion } from "@/app/admin/blog-writer/types";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    // Check if Unsplash API key is configured
    if (!UNSPLASH_ACCESS_KEY) {
      // Return placeholder images if no API key
      return NextResponse.json({
        success: true,
        data: generatePlaceholderImages(query),
        source: "placeholder",
      });
    }

    // Search Unsplash
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!unsplashResponse.ok) {
      console.error("Unsplash API error:", await unsplashResponse.text());
      return NextResponse.json({
        success: true,
        data: generatePlaceholderImages(query),
        source: "placeholder",
      });
    }

    const unsplashData = await unsplashResponse.json();

    const images: ImageSuggestion[] = unsplashData.results.map((photo: UnsplashPhoto) => ({
      id: photo.id,
      query,
      description: photo.alt_description || photo.description || query,
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular,
        full: photo.urls.full,
      },
      author: photo.user.name,
      authorUrl: photo.user.links.html,
    }));

    return NextResponse.json({
      success: true,
      data: images,
      source: "unsplash",
    });
  } catch (error) {
    console.error("Image search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search images" },
      { status: 500 }
    );
  }
}

function generatePlaceholderImages(query: string): ImageSuggestion[] {
  // Generate placeholder images using a service like placeholder.com or picsum
  const placeholders: ImageSuggestion[] = [];

  for (let i = 0; i < 6; i++) {
    placeholders.push({
      id: `placeholder-${i}`,
      query,
      description: `${query} - Image ${i + 1}`,
      urls: {
        small: `https://picsum.photos/seed/${encodeURIComponent(query + i)}/400/300`,
        regular: `https://picsum.photos/seed/${encodeURIComponent(query + i)}/800/600`,
        full: `https://picsum.photos/seed/${encodeURIComponent(query + i)}/1920/1080`,
      },
      author: "Picsum Photos",
      authorUrl: "https://picsum.photos",
    });
  }

  return placeholders;
}
