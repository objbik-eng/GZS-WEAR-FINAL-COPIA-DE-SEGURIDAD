"use client";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

const CATS=["Todas","Camisetas","Hoodies","Pantalones","Chaquetas","Accesorios"];
const COLS=["Todas","ORIGEN","CAOS CREATIVO","NO SIGNAL","DROP 04"];
const SIZES=["XS","S","M","L","XL","XXL","Única"];
const SORTS=[{id:"destacados",label:"Destacados"},{id:"nuevo",label:"Más nuevos"},{id:"precio-asc",label:"Precio: menor a mayor"},{id:"precio-desc",label:"Precio: mayor a menor"},{id:"nombre",label:"Nombre A-Z"}];

export default function ShopClient({products, initial}:{products:any[]; initial:any}){
  const {wishlist}=useCart();
  const [cat,setCat]=useState(initial.categoria||"Todas");
  const [col,setCol]=useState(initial.coleccion||"Todas");
  const [q,setQ]=useState(initial.buscar||"");
  const [sort,setSort]=useState("destacados");
  const [size,setSize]=useState("");
  const [maxPrice,setMaxPrice]=useState(80);
  const [onlySale,setOnlySale]=useState(false);
  const [showFilters,setShowFilters]=useState(false);
  const [visible,setVisible]=useState(12);

  useEffect(()=>{ if(initial.filtro==="nuevo") setSort("nuevo"); },[initial.filtro]);

  const filtered=useMemo(()=>{
    let list=[...products];
    if(initial.filtro==="favoritos") list=list.filter(p=>wishlist.includes(p.slug));
    if(initial.filtro==="nuevo") list=list.filter(p=>p.isNew);
    if(cat!=="Todas") list=list.filter(p=>p.category===cat);
    if(col!=="Todas") list=list.filter(p=>p.collection===col);
    if(q) list=list.filter(p=>(p.name+" "+p.category+" "+p.collection+" "+p.description).toLowerCase().includes(q.toLowerCase()));
    if(size) list=list.filter(p=>p.sizes.includes(size));
    list=list.filter(p=>p.price<=maxPrice*100);
    if(onlySale) list=list.filter(p=>p.compareAt);
    switch(sort){ case "precio-asc": list.sort((a,b)=>a.price-b.price); break; case "precio-desc": list.sort((a,b)=>b.price-a.price); break; case "nombre": list.sort((a,b)=>a.name.localeCompare(b.name)); break; case "nuevo": list.sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0)); break; default: list.sort((a,b)=>(b.isBestSeller?1:0)-(a.isBestSeller?1:0)); }
    return list;
  },[products,cat,col,q,size,maxPrice,onlySale,sort,wishlist,initial.filtro]);

  const clear=()=>{setCat("Todas");setCol("Todas");setQ("");setSize("");setMaxPrice(80);setOnlySale(false);};
  const activeCount=(cat!=="Todas"?1:0)+(col!=="Todas"?1:0)+(size?1:0)+(onlySale?1:0)+(maxPrice<80?1:0);

  return <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-black tracking-[0.2em] uppercase text-[#5E845F]">Tienda GZS Wear *</p><h1 className="font-display font-black uppercase text-4xl sm:text-6xl leading-none mt-2">{initial.filtro==="favoritos"?"Tus favoritos": col!=="Todas"?col: cat!=="Todas"?cat:"Todo el drop"}</h1><p className="text-neutral-500 text-sm mt-2">{filtered.length} productos · Envío 24/48h · Devolución 30 días</p></div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="flex items-center gap-2 border border-black/15 px-3 py-2.5 flex-1 sm:w-64"><Search size={16} className="text-neutral-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar…" className="w-full text-sm"/></label>
        <button onClick={()=>setShowFilters(true)} className="lg:hidden border border-black px-4 py-2.5 text-xs font-black tracking-widest uppercase flex items-center gap-2"><SlidersHorizontal size={14}/> Filtros {activeCount>0&&`(${activeCount})`}</button>
      </div>
    </div>

    {/* Category pills Pull&Bear style */}
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-6 -mx-4 px-4">
      {CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap px-4 py-2 text-xs font-black tracking-widest uppercase border transition ${cat===c?"bg-black text-white border-black":"border-black/20 hover:border-black"}`}>{c}</button>)}
    </div>

    <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block sticky top-24 space-y-7">
        <FilterBody {...{col,setCol,size,setSize,maxPrice,setMaxPrice,onlySale,setOnlySale,clear,activeCount}}/>
      </aside>

      <div>
        <div className="flex items-center justify-between border-y border-black/10 py-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{filtered.length} resultados</span>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">Ordenar <span className="relative"><select value={sort} onChange={e=>setSort(e.target.value)} className="appearance-none border border-black/15 pl-3 pr-8 py-2 font-semibold normal-case tracking-normal text-sm bg-white">{SORTS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select><ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/></span></label>
        </div>
        {filtered.length===0 ? <div className="text-center py-20 border border-dashed border-black/20"><p className="font-logo text-5xl text-[#5E845F]">GZS<span className="text-[#D39905]">*</span></p><p className="font-display font-black uppercase text-xl mt-4">Nada por aquí… todavía</p><p className="text-sm text-neutral-500 mt-1">Prueba a quitar filtros o busca “hoodie”, “cargo”, “blackletter”.</p><button onClick={clear} className="mt-5 bg-black text-white px-6 py-3 text-xs font-black tracking-widest uppercase">Limpiar filtros</button></div>
        : <>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">{filtered.slice(0,visible).map((p,i)=><ProductCard key={p.id} p={p} index={i%12}/>)}</div>
          {visible<filtered.length && <div className="text-center mt-10"><button onClick={()=>setVisible(v=>v+12)} className="border-2 border-black px-8 py-3 text-xs font-black tracking-widest uppercase hover:bg-black hover:text-white transition">Cargar más ({filtered.length-visible} quedan)</button></div>}
        </>}
      </div>
    </div>

    {/* Mobile filters drawer */}
    {showFilters && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/60" onClick={()=>setShowFilters(false)}/><div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white p-6 overflow-y-auto animate-drawer"><div className="flex justify-between items-center mb-6"><h3 className="font-display font-black uppercase text-lg">Filtros</h3><button onClick={()=>setShowFilters(false)}><X/></button></div><FilterBody {...{col,setCol,size,setSize,maxPrice,setMaxPrice,onlySale,setOnlySale,clear,activeCount}}/><button onClick={()=>setShowFilters(false)} className="w-full bg-[#5E845F] text-white py-3.5 font-black tracking-widest uppercase text-sm mt-8">Ver {filtered.length} productos</button></div></div>}
  </div>
}

function FilterBody({col,setCol,size,setSize,maxPrice,setMaxPrice,onlySale,setOnlySale,clear,activeCount}:any){
  return <div className="space-y-7">
    <div><h4 className="font-display font-black uppercase text-sm mb-3">Colección</h4><div className="space-y-2">{COLS.map((c:string)=><button key={c} onClick={()=>setCol(c)} className={`block text-sm ${col===c?"font-black text-[#5E845F]":"text-neutral-600 hover:text-black"}`}>{c==="Todas"?"Todas las colecciones":c} {col===c&&"*"}</button>)}</div></div>
    <div><h4 className="font-display font-black uppercase text-sm mb-3">Talla</h4><div className="flex flex-wrap gap-1.5">{SIZES.map((s:string)=><button key={s} onClick={()=>setSize(size===s?"":s)} className={`min-w-10 px-2 py-2 border text-xs font-bold ${size===s?"bg-black text-white border-black":"border-black/20 hover:border-black"}`}>{s}</button>)}</div></div>
    <div><h4 className="font-display font-black uppercase text-sm mb-3">Precio máx. · {maxPrice} €</h4><input type="range" min={15} max={80} step={5} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="w-full accent-[#5E845F]"/><div className="flex justify-between text-xs text-neutral-500"><span>15 €</span><span>80 €</span></div></div>
    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={onlySale} onChange={e=>setOnlySale(e.target.checked)} className="w-4 h-4 accent-[#D39905]"/><span className="text-sm font-semibold">Solo ofertas</span><span className="bg-[#D39905] text-black text-[10px] font-black px-1.5 py-0.5">-20%</span></label>
    {activeCount>0 && <button onClick={clear} className="text-xs font-black tracking-widest uppercase underline underline-offset-4">Limpiar filtros ({activeCount})</button>}
    <div className="bg-[#F4F2EC] p-4"><p className="font-display font-black uppercase text-sm">Código BARRIO10 *</p><p className="text-xs text-neutral-500 mt-1">-10% en tu primera compra al pagar.</p></div>
  </div>
}
