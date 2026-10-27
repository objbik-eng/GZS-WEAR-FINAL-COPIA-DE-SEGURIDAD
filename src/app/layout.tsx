import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Pirata_One } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getLocale } from "@/lib/locale-server";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["400", "500", "600", "700", "800", "900"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", weight: ["400", "500", "600", "700"] });
const pirata = Pirata_One({ subsets: ["latin"], variable: "--font-pirata", display: "swap", weight: ["400"] });

const SITE_URL = process.env.SITE_URL || "https://gzswear.roadshop.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GZS WEAR BRANDS — Streetwear exclusivo hecho en Europa",
    template: "%s · GZS WEAR BRANDS",
  },
  description:
    "Camisetas, sudaderas, gorras y gorros unisex de diseño exclusivo. Fabricación bajo pedido en Europa, envío gratis desde 60 € en la UE y devoluciones 30 días.",
  keywords: [
    "streetwear", "ropa urbana", "camisetas oversize", "sudaderas con capucha",
    "GZS WEAR", "moda unisex", "diseño exclusivo", "hoodie", "gorras", "gorros",
  ],
  applicationName: "GZS WEAR BRANDS",
  authors: [{ name: "GZS WEAR BRANDS" }],
  creator: "GZS WEAR BRANDS",
  publisher: "GZS WEAR BRANDS",
  alternates: {
    canonical: "/",
    languages: { "es-ES": "/", "en-US": "/en", en: "/en", "x-default": "/" },
  },
  openGraph: {
    siteName: "GZS WEAR BRANDS",
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    images: [{ url: "/brand/og-default.jpg", width: 1200, height: 630, alt: "GZS WEAR BRANDS" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  icons: { icon: "/icon.svg", apple: "/icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#5E845F",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale === "es" ? "es-ES" : "en-US"} className={`${archivo.variable} ${inter.variable} ${pirata.variable}`}>
      <body className="bg-white text-ink antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer locale={locale} />
        </CartProvider>
      </body>
    </html>
  );
}
