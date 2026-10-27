"use client";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { money } from "@/lib/seed-data";
import { useCart } from "@/context/CartContext";
import { ratingFor } from "@/lib/catalog-client";

export default function ProductCard({p, index=0}:{p:any; index?:number}){
  const {add, wishlist, toggleWish} = useCart();
  const wished = wishlist.includes(p.slug);
  const rating = ratingFor(p.id, p.slug);
  const discount = p.compareAt ? Math.round((1-p.price/p.compareAt)*100) : 0;
  const quickAdd=(e:any)=>{ e.preventDefault(); add({productId:p.id, slug:p.slug, name:p.name, price:p.price, image:p.images[0], size:p.sizes.includes("M")?"M":p.sizes[0], color:p.colors[0].name, qty:1}); };
  return (
    <Link href={`/producto/${p.slug}`} className="group block animate-fadeUp" style={{animationDelay:`${index*40}ms`}}>
      <div className="relative bg-[#F4F2EC] overflow-hidden aspect-[3/4]">
        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
        {p.images[1] && <img src={p.images[1]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"/>}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.tag && <span className={`text-[10px] font-black tracking-[0.12em] uppercase px-2.5 py-1 ${p.tag.includes("-")||p.tag.includes("%")?"bg-[#D39905] text-black": p.tag==="NUEVO"?"bg-[#5E845F] text-white":"bg-black text-white"}`}>{p.tag}</span>}
          {discount>0 && <span className="text-[10px] font-black px-2.5 py-1 bg-white text-black w-max">-{discount}% HOY</span>}
        </div>
        <button onClick={(e)=>{e.preventDefault(); toggleWish(p.slug);}} className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center transition ${wished?"bg-[#D39905] text-black":"bg-white/90 hover:bg-white"}`} aria-label="Favorito"><Heart size={17} fill={wished?"currentColor":"none"}/></button>
        {p.stock<=10 && <span className="absolute bottom-3 left-3 bg-black/85 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Quedan {p.stock}</span>}
        <button onClick={quickAdd} className="absolute bottom-3 right-3 bg-black text-white pl-3 pr-3 py-2.5 text-[11px] font-black tracking-widest uppercase flex items-center gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition hover:bg-[#5E845F]"><Plus size={14}/> Añadir</button>
      </div>
      <div className="pt-3 space-y-1">
        <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#5E845F]">{p.collection} · {p.category}</p><span className="flex items-center gap-1 text-xs font-bold"><Star size={12} className="fill-[#D39905] text-[#D39905]"/>{rating.avg} <span className="text-neutral-400 font-medium">({rating.count})</span></span></div>
        <h3 className="font-display font-bold leading-tight group-hover:text-[#5E845F] transition">{p.name}</h3>
        <div className="flex items-center gap-2"><span className="font-black">{money(p.price)}</span>{p.compareAt && <span className="text-neutral-400 line-through text-sm">{money(p.compareAt)}</span>}<span className="flex gap-1 ml-1">{p.colors.map((c:any)=><span key={c.name} className="w-3 h-3 rounded-full border border-black/20" style={{background:c.hex}}/>)}</span></div>
        <p className="text-[11px] text-neutral-500">{p.sizes.join(" · ")}</p>
      </div>
    </Link>
  );
}
