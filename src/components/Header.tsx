"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X, Truck, RotateCcw, Sparkles } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const NAV=[{label:"Novedades",href:"/tienda?filtro=nuevo"},{label:"Camisetas",href:"/tienda?categoria=Camisetas"},{label:"Hoodies",href:"/tienda?categoria=Hoodies"},{label:"Pantalones",href:"/tienda?categoria=Pantalones"},{label:"Chaquetas",href:"/tienda?categoria=Chaquetas"},{label:"Accesorios",href:"/tienda?categoria=Accesorios"},{label:"Colecciones",href:"/#colecciones"}];

export default function Header(){
  const {count,setOpen,wishlist}=useCart();
  const [mobile,setMobile]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [q,setQ]=useState("");
  const router=useRouter();
  const submit=(e:any)=>{e.preventDefault(); router.push(`/tienda?buscar=${encodeURIComponent(q)}`); setSearchOpen(false); setMobile(false);};
  return <>
    <div className="bg-black text-white text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2 w-max">
        {[0,1].map(k=><div key={k} className="flex items-center gap-8 pr-8">
          <span className="flex items-center gap-2"><Truck size={13} className="text-[#D39905]"/> Envío gratis +75€ · 24/48h</span><span className="text-[#D39905]">*</span>
          <span>DROP 04 ya disponible — unidades limitadas</span><span className="text-[#D39905]">*</span>
          <span className="flex items-center gap-2"><RotateCcw size={13} className="text-[#D39905]"/> Devolución 30 días gratis</span><span className="text-[#D39905]">*</span>
          <span className="text-[#5E845F]">Código BARRIO10 · -10% primera compra</span><span className="text-[#D39905]">*</span>
        </div>)}
      </div>
    </div>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] flex items-center justify-between gap-4">
        <button className="lg:hidden p-2 -ml-2" onClick={()=>setMobile(true)} aria-label="Menú"><Menu/></button>
        <Logo/>
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-bold tracking-[0.08em] uppercase">
          {NAV.map(n=><Link key={n.label} href={n.href} className="hover:text-[#5E845F] relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#D39905] hover:after:w-full after:transition-all">{n.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={()=>setSearchOpen(!searchOpen)} className="p-2 hover:bg-[#F4F2EC] rounded-full" aria-label="Buscar"><Search size={20}/></button>
          <Link href="/tienda?filtro=favoritos" className="p-2 hover:bg-[#F4F2EC] rounded-full relative hidden sm:block" aria-label="Favoritos"><Heart size={20}/>{wishlist.length>0 && <span className="absolute top-0 right-0 bg-[#D39905] text-black text-[10px] font-black w-4 h-4 rounded-full grid place-items-center">{wishlist.length}</span>}</Link>
          <button onClick={()=>setOpen(true)} className="p-2 hover:bg-[#F4F2EC] rounded-full relative" aria-label="Carrito"><ShoppingBag size={20}/>{count>0 && <span key={count} className="animate-pop absolute top-0 right-0 bg-[#5E845F] text-white text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full grid place-items-center">{count}</span>}</button>
          <Link href="/tienda" className="hidden md:inline-flex ml-2 bg-black text-white text-xs font-black tracking-widest uppercase px-4 py-2.5 hover:bg-[#5E845F] transition">Comprar ahora</Link>
        </div>
      </div>
      {searchOpen && <form onSubmit={submit} className="border-t border-black/10 px-4 py-3 max-w-[1440px] mx-auto flex gap-2 animate-fadeUp"><Search className="text-neutral-400 mt-2"/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Busca hoodies, cargos, blackletter…" className="flex-1 text-lg font-medium placeholder:text-neutral-400"/><button className="bg-[#5E845F] text-white px-5 py-2 text-xs font-black tracking-widest uppercase">Buscar</button></form>}
    </header>
    {mobile && <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/60" onClick={()=>setMobile(false)}/><div className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-white p-6 animate-drawer" style={{animationName:"none", transform:"none"}}><div className="flex justify-between items-center"><Logo/><button onClick={()=>setMobile(false)}><X/></button></div><form onSubmit={submit} className="mt-6 flex border border-black/15"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar en GZS…" className="flex-1 px-3 py-3"/><button className="px-4 bg-black text-white"><Search size={18}/></button></form><nav className="mt-6 flex flex-col divide-y">{NAV.map(n=><Link key={n.label} onClick={()=>setMobile(false)} href={n.href} className="py-4 font-display font-black uppercase text-xl flex justify-between">{n.label}<span className="text-[#D39905]">*</span></Link>)}</nav><div className="mt-6 bg-[#5E845F] text-white p-4"><p className="font-display font-black uppercase">Drop 04 *</p><p className="text-sm text-white/80">Edición limitada. Cuando se acaba, no vuelve.</p><Link href="/tienda?coleccion=DROP%2004" onClick={()=>setMobile(false)} className="inline-block mt-3 bg-white text-black px-4 py-2 text-xs font-black tracking-widest">VER DROP</Link></div></div></div>}
  </>
}
