"use client";

import { t, type Locale } from "@/i18n/dict";
import { legalPath } from "@/lib/routes";
import Link from "next/link";

export default function ConsentCheckbox({
  locale,
  checked,
  onChange,
  invalid,
}: {
  locale: Locale;
  checked: boolean;
  onChange: (v: boolean) => void;
  invalid?: boolean;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 text-[13px] leading-snug text-smoke cursor-pointer select-none">
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#5e845f] cursor-pointer"
          aria-required="true"
        />
        <span>
          {t("form.consent", locale)}{" "}
          <Link href={legalPath("privacidad", locale)} target="_blank" className="text-forest font-semibold underline">
            {t("legal.privacy", locale)}
          </Link>{" · "}
          <Link href={legalPath("aviso-legal", locale)} target="_blank" className="text-forest font-semibold underline">
            {t("legal.legalNotice", locale)}
          </Link>
        </span>
      </label>
      {invalid && <p className="text-red-600 text-xs font-semibold mt-1.5">{t("form.consent.required", locale)}</p>}
    </div>
  );
}
