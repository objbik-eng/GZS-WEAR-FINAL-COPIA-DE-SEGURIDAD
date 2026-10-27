import type { ReactNode } from "react";
import type { Locale } from "@/i18n/dict";
import { LOCALES } from "@/i18n/dict";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default function LangLayout({ children }: { children: ReactNode }) {
  return children;
}
