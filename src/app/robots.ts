import type { MetadataRoute } from "next";

const BASE = process.env.SITE_URL || "https://gzswear.roadshop.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout", "/carrito", "/cart", "/pedido", "/es/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
