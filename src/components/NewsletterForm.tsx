"use client";

import { useState, type FormEvent } from "react";
import { t, type Locale } from "@/i18n/dict";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import ConfirmModal from "@/components/ConfirmModal";

export default function NewsletterForm({
  locale,
  variant = "home",
}: {
  locale: Locale;
  variant?: "home" | "footer";
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentInvalid, setConsentInvalid] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [popup, setPopup] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setConsentInvalid(true);
      return;
    }
    setConsentInvalid(false);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      if (!r.ok) throw new Error();
      setState("ok");
      setEmail("");
      setConsent(false);
      setPopup(true);
    } catch {
      setState("error");
    }
  }

  return (
    <div className={variant === "footer" ? "" : "max-w-xl mx-auto text-center"}>
      <form onSubmit={submit} className={`flex flex-col gap-3 ${variant === "footer" ? "" : "sm:flex-row"}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder={t("newsletter.placeholder", locale)}
          className="field flex-1"
          aria-label={t("newsletter.placeholder", locale)}
        />
        <button type="submit" className="btn btn-gold shrink-0" disabled={state === "loading"}>
          {state === "loading" ? "..." : t("newsletter.cta", locale)}
        </button>
      </form>
      <div className={`mt-3 ${variant === "footer" ? "text-left" : "text-left"}`}>
        <ConsentCheckbox locale={locale} checked={consent} onChange={(v) => { setConsent(v); setConsentInvalid(false); }} invalid={consentInvalid} />
      </div>
      {state === "error" && <p className="mt-3 text-sm font-semibold text-red-500">{t("newsletter.err", locale)}</p>}
      <ConfirmModal
        open={popup}
        onClose={() => setPopup(false)}
        title={t("form.popup.newsletter.title", locale)}
        text={t("form.popup.newsletter.text", locale)}
        locale={locale}
      />
    </div>
  );
}
