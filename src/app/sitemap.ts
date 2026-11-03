import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const [categories, { items: products }] = await Promise.all([getCategories(), getProducts({ perPage: 1000 })]);
  const staticRoutes = ["", "/catalog", "/new", "/sale", "/about", "/stores", "/reviews", "/delivery", "/size-guide"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${base}/catalog/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
