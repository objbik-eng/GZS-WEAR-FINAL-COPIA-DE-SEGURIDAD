import { headers } from "next/headers";
import type { Locale } from "@/i18n/dict";
import { DEFAULT_LOCALE } from "@/i18n/dict";

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const loc = h.get("x-locale");
  return loc === "en" ? "en" : DEFAULT_LOCALE;
}

export async function getOriginalPath(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") || "/";
}
