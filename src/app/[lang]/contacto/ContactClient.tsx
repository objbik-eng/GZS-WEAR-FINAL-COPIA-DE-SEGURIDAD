"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { t, type Locale } from "@/i18n/dict";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import ConfirmModal from "@/components/ConfirmModal";

export default function ContactClient({ locale }: { locale: Locale }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
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
    setState("loading");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent: true }),
      });
      if (!r.ok) throw new Error();
      setState("ok");
      setForm({ name: "", email: "", subject: "", message: "" });
      setConsent(false);
      setPopup(true);
    } catch {
      setState("error");
    }
  }

  return (
    <div className="container-gzs py-12 lg:py-16 max-w-5xl grid lg:grid-cols-[1fr_1.3fr] gap-12">
      <div>
        <span className="eyebrow">GZS WEAR</span>
        <h1 className="text-[clamp(30px,4.5vw,48px)] font-black mt-3">{t("contact.title", locale)}</h1>
        <p className="text-smoke mt-4 leading-relaxed">{t("contact.subtitle", locale)}</p>
        <div className="mt-8 space-y-4 text-sm">
          <a href="mailto:gzswear@roadshop.online" className="flex items-center gap-3 font-semibold hover:text-forest">
            <Mail size={18} className="text-forest" /> gzswear@roadshop.online
          </a>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-line p-6 lg:p-8 space-y-5">
        <div>
          <label className="field-label">{t("contact.name", locale)}</label>
          <input required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="field-label">{t("contact.email", locale)}</label>
          <input required type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="field-label">{t("contact.subject", locale)}</label>
          <input required className="field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div>
          <label className="field-label">{t("contact.message", locale)}</label>
          <textarea required rows={6} className="field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <ConsentCheckbox locale={locale} checked={consent} onChange={(v) => { setConsent(v); setConsentInvalid(false); }} invalid={consentInvalid} />
        <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full">
          {state === "loading" ? <Loader2 className="animate-spin" size={17} /> : <Send size={16} />}
          {t("contact.send", locale)}
        </button>
        {state === "error" && <p className="text-red-600 font-semibold text-sm text-center">{t("contact.err", locale)}</p>}
      </form>

      <ConfirmModal
        open={popup}
        onClose={() => setPopup(false)}
        title={t("form.popup.title", locale)}
        text={t("form.popup.contact.text", locale)}
        locale={locale}
      />
    </div>
  );
}
