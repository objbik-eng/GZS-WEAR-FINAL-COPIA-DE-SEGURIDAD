"use client";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/seed-data";

export default function CartDrawer(){
  const {items,isOpen,setOpen,updateQty,remove,subtotal}=useCart();
  if(!isOpen) return null;
  const freeShip=7500; const progress=Math.min(100, subtotal/freeShip*100); const missing=freeShip-subtotal;
  return <div className="fixed inset-0 z-[60]">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={()=>setOpen(false)}/>
    <aside className="animate-drawer absolute right-0 top-0 h-full w-full max-w-[440px] bg-white flex flex-col shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b"><div><h2 className="font-display font-black uppercase text-lg flex items-center gap-2"><ShoppingBag/> Tu bolsa <span className="text-[#D39905]">*</span></h2><p className="text-xs text-neutral-500">{items.length} artículo(s) · Guardada en tu dispositivo</p></div><button onClick={()=>setOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X/></button></div>
      <div className="px-5 py-3 bg-[#F4F2EC] border-b">
        <p className="text-xs font-semibold flex items-center gap-2"><Truck size={14} className="text-[#5E845F]"/>{missing>0? <>Te faltan <b>{money(missing)}</b> para envío gratis</> : <>¡Envío gratis conseguido! 🎉</>}</p>
        <div className="h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#5E845F] transition-all duration-500" style={{width:`${progress}%`}}/></div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {items.length===0 ? <div className="h-full grid place-items-center text-center"><div><div className="text-6xl font-logo text-[#5E845F]">GZS<span className="text-[#D39905]">*</span></div><p className="font-display font-black uppercase mt-4">Tu bolsa está vacía</p><p className="text-sm text-neutral-500 mt-1">El drop no espera. Y tus favoritos tampoco.</p><button onClick={()=>setOpen(false)} className="mt-5 bg-black text-white px-6 py-3 text-xs font-black tracking-widest uppercase">Seguir comprando</button></div></div>
        : items.map(i=>(
          <div key={`${i.slug}-${i.size}-${i.color}`} className="flex gap-3">
            <Link href={`/producto/${i.slug}`} onClick={()=>setOpen(false)} className="w-20 h-24 bg-[#F4F2EC] shrink-0 overflow-hidden"><img src={i.image} className="w-full h-full object-cover" alt={i.name}/></Link>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2"><p className="font-bold text-sm leading-tight">{i.name}</p><button onClick={()=>remove(i.slug,i.size,i.color)} className="text-neutral-400 hover:text-red-600"><Trash2 size={16}/></button></div>
              <p className="text-xs text-neutral-500 mt-1">Talla {i.size} · {i.color}</p>
              <div className="flex items-center justify-between mt-2"><div className="flex items-center border border-black/15"><button className="px-2 py-1" onClick={()=>updateQty(i.slug,i.size,i.color,i.qty-1)}><Minus size={13}/></button><span className="w-7 text-center text-sm font-bold">{i.qty}</span><button className="px-2 py-1" onClick={()=>updateQty(i.slug,i.size,i.color,i.qty+1)}><Plus size={13}/></button></div><span className="font-black text-sm">{money(i.price*i.qty)}</span></div>
            </div>
          </div>))}
      </div>
      {items.length>0 && <div className="border-t px-5 py-4 space-y-3">
        <div className="flex justify-between text-sm"><span>Subtotal</span><b>{money(subtotal)}</b></div>
        <div className="flex justify-between text-sm text-neutral-500"><span>Envío</span><span>{missing>0? "Calculado al pagar · 4,95 €":"GRATIS"}</span></div>
        <p className="text-[11px] text-neutral-500 flex items-center gap-1"><ShieldCheck size={12} className="text-[#5E845F]"/> Pago seguro · Devolución 30 días · Código BARRIO10 -10%</p>
        <Link href="/checkout" onClick={()=>setOpen(false)} className="w-full bg-[#5E845F] hover:bg-[#2E4A33] text-white py-3.5 font-black tracking-[0.14em] uppercase text-sm flex items-center justify-center gap-2 transition">Tramitar pedido <ArrowRight size={16}/></Link>
        <button onClick={()=>setOpen(false)} className="w-full text-center text-xs font-bold underline underline-offset-4">Seguir comprando</button>
      </div>}
    </aside>
  </div>
}
