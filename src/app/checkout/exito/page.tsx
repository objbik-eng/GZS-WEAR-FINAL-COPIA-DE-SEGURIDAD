import Link from "next/link";
import { Check, Truck, Mail } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { money } from "@/lib/seed-data";
export default async function ExitoPage({searchParams}:{searchParams:Promise<any>}){
  const sp=await searchParams;
  return <div className="max-w-2xl mx-auto px-4 py-20 text-center">
    <div className="w-20 h-20 bg-[#5E845F] rounded-full grid place-items-center mx-auto animate-pop"><Check className="text-white" size={36}/></div>
    <div className="mt-6 flex justify-center"><LogoMark size={44}/></div>
    <h1 className="font-display font-black uppercase text-4xl sm:text-5xl mt-4">¡Pedido confirmado! <span className="text-[#D39905]">*</span></h1>
    <p className="text-neutral-600 mt-3">Gracias por vestir el manifiesto. Tu pedido ya está en preparación en nuestro taller.</p>
    <div className="bg-[#F4F2EC] border border-black/10 p-6 mt-8 text-left grid sm:grid-cols-3 gap-4">
      <div><p className="text-xs font-black uppercase tracking-widest text-neutral-500">Nº pedido</p><p className="font-display font-black text-lg mt-1">{sp.pedido||"GZS-000000"}</p></div>
      <div><p className="text-xs font-black uppercase tracking-widest text-neutral-500">Total pagado</p><p className="font-display font-black text-lg mt-1">{sp.total? money(Number(sp.total)):"—"}</p></div>
      <div><p className="text-xs font-black uppercase tracking-widest text-neutral-500">Entrega estimada</p><p className="font-display font-black text-lg mt-1">24/48h laborables</p></div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 text-sm">
      <p className="flex items-center gap-2 bg-white border border-black/10 px-4 py-3"><Mail size={16} className="text-[#5E845F]"/> Confirmación enviada a {sp.email||"tu email"}</p>
      <p className="flex items-center gap-2 bg-white border border-black/10 px-4 py-3"><Truck size={16} className="text-[#5E845F]"/> Recibirás tracking por SMS/email</p>
    </div>
    <div className="flex flex-wrap gap-3 justify-center mt-8">
      <Link href="/tienda" className="bg-black text-white px-7 py-3.5 text-xs font-black tracking-widest uppercase hover:bg-[#5E845F] transition">Seguir comprando</Link>
      <Link href="/" className="border-2 border-black px-7 py-3.5 text-xs font-black tracking-widest uppercase">Volver al inicio</Link>
    </div>
  </div>
}
