import { MetadataRoute } from "next";
import { siteUrl, SITE_URL } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: siteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
