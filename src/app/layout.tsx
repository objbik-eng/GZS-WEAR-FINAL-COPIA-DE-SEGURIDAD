import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "GZS WEAR* — Ropa urbana de arte disruptivo",
  description: "Hoodies, camisetas gráficas, cargos y chaquetas. Arte disruptivo para gente street de 16 a 40. Envío 24/48h y devolución 30 días.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-[#0E0E0E] antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Header/>
          <main className="flex-1">{children}</main>
          <Footer/>
          <CartDrawer/>
        </CartProvider>
      </body>
    </html>
  );
}
