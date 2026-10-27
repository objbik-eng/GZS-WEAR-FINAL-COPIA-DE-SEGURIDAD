"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import type { Locale } from "@/i18n/dict";

interface OrderData {
  id: string;
  email: string | null;
  customer_name: string | null;
  amount_total_cents: number;
  status: string;
  fulfillment_status?: string | null;
  tracking_info?: { carrier?: string; tracking_number?: string; tracking_url?: string }[] | null;
  created_at?: string;
}

const STEPS: { key: string; es: string; en: string }[] = [
  { key: "paid", es: "Pago confirmado", en: "Payment confirmed" },
  { key: "in-production", es: "En producción", en: "In production" },
  { key: "shipped", es: "Enviado", en: "Shipped" },
  { key: "delivered", es: "Entregado", en: "Delivered" },
];

function Inner({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setOrder(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <p className="container-gzs py-28 text-center text-smoke">…</p>;
  if (!order) {
    return (
      <div className="container-gzs py-28 max-w-xl text-center">
        <Clock size={48} className="mx-auto text-smoke mb-4" />
        <h1 className="text-2xl font-black">
          {locale === "es" ? "Pedido no encontrado" : "Order not found"}
        </h1>
        <p className="text-smoke mt-3">
          {locale === "es"
            ? "Si acabas de completar el pago, espera un minuto y recarga la página."
            : "If you just completed payment, wait a minute and reload the page."}
        </p>
      </div>
    );
  }

  const currentStep = STEPS.findIndex((s) => s.key === order.fulfillment_status);
  const active = currentStep === -1 ? 0 : currentStep;

  return (
    <div className="container-gzs py-16 max-w-3xl">
      <h1 className="text-3xl font-black mb-2">
        {locale === "es" ? "Estado de tu pedido" : "Your order status"}
      </h1>
      <p className="text-smoke text-sm mb-10">
        {order.customer_name ? `${order.customer_name} · ` : ""}{order.email}
      </p>

      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        {STEPS.map((step, i) => {
          const done = i <= active;
          const Icon = i === 3 ? CheckCircle2 : i === 2 ? Truck : i === 1 ? Package : CheckCircle2;
          return (
            <div key={step.key} className={`rounded-xl border p-4 text-center ${done ? "border-forest bg-forest-soft" : "border-line opacity-50"}`}>
              <Icon size={22} className={`mx-auto mb-2 ${done ? "text-forest" : "text-smoke"}`} />
              <p className="text-xs font-bold">{step[locale]}</p>
            </div>
          );
        })}
      </div>

      {order.tracking_info && order.tracking_info.length > 0 && (
        <div className="rounded-xl border border-line p-5">
          <h2 className="font-bold mb-3">{locale === "es" ? "Seguimiento" : "Tracking"}</h2>
          {order.tracking_info.map((s, i) => (
            <div key={i} className="text-sm py-1">
              <b>{s.carrier}</b> {s.tracking_number}
              {s.tracking_url && (
                <a href={s.tracking_url} target="_blank" rel="noopener noreferrer" className="text-forest underline ml-2">
                  {locale === "es" ? "Ver envío" : "Track parcel"}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderStatus({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <Inner locale={locale} />
    </Suspense>
  );
}
