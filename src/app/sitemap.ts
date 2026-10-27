import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { productPath, shopPath, contactPath, legalPath } from "@/lib/routes";

const BASE = (process.env.SITE_URL || "https://gzswear.roadshop.online").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}${shopPath("es")}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}${shopPath("en")}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}${contactPath("es")}`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}${contactPath("en")}`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  for (const key of ["aviso-legal", "privacidad", "terminos", "cookies", "envios-devoluciones"]) {
    entries.push({
      url: `${BASE}${legalPath(key, "es")}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    });
    entries.push({
      url: `${BASE}${legalPath(key, "en")}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    });
  }

  for (const p of getAllProducts()) {
    entries.push({
      url: `${BASE}${productPath(p, "es")}`,
      lastModified: new Date(p.updatedAt || now),
      changeFrequency: "weekly",
      priority: 0.8,
    });
    entries.push({
      url: `${BASE}${productPath(p, "en")}`,
      lastModified: new Date(p.updatedAt || now),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
