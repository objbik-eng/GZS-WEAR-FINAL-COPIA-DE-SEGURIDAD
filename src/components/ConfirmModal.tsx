"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import type { Locale } from "@/i18n/dict";
import { t } from "@/i18n/dict";

export default function ConfirmModal({
  open,
  onClose,
  title,
  text,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  locale: Locale;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/55 animate-fade" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-fadeUp">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("form.popup.close", locale)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-cream transition-colors"
        >
          <X size={20} />
        </button>
        <div className="w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center mx-auto">
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h3 className="font-display font-extrabold text-xl mt-5">{title}</h3>
        <p className="text-smoke text-sm mt-2 leading-relaxed">{text}</p>
        <button type="button" onClick={onClose} className="btn btn-primary mt-6 w-full">
          {t("form.popup.close", locale)}
        </button>
      </div>
    </div>
  );
}
