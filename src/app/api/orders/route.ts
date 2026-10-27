import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
export async function POST(req:Request){
  try{
    const b=await req.json();
    if(!b.email || !b.customerName || !b.address || !b.city || !b.postalCode || !Array.isArray(b.items) || b.items.length===0) return NextResponse.json({error:"Faltan datos del pedido"},{status:400});
    const subtotal = b.items.reduce((a:any,i:any)=>a+i.price*i.qty,0);
    const shipping = subtotal>=7500 ? 0 : (b.shippingMethod==="express"? 895:495);
    const discount = b.promo==="BARRIO10" ? Math.round(subtotal*0.10) : 0;
    const total = subtotal - discount + shipping;
    const orderNumber = "GZS-" + Math.random().toString(36).slice(2,8).toUpperCase();
    const [order]=await db.insert(orders).values({orderNumber, email:b.email, customerName:b.customerName, address:b.address, city:b.city, postalCode:b.postalCode, shippingMethod:b.shippingMethod||"standard", paymentMethod:b.paymentMethod||"card", subtotal, shipping, total, items:b.items, status:"confirmado"}).returning();
    return NextResponse.json({order, message:"Pedido confirmado"});
  }catch(e){ console.error(e); return NextResponse.json({error:"No se pudo crear el pedido. Inténtalo de nuevo."},{status:500}); }
}
