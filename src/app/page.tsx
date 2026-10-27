import Link from "next/link";
import { ArrowRight, ArrowUpRight, Truck, RotateCcw, ShieldCheck, Sparkles, Star } from "lucide-react";
import { getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { LogoMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function HomePage(){
  const products = await getProducts();
  const featured = products.filter((p:any)=>p.isBestSeller).slice(0,4);
  const news = products.filter((p:any)=>p.isNew).slice(0,4);
  const drops = products.slice(0,8);

  return <div>
    {/* HERO */}
    <section className="relative bg-black text-white overflow-hidden">
      <img src="/images/hero-gzs.jpg" alt="Campaña GZS Wear" className="absolute inset-0 w-full h-full object-cover opacity-70 animate-zoomSlow"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"/>
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 min-h-[86vh] flex flex-col justify-end pb-14 pt-32">
        <div className="animate-fadeUp max-w-3xl">
          <p className="inline-flex items-center gap-2 bg-[#D39905] text-black text-[11px] font-black tracking-[0.18em] uppercase px-3 py-1.5"><Sparkles size={13}/> Drop 04 · Nueva colección ya disponible</p>
          <h1 className="font-display font-black uppercase leading-[0.88] mt-5 text-[clamp(3rem,9vw,7.5rem)]">El arte no<br/>se cuelga.<br/><span className="text-[#5E845F] [-webkit-text-stroke:1px_#fff]">Se viste.</span></h1>
          <p className="mt-5 text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">Ropa urbana de arte disruptivo para gente street de 16 a 40 años. Hoodies, gráficas blackletter y cargos diseñados en el barrio.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/tienda" className="bg-[#5E845F] hover:bg-white hover:text-black text-white px-7 py-3.5 font-black tracking-[0.14em] uppercase text-sm inline-flex items-center gap-2 transition">Comprar el drop <ArrowRight size={16}/></Link>
            <Link href="#colecciones" className="border border-white/60 hover:border-[#D39905] hover:text-[#D39905] px-7 py-3.5 font-black tracking-[0.14em] uppercase text-sm transition">Ver colecciones</Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-xs text-white/70 font-semibold">
            <span className="flex items-center gap-1.5"><Star size={13} className="fill-[#D39905] text-[#D39905]"/> 4,8/5 · +2.340 reseñas</span>
            <span className="flex items-center gap-1.5"><Truck size={13}/> Envío 24/48h</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={13}/> Devolución 30 días</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 right-6 hidden lg:block"><div className="animate-spin-slow text-[#D39905] font-display font-black text-6xl leading-none">*</div></div>
    </section>

    {/* MARQUEE */}
    <div className="bg-[#5E845F] text-white overflow-hidden py-3 border-y-4 border-black">
      <div className="flex animate-marquee whitespace-nowrap w-max font-display font-black uppercase tracking-widest text-sm">
        {[0,1].map(k=><div key={k} className="flex gap-8 pr-8">{["Arte disruptivo *","No es logo, es manifiesto *","Diseñado en el barrio *","Unisex 16—40 *","Drop 04 limitado *","GZS Wear *"].map(t=><span key={t}>{t}</span>)}</div>)}
      </div>
    </div>

    {/* CATEGORIES PULL&BEAR style */}
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {name:"Hoodies", img:"/images/coleccion-origen.jpg", href:"/tienda?categoria=Hoodies", n:"Desde 44,95 €"},
          {name:"Camisetas", img:products[1]?.images[0], href:"/tienda?categoria=Camisetas", n:"Desde 22,95 €"},
          {name:"Pantalones", img:products[4]?.images[0], href:"/tienda?categoria=Pantalones", n:"Cargos & wide"},
          {name:"Accesorios", img:products[9]?.images[0], href:"/tienda?categoria=Accesorios", n:"Gorras & totes"},
        ].map(c=>(
          <Link key={c.name} href={c.href} className="group relative overflow-hidden aspect-[3/4] bg-[#F4F2EC]">
            <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"/>
            <div className="absolute bottom-0 p-4 sm:p-5 text-white"><p className="text-[11px] uppercase tracking-widest text-[#D39905] font-black">{c.n}</p><h3 className="font-display font-black uppercase text-xl sm:text-2xl flex items-center gap-1">{c.name} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition"/></h3></div>
          </Link>
        ))}
      </div>
    </section>

    {/* FEATURED */}
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div><p className="text-xs font-black tracking-[0.2em] uppercase text-[#5E845F]">Los que vuelan *</p><h2 className="font-display font-black uppercase text-3xl sm:text-5xl leading-none mt-2">Best sellers</h2></div>
        <Link href="/tienda" className="hidden sm:inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase border-b-2 border-[#D39905] pb-1 hover:text-[#5E845F]">Ver todo <ArrowRight size={14}/></Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">{featured.map((p:any,i:number)=><ProductCard key={p.id} p={p} index={i}/>)}</div>
    </section>

    {/* COLLECTIONS */}
    <section id="colecciones" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
      <p className="text-xs font-black tracking-[0.2em] uppercase text-[#5E845F]">Colecciones destacadas</p>
      <h2 className="font-display font-black uppercase text-3xl sm:text-5xl mt-2 mb-7">Tres formas de romper</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/tienda?coleccion=ORIGEN" className="group relative overflow-hidden min-h-[420px] bg-[#5E845F] text-white p-6 flex flex-col justify-end">
          <img src="/images/coleccion-origen.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" alt="Origen"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E3323]/90 via-transparent"/><div className="relative"><span className="font-logo text-5xl">GZS</span><h3 className="font-display font-black uppercase text-3xl mt-2">Origen</h3><p className="text-white/75 text-sm mt-1 max-w-[260px]">El monograma blackletter y el verde de la casa. Donde empezó todo.</p><span className="inline-flex mt-4 bg-white text-black px-4 py-2 text-xs font-black tracking-widest uppercase group-hover:bg-[#D39905]">Explorar →</span></div>
        </Link>
        <Link href="/tienda?coleccion=CAOS%20CREATIVO" className="group relative overflow-hidden min-h-[420px] bg-black text-white p-6 flex flex-col justify-end">
          <img src="/images/coleccion-caos.jpg" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-700" alt="Caos Creativo"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent"/><div className="relative"><span className="text-[#D39905] font-display font-black text-5xl">*</span><h3 className="font-display font-black uppercase text-3xl mt-2">Caos Creativo</h3><p className="text-white/75 text-sm mt-1 max-w-[260px]">Grafiti, fanzine y serigrafía manual. Ninguna prenda igual a otra.</p><span className="inline-flex mt-4 bg-[#D39905] text-black px-4 py-2 text-xs font-black tracking-widest uppercase">Explorar →</span></div>
        </Link>
        <Link href="/tienda?coleccion=NO%20SIGNAL" className="group relative overflow-hidden min-h-[420px] bg-neutral-900 text-white p-6 flex flex-col justify-end">
          <img src={products[3]?.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" alt="No Signal"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent"/><div className="relative"><span className="font-display font-black text-5xl text-white/90">Ø</span><h3 className="font-display font-black uppercase text-3xl mt-2">No Signal</h3><p className="text-white/75 text-sm mt-1 max-w-[260px]">Utility, técnico y sin cobertura. Para moverte a tu ritmo.</p><span className="inline-flex mt-4 bg-white text-black px-4 py-2 text-xs font-black tracking-widest uppercase">Explorar →</span></div>
        </Link>
      </div>
    </section>

    {/* EDITORIAL / MANIFIESTO */}
    <section className="bg-[#F4F2EC] border-y border-black/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <LogoMark size={56}/>
          <h2 className="font-display font-black uppercase text-4xl sm:text-6xl leading-[0.9] mt-6">No vestimos<br/>logos.<br/><span className="text-[#5E845F]">Vestimos ideas.</span></h2>
          <p className="text-neutral-600 mt-5 leading-relaxed max-w-lg">GZS WEAR nace entre muros pintados, skateparks y fotocopias de fanzine. Cada drop es una edición limitada numerada por la calle: cuando se agota, pasa a ser historia del barrio.</p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
            {[["+48K","clientes en el barrio"],["4,8/5","valoración media"],["72h","drop medio agotado"]].map(([n,l])=><div key={l} className="border-l-2 border-[#D39905] pl-3"><p className="font-display font-black text-2xl">{n}</p><p className="text-xs text-neutral-500">{l}</p></div>)}
          </div>
          <Link href="/tienda?coleccion=DROP%2004" className="inline-flex mt-8 bg-black text-white px-6 py-3 text-xs font-black tracking-widest uppercase hover:bg-[#5E845F] transition">Ver Drop 04 limitado</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src="https://images.pexels.com/photos/5037667/pexels-photo-5037667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" className="w-full h-64 sm:h-80 object-cover" alt="Comunidad skate GZS"/>
          <img src="/images/coleccion-caos.jpg" className="w-full h-64 sm:h-80 object-cover mt-8" alt="Editorial Caos"/>
        </div>
      </div>
    </section>

    {/* NEW IN */}
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-6"><div><p className="text-xs font-black tracking-[0.2em] uppercase text-[#D39905]">Recién llegado *</p><h2 className="font-display font-black uppercase text-3xl sm:text-5xl mt-2">Novedades</h2></div><Link href="/tienda?filtro=nuevo" className="text-xs font-black tracking-widest uppercase border-b-2 border-black pb-1">Ver novedades →</Link></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">{news.map((p:any,i:number)=><ProductCard key={p.id} p={p} index={i}/>)}</div>
    </section>

    {/* PERKS */}
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-16">
      <div className="grid sm:grid-cols-3 gap-3">
        {[{icon:Truck,t:"Envío 24/48h",d:"Gratis en pedidos +75 €. Entrega express disponible en checkout."},{icon:RotateCcw,t:"30 días para cambiar de idea",d:"Devoluciones gratuitas y cambio de talla sin preguntas."},{icon:ShieldCheck,t:"Pago seguro, como quieras",d:"Tarjeta, Bizum, Apple Pay o paga en 3 con Klarna."}].map(x=><div key={x.t} className="border border-black/10 p-6 hover:border-[#5E845F] hover:shadow-[6px_6px_0_#5E845F] transition"><x.icon className="text-[#5E845F]"/><h3 className="font-display font-black uppercase mt-3">{x.t}</h3><p className="text-sm text-neutral-500 mt-1">{x.d}</p></div>)}
      </div>
      <div className="mt-3 bg-black text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div><p className="font-display font-black uppercase text-2xl">¿Aún sin tu -10%? <span className="text-[#D39905]">*</span></p><p className="text-white/60 text-sm">Usa <b className="text-white">BARRIO10</b> en el checkout. Sin letra pequeña.</p></div>
        <Link href="/tienda" className="bg-[#D39905] text-black px-6 py-3 text-xs font-black tracking-widest uppercase shrink-0">Comprar con descuento</Link>
      </div>
    </section>
  </div>
}
