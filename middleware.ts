import { NextRequest, NextResponse } from "next/server";

/* Mapa de alias públicos en inglés → segmentos internos en español. */
const EN_ALIAS: Record<string, string> = {
  shop: "tienda",
  product: "producto",
  cart: "carrito",
  contact: "contacto",
  legal: "legal",
};

const LEGAL_EN_TO_ES: Record<string, string> = {
  "legal-notice": "aviso-legal",
  privacy: "privacidad",
  terms: "terminos",
  cookies: "cookies",
  "shipping-returns": "envios-devoluciones",
};

const SYSTEM = ["/api", "/_next", "/favicon", "/robots.txt", "/sitemap.xml", "/google", "/brand", "/images"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (SYSTEM.some((s) => pathname.startsWith(s))) return NextResponse.next();

  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  if (isEn) {
    const rest = pathname.replace(/^\/en\/?/, "");
    const segments = rest.split("/").filter(Boolean);
    if (segments[0] && EN_ALIAS[segments[0]]) segments[0] = EN_ALIAS[segments[0]];
    if (segments[0] === "legal" && segments[1] && LEGAL_EN_TO_ES[segments[1]]) {
      segments[1] = LEGAL_EN_TO_ES[segments[1]];
    }
    const internal = `/en/${segments.join("/")}`;
    const url = req.nextUrl.clone();
    url.pathname = internal;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-pathname", pathname);
    res.headers.set("x-locale", "en");
    return res;
  }

  // Evitar prefijo /es duplicado: redirigir a la URL limpia
  if (pathname.startsWith("/es/") || pathname === "/es") {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/es/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = req.nextUrl.clone();
  url.pathname = `/es${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-pathname", pathname);
  res.headers.set("x-locale", "es");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|google.*\\.html|brand/|images/).*)"],
};
