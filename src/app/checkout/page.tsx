"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Truck, Zap, CreditCard, Smartphone, Check, ChevronLeft, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/seed-data";
import { LogoMark } from "@/components/Logo";

export default function CheckoutPage(){
  const {items, subtotal, clear}=useCart();
  const router=useRouter();
  const [step,setStep]=useState(1);
  const [promo,setPromo]=useState("");
  const [appliedPromo,setAppliedPromo]=useState("");
  const [promoMsg,setPromoMsg]=useState("");
  const [shippingMethod,setShippingMethod]=useState("standard");
  const [payment,setPayment]=useState("card");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({email:"", customerName:"", address:"", city:"", postalCode:"", phone:"", card:"", expiry:"", cvc:""});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));

  const shipping = subtotal>=7500 ? 0 : shippingMethod==="express"?895:495;
  const discount = appliedPromo==="BARRIO10" ? Math.round(subtotal*0.10):0;
  const total = Math.max(0, subtotal - discount + (items.length?shipping:0));

  const applyPromo=()=>{ if(promo.trim().toUpperCase()==="BARRIO10"){ setAppliedPromo("BARRIO10"); setPromoMsg("Código aplicado: -10% 🎉"); } else { setAppliedPromo(""); setPromoMsg("Código no válido. Prueba BARRIO10"); } };

  const placeOrder=async(e:any)=>{ e.preventDefault(); setLoading(true); setError("");
    const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form, items, shippingMethod, paymentMethod:payment, promo:appliedPromo})});
    const d=await r.json(); setLoading(false);
    if(r.ok){ clear(); router.push(`/checkout/exito?pedido=${d.order.orderNumber}&total=${d.order.total}&email=${encodeURIComponent(form.email)}`); } else setError(d.error||"Error al procesar el pedido");
  };

  if(items.length===0) return <div className="max-w-2xl mx-auto px-4 py-24 text-center"><LogoMark size={56}/><h1 className="font-display font-black uppercase text-3xl mt-6">Tu bolsa está vacía</h1><p className="text-neutral-500 mt-2">Añade algo del drop antes de pasar por caja.</p><Link href="/tienda" className="inline-block mt-6 bg-black text-white px-7 py-3.5 text-xs font-black tracking-widest uppercase">Ir a la tienda</Link></div>;

  return <div className="bg-[#F4F2EC] min-h-screen">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/tienda" className="text-xs font-bold flex items-center gap-1 hover:text-[#5E845F]"><ChevronLeft size={14}/> Seguir comprando</Link>
      <h1 className="font-display font-black uppercase text-4xl sm:text-5xl mt-3">Checkout <span className="text-[#D39905]">*</span></h1>
      <div className="flex items-center gap-0 mt-6 max-w-lg">{[["1","Envío"],["2","Pago"],["3","Confirmar"]].map(([n,l],i)=><div key={n} className="flex items-center flex-1 last:flex-none"><button onClick={()=> i<step-1 && setStep(i+1)} className={`flex items-center gap-2 ${step>=Number(n)?"text-black":"text-neutral-400"}`}><span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-black ${step>Number(n)?"bg-[#5E845F] text-white": step===Number(n)?"bg-black text-white":"bg-black/10"}`}>{step>Number(n)?<Check size={14}/>:n}</span><span className="text-xs font-black tracking-widest uppercase hidden sm:block">{l}</span></button>{i<2 && <div className={`flex-1 h-0.5 mx-2 ${step>Number(n)?"bg-[#5E845F]":"bg-black/10"}`}/>}</div>)}</div>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_400px] gap-6 mt-8 items-start">
        <div className="space-y-4">
          {step===1 && <section className="bg-white p-6 border border-black/10 animate-fadeUp">
            <h2 className="font-display font-black uppercase text-lg flex items-center gap-2"><Truck className="text-[#5E845F]"/> Datos de envío</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <label className="sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider">Email *</span><input required type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="tu@email.com" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label className="sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider">Nombre y apellidos *</span><input required value={form.customerName} onChange={e=>set("customerName",e.target.value)} placeholder="Ej. Lucía Martínez" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label className="sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider">Dirección *</span><input required value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Calle, número, piso" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label><span className="text-xs font-bold uppercase tracking-wider">Ciudad *</span><input required value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Madrid" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label><span className="text-xs font-bold uppercase tracking-wider">Código postal *</span><input required value={form.postalCode} onChange={e=>set("postalCode",e.target.value)} placeholder="28004" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label className="sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider">Teléfono (para el repartidor)</span><input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="600 123 456" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <button type="button" onClick={()=>setShippingMethod("standard")} className={`border p-4 text-left ${shippingMethod==="standard"?"border-[#5E845F] bg-[#5E845F]/5 ring-1 ring-[#5E845F]":"border-black/15"}`}><Truck size={18} className="text-[#5E845F]"/><p className="font-bold text-sm mt-2">Estándar 24/48h</p><p className="text-xs text-neutral-500">{subtotal>=7500?"GRATIS en tu pedido":"4,95 € · Gratis +75 €"}</p></button>
              <button type="button" onClick={()=>setShippingMethod("express")} className={`border p-4 text-left ${shippingMethod==="express"?"border-[#5E845F] bg-[#5E845F]/5 ring-1 ring-[#5E845F]":"border-black/15"}`}><Zap size={18} className="text-[#D39905]"/><p className="font-bold text-sm mt-2">Express 24h</p><p className="text-xs text-neutral-500">8,95 € · Pide antes de las 16:00</p></button>
            </div>
            <button type="button" onClick={()=>{ if(form.email && form.customerName && form.address && form.city && form.postalCode) setStep(2); else setError("Completa los campos obligatorios de envío"); }} className="w-full mt-6 bg-black text-white py-3.5 font-black tracking-widest uppercase text-sm hover:bg-[#5E845F] transition">Continuar al pago →</button>
            {error && step===1 && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </section>}

          {step===2 && <section className="bg-white p-6 border border-black/10 animate-fadeUp">
            <h2 className="font-display font-black uppercase text-lg flex items-center gap-2"><CreditCard className="text-[#5E845F]"/> Pago seguro</h2>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[["card",CreditCard,"Tarjeta"],["bizum",Smartphone,"Bizum"],["klarna",Tag,"Klarna 3x"]].map(([id,Icon,label]:any)=><button key={id} type="button" onClick={()=>setPayment(id)} className={`border p-3 text-center ${payment===id?"border-[#5E845F] bg-[#5E845F]/5 ring-1 ring-[#5E845F]":"border-black/15"}`}><Icon size={18} className="mx-auto"/><p className="text-xs font-bold mt-1">{label}</p></button>)}
            </div>
            {payment==="card" && <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <label className="sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider">Número de tarjeta *</span><input required value={form.card} onChange={e=>set("card",e.target.value.replace(/[^\d]/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="4242 4242 4242 4242" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label><span className="text-xs font-bold uppercase tracking-wider">Caducidad *</span><input required value={form.expiry} onChange={e=>set("expiry",e.target.value)} placeholder="12/28" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <label><span className="text-xs font-bold uppercase tracking-wider">CVC *</span><input required value={form.cvc} onChange={e=>set("cvc",e.target.value.slice(0,4))} placeholder="123" className="w-full border border-black/15 px-3 py-3 mt-1"/></label>
              <p className="sm:col-span-2 text-xs text-neutral-500 bg-[#F4F2EC] p-3">Demo: usa cualquier número válido de prueba, ej. 4242 4242 4242 4242. No se realiza ningún cargo real.</p>
            </div>}
            {payment==="bizum" && <p className="mt-5 text-sm bg-[#F4F2EC] p-4">Recibirás una solicitud Bizum en tu móvil al confirmar. Demo: no se envía ninguna solicitud real.</p>}
            {payment==="klarna" && <p className="mt-5 text-sm bg-[#F4F2EC] p-4">Paga en 3 plazos de {money(Math.round(total/3))} sin intereses. Demo sin cargo real.</p>}
            <div className="flex gap-2 mt-6"><button type="button" onClick={()=>setStep(1)} className="border border-black px-5 py-3.5 text-xs font-black tracking-widest uppercase">← Envío</button><button type="button" onClick={()=>setStep(3)} className="flex-1 bg-black text-white py-3.5 font-black tracking-widest uppercase text-sm hover:bg-[#5E845F] transition">Revisar pedido →</button></div>
          </section>}

          {step===3 && <section className="bg-white p-6 border border-black/10 animate-fadeUp">
            <h2 className="font-display font-black uppercase text-lg flex items-center gap-2"><Check className="text-[#5E845F]"/> Confirma tu pedido</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
              <div className="bg-[#F4F2EC] p-4"><p className="font-black uppercase text-xs tracking-widest mb-1">Envío</p><p>{form.customerName}<br/>{form.address}<br/>{form.postalCode} {form.city}<br/><span className="text-neutral-500">{form.email}</span></p><button type="button" onClick={()=>setStep(1)} className="underline text-xs mt-2 font-bold">Editar</button></div>
              <div className="bg-[#F4F2EC] p-4"><p className="font-black uppercase text-xs tracking-widest mb-1">Pago y entrega</p><p>{payment==="card"?"Tarjeta •••• "+(form.card.slice(-4)||"4242"): payment==="bizum"?"Bizum":"Klarna 3 plazos"}<br/>{shippingMethod==="express"?"Express 24h":"Estándar 24/48h"}</p><button type="button" onClick={()=>setStep(2)} className="underline text-xs mt-2 font-bold">Editar</button></div>
            </div>
            {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
            <button disabled={loading} className="w-full mt-6 bg-[#5E845F] hover:bg-[#2E4A33] disabled:opacity-60 text-white py-4 font-black tracking-[0.14em] uppercase text-sm flex items-center justify-center gap-2 transition"><Lock size={15}/> {loading?"Procesando pago…":`Pagar ${money(total)}`}</button>
            <p className="text-[11px] text-neutral-500 text-center mt-3">Al pagar aceptas nuestros términos. Pedido demo guardado en la base de datos de la tienda.</p>
          </section>}
        </div>

        {/* Summary */}
        <aside className="bg-white border border-black/10 p-6 lg:sticky lg:top-24">
          <h3 className="font-display font-black uppercase">Tu pedido ({items.reduce((a,i)=>a+i.qty,0)})</h3>
          <div className="space-y-3 mt-4 max-h-72 overflow-y-auto pr-1">{items.map(i=><div key={`${i.slug}-${i.size}`} className="flex gap-3"><div className="relative w-14 h-16 bg-[#F4F2EC] shrink-0"><img src={i.image} className="w-full h-full object-cover" alt=""/><span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full grid place-items-center">{i.qty}</span></div><div className="flex-1 min-w-0"><p className="text-sm font-bold leading-tight truncate">{i.name}</p><p className="text-xs text-neutral-500">Talla {i.size} · {i.color}</p></div><span className="text-sm font-bold">{money(i.price*i.qty)}</span></div>)}</div>
          <div className="flex gap-2 mt-5"><input value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Código (BARRIO10)" className="flex-1 border border-black/15 px-3 py-2.5 text-sm uppercase"/><button type="button" onClick={applyPromo} className="bg-black text-white px-4 text-xs font-black tracking-widest uppercase">Aplicar</button></div>
          {promoMsg && <p className={`text-xs mt-2 font-semibold ${appliedPromo?"text-[#5E845F]":"text-red-600"}`}>{promoMsg}</p>}
          <div className="border-t border-black/10 mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            {discount>0 && <div className="flex justify-between text-[#5E845F] font-bold"><span>Descuento BARRIO10</span><span>-{money(discount)}</span></div>}
            <div className="flex justify-between"><span>Envío</span><span>{shipping===0?"GRATIS":money(shipping)}</span></div>
            <div className="flex justify-between font-display font-black text-xl border-t border-black/10 pt-3"><span>Total</span><span>{money(total)}</span></div>
            <p className="text-[11px] text-neutral-500">IVA incluido. {shipping>0 && <>Te faltan {money(7500-subtotal)} para envío gratis.</>}</p>
          </div>
        </aside>
      </form>
    </div>
  </div>
}
