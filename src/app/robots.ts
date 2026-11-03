import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/checkout", "/cart", "/order/", "/search"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
