"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { t, formatPrice, type Locale } from "@/i18n/dict";
import { shopPath } from "@/lib/routes";
import { useCart } from "@/context/CartContext";

function SuccessInner({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const [data, setData] = useState<{ total?: number; email?: string } | null>(null);

  useEffect(() => {
    clear();
    if (!sessionId) return;
    fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setData(d))
      .catch(() => {});
  }, [sessionId, clear]);

  return (
    <div className="container-gzs py-24 max-w-2xl text-center">
      <CheckCircle2 size={64} className="mx-auto text-forest mb-6" strokeWidth={1.5} />
      <h1 className="text-[clamp(28px,4vw,44px)] font-black">{t("success.title", locale)}</h1>
      <p className="mt-4 text-smoke">{t("success.subtitle", locale)}</p>
      <p className="mt-2 text-smoke">{t("success.tracking", locale)}</p>
      {data?.total ? (
        <p className="mt-6 text-lg font-extrabold">{formatPrice(data.total, locale)}</p>
      ) : null}
      {sessionId && (
        <p className="mt-6 text-xs text-smoke break-all">
          {locale === "es" ? "Referencia de pedido" : "Order reference"}: <b>{sessionId}</b>
        </p>
      )}
      <Link href={shopPath(locale)} className="btn btn-primary mt-10">{t("success.back", locale)}</Link>
    </div>
  );
}

export default function SuccessClient({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <SuccessInner locale={locale} />
    </Suspense>
  );
}
