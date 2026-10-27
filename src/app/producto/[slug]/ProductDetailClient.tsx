"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, Check, ChevronRight, Ruler } from "lucide-react";
import { money } from "@/lib/seed-data";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { ratingFor } from "@/lib/catalog-client";

function Stars({value, size=16, onClick}:{value:number; size?:number; onClick?:(v:number)=>void}){
  return <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><button key={i} type="button" onClick={()=>onClick?.(i)} className={onClick?"cursor-pointer":"cursor-default"}><Star size={size} className={i<=value?"fill-[#D39905] text-[#D39905]":"text-neutral-300"}/></button>)}</div>
}

export default function ProductDetailClient({product, related}:{product:any; related:any[]}){
  const {add, wishlist, toggleWish}=useCart();
  const images:string[]=product.images;
  const [img,setImg]=useState(0);
  const [size,setSize]=useState(product.sizes.includes("M")?"M":product.sizes[0]);
  const [color,setColor]=useState(product.colors[0]);
  const [qty,setQty]=useState(1);
  const [tab,setTab]=useState<"desc"|"envios"|"tallas">("desc");
  const [reviews,setReviews]=useState<any[]>(product.reviews||[]);
  const [form,setForm]=useState({author:"", rating:5, title:"", body:"", sizeBought:size});
  const [reviewMsg,setReviewMsg]=useState("");
  const [added,setAdded]=useState(false);
  const rating=ratingFor(product.id, product.slug);
  const avg = reviews.length? (reviews.reduce((a:any,r:any)=>a+r.rating,0)/reviews.length) : rating.avg;
  const distribution=[5,4,3,2,1].map(star=>({star, pct: reviews.length? Math.round(reviews.filter((r:any)=>r.rating===star).length/reviews.length*100):0}));
  const wished=wishlist.includes(product.slug);

  const addToCart=()=>{ add({productId:product.id, slug:product.slug, name:product.name, price:product.price, image:images[0], size, color:color.name, qty}); setAdded(true); setTimeout(()=>setAdded(false),2000); };
  const submitReview=async(e:any)=>{ e.preventDefault(); const r=await fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productSlug:product.slug, ...form, sizeBought:size})}); const d=await r.json(); if(r.ok){ setReviews([d.review, ...reviews]); setReviewMsg(d.message); setForm({author:"",rating:5,title:"",body:"",sizeBought:size}); } else setReviewMsg(d.error||"Error"); };

  return <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
    <nav className="flex items-center gap-1.5 text-xs text-neutral-500 flex-wrap"><Link href="/" className="hover:text-black">Inicio</Link><ChevronRight size={12}/><Link href="/tienda" className="hover:text-black">Tienda</Link><ChevronRight size={12}/><Link href={`/tienda?categoria=${product.category}`} className="hover:text-black">{product.category}</Link><ChevronRight size={12}/><span className="text-black font-semibold">{product.name}</span></nav>

    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 mt-6">
      {/* Gallery */}
      <div>
        <div className="relative bg-[#F4F2EC] aspect-[3/4] overflow-hidden">
          <img key={img} src={images[img]} alt={product.name} className="w-full h-full object-cover animate-fadeUp"/>
          {product.tag && <span className="absolute top-4 left-4 bg-black text-white text-[11px] font-black tracking-widest uppercase px-3 py-1.5">{product.tag}</span>}
          <span className="absolute bottom-4 right-4 bg-white/90 text-xs font-bold px-2 py-1">{img+1} / {images.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">{images.map((src:string,i:number)=><button key={i} onClick={()=>setImg(i)} className={`aspect-[3/4] bg-[#F4F2EC] overflow-hidden border-2 ${img===i?"border-[#5E845F]":"border-transparent opacity-70 hover:opacity-100"}`}><img src={src} className="w-full h-full object-cover" alt=""/></button>)}</div>
      </div>

      {/* Info */}
      <div className="lg:sticky lg:top-24 self-start">
        <p className="text-xs font-black tracking-[0.2em] uppercase text-[#5E845F]">{product.collection} · {product.category}</p>
        <h1 className="font-display font-black uppercase text-3xl sm:text-5xl leading-[0.95] mt-2">{product.name}</h1>
        <div className="flex items-center gap-2 mt-3"><Stars value={Math.round(avg)}/><span className="text-sm font-bold">{avg.toFixed(1)}</span><a href="#resenas" className="text-sm text-neutral-500 underline underline-offset-2">{reviews.length+rating.count-3} reseñas</a>{product.stock<=10 && <span className="ml-2 bg-[#D39905] text-black text-[10px] font-black px-2 py-1 uppercase">Quedan {product.stock}</span>}</div>
        <div className="flex items-baseline gap-3 mt-4"><span className="font-display font-black text-3xl">{money(product.price)}</span>{product.compareAt && <><span className="text-neutral-400 line-through text-lg">{money(product.compareAt)}</span><span className="bg-[#D39905] text-black text-xs font-black px-2 py-1">-{Math.round((1-product.price/product.compareAt)*100)}%</span></>}<span className="text-xs text-neutral-500">IVA incl. · o 3 pagos sin intereses</span></div>

        <div className="mt-6"><p className="text-xs font-black tracking-widest uppercase mb-2">Color: <span className="font-semibold normal-case tracking-normal">{color.name}</span></p><div className="flex gap-2">{product.colors.map((c:any)=><button key={c.name} onClick={()=>setColor(c)} className={`w-10 h-10 rounded-full border-2 p-0.5 ${color.name===c.name?"border-[#5E845F]":"border-black/15"}`} title={c.name}><span className="block w-full h-full rounded-full border border-black/10" style={{background:c.hex}}/></button>)}</div></div>

        <div className="mt-6"><div className="flex justify-between mb-2"><p className="text-xs font-black tracking-widest uppercase">Talla: {size}</p><button onClick={()=>setTab("tallas")} className="text-xs underline underline-offset-2 flex items-center gap-1"><Ruler size={12}/> Guía de tallas</button></div>
          <div className="flex flex-wrap gap-2">{product.sizes.map((s:string)=><button key={s} onClick={()=>setSize(s)} className={`min-w-12 px-3 py-3 border font-bold text-sm transition ${size===s?"bg-black text-white border-black":"border-black/20 hover:border-black"}`}>{s}</button>)}</div>
          <p className="text-xs text-neutral-500 mt-2">{product.fit} — Si estás entre dos tallas, pide la mayor para fit oversize.</p>
        </div>

        <div className="flex gap-2 mt-7">
          <div className="flex items-center border border-black/20"><button className="px-3 py-3" onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><span className="w-8 text-center font-black">{qty}</span><button className="px-3 py-3" onClick={()=>setQty(qty+1)}><Plus size={14}/></button></div>
          <button onClick={addToCart} className={`flex-1 py-3.5 font-black tracking-[0.14em] uppercase text-sm transition flex items-center justify-center gap-2 ${added?"bg-[#D39905] text-black":"bg-[#5E845F] hover:bg-[#2E4A33] text-white"}`}>{added?<><Check/> Añadido a tu bolsa</>:"Añadir a la bolsa"}</button>
          <button onClick={()=>toggleWish(product.slug)} className={`w-12 grid place-items-center border ${wished?"bg-[#D39905] border-[#D39905]":"border-black/20 hover:border-black"}`} aria-label="Favorito"><Heart fill={wished?"currentColor":"none"}/></button>
        </div>
        <Link href="/checkout" onClick={addToCart} className="block text-center mt-2 border-2 border-black py-3 font-black tracking-[0.14em] uppercase text-sm hover:bg-black hover:text-white transition">Comprar ahora</Link>

        <div className="grid grid-cols-3 gap-2 mt-6 text-center text-[11px] font-semibold">
          <div className="bg-[#F4F2EC] p-3"><Truck className="mx-auto text-[#5E845F]" size={18}/><p className="mt-1">Envío 24/48h<br/><span className="text-neutral-500 font-normal">Gratis +75 €</span></p></div>
          <div className="bg-[#F4F2EC] p-3"><RotateCcw className="mx-auto text-[#5E845F]" size={18}/><p className="mt-1">Devolución 30 días<br/><span className="text-neutral-500 font-normal">Sin preguntas</span></p></div>
          <div className="bg-[#F4F2EC] p-3"><ShieldCheck className="mx-auto text-[#5E845F]" size={18}/><p className="mt-1">Pago seguro<br/><span className="text-neutral-500 font-normal">Bizum · Klarna</span></p></div>
        </div>

        <div className="mt-7 border-t border-black/10">
          {[["desc","Descripción & tejido"],["envios","Envíos y devoluciones"],["tallas","Guía de tallas"]].map(([id,label])=>(
            <div key={id} className="border-b border-black/10">
              <button onClick={()=>setTab(tab===id as any?"desc":id as any)} className="w-full flex justify-between py-4 font-display font-bold uppercase text-sm">{label}<span className="text-[#D39905]">{tab===id?"−":"+"}</span></button>
              {tab===id && <div className="pb-5 text-sm text-neutral-600 leading-relaxed animate-fadeUp">
                {id==="desc" && <><p>{product.description}</p><p className="mt-2"><b className="text-black">Tejido:</b> {product.fabric}</p><p><b className="text-black">Fit:</b> {product.fit}</p><p className="mt-2">Lavado a máquina 30º · No usar secadora · Cada prenda incluye pegatina GZS* de regalo.</p></>}
                {id==="envios" && <p>Envío estándar 24/48h laborables: 4,95 € (gratis +75 €). Express 24h: 8,95 €. Devolución gratuita en 30 días desde tu cuenta o en Correos. Reembolso en 3-5 días laborables.</p>}
                {id==="tallas" && <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="py-2">Talla</th><th>Pecho</th><th>Largo</th><th>Equivale</th></tr></thead><tbody>{[["XS","96 cm","66 cm","34-36"],["S","102 cm","69 cm","36-38"],["M","108 cm","72 cm","38-40"],["L","116 cm","75 cm","40-42"],["XL","124 cm","78 cm","42-44"]].map(r=><tr key={r[0]} className="border-b border-black/5">{r.map(c=><td key={c} className="py-1.5">{c}</td>)}</tr>)}</tbody></table><p className="mt-2 text-xs">Modelo editorial: 178 cm, lleva talla M.</p></div>}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* REVIEWS */}
    <section id="resenas" className="mt-16 border-t border-black/10 pt-10 grid lg:grid-cols-[320px_1fr] gap-10">
      <div>
        <h2 className="font-display font-black uppercase text-3xl">Reseñas <span className="text-[#D39905]">*</span></h2>
        <div className="flex items-end gap-2 mt-4"><span className="font-display font-black text-6xl leading-none">{avg.toFixed(1)}</span><div className="pb-1"><Stars value={Math.round(avg)}/><p className="text-xs text-neutral-500 mt-1">{reviews.length} reseñas publicadas aquí</p></div></div>
        <div className="space-y-1.5 mt-5">{distribution.map(d=><div key={d.star} className="flex items-center gap-2 text-xs"><span className="w-6 font-bold">{d.star}★</span><div className="flex-1 h-2 bg-black/10"><div className="h-full bg-[#D39905]" style={{width:`${d.pct}%`}}/></div><span className="w-8 text-neutral-500">{d.pct}%</span></div>)}</div>
        <form onSubmit={submitReview} className="mt-8 bg-[#F4F2EC] p-5 space-y-3">
          <p className="font-display font-black uppercase text-sm">Escribe tu reseña</p>
          <Stars value={form.rating} onClick={v=>setForm({...form,rating:v})} size={22}/>
          <input required value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Tu nombre · Ciudad" className="w-full bg-white border border-black/15 px-3 py-2.5 text-sm"/>
          <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Titular: ej. Calidad brutal" className="w-full bg-white border border-black/15 px-3 py-2.5 text-sm"/>
          <textarea required value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="¿Cómo queda? ¿Qué tal el tejido?" className="w-full bg-white border border-black/15 px-3 py-2.5 text-sm" rows={3}/>
          {reviewMsg && <p className="text-xs font-bold text-[#5E845F]">{reviewMsg}</p>}
          <button className="w-full bg-black text-white py-3 text-xs font-black tracking-widest uppercase hover:bg-[#5E845F] transition">Publicar reseña</button>
        </form>
      </div>
      <div className="space-y-4">
        {reviews.map((r:any)=>(
          <article key={r.id} className="border border-black/10 p-5 hover:border-[#5E845F] transition">
            <div className="flex flex-wrap justify-between gap-2"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-full bg-[#5E845F] text-white grid place-items-center font-display font-black">{r.author.charAt(0)}</span><div><p className="font-bold text-sm">{r.author}</p><p className="text-xs text-neutral-500">{r.verified?"Compra verificada ✓":"Reseña de comunidad"} {r.sizeBought && `· Talla ${r.sizeBought}`} · {r.createdAt? new Date(r.createdAt).toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"}):"Ahora"}</p></div></div><Stars value={r.rating}/></div>
            <h3 className="font-display font-bold mt-3">{r.title}</h3><p className="text-sm text-neutral-600 mt-1 leading-relaxed">{r.body}</p>
          </article>
        ))}
        {reviews.length===0 && <p className="text-neutral-500">Sé la primera persona en reseñar esta prenda.</p>}
      </div>
    </section>

    {related.length>0 && <section className="mt-16"><h2 className="font-display font-black uppercase text-3xl mb-6">Completa el fit <span className="text-[#D39905]">*</span></h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">{related.map((p:any,i:number)=><ProductCard key={p.id} p={p} index={i}/>)}</div></section>}
  </div>
}
