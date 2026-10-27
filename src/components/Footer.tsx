"use client";
import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "./Logo";
import { Camera, Play, Music2, ArrowRight, Check } from "lucide-react";

export default function Footer(){
  const [email,setEmail]=useState(""); const [done,setDone]=useState(false); const [msg,setMsg]=useState("");
  const submit=async(e:any)=>{ e.preventDefault(); const r=await fetch("/api/newsletter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})}); const d=await r.json(); if(r.ok){setDone(true); setMsg(d.message);} else setMsg(d.error||"Error"); };
  return <footer className="bg-black text-white mt-0">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <LogoMark variant="white" size={52}/>
        <p className="text-white/60 text-sm mt-4 max-w-xs leading-relaxed">Ropa urbana de arte disruptivo. Diseñada en el barrio, para gente de 16 a 40 que no viste logos: viste manifiestos.</p>
        <div className="flex gap-2 mt-5">{[Camera,Play,Music2].map((Icon,i)=><a key={i} href="#" className="w-10 h-10 border border-white/20 grid place-items-center hover:bg-[#5E845F] hover:border-[#5E845F] transition"><Icon size={18}/></a>)}</div>
        <p className="text-xs text-white/40 mt-4">@gzswear · #VisteElManifiesto</p>
      </div>
      <div className="lg:col-span-2"><h4 className="font-display font-black uppercase text-sm tracking-widest">Tienda</h4><ul className="mt-4 space-y-2.5 text-sm text-white/60">{["Novedades","Camisetas","Hoodies","Pantalones","Chaquetas","Accesorios"].map(x=><li key={x}><Link className="hover:text-[#D39905]" href={x==="Novedades"?"/tienda?filtro=nuevo":`/tienda?categoria=${x}`}>{x}</Link></li>)}</ul></div>
      <div className="lg:col-span-2"><h4 className="font-display font-black uppercase text-sm tracking-widest">Ayuda</h4><ul className="mt-4 space-y-2.5 text-sm text-white/60"><li>Envíos 24/48h</li><li>Devoluciones 30 días</li><li>Guía de tallas</li><li>Estado de mi pedido</li><li>Contacto: hola@gzswear.es</li></ul></div>
      <div className="lg:col-span-4">
        <h4 className="font-display font-black uppercase text-xl">Únete al barrio <span className="text-[#D39905]">*</span></h4>
        <p className="text-white/60 text-sm mt-2">-10% en tu primera compra con <b className="text-white">BARRIO10</b>. Early access a drops, sin spam.</p>
        {done? <p className="mt-4 bg-[#5E845F] p-3 text-sm font-bold flex gap-2"><Check/> {msg}</p> : <form onSubmit={submit} className="mt-4 flex"><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/40"/><button className="bg-[#D39905] text-black px-4 font-black text-xs tracking-widest uppercase flex items-center gap-1">Unirme <ArrowRight size={14}/></button></form>}
        {msg && !done && <p className="text-xs text-red-300 mt-2">{msg}</p>}
      </div>
    </div>
    <div className="border-t border-white/10"><div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40"><span>© 2026 GZS WEAR* — Arte disruptivo. Todos los derechos reservados.</span><span>Visa · Mastercard · Bizum · Apple Pay · Klarna</span></div></div>
  </footer>
}
