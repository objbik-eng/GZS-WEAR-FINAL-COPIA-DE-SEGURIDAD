"use client";

import { useState, type FormEvent } from "react";
import { t, type Locale } from "@/i18n/dict";

export default function NewsletterForm({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error();
      setState("ok");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <div className={compact ? "" : "max-w-xl mx-auto text-center"}>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
          placeholder={t("newsletter.placeholder", locale)}
          className="field flex-1"
          aria-label={t("newsletter.placeholder", locale)}
        />
        <button type="submit" className="btn btn-gold" disabled={state === "loading"}>
          {state === "loading" ? "..." : t("newsletter.cta", locale)}
        </button>
      </form>
      {state === "ok" && <p className="mt-3 text-sm font-semibold text-forest">{t("newsletter.ok", locale)}</p>}
      {state === "error" && <p className="mt-3 text-sm font-semibold text-red-600">{t("newsletter.err", locale)}</p>}
    </div>
  );
}
